import { Mission } from './missions.interface';
import { Settings } from './settings.interface';
import { Team } from './team.interface';

export interface Strategy {
	id: number;
	name: string;
	summary: string;
	details: string;
	tags?: StratTag[];
	requirements?: StratRequirements;
	writtenRequirements?: string;
	missionReqChance?: number;
	generateDynamicContent?: (t: Team) => string;
	dynamicContent?: string;
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
		icon: 'settings',
	},
	{
		type: StratTag.loadout,
		description:
			'This strategy requires bringing a particular loadout. You will need to modify a loadout slot to complete it.',
		tooltipDetails: 'require changing equipment loadout.',
		icon: 'inventory',
	},
	{
		type: StratTag.time,
		description: 'This strategy may significantly increase the time taken to complete a mission.',
		tooltipDetails: 'may significantly increase the mission time.',
		icon: 'schedule',
	},
	{
		type: StratTag.communication,
		description: 'This strategy requires a high level of communication. Voice-chat is strongly recommended.',
		tooltipDetails: 'necessitate voice communications.',
		icon: 'headset_mic',
	},
	{
		type: StratTag.queue,
		description:
			'This strategy relies on RNG to be attempted. As such, they should be queued up and attempted when the opportunity presents itself.',
		tooltipDetails: 'must be queued. (Relies on random events)',
		icon: 'list_alt',
	},
	{
		type: StratTag.nausea,
		description: 'This strategy has the potential to cause nausea for some players.',
		tooltipDetails: 'may cause nausea.',
		icon: 'sick',
	},
];

export interface StratTagInfo {
	type: StratTag;
	description: string;
	tooltipDetails: string;
	icon: string;
}

export interface StratTagObject extends StratTagInfo {
	checked: boolean;
}

export interface StratRequirements {
	mission?: (mission: Mission) => boolean;
	team?: (team: Team) => boolean;
	settings?: (settings: Settings) => boolean;
}

export interface CachedQueuedStrats {
	queue: Strategy[];
	version: number;
}
