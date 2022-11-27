export interface Mission {
	primary: PrimaryObjective;
	secondary: SecondaryObjective;
	biome: BiomeType;
	length: number; // Currently unused
	complexity: number; // Currently unused
	warnings: WarningType[];
	anomaly: AnomalyType | null;
}

export enum PrimaryObjective {
	eggHunt = 'Egg Hunt',
	elimination = 'Elimination',
	escortDuty = 'Escort Duty',
	industrialSabotage = 'Industrial Sabotage',
	miningExpedition = 'Mining Expedition',
	onSiteRefining = 'On-site Refining',
	pointExtraction = 'Point Extraction',
	salvageOperation = 'Salvage Operation',
}

export enum SecondaryObjective {
	alienFossils = 'Alien Fossils',
	apocaBlooms = 'Apoca Blooms',
	booloCap = 'Boolo Caps',
	dystrum = 'Dystrum',
	ebonut = 'Ebonuts',
	festerFleas = 'Fester Fleas',
	gunkSeed = 'Gunk Seeds',
	hollomite = 'Hollomite',
}

export enum WarningType {
	caveLeechCluster = 'Cave Leech Cluster',
	eliteThreat = 'Elite Threat',
	exploderInfestation = 'Exploder Infestation',
	hauntedCave = 'Haunted Cave',
	lethalEnemies = 'Lethal Enemies',
	lithophageOutbreak = 'Lithophage Outbreak',
	lowOxygen = 'Low Oxygen',
	macteraPlague = 'Mactera Plague',
	parasites = 'Parasites',
	regenerativeBugs = 'Regenerative bugs',
	rivalPresence = 'Rival Presence',
	shieldDisruption = 'Shield Disruption',
	swarmageddon = 'Swarmageddon',
}

export enum AnomalyType {
	criticalWeakness = 'Critical Weaknesses',
	doubleXp = 'Double XP',
	goldRush = 'Gold Rush',
	goldenBugs = 'Golden Bugs',
	lowGravity = 'Low Gravity',
	mineralMania = 'Mineral Mania',
	richAtmosphere = 'Rich Atmosphere',
	volatileGuts = 'Volatile Guts',
}

export enum BiomeType {
	azureWeald = 'Azure Weald',
	crystallineCaverns = 'Crystalline Caverns',
	denseBiozone = 'Dense Biozone',
	fungusBogs = 'Fungus Bogs',
	glacialStrata = 'Glacial Strata',
	hollowBough = 'Hollow Bough',
	magmaCore = 'Magma Core',
	radioactiveExclusionZone = 'Radioactive Exclusion Zone',
	saltPits = 'Salt Pits',
	sandblastedCorridors = 'Sandblasted Corridors',
}
