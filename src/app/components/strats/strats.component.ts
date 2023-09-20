import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { strategies } from '../..//data/strats.const';
import { clamp, sample } from 'lodash-es';
import { CachedQueuedStrats, Strategy, StratTag, stratTagInfo, StratTagObject } from '../../models/strat.interface';
import { Dwarf, DwarfClass } from '../../models/team.interface';
import { Clipboard } from '@angular/cdk/clipboard';
import {
	AnomalyType,
	BiomeType,
	Mission,
	PrimaryObjective,
	SecondaryObjective,
	WarningType,
} from '../../models/missions.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Settings, settingsVersion } from '../../models/settings.interface';
import { CrossTabSyncType, queuedStrategiesVersion, StratKeys } from '../../models/local-storage.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
	SnackbarConfig,
	SnackbarWithIconComponent,
} from '../../components/snackbar-with-icon/snackbar-with-icon.component';
import { MatDrawer } from '@angular/material/sidenav';
import { sampleWithWeights } from '../../utilities/general-functions.utils';
import { HeaderControlsService } from 'src/app/services/header-controls/header-controls.service';
import { Subject, takeUntil } from 'rxjs';
import { ManagementDialogConfigs } from 'src/app/services/management-dialog/management-dialog.const';
import { ManagementDialogService } from 'src/app/services/management-dialog/management-dialog.service';
import { CrossTabSyncService } from 'src/app/services/cross-tab-sync/cross-tab-sync.service';

const RECENT_STRAT_MAX_COUNT = 10;

@Component({
	selector: 'app-strats',
	templateUrl: './strats.component.html',
	styleUrls: ['./strats.component.scss'],
})
export class StratsComponent implements OnInit, OnDestroy {
	@ViewChild('queuedStratsDrawer') queuedStratsDrawer: MatDrawer | undefined;

	// Static data
	dwarfClasses: DwarfClass[] = Object.values(DwarfClass);
	missionPrimaryObjectives: PrimaryObjective[] = Object.values(PrimaryObjective);
	missionSecondaryObjectives: SecondaryObjective[] = Object.values(SecondaryObjective);
	biomes: BiomeType[] = Object.values(BiomeType);
	warnings: WarningType[] = Object.values(WarningType);
	anomalies: AnomalyType[] = Object.values(AnomalyType);

