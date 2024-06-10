/** Information about a team of dwarves */
export interface Team {
	dwarves: Dwarf[];
}

/** Information about a single dwarf */
export interface Dwarf {
	name?: string;
	classes: DwarfClass[];
}

/** Types of dwarf classes */
export enum DwarfClass {
	driller = 'Driller',
	engineer = 'Engineer',
	gunner = 'Gunner',
	scout = 'Scout',
}
