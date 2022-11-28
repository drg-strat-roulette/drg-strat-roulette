import { sample } from 'lodash-es';
import { getRandomInt, sampleMultipleDistinct } from '../utilities/general-functions.utils';
import { DwarfClass } from './team.interface';

export class RandomBuild {
	dwarfClass: DwarfClass;
	equipment: EquipmentConfig[] = [];
	activePerks: ActivePerkType[] = [];
	passivePerks: PassivePerkType[] = [];

	constructor(dwarfClass: DwarfClass) {
		this.dwarfClass = dwarfClass;
		// For each type of equipment that can be brought on missions
		Object.values(EquipmentType).forEach((equipmentType) => {
			// Pick a random item of that equipment type which can be brought by dwarves of this class
			const chosenEquipment = sample(
				equipmentDetails.filter(
					(equipment) => equipment.type === equipmentType && equipment.classes.includes(dwarfClass)
				)
			);
			if (!chosenEquipment) {
				throw 'Could not find eligible equipment';
			}
			// Copy the equipment details, then select random mods and overclocks (if applicable)
			const equipmentConfig: EquipmentConfig = {
				...chosenEquipment,
				mods: !chosenEquipment.mods ? undefined : chosenEquipment.mods.map((n) => getRandomInt(1, n)),
				overclock: !chosenEquipment.overclocks ? undefined : sample(chosenEquipment.overclocks),
			};
			this.equipment.push(equipmentConfig);
		});
		// Select 2 distinct active perks, and 3 distinct passive perks
		this.activePerks = sampleMultipleDistinct(Object.values(ActivePerkType), 2);
		this.passivePerks = sampleMultipleDistinct(Object.values(PassivePerkType), 3);
	}