	// Most recently rolled strategy
	strat: Strategy | undefined;
	set strategy(s: Strategy) {
		// Set the strategy
		this.strat = s;

		// Generate dynamic content for the chosen strategy
		if (s.generateDynamicContent && this.dwarves.length > 0) {
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

	private destroy: Subject<void> = new Subject();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private clipboard: Clipboard,
		private snackbar: MatSnackBar,
		private managementDialogService: ManagementDialogService,
		private headerControlsService: HeaderControlsService,
		private crossTabSyncService: CrossTabSyncService
	) {}

	ngOnInit(): void {
		// Check for cached settings to be loaded
		this.loadSettings();

		// Load cached queued strategies
		this.loadQueuedStrats();

		// Load list of recent strategies from cache
		this.loadRecentStrategies();

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

		// Display welcome dialog to new users
		const hasSeenWelcomeDialog = localStorage.getItem(StratKeys.hasSeenWelcomeDialog);
		if (hasSeenWelcomeDialog !== 'true') {
			this.openWelcomeDialog();
		}

		// Subscribe to events from header control button presses
		this.headerControlsService.infoButtonPressed$
			.pipe(takeUntil(this.destroy))
			.subscribe(() => this.openWelcomeDialog());
		this.headerControlsService.shareButtonPressed$
			.pipe(takeUntil(this.destroy))
			.subscribe(() => this.copyShareText());
		this.headerControlsService.settingsButtonPressed$
			.pipe(takeUntil(this.destroy))
			.subscribe(() => (this.settingsMenuCollapsed = !this.settingsMenuCollapsed));

		// Subscribe to updates from other tabs
		this.crossTabSyncService.tabSync$.pipe(takeUntil(this.destroy)).subscribe((u) => {
			if (u === CrossTabSyncType.queuedStratsUpdated) {
				this.loadQueuedStrats();
			} else if (u === CrossTabSyncType.recentStratsUpdated) {
				this.loadRecentStrategies();
			} else if (u === CrossTabSyncType.stratSettingsUpdated) {
				this.loadSettings();
			}
		});
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.complete();
	}

	/**
	 * Roll for a random strategy to be performed
	 * If configured, strategies will be filtered based on unselected tags, team setup, and existing mission
	 * Default values will be applied to any inputs which are improperly configured (rather than preventing rolling)
	 */
	rollStrat(): void {
		// Correct invalid inputs before rolling for a strategy
		this.correctInvalidInputs();

		// Pick a strategy from the candidate list
		const candidateStrats = this.getCandidateStrats();
		let chosenStrategy: Strategy | undefined;
		if (this.preChosenMissions) {
			// Apply weights to the list of candidate strategies in order to balance when choosing missions before strategy
			const strategyWeights = candidateStrats.map((s) => (s.missionReqChance ? 1 / s.missionReqChance : 1));
			chosenStrategy = sampleWithWeights(candidateStrats, strategyWeights);
		} else {
			// Apply equal weights to all candidate strategies
			chosenStrategy = sample(candidateStrats);
		}

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
	 * Clears all items from localStorage and reloads the page
	 */
	clearAllCachedData(): void {
		for (let key of Object.values(StratKeys)) {
			localStorage.removeItem(key);
		}
		this.router.navigate([], {
			queryParams: {
				dynamicContent: null,
				strategyId: null,
			},
			queryParamsHandling: 'merge',
		});
		this.crossTabSyncService.postUpdate(CrossTabSyncType.forceReload);
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
	 * Saves the latest settings to browser cache so it can be persisted across sessions
	 */
	saveSettings(): void {
		const settings: Settings = {
			version: settingsVersion,
			excludedTags: this.tags.filter((tag) => !tag.checked).map((tag) => tag.type),
			dwarves: this.dwarves,
			preChosenMissions: this.preChosenMissions,
			mission: this.mission,
		};
		localStorage.setItem(StratKeys.settings, JSON.stringify(settings));
		this.crossTabSyncService.postUpdate(CrossTabSyncType.stratSettingsUpdated);
	}

	/**
	 * Resets all settings to their default configurations and reloads the page
	 */
	resetAllSettings(): void {
		localStorage.removeItem(StratKeys.settings);
		this.crossTabSyncService.postUpdate(CrossTabSyncType.forceReload);
		location.reload();
	}

	/**
	 * Load cached strategy settings
	 */
	loadSettings(): void {
		const settingsString = localStorage.getItem(StratKeys.settings);
		if (settingsString) {
			const settings: Settings = JSON.parse(settingsString);
			if (settings.version !== settingsVersion) {
				// Delete old settings if version is outdated
				localStorage.removeItem(StratKeys.settings);
			} else {
				this.tags.forEach((tag) => (tag.checked = !settings.excludedTags.includes(tag.type)));
				this.dwarves = settings.dwarves;
				this.preChosenMissions = settings.preChosenMissions;
				this.mission = settings.mission;
			}
		}
	}

	/**
	 * Correct any invalid inputs in settings or mission.
	 * This allows us to always roll a strategy and avoid form validation.
	 */
	correctInvalidInputs(): void {
		// If dwarf names have not been properly filled out, auto-populate with some data
		let dwarfNameChanged = false;
		this.dwarves.forEach((dwarf, i) => {
			const oldName = dwarf.name;
			dwarf.name = (dwarf.name ?? '').trim().length === 0 ? `Dwarf #${i + 1}` : dwarf.name;
			if (oldName !== dwarf.name) {
				dwarfNameChanged = true;
			}
		});
		// If mission length or complexity are out of bounds, clamp them to the appropriate range
		const clamped = this.clampMissionLengthAndComplexity();
		if (dwarfNameChanged || clamped) {
			this.saveSettings();
		}
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
	 * Adds the active strategyId to the list of recently chosen strategies
	 * If the list of recently chosen strategies exceeds the length limit, the oldest item(s) will be removed.
	 */
	updateRecentStrategies(): void {
		if (!this.strat) {
			return;
		}
		const priorList = this.recentStrats.toString();

		// Remove current strategyId if already exists
		if (this.recentStrats.includes(this.strat.id)) {
			this.recentStrats.splice(this.recentStrats.indexOf(this.strat.id), 1);
		}

		// Add current strategyId
		this.recentStrats.push(this.strat.id);

		// Enforce recentStrats length limit
		while (this.recentStrats.length > RECENT_STRAT_MAX_COUNT) {
			this.recentStrats.splice(0, 1); // Remove oldest item
		}

		// Update cache if changed
		if (priorList !== this.recentStrats.toString()) {
			localStorage.setItem(StratKeys.recentStrategies, JSON.stringify(this.recentStrats));
			this.crossTabSyncService.postUpdate(CrossTabSyncType.recentStratsUpdated);
		}
	}

	/**
	 * Load list of recent strategies from cache
	 */
	loadRecentStrategies(): void {
		const recentStrategiesString = localStorage.getItem(StratKeys.recentStrategies);
		if (recentStrategiesString) {
			const recentStrategies: number[] = JSON.parse(recentStrategiesString);
			if (recentStrategies) {
				this.recentStrats = recentStrategies;
			}
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
		localStorage.setItem(StratKeys.queuedStrategies, JSON.stringify(cachedQueuedStrats));
		this.crossTabSyncService.postUpdate(CrossTabSyncType.queuedStratsUpdated);
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
	 * Load cached queued strategies
	 */
	loadQueuedStrats(): void {
		const queuedStrategiesString = localStorage.getItem(StratKeys.queuedStrategies);
		if (queuedStrategiesString) {
			const cachedQueuedStrats: CachedQueuedStrats = JSON.parse(queuedStrategiesString);
			if (cachedQueuedStrats) {
				if (cachedQueuedStrats.version !== queuedStrategiesVersion) {
					// Delete old queued strategies if version is outdated
					localStorage.removeItem(StratKeys.queuedStrategies);
				} else {
					this.queuedStrats = cachedQueuedStrats.queue;
					// Close drawer if all queued strats have been removed
					if (this.queuedStrats.length === 0) {
						this.queuedStratsDrawer?.close();
					}
				}
			}
		}
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
				"Welcome! We're playing DRG Strat Roulette. Every mission has a randomly chosen strategy that we have to follow.";
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
			? 'Join us for this strategy on DRG Strat Roulette!\n'
			: 'Check out DRG Strat Roulette!\n';
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
		const welcomeDialog = this.managementDialogService.open(ManagementDialogConfigs.welcomeStrats);
		welcomeDialog.afterClosed().subscribe(() => localStorage.setItem(StratKeys.hasSeenWelcomeDialog, 'true'));
	}

	/**
	 * Cycles the strategy left or right by 1
	 */
	cycleStrat(direction: -1 | 1): void {
		// Correct invalid inputs before rolling for a strategy
		this.correctInvalidInputs();

		// Find the ID of the next candidate strat
		const currentStratId = this.strat?.id ?? 0;
		const candidateStratIds = this.getCandidateStrats(false, false).map((s) => s.id);
		let newStratId: number | undefined;
		if (direction > 0) {
			newStratId = candidateStratIds.find((id) => id > currentStratId) ?? candidateStratIds[0];
		} else {
			newStratId = candidateStratIds.reverse().find((id) => id < currentStratId) ?? candidateStratIds[0];
		}

		// Add strategyId to query params
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				strategyId: newStratId,
				dynamicContent: null,
			},
			queryParamsHandling: 'merge',
		});
	}

	/**
	 * Clamps the values of mission.length and mission.complexity to be within the [1, 3] range
	 * Return true if something was updated, false otherwise
	 */
	private clampMissionLengthAndComplexity(): boolean {
		const originalLength = this.mission.length;
		const originalComplexity = this.mission.complexity;
		if (!this.mission.length) {
			this.mission.length = 1;
		}
		if (!this.mission.complexity) {
			this.mission.complexity = 1;
		}
		this.mission.length = clamp(this.mission.length, 1, 3);
		this.mission.complexity = clamp(this.mission.complexity, 1, 3);
		return originalLength !== this.mission.length || originalComplexity !== this.mission.complexity;
	}

	/**
	 * Returns a list of all strategies which are valid given the current settings
	 */
	private getCandidateStrats(disallowRecent = true, disallowQueued = true): Strategy[] {
		// Filter out strategies based on unselected tags
		const excludedTags = this.tags.filter((tag) => !tag.checked).map((tag) => tag.type);
		let candidateStrats = strategies.filter((strat) => !strat.tags?.some((tag) => excludedTags.includes(tag)));

		// Filter out strategies based on team requirements
		if (this.dwarves.length > 0) {
			candidateStrats = candidateStrats.filter((strat) => {
				const teamReq = strat.requirements?.team;
				return teamReq ? teamReq({ dwarves: this.dwarves }) : true;
			});
		}

		// Filter out strategies based on mission requirements
		if (this.preChosenMissions) {
			candidateStrats = candidateStrats.filter((strat) => {
				const missionReq = strat.requirements?.mission;
				return missionReq ? missionReq(this.mission) : true;
			});
		}

		// Prevent a presently queued strategy from being re-chosen
		if (disallowQueued) {
			candidateStrats = candidateStrats.filter(
				(strat) => !this.queuedStrats.some((queue) => queue.id === strat.id)
			);
		}

		// Prevent recently chosen strategies from being re-chosen
		if (disallowRecent) {
			candidateStrats = candidateStrats.filter((strat) => !this.recentStrats.includes(strat.id));
		}

		return candidateStrats;
	}
}
