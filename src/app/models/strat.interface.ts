import { Mission } from './missions.interface';
import { StratSettings } from './settings.interface';
import { Team } from './team.interface';

/** Strategy information */
export interface Strategy {
	/** Strategy unique identifier */
	id: number;
	/** Friendly name */
	name: string;
	/** Short summary */
	summary: string;
	/** Further details/clarifications */
	details: string;
	/** Tags for this strategy */
	tags?: StratTag[];
	/** Functions defining requirements needed to attempt this strategy */
	requirements?: StratRequirements;
	/** User-readable explanation of requirements needed to attempt this strategy */
	writtenRequirements?: string;
	/** The percent chance that the mission requirements for this strategy are met by a random mission [0-1] */
	missionReqChance?: number;
	/** Function to generate dynamic content for a given strategy (e.g. Picking a dwarf at random) */
	generateDynamicContent?: (t: Team) => string;
	/** Dynamic content to be displayed */
	dynamicContent?: string;
}

/** Tags which can apply to a strategy */
export enum StratTag {
	settings = 'Require changing settings',
	loadout = 'Require changing loadout',
	time = 'May take a long time',
	communication = 'Require voice chat',
	queue = 'Are queued',
	nausea = 'May cause nausea',
}

/** Further information about each `StratTag` */
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
		tooltipDetails: 'require voice communications.',
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

/** Further information about a `StratTag` */
export interface StratTagInfo {
	/** Strategy tag type */
	type: StratTag;
	/** Short description of the tag */
	description: string;
	/** Text to be displayed in a tooltip following string: 'Include strategies which ' */
	tooltipDetails: string;
	/** Icon symbolizing this strategy tag */
	icon: string;
}

/** Further information about a `StratTag`, including whether or not this tag is enabled */
export interface StratTagObject extends StratTagInfo {
	/** Whether or not this tag is enabled */
	checked: boolean;
}

/** Requirements which must be met for a strategy to be attempted */
export interface StratRequirements {
	/** Function specifying whether a mission meets a strategy's requirement */
	mission?: (mission: Mission) => boolean;
	/** Function specifying whether a team meets a strategy's requirement */
	team?: (team: Team) => boolean;
	/** Function specifying whether user's settings meet a strategy's requirement */
	settings?: (settings: StratSettings) => boolean;
}

/** Information stored to persist queued strategies */
export interface CachedQueuedStrats {
	/** List of queued strategies */
	queue: Strategy[];
	/** Data version */
	version: number;
}
