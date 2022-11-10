// TODO: Is Team a necessary interface? What else would it store?
export interface Team {
	dwarves: Dwarf[];
}

export interface Dwarf {
	name?: string;
	type?: DwarfType;
}

export enum DwarfType {
	flexible = 'Flexible', // Willing to play as any dwarf as-needed
	driller = 'Driller',
	engineer = 'Engineer',
	gunner = 'Gunner',
	scout = 'Scout',
}
