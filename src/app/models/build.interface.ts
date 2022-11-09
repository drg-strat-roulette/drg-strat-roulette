export interface Build {
	primary: PrimaryWeapon;
	secondary: SecondaryWeapon;
	perks: Perks;
}

export interface Perks {
	active: ActivePerkType[];
	passive: PassivePerkType[];
}

export enum ActivePerkType {
	beastMaster = 'Beast Master',
	berzerker = 'Berzerker',
	dash = 'Dash',
	fieldMedic = 'Field Medic',
	heightenedSenses = 'Heightened Senses',
	hoverBoots = 'Hover Boots',
	ironWill = 'Iron Will',
	seeYouInHell = 'See You In Hell',
	shieldLink = 'Shield Link',
}

export enum PassivePerkType {
	bornReady = 'Born Ready',
	deepPockets = 'Deep Pockets',
	elementalInsulation = 'Elemental Insulation',
	friendly = 'Friendly',
	itsABugThing = "It's a bug thing",
	resupplier = 'Resupplier',
	secondWind = 'Second Wind',
	strongArm = 'Strong Arm',
	sweetTooth = 'Sweet Tooth',
	thorns = 'Thorns',
	unstoppable = 'Unstoppable',
	vampire = 'Vampire',
	veteranDepositer = 'Veteran Depositer',
}

export interface PrimaryWeapon {}

export interface SecondaryWeapon {}

export enum WeaponType {}

export interface Overclock {
	weapon: WeaponType;
}

export interface MovementTool {}

export interface SupportTool {}

export interface Armor {}

export enum GrenadeType {
	// Driller
	impactAxe = 'Impact Axe',
	highExplosiveGrenade = 'High Explosive Grenade',
	neurotoxinGrenade = 'Neurotoxin Grenade',
	springloadedRipper = 'Springloaded Ripper',
	// Engineer
	lure = 'L.U.R.E.',
	plasmaBurster = 'Plasma Burster',
	proximityMine = 'Proximity Mine',
	shredderSwarm = 'Shredder Swarm',
	// Gunner
	stickyGrenade = 'Sticky Grenade',
	incendiaryGrenade = 'Incendiary Grenade',
	clusterGrenade = 'Cluster Grenade',
	tacticalLeadburster = 'Tactical Leadburster',
	// Scout
	inhibitorFieldGenerator = 'Inhibitor-Field Generator (IFG)',
	cryoGrenade = 'Cryo Grenade',
	pheromoneCanister = 'Pheromone Canister',
	volcanicStunSweeper = 'Voltaic Stun Sweeper',
}
