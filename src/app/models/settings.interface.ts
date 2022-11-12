import { Mission } from './missions.interface';
import { StratTag } from './strat.interface';
import { Dwarf } from './team.interface';

export interface Settings {
	version: number;
	excludedTags: StratTag[];
	dwarves: Dwarf[];
	preChosenMissions: boolean;
	makeStratDecisionsAutomatically: boolean;
	mission: Mission;
}

export enum SelectionMode {
	normal = 'Normal', // Single strategy rolled at random. Option to roll multiple strats.
	climber = 'Climber', // Multiple strategies are rolled at random. Cumulative difficulty increases after every successful mission.
	multi = 'Multi', // Select a desired difficulty. Multiple strategies are rolled to achieve the selected difficulty.
}
