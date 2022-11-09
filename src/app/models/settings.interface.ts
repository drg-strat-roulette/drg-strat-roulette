import { StratTag } from './strat.interface';

export interface Settings {
	excludedTags: StratTag[]; // Strategies with these tags should be excluded from the selection pool
	missionFirst: boolean; // Whether the mission is chosen before the strategy // TODO: Needed or can be inferred?
}

export enum SelectionMode {
	normal = 'Normal', // Single strategy rolled at random. Option to roll multiple strats.
	climber = 'Climber', // Multiple strategies are rolled at random. Cumulative difficulty increases after every successful mission.
	multi = 'Multi', // Select a desired difficulty. Multiple strategies are rolled to achieve the selected difficulty.
}
