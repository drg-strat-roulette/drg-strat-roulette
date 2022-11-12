import { Component, OnInit } from '@angular/core';
import { strategies } from './data/strats.const';
import * as lodash from 'lodash';
import { Strategy, stratTagInfo, StratTagObject } from './models/strat.interface';
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
import { Settings } from './models/settings.interface';
import { StoredKeys } from './models/local-storage.interface';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	// Static data
	dwarfClasses: DwarfClass[] = Object.values(DwarfClass);
	missionPrimaryObjectives: PrimaryObjective[] = Object.values(PrimaryObjective);
	missionSecondaryObjectives: SecondaryObjective[] = Object.values(SecondaryObjective);
	biomes: BiomeType[] = Object.values(BiomeType);
	warnings: WarningType[] = Object.values(WarningType);
	anomalies: AnomalyType[] = Object.values(AnomalyType);

	// Most recently rolled strategy
	strat: Strategy | undefined;

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

	constructor(private route: ActivatedRoute, private router: Router, private clipboard: Clipboard) {}

	ngOnInit(): void {
		// Subscribe to query parameters (in order to load a strategy by its Id)
		this.route.queryParamMap.subscribe((params) => {
			const strategyId = params.get('strategyId');
			const strategy = strategies.find((strat) => strat.id === parseInt(strategyId ?? ''));
			if (strategy) {
				// If a matching strategy was found, display it
				this.strat = strategy;
			} else if (strategyId) {
				// If no matching strategy was found, but a strategyId was provided, clear the invalid strategyId
				this.router.navigate([], {
					queryParams: {
						strategy: null,
					},
					queryParamsHandling: 'merge',
				});
			}
		});

		// Check for cached settings to be loaded
		const settings: Settings = JSON.parse(localStorage.getItem(StoredKeys.settings) ?? '');
		if (settings) {
			this.tags.forEach((tag) => (tag.checked = !settings.excludedTags.includes(tag.type)));
			this.dwarves = settings.dwarves;
			this.makeStratDecisionsAutomatically = settings.makeStratDecisionsAutomatically;
			this.preChosenMissions = settings.preChosenMissions;
			this.mission = settings.mission;
		}
	}

	/**
	 * Roll for a random strategy to be performed
	 * If configured, strategies will be filtered based on unselected tags, team setup, and existing mission
	 * Default values will be applied to any inputs which are improperly configured (rather than preventing rolling)
	 */
	rollStrat(): void {
		// Filter out strategies based on unselected tags
		const excludedTags = this.tags.filter((tag) => !tag.checked).map((tag) => tag.type);
		let candidateStrats = strategies.filter((strat) => !strat.tags?.some((tag) => excludedTags.includes(tag)));

		// Correct invalid inputs before rolling for a strategy
		this.correctInvalidInputs();

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

		// Pick a random strategy from the candidate list
		this.strat = lodash.sample(candidateStrats);

		// Add strategyId to query params
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				strategyId: this.strat?.id,
			},
			queryParamsHandling: 'merge',
		});
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
			version: 1,
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
			dwarf.name = (dwarf.name ?? '').length === 0 ? `Dwarf #${i + 1}` : dwarf.name;
		});
		// If mission length or complexity are out of bounds, clamp them to the appropriate range
		this.clampMissionLengthAndComplexity();
		this.saveSettings();
	}

	/**
	 * Copies text to the clipboard so that strategies can be easily shared with fellow dwarves
	 * @param copyIntro - Whether or not an explanation of what Strat Roulette is should be copied
	 * @param copyStrat - Whether or not an explanation of the current strategy should be copied
	 */
	copyText(copyIntro: boolean, copyStrat: boolean): void {
		let stringToCopy = '';
		if (copyIntro) {
			stringToCopy += 'INTRO';
		}
		if (copyIntro && copyStrat) {
			stringToCopy += '\n\n';
		}
		if (copyStrat) {
			stringToCopy += JSON.stringify(this.strat);
		}
		this.clipboard.copy(stringToCopy);
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
		this.mission.length = this.clamp(this.mission.length, 1, 3);
		this.mission.complexity = this.clamp(this.mission.complexity, 1, 3);
	}

	/**
	 * Clamps a number to fall within a specified range
	 * @param num - Number to be clamped
	 * @param min - Minimum value for resulting number
	 * @param max - Maximum value for resulting number
	 * @returns The resulting number after the clamp has been applied to the input
	 */
	private clamp(num: number, min: number, max: number): number {
		return Math.min(Math.max(num, min), max);
	}
}
