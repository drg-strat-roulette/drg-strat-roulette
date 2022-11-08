import { Build } from './build.interface';
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
	settings = 'This strategy requires changing in-game settings.',
	loadout = 'This strategy requires bringing a particular loadout. You will need to modify a loadout slot to complete it.',
	time = 'This strategy may significantly increase the time taken to complete a mission.',
	communication = 'This strategy requires a high level of communication. Voice-chat is strongly recommended.',
	queue = 'This strategy relies on RNG to be attempted. As such, they will be queued up and attempted when the opportunity presents itself.',
	nausea = 'This strategy has the potential to cause nausea for some players.',
	class = 'This strategy requires multiple dwarves to play as the same class.',
	advancedSettings = 'This strategy requires advanced changes to settings. It will require editing settings files in a text editor and/or restarting your game.',
}

export enum ExclusionCategory {
	specificClasses = 'Specific classes',
	// TODO: Others, and add them to strats
}

export interface StratRequirements {
	// build?: ((build: Build) => boolean)[]; // TODO: Not needed?
	mission?: (mission: Mission) => boolean; // e.g. Biome must be Azure Weald, Mission type must be elimination
	team?: (team: Team) => boolean; // e.g. team must have 3+ players, and 1 gunner
	settings?: (settings: Settings) => boolean;
}
