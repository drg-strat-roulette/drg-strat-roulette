export interface Mission {
	primary: PrimaryObjective;
	secondary: SecondaryObjective;
	length: number;
	complexity: number;
	warnings: WarningType[];
	anomalies: AnomalyType[];
	biome: BiomeType;
}

export enum PrimaryObjective {
	miningExpedition = 'Mining Expedition',
	eggHunt = 'Egg Hunt',
	onSiteRefining = 'On-site Refining',
	salvageOperation = 'Salvage Operation',
	pointExtraction = 'Point Extraction',
	escortDuty = 'Escort Duty',
	elimination = 'Elimination',
	industrialSabotage = 'Industrial Sabotage',
}

export enum SecondaryObjective {
	alienFossils = 'Alien Fossils',
	apocaBlooms = 'Apoca Blooms',
	booloCap = 'Boolo Caps',
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
	crystallineCaverns = 'Crystalline Caverns',
	denseBiozone = 'Dense Biozone',
	fungusBogs = 'Fungus Bogs',
	glacialStrata = 'Glacial Strata',
	magmaCore = 'Magma Core',
	radioactiveExclusionZone = 'Radioactive Exclusion Zone',
	saltPits = 'Salt Pits',
	sandblastedCorridors = 'Sandblasted Corridors',
	hollowBough = 'Hollow Bough',
	azureWeald = 'Azure Weald',
}
