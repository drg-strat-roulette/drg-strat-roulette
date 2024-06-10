/** Mission information */
export interface Mission {
	/** Mission primary objective */
	primary: PrimaryObjective;
	/** Mission secondary objective */
	secondary: SecondaryObjective;
	/** Mission biome */
	biome: BiomeType;
	/** Mission length (1-3) */
	length: number; // Currently hidden
	/** Mission complexity (1-3) */
	complexity: number; // Currently hidden
	/** Mission warning type(s) */
	warnings: WarningType[];
	/** Mission anomaly type */
	anomaly: AnomalyType | null;
}

/** Primary objective types */
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

/** Secondary objective types */
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

/** Warning types */
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

/** Anomaly types */
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

/** Biome types */
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
