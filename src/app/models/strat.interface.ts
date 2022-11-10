import { Mission } from './missions.interface';
import { Settings } from './settings.interface';
import { Team } from './team.interface';

export interface Strategy {
	// TODO: How can we generate additional content? e.g. Roll RNG
	id: number;
	name: string;
	summary: string;
	details: string;
	difficultyPoints?: number;
	tags?: StratTag[];
	requirements?: StratRequirements;
	writtenRequirements?: string;
	exclusionCategory?: ExclusionCategory[];
}

export enum StratTag {
	settings = 'Settings',
	loadout = 'Loadout',
	time = 'Time',
	communication = 'Communication',
	queue = 'Queue',
	nausea = 'Nausea',
}

export const stratTagInfo: StratTagInfo[] = [
	{
		type: StratTag.settings,
		description: 'This strategy requires changing in-game settings.',
		tooltipDetails: 'require changing in-game settings.',
	},
	{
		type: StratTag.loadout,
		description:
			'This strategy requires bringing a particular loadout. You will need to modify a loadout slot to complete it.',
		tooltipDetails: 'require changing equipment loadout.',
	},
	{
		type: StratTag.time,
		description: 'This strategy may significantly increase the time taken to complete a mission.',
		tooltipDetails: 'may significantly increase the mission time.',
	},
	{
		type: StratTag.communication,
		description: 'This strategy requires a high level of communication. Voice-chat is strongly recommended.',
		tooltipDetails: 'necessitate voice communications.',
	},
	{
		type: StratTag.queue,
		description:
			'This strategy relies on RNG to be attempted. As such, they should be queued up and attempted when the opportunity presents itself.',
		tooltipDetails: 'must be queued. (Relies on random events)',
	},
	{
		type: StratTag.nausea,
		description: 'This strategy has the potential to cause nausea for some players.',
		tooltipDetails: 'may cause nausea.',
	},
];

export interface StratTagInfo {
	type: StratTag;
	description: string;
	tooltipDetails: string;
}

export interface StratTagObject extends StratTagInfo {
	checked: boolean;
}

export enum ExclusionCategory {
	specificClasses = 'Specific classes',
	// TODO: Others, and add them to strats
}

export interface StratRequirements {
	mission?: (mission: Mission) => boolean;
	team?: (team: Team) => boolean;
	settings?: (settings: Settings) => boolean;
}