	// Return a string describing all equipment and perk configurations
	toString(): string {
		let output = ` - Class is ${this.dwarfClass}.\n`;
		this.equipment.forEach((item) => {
			output += ` - ${item.type !== item.name ? `${item.type} is ` : ''}${item.name}${
				item.mods ? ` with mods: ${item.mods.join(',')}` : ''
			}${item.overclock ? ` and overclock: ${item.overclock}` : ''}.\n`;
		});
		output += ` - Passive perks are: ${this.passivePerks.join(', ')}.\n`;
		output += ` - Active perks are: ${this.activePerks.join(', ')}.\n`;
		return output;
	}
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

export enum PrimaryWeaponType {
	flamethrower = 'CRSPR Flamethrower',
	cryoCannon = 'Cryo Cannon',
	sludgePump = 'Corrosive Sludge Pump',
	shotgun = '"Warthog" Auto 210',
	stubby = '"Stubby" Voltaic SMG',
	lok1 = 'LOK-1 Smart Rifle',
	minigun = '"Lead Storm" Powered Minigun',
	autocannon = '"Thunderhead" Heavy Autocannon',
	hurricane = '"Hurricane" Guided Rocket System',
	gk2 = 'Deepcore GK2',
	m1000 = 'M1000 Classic',
	drak = 'DRAK-25 Plasma Carbine',
}

export enum SecondaryWeaponType {
	subata = 'Subata 120',
	epc = 'Experimental Plasma Charger',
	waveCooker = 'Colette Wave Cooker',
	pgl = 'Deepcore 40mm PGL',
	breachCutter = 'Breach Cutter',
	shardDiffractor = 'Shard Diffractor',
	bulldog = '"Bulldog" Heavy Revolver',
	brt = 'BRT7 Burst Fire Gun',
	coilGun = 'ArmsKore Coil Gun',
	boomstick = 'Jury-Rigged Boomstick',
	zhukov = 'Zhukov NUK17',
	crossbow = 'Nishanka Boltshark X-80',
}

export enum MobilityToolType {
	drills = 'Reinforced Power Drills',
	platformGun = 'Platform Gun',
	zipline = 'Zipline Launcher',
	grapplingHook = 'Grappling Hook',
}

export enum SupportToolType {
	c4 = 'Satchel Charge',
	sentryGun = 'LMG Gun Platform',
	shield = 'Shield Generator',
	flareGun = 'Flare Gun',
}

export enum ThrowableType {
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

export enum EquipmentType {
	primaryWeapon = 'Primary weapon',
	secondaryWeapon = 'Secondary weapon',
	mobilityTool = 'Mobility tool',
	supportTool = 'Support tool',
	throwable = 'Throwable',
	armor = 'Armor',
	pickaxe = 'Pickaxe',
}

export interface EquipmentConfig extends CoreEquipmentDetails {
	overclock?: string;
}

export interface EquipmentDetails extends CoreEquipmentDetails {
	classes: DwarfClass[];
	overclocks?: string[];
}

interface CoreEquipmentDetails {
	name: string;
	type: EquipmentType;
	mods?: number[];
}

export const equipmentDetails: EquipmentDetails[] = [
	// Driller primaries
	{
		name: PrimaryWeaponType.flamethrower,
		classes: [DwarfClass.driller],
		type: EquipmentType.primaryWeapon,
		mods: [2, 3, 3, 3, 2],
		overclocks: [
			'Lighter Tanks',
			'Sticky Additive',
			'Compact Feed Valves',
			'Fuel Stream Diffuser',
			'Face Melter',
			'Sticky Fuel',
		],
	},
	{
		name: PrimaryWeaponType.cryoCannon,
		classes: [DwarfClass.driller],
		type: EquipmentType.primaryWeapon,
		mods: [3, 3, 2, 3, 2],
		overclocks: [
			'Improved Thermal Efficiency',
			'Tuned Cooler',
			'Flow Rate Expansion',
			'Ice Spear',
			'Ice Storm',
			'Snowball',
		],
	},
	{
		name: PrimaryWeaponType.sludgePump,
		classes: [DwarfClass.driller],
		type: EquipmentType.primaryWeapon,
		mods: [3, 3, 2, 2, 2],
		overclocks: [
			'Hydrogen Ion Additive',
			'AG Mixture',
			'Volatile Impact Mixture',
			'Disperser Compound',
			'Goo Bomber Special',
			'Sludge Blast',
		],
	},
	// Driller secondaries
	{
		name: SecondaryWeaponType.subata,
		classes: [DwarfClass.driller],
		type: EquipmentType.secondaryWeapon,
		mods: [3, 2, 3, 2, 2],
		overclocks: [
			'Chain Hit',
			'Homebrew Powder',
			'Oversized Magazine',
			'Automatic Fire',
			'Explosive Reload',
			'Tranquilizer Rounds',
		],
	},
	{
		name: SecondaryWeaponType.epc,
		classes: [DwarfClass.driller],
		type: EquipmentType.secondaryWeapon,
		mods: [3, 2, 3, 3, 3],
		overclocks: [
			'Energy Rerouting',
			'Magnetic Cooling Unit',
			'Heat Pipe',
			'Heavy Hitter',
			'Overcharger',
			'Persistent Plasma',
		],
	},
	{
		name: SecondaryWeaponType.waveCooker,
		classes: [DwarfClass.driller],
		type: EquipmentType.secondaryWeapon,
		mods: [3, 3, 2, 2, 3],
		overclocks: [
			'Liquid Cooling System',
			'Super Focus Lens',
			'Diffusion Ray',
			'Mega Power Supply',
			'Blistering Necrosis',
			'Gamma Contamination',
		],
	},
	// Engineer primaries
	{
		name: PrimaryWeaponType.shotgun,
		classes: [DwarfClass.engineer],
		type: EquipmentType.primaryWeapon,
		mods: [2, 3, 3, 2, 2],
		overclocks: ['Stunner', 'Light-Weight Magazines', 'Magnetic Pellet Alignment', 'Cycle Overload', 'Mini Shells'],
	},
	{
		name: PrimaryWeaponType.stubby,
		classes: [DwarfClass.engineer],
		type: EquipmentType.primaryWeapon,
		mods: [3, 3, 2, 2, 2],
		overclocks: [
			'Super-Slim Rounds',
			'Well Oiled Machine',
			'EM Refire Booster',
			'Light-Weight Rounds',
			'Turret Arc',
			'Turret EM Discharge',
		],
	},
	{
		name: PrimaryWeaponType.lok1,
		classes: [DwarfClass.engineer],
		type: EquipmentType.primaryWeapon,
		mods: [2, 3, 3, 2, 3],
		overclocks: [
			'Eraser',
			'Armor Break Module',
			'Explosive Chemical Rounds',
			'Seeker Rounds',
			'Executioner',
			'Neuro-Lasso',
		],
	},
	// Engineer secondaries
	{
		name: SecondaryWeaponType.pgl,
		classes: [DwarfClass.engineer],
		type: EquipmentType.secondaryWeapon,
		mods: [3, 2, 3, 3, 3],
		overclocks: ['Clean Sweep', 'Pack Rat', 'Compact Rounds', 'RJ250 Compound', 'Fat Boy', 'Hyper Propellant'],
	},
	{
		name: SecondaryWeaponType.breachCutter,
		classes: [DwarfClass.engineer],
		type: EquipmentType.secondaryWeapon,
		mods: [2, 3, 2, 2, 3],
		overclocks: [
			'Light-Weight Cases',
			'Roll Control',
			'Stronger Plasma Current',
			'Return to Sender',
			'High Voltage Crossover',
			'Spinning Death',
			'Inferno',
		],
	},
	{
		name: SecondaryWeaponType.shardDiffractor,
		classes: [DwarfClass.engineer],
		type: EquipmentType.secondaryWeapon,
		mods: [3, 2, 2, 2, 3],
		overclocks: [
			'Efficiency Tweaks',
			'Automated Beam Controller',
			'Feedback Loop',
			'Volatile Impact Reactor',
			'Plastcrete Catalyst',
			'Overdrive Booster',
		],
	},
	// Gunner primaries
	{
		name: PrimaryWeaponType.minigun,
		classes: [DwarfClass.gunner],
		type: EquipmentType.primaryWeapon,
		mods: [3, 2, 3, 3, 3],
		overclocks: [
			'A Little More Oomph!',
			'Thinned Drum Walls',
			'Burning Hell',
			'Compact Feed Mechanism',
			'Exhaust Vectoring',
			'Bullet Hell',
			'Lead Storm',
		],
	},
	{
		name: PrimaryWeaponType.autocannon,
		classes: [DwarfClass.gunner],
		type: EquipmentType.primaryWeapon,
		mods: [3, 3, 3, 2, 3],
		overclocks: [
			'Composite Drums',
			'Splintering Shells',
			'Carpet Bomber',
			'Combat Mobility',
			'Big Bertha',
			'Neurotoxin Payload',
		],
	},
	{
		name: PrimaryWeaponType.hurricane,
		classes: [DwarfClass.gunner],
		type: EquipmentType.primaryWeapon,
		mods: [3, 2, 2, 2, 3],
		overclocks: [
			'Manual Guidance Cutoff',
			'Overtuned Feed Mechanism',
			'Fragmentation Missiles',
			'Plasma Burster Missiles',
			'Minelayer System',
			'Jet Fuel Homebrew',
			'Salvo Module',
		],
	},
	// Gunner secondaries
	{
		name: SecondaryWeaponType.bulldog,
		classes: [DwarfClass.gunner],
		type: EquipmentType.secondaryWeapon,
		mods: [2, 3, 3, 2, 2],
		overclocks: [
			'Chain Hit',
			'Homebrew Powder',
			'Volatile Bullets',
			'Six Shooter',
			'Elephant Rounds',
			'Magic Bullets',
		],
	},
	{
		name: SecondaryWeaponType.brt,
		classes: [DwarfClass.gunner],
		type: EquipmentType.secondaryWeapon,
		mods: [3, 3, 2, 3, 2],
		overclocks: [
			'Composite Casings',
			'Full Chamber Seal',
			'Compact Mags',
			'Experimental Rounds',
			'Electro Minelets',
			'Micro Flechettes',
			'Lead Spray',
		],
	},
	{
		name: SecondaryWeaponType.coilGun,
		classes: [DwarfClass.gunner],
		type: EquipmentType.secondaryWeapon,
		mods: [3, 3, 2, 2, 3],
		overclocks: [
			'Re-atomizer',
			'Ultra-Magnetic Coils',
			'Backfeeding Module',
			'The Mole',
			'Hellfire',
			'Triple-Tech Chambers',
		],
	},
	// Scout primaries
	{
		name: PrimaryWeaponType.gk2,
		classes: [DwarfClass.scout],
		type: EquipmentType.primaryWeapon,
		mods: [3, 2, 2, 2, 3],
		overclocks: [
			'Compact Ammo',
			'Gas Rerouting',
			'Homebrew Powder',
			'Overclocked Firing Mechanism',
			'Bullets of Mercy',
			'AI Stability Engine',
			'Electrifying Reload',
		],
	},
	{
		name: PrimaryWeaponType.m1000,
		classes: [DwarfClass.scout],
		type: EquipmentType.primaryWeapon,
		mods: [2, 3, 2, 2, 3],
		overclocks: [
			'Hoverclock',
			'Minimal Clips',
			'Active Stability System',
			'Hipster',
			'Electrocuting Focus Shots',
			'Supercooling Chamber',
		],
	},
	{
		name: PrimaryWeaponType.drak,
		classes: [DwarfClass.scout],
		type: EquipmentType.primaryWeapon,
		mods: [3, 2, 3, 3, 2],
		overclocks: [
			'Aggressive Venting',
			'Thermal Liquid Coolant',
			'Impact Deflection',
			'Rewiring Mod',
			'Overtuned Particle Accelerator',
			'Shield Battery Booster',
			'Thermal Exhaust Feedback',
		],
	},
	// Scout secondaries
	{
		name: SecondaryWeaponType.boomstick,
		classes: [DwarfClass.scout],
		type: EquipmentType.secondaryWeapon,
		mods: [2, 2, 3, 3, 3],
		overclocks: [
			'Compact Shells',
			'Double Barrel',
			'Special Powder',
			'Stuffed Shells',
			'Shaped Shells',
			'Jumbo Shells',
		],
	},
	{
		name: SecondaryWeaponType.zhukov,
		classes: [DwarfClass.scout],
		type: EquipmentType.secondaryWeapon,
		mods: [2, 3, 2, 3, 2],
		overclocks: ['Minimal Magazines', 'Custom Casings', 'Cryo Minelets', 'Embedded Detonators', 'Gas Recycling'],
	},
	{
		name: SecondaryWeaponType.crossbow,
		classes: [DwarfClass.scout],
		type: EquipmentType.secondaryWeapon,
		mods: [3, 3, 2, 2, 3],
		overclocks: ['Quick Fire', 'The Specialist', 'Cryo Bolt', 'Fire Bolt', 'Bodkin Points', 'Trifork Volley'],
	},
	// Mobility tools
	{
		name: MobilityToolType.drills,
		classes: [DwarfClass.driller],
		type: EquipmentType.mobilityTool,
		mods: [3, 2, 1, 2],
	},
	{
		name: MobilityToolType.platformGun,
		classes: [DwarfClass.engineer],
		type: EquipmentType.mobilityTool,
		mods: [3, 1, 3],
	},
	{
		name: MobilityToolType.zipline,
		classes: [DwarfClass.gunner],
		type: EquipmentType.mobilityTool,
		mods: [3, 1, 2],
	},
	{
		name: MobilityToolType.grapplingHook,
		classes: [DwarfClass.scout],
		type: EquipmentType.mobilityTool,
		mods: [2, 1, 2, 3],
	},
	// Support tools
	{
		name: SupportToolType.c4,
		classes: [DwarfClass.driller],
		type: EquipmentType.supportTool,
		mods: [3, 1, 2, 3],
	},
	{
		name: SupportToolType.sentryGun,
		classes: [DwarfClass.engineer],
		type: EquipmentType.supportTool,
		mods: [2, 3, 3, 2],
	},
	{
		name: SupportToolType.shield,
		classes: [DwarfClass.gunner],
		type: EquipmentType.supportTool,
		mods: [2, 2, 3],
	},
	{
		name: SupportToolType.flareGun,
		classes: [DwarfClass.scout],
		type: EquipmentType.supportTool,
		mods: [2, 2, 3],
	},
	// Throwables
	{
		name: ThrowableType.impactAxe,
		classes: [DwarfClass.driller],
		type: EquipmentType.throwable,
	},
	{
		name: ThrowableType.highExplosiveGrenade,
		classes: [DwarfClass.driller],
		type: EquipmentType.throwable,
	},
	{
		name: ThrowableType.neurotoxinGrenade,
		classes: [DwarfClass.driller],
		type: EquipmentType.throwable,
	},
	{
		name: ThrowableType.lure,
		classes: [DwarfClass.engineer],
		type: EquipmentType.throwable,
	},
	{
		name: ThrowableType.plasmaBurster,
		classes: [DwarfClass.engineer],
		type: EquipmentType.throwable,
	},
	{
		name: ThrowableType.proximityMine,
		classes: [DwarfClass.engineer],
		type: EquipmentType.throwable,
	},
	{
		name: ThrowableType.stickyGrenade,
		classes: [DwarfClass.gunner],
		type: EquipmentType.throwable,
	},
	{
		name: ThrowableType.incendiaryGrenade,
		classes: [DwarfClass.gunner],
		type: EquipmentType.throwable,
	},
	{
		name: ThrowableType.clusterGrenade,
		classes: [DwarfClass.gunner],
		type: EquipmentType.throwable,
	},
	{
		name: ThrowableType.inhibitorFieldGenerator,
		classes: [DwarfClass.scout],
		type: EquipmentType.throwable,
	},
	{
		name: ThrowableType.cryoGrenade,
		classes: [DwarfClass.scout],
		type: EquipmentType.throwable,
	},
	{
		name: ThrowableType.pheromoneCanister,
		classes: [DwarfClass.scout],
		type: EquipmentType.throwable,
	},
	// Armor
	{
		name: EquipmentType.armor,
		classes: Object.values(DwarfClass),
		type: EquipmentType.armor,
		mods: [3, 2, 1, 3],
	},
	// Pickaxe
	{
		name: EquipmentType.pickaxe,
		classes: Object.values(DwarfClass),
		type: EquipmentType.pickaxe,
		mods: [1, 3],
	},
];
