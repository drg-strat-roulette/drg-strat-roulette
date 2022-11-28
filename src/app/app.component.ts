import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { strategies } from './data/strats.const';
import { clamp, sample } from 'lodash-es';
import { CachedQueuedStrats, Strategy, StratTag, stratTagInfo, StratTagObject } from './models/strat.interface';
import { Dwarf, DwarfClass } from './models/team.interface';
import { Clipboard } from '@angular/cdk/clipboard';
import {
	AnomalyType,
	BiomeType,
	Mission,
	PrimaryObjective,
	SecondaryObjective,
	WarningType,
} from './models/missions.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Settings, settingsVersion } from './models/settings.interface';
import { queuedStrategiesVersion, StoredKeys } from './models/local-storage.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
	SnackbarConfig,
	SnackbarWithIconComponent,
} from './components/snackbar-with-icon/snackbar-with-icon.component';
import { backgroundImages } from './data/backgrounds.const';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { WelcomeDialogComponent } from './components/welcome-dialog/welcome-dialog.component';
import { FeedbackDialogComponent } from './components/feedback-dialog/feedback-dialog.component';

const RECENT_STRAT_MAX_COUNT = 10;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	@ViewChild('queuedStratsDrawer') queuedStratsDrawer: MatDrawer | undefined;

	// Static data
	dwarfClasses: DwarfClass[] = Object.values(DwarfClass);
	missionPrimaryObjectives: PrimaryObjective[] = Object.values(PrimaryObjective);
	missionSecondaryObjectives: SecondaryObjective[] = Object.values(SecondaryObjective);
	biomes: BiomeType[] = Object.values(BiomeType);
	warnings: WarningType[] = Object.values(WarningType);
	anomalies: AnomalyType[] = Object.values(AnomalyType);

	// Current background image
	background: string = backgroundImages[0];

	// Most recently rolled strategy
	strat: Strategy | undefined;
	set strategy(s: Strategy) {
		// Set the strategy
		this.strat = s;

		// Generate dynamic content for the chosen strategy
		if (this.makeStratDecisionsAutomatically && s.generateDynamicContent && this.dwarves.length > 0) {
			this.generateDynamicContent();
		} else {
			this.strat.dynamicContent = undefined;
		}

		// Update list of queued strategies
		if (s.tags?.includes(StratTag.queue)) {
			this.addQueuedStrategy();
		}
	}
	queuedStrats: Strategy[] = [];
	recentStrats: number[] = [];

	// True if the settings menu is collapsed, false otherwise
	settingsMenuCollapsed = true;

	// List of all possible strategy tags, and whether they are included or excluded
	tags: StratTagObject[] = stratTagInfo.map((tagInfo) => ({
		...tagInfo,
		checked: true,
	}));

	// Team configuration
	dwarves: Dwarf[] = [];

	// True if a mission is to be chosen before a strategy, false otherwise
	preChosenMissions = false;

	// True if strategy-related decisions are made automatically for the user
	makeStratDecisionsAutomatically = true;

	// Pre-chosen mission configuration
	mission: Mission = {
		primary: PrimaryObjective.eggHunt,
		secondary: SecondaryObjective.alienFossils,
		biome: BiomeType.azureWeald,
		length: 1,
		complexity: 1,
		warnings: [],
		anomaly: null,
	};

	// Hide DRG logo when page is too small to fit it
	hideLogo = false;
	@HostListener('window:resize')
	onResize() {
		this.hideLogo = window.innerWidth < 500;
	}

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private clipboard: Clipboard,
		private snackbar: MatSnackBar,
		public dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.hideLogo = window.innerWidth < 500;

		// Subscribe to query parameters (in order to load a strategy by its Id)
		this.route.queryParamMap.subscribe((params) => {
			const strategyId = parseInt(params.get('strategyId') ?? '');
			// If this strategy is already active, exit early
			if (this.strat?.id === strategyId) {
				return;
			}
			const strategy = strategies.find((strat) => strat.id === strategyId);
			if (strategy) {
				// If a matching strategy was found, display it
				const dynamicContent = params.get('dynamicContent') ?? undefined;
				if (dynamicContent) {
					strategy.dynamicContent = dynamicContent;
					this.strat = strategy;
				} else {
					this.strategy = strategy;
				}
				this.updateRecentStrategies();
			} else if (strategyId) {
				// If no matching strategy was found, but a strategyId was provided, clear the invalid strategyId
				this.router.navigate([], {
					queryParams: {
						strategy: null,
						dynamicContent: null,
					},
					queryParamsHandling: 'merge',
				});
			}
		});

		// Check for cached settings to be loaded
		const settingsString = localStorage.getItem(StoredKeys.settings);
		if (settingsString) {
			const settings: Settings = JSON.parse(settingsString);
			if (settings.version !== settingsVersion) {
				// Delete old settings if version is outdated
				localStorage.removeItem(StoredKeys.settings);
			} else {
				this.tags.forEach((tag) => (tag.checked = !settings.excludedTags.includes(tag.type)));
				this.dwarves = settings.dwarves;
				this.makeStratDecisionsAutomatically = settings.makeStratDecisionsAutomatically;
				this.preChosenMissions = settings.preChosenMissions;
				this.mission = settings.mission;
				this.correctInvalidInputs();
			}
		}

		// Load cached queued strategies
		const queuedStrategiesString = localStorage.getItem(StoredKeys.queuedStrategies);
		if (queuedStrategiesString) {
			const cachedQueuedStrats: CachedQueuedStrats = JSON.parse(queuedStrategiesString);
			if (cachedQueuedStrats) {
				if (cachedQueuedStrats.version !== queuedStrategiesVersion) {
					// Delete old queued strategies if version is outdated
					localStorage.removeItem(StoredKeys.queuedStrategies);
				} else {
					this.queuedStrats = cachedQueuedStrats.queue;
				}
			}
		}

		// Load list of recently chosen strategies from cache
		const recentStrategiesString = localStorage.getItem(StoredKeys.recentStrategies);
		if (recentStrategiesString) {
			const recentStrategies: number[] = JSON.parse(recentStrategiesString);
			if (recentStrategies) {
				this.recentStrats = recentStrategies;
			}
		}

		// Display welcome dialog to new users
		const hasSeenWelcomeDialog = localStorage.getItem(StoredKeys.hasSeenWelcomeDialog);
		if (hasSeenWelcomeDialog !== 'true') {
			this.openWelcomeDialog();
		}

		// Update background image
		this.updateBackgroundImage();
	}

	/**
	 * Roll for a random strategy to be performed
	 * If configured, strategies will be filtered based on unselected tags, team setup, and existing mission
	 * Default values will be applied to any inputs which are improperly configured (rather than preventing rolling)
	 */
	rollStrat(): void {
		// Correct invalid inputs before rolling for a strategy
		this.correctInvalidInputs();

		// Filter out strategies based on unselected tags
		const excludedTags = this.tags.filter((tag) => !tag.checked).map((tag) => tag.type);
		let candidateStrats = strategies.filter((strat) => !strat.tags?.some((tag) => excludedTags.includes(tag)));

		// Filter out strategies based on team requirements
		if (this.dwarves.length > 0) {
			candidateStrats = candidateStrats.filter((strat) => {
				const func = strat.requirements?.team;
				if (func) {
					return func({ dwarves: this.dwarves });
				} else {
					return true;
				}
			});
		}

		// Filter out strategies based on mission requirements
		if (this.preChosenMissions) {
			candidateStrats = candidateStrats.filter((strat) => {
				const func = strat.requirements?.mission;
				if (func) {
					return func(this.mission);
				} else {
					return true;
				}
			});
		}

		// Prevent a presently queued strategy from being re-chosen
		candidateStrats = candidateStrats.filter((strat) => !this.queuedStrats.some((queue) => queue.id === strat.id));

		// Prevent recently chosen strategies from being re-chosen
		candidateStrats = candidateStrats.filter((strat) => !this.recentStrats.includes(strat.id));

		// Pick a random strategy from the candidate list
		const chosenStrategy = sample(candidateStrats) ?? strategies[0];

		// Add strategyId to query params
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				strategyId: chosenStrategy?.id,
				dynamicContent: null,
			},
			queryParamsHandling: 'merge',
		});
	}

	/**
	 * Resets all settings to their default configurations and reloads the page
	 */
	resetAllSettings(): void {
		localStorage.removeItem(StoredKeys.settings);
		location.reload();
	}

	/**
	 * Clears all items from localStorage and reloads the page
	 */
	clearAllCachedData(): void {
		for (let key of Object.values(StoredKeys)) {
			localStorage.removeItem(key);
		}
		this.router.navigate([], {
			queryParams: {
				dynamicContent: null,
				strategyId: null,
			},
			queryParamsHandling: 'merge',
		});
		setTimeout(() => location.reload());
	}

	/**
	 * Adds another dwarf to the team
	 * New dwarves are created with no name, and willing to play all classes
	 */
	addDwarf(): void {
		this.dwarves.push({
			classes: Object.values(DwarfClass),
		});
		this.saveSettings();
	}

	/**
	 * Removes a dwarf from the team
	 * @param index - Index of dwarf to be removed
	 */
	removeDwarf(index: number): void {
		this.dwarves.splice(index, 1);
		this.saveSettings();
	}

	/**
	 * Sets the background image to a random image from the gallery
	 * The current background image is cycled on a daily basis
	 */
	updateBackgroundImage(): void {
		const backgroundImageIndex = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24)) % backgroundImages.length;
		this.background = backgroundImages[backgroundImageIndex];
	}

	/**
	 * Saves the latest settings to browser cache so it can be persisted across sessions
	 */
	saveSettings(): void {
		const settings: Settings = {
			version: settingsVersion,
			excludedTags: this.tags.filter((tag) => !tag.checked).map((tag) => tag.type),
			dwarves: this.dwarves,
			preChosenMissions: this.preChosenMissions,
			makeStratDecisionsAutomatically: this.makeStratDecisionsAutomatically,
			mission: this.mission,
		};
		localStorage.setItem(StoredKeys.settings, JSON.stringify(settings));
	}

	/**
	 * Correct any invalid inputs in settings or mission.
	 * This allows us to always roll a strategy and avoid form validation.
	 */
	correctInvalidInputs(): void {
		// If dwarf names have not been properly filled out, auto-populate with some data
		this.dwarves.forEach((dwarf, i) => {
			dwarf.name = (dwarf.name ?? '').trim().length === 0 ? `Dwarf #${i + 1}` : dwarf.name;
		});
		// If mission length or complexity are out of bounds, clamp them to the appropriate range
		this.clampMissionLengthAndComplexity();
		this.saveSettings();
	}

	/**
	 * Generates the dynamic contents associated with the active strategy
	 * (e.g. "Who is the Designated Medic?")
	 */
	generateDynamicContent(): void {
		if (this.strat?.generateDynamicContent) {
			this.strat.dynamicContent = this.strat.generateDynamicContent({ dwarves: this.dwarves });
			this.router.navigate([], {
				queryParams: {
					dynamicContent: this.strat.dynamicContent,
				},
				queryParamsHandling: 'merge',
			});
		}
	}

	/**
	 * Updates the cached queued strategies to match the latest in-memory queued strats
	 */
	updateQueuedStrategies(): void {
		// Close drawer if all queued strats have been removed
		if (this.queuedStrats.length === 0) {
			this.queuedStratsDrawer?.close();
		}
		// Update queuedStrategies in cache
		const cachedQueuedStrats: CachedQueuedStrats = {
			version: queuedStrategiesVersion,
			queue: this.queuedStrats,
		};
		localStorage.setItem(StoredKeys.queuedStrategies, JSON.stringify(cachedQueuedStrats));
	}

	/**
	 * Add a queued strategy to the list
	 */
	addQueuedStrategy(): void {
		// Exit early if there is no active strategy, or if the active strategy is already queued
		if (!this.strat || this.queuedStrats.some((strat) => strat.id === this.strat?.id)) {
			return;
		}
		this.queuedStrats.push(this.strat);
		this.updateQueuedStrategies();
	}

	/**
	 * Adds the active strategyId to the list of recently chosen strategies
	 * If the list of recently chosen strategies exceeds the length limit, the
	 * oldest item will be removed.
	 */
	updateRecentStrategies() {
		if (!this.strat) {
			return;
		}
		if (this.recentStrats.length === RECENT_STRAT_MAX_COUNT) {
			this.recentStrats.splice(0, 1); // Remove oldest item
		}
		this.recentStrats.push(this.strat?.id);
		localStorage.setItem(StoredKeys.recentStrategies, JSON.stringify(this.recentStrats));
	}

	/**
	 * Remove a queued strategy from the list
	 * @param id - ID of the strategy to be removed
	 */
	removeQueuedStrategy(id: number): void {
		const queuedStratIndex = this.queuedStrats.findIndex((strat) => strat.id === id);
		if (queuedStratIndex !== -1) {
			this.queuedStrats.splice(queuedStratIndex, 1);
		}
		this.updateQueuedStrategies();
	}

	/**
	 * Copies text to the clipboard so that strategies can be easily shared with fellow dwarves
	 * @param copyIntro - Whether or not an explanation of what Strat Roulette is should be copied
	 * @param copyStrat - Whether or not an explanation of the current strategy should be copied
	 */
	copyText(copyIntro: boolean, copyStrat: boolean): void {
		let stringToCopy = '';
		if (copyIntro) {
			stringToCopy +=
				"Welcome! We're playing DRG Strategy Roulette. Every mission has a randomly chosen strategy that we have to follow.";
		}
		if (copyIntro && copyStrat) {
			stringToCopy += '\n\n';
		}
		if (copyStrat) {
			stringToCopy += `This mission's strategy is #${this.strat?.id}: ${this.strat?.name}.\n`;
			stringToCopy += `Summary: ${this.strat?.summary}`;
			if (this.strat?.details) {
				stringToCopy += `\nAdditional details: ${this.strat?.details}`;
			}
			if (this.strat?.writtenRequirements) {
				stringToCopy += `\nRequirements: ${this.strat?.writtenRequirements}`;
			}
			if (this.strat?.dynamicContent) {
				stringToCopy += `\nThis time around: ${this.strat.dynamicContent}`;
			}
		}
		this.clipboard.copy(stringToCopy);
		this.snackbar.openFromComponent(SnackbarWithIconComponent, {
			duration: 5000,
			data: {
				text: `${copyIntro ? (copyStrat ? 'Intro and strategy' : 'Intro') : 'Strategy'} copied to clipboard.`,
				prefixIcon: 'assignment',
			} as SnackbarConfig,
		});
	}

	/**
	 * Copy text and current URL to clipboard
	 * to enable quickly sharing site
	 */
	copyShareText(): void {
		let stringToCopy = this.strat
			? 'Join us for this strategy on DRG Strategy Roulette!\n'
			: 'Check out DRG Strategy Roulette!\n';
		stringToCopy += window.location.href;
		this.clipboard.copy(stringToCopy);
		this.snackbar.openFromComponent(SnackbarWithIconComponent, {
			duration: 5000,
			data: {
				text: `Link to ${this.strat ? 'current strategy' : 'DRG Strat Roulette'} copied to clipboard.`,
				prefixIcon: 'assignment',
			} as SnackbarConfig,
		});
	}

	/**
	 * Opens the welcome dialog which explains how to use the app
	 */
	openWelcomeDialog(): void {
		const welcomeDialog = this.dialog.open(WelcomeDialogComponent);
		welcomeDialog.afterClosed().subscribe(() => localStorage.setItem(StoredKeys.hasSeenWelcomeDialog, 'true'));
	}

	/**
	 * Opens the feedback dialog
	 */
	openFeedbackDialog(): void {
		this.dialog.open(FeedbackDialogComponent);
	}

	/**
	 * Clamps the values of mission.length and mission.complexity to be within the [1, 3] range
	 */
	private clampMissionLengthAndComplexity(): void {
		if (!this.mission.length) {
			this.mission.length = 1;
		}
		if (!this.mission.complexity) {
			this.mission.complexity = 1;
		}
		this.mission.length = clamp(this.mission.length, 1, 3);
		this.mission.complexity = clamp(this.mission.complexity, 1, 3);
	}
}
