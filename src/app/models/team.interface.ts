// TODO: Is Team a necessary interface? What else would it store?
export interface Team {
	dwarves: Dwarf[];
}

export interface Dwarf {
	name?: string;
	classes: DwarfClass[];
}

export enum DwarfClass {
	driller = 'Driller',
	engineer = 'Engineer',
	gunner = 'Gunner',
	scout = 'Scout',
}
