import { ActivePerkType, PassivePerkType, RandomBuild } from '../models/build.interface';
import {
	AnomalyType,
	BiomeType,
	PrimaryObjective,
	SecondaryObjective,
	WarningType,
} from '../models/missions.interface';
import { Strategy, StratTag } from '../models/strat.interface';
import { DwarfClass } from '../models/team.interface';
import { sample, shuffle } from 'lodash-es';
import { getAllCombinations } from '../utilities/general-functions.utils';

// Common definitions which may be shared across multiple strategies.
enum CommonStratDefinitions {
	largeEnemies = "Large enemies are: Praetorians, Oppressors, Wardens, Nayaka Trawlers, Q'ronar Shellbacks, Bulk/Crassus Detonators, Dreadnoughts, Naedocyte breeders, Spitball Infectors, Glyphid Menaces, Glyphid Brood Nexus, Stabber Vines, and Nemesis.",
	stationaryEnemies = 'Stationary enemies are: Cave Leeches, Spitball Infectors, Glyphid Brood Nexus, Stabber Vines, Deeptora Honeycombs, and Deeptora Bough Wasp Nests.',
	environmentalHazards = "Environmental hazards are: \n- Crystalline Caverns: Electrocrystals and cobwebs\n- Salt Pits: Unstable crystal and unstable platform\n- Fungus Bogs: Steam geysers, exploding plants, sticky goo, poison spores, glyphid eggs, and hanging grassy vines\n- Radioactive Exclusion Zone: Volatile uranium and spider webs\n- Dense Biozone: Exploding plants, ejector cacti, spider webs, glyphid eggs, cave urchins, and trapactus\n- Glacial Strata: Cryo bulbs, unstable ice, deep snow, and crevasse cracks (don't cover them)\n* Hollow Bough: Creeper vines, bloated vines, thorn pots, and goo sacks\n* Magma Core: Exploding plants, small/large lava geysers, and hot rock.",
	heavyMinerals = 'Heavy minerals are: Compressed gold, Bittergems, Aquarqs, Enor pearls, Jadiz, or Gunk seeds in a pinch.',
}

// The list of all possible strategies
export const strategies: Strategy[] = [
	{
		id: 1,
		name: 'Surgical Team',
		summary: 'All living dwarves must revive downed dwarves together.',
		details:
			'If a dwarf goes down, all dwarves still standing must gather around their corpse. They may not start reviving until all dwarves are present and must begin reviving at the same time.',
		requirements: {
			team: (t) => t.dwarves.length >= 3,
		},
		writtenRequirements: 'Team must have 3+ dwarves.',
	},
	{
		id: 2,
		name: 'Budget Cuts',
		summary: 'Must have no ammo in everything before resupplying.',
		details:
			'Must have no ammo in your weapons, traversal tool, support tool, grenades before you can resupply. You may resupply twice (up to full) at this time.',
	},
	{
		id: 3,
		name: 'Perkaholics Anonymous',
		summary: 'No perks.',
		details: 'Unequip all perks, both passive and active.',
		tags: [StratTag.loadout],
	},
	{
		id: 4,
		name: 'Powerless',
		summary: 'No power pick.',
		details: 'You may not use your power pick attack.',
	},
	{
		id: 5,
		name: 'Lacking Pizzazz',
		summary: 'No flares.',
		details: 'No throwing flares. Flare gun is allowed.',
	},
	{
		id: 6,
		name: 'Got Any AAs?',
		summary: 'No flashlight.',
		details: 'Turn off your flashlight for the whole mission.',
	},
	{
		id: 7,
		name: 'Advanced Darkness',
		summary: 'No lights (flashlight, flare, or flare gun).',
		details: `Turn off your flashlight and don't throw any flares. If ${DwarfClass.scout}, you may not use your flare gun.`,
	},
	{
		id: 8,
		name: 'Firing Squad',
		summary: `All dwarves must play as ${DwarfClass.gunner}.`,
		details: '',
		requirements: {
			team: (t) => t.dwarves.length >= 2 && t.dwarves.every((dwarf) => dwarf.classes.includes(DwarfClass.gunner)),
		},
		writtenRequirements: `Team must have 2+ dwarves. All dwarves must play as ${DwarfClass.gunner}.`,
	},
	{
		id: 9,
		name: "Drill 'Em and Grill 'Em",
		summary: `All dwarves must play as ${DwarfClass.driller}.`,
		details: '',
		requirements: {
			team: (t) =>
				t.dwarves.length >= 2 && t.dwarves.every((dwarf) => dwarf.classes.includes(DwarfClass.driller)),
		},
		writtenRequirements: `Team must have 2+ dwarves. All dwarves must play as ${DwarfClass.driller}.`,
	},
	{
		id: 10,
		name: 'Swinger Party',
		summary: `All dwarves must play as ${DwarfClass.scout}.`,
		details: '',
		requirements: {
			team: (t) => t.dwarves.length >= 2 && t.dwarves.every((dwarf) => dwarf.classes.includes(DwarfClass.scout)),
		},
		writtenRequirements: `Team must have 2+ dwarves. All dwarves must play as ${DwarfClass.scout}.`,
	},
	{
		id: 11,
		name: 'Engineer Is Engi-here',
		summary: `All dwarves must play as ${DwarfClass.engineer}.`,
		details: '',
		requirements: {
			team: (t) =>
				t.dwarves.length >= 2 && t.dwarves.every((dwarf) => dwarf.classes.includes(DwarfClass.engineer)),
		},
		writtenRequirements: `Team must have 2+ dwarves. All dwarves must play as ${DwarfClass.engineer}.`,
	},
	{
		id: 12,
		name: 'Trouble Getting Around',
		summary: 'No traversal tools.',
		details: `No using traversal tools for any reason. This includes ${DwarfClass.driller}'s drills for combat.`,
	},
	{
		id: 13,
		name: 'My Side Piece',
		summary: 'No primary weapons.',
		details: 'No using your primary weapon. Unbind your primary weapon key.',
	},
	{
		id: 14,
		name: 'So What If I Like Really Big Guns',
		summary: 'No secondary weapons.',
		details: 'No using your secondary weapon. Unbind your secondary weapon key.',
	},
	{
		id: 15,
		name: 'Take Your Pick',
		summary: 'Fight one dreadnought using only pickaxes, drills, and axes.',
		details:
			"Must fight one dreadnought using only your only pickaxe, drills, and axes. Dealer's choice if 1 or both twins are required. Weapons may be used on Glyphid Spawn and Glyphid Sentinels.",
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 16,
		name: 'Double Trouble',
		summary: 'Do a double warning mission.',
		details: '',
		requirements: {
			mission: (m) => !m,
		},
		writtenRequirements: 'Mission must have 2 warnings.',
		missionRequirementsLikelihood: 1,
	},
	{
		id: 17,
		name: 'Back to Basics (Primary)',
		summary: 'No mods or overclocks on primary weapons.',
		details: '',
		tags: [StratTag.loadout],
	},
	{
		id: 18,
		name: 'Back to Basics (Secondary)',
		summary: 'No mods or overclocks on secondary weapons.',
		details: '',
		tags: [StratTag.loadout],
	},
	{
		id: 19,
		name: 'Guns Go Brr',
		summary: 'Must make sound effects for every in-game action.',
		details: 'If not in discord, use in game voice.',
		tags: [StratTag.communication],
	},
	{
		id: 20,
		name: "There's No Rush",
		summary: 'Cannot sprint.',
		details: '',
	},
	{
		id: 21,
		name: 'In Space, No One Can Hear You Scream',
		summary: 'No volume.',
		details: 'Set your master volume to 0%.',
		tags: [StratTag.settings],
	},
	{
		id: 22,
		name: 'Lose Control',
		summary: 'No pressing CTRL, no using the laser pointer.',
		details:
			'Unbind your laser pointer. If you have the Customizable Ally Outlines mod, disable all the highlights.',
	},
	{
		id: 23,
		name: 'Beast of Burden',
		summary: 'A heavy mineral must be carried for the whole mission.',
		details: `As soon as a heavy mineral is discovered, it must be mined and carried for the entirety of the mission. The heavy mineral can be handed off to another dwarf but must not touch the ground. Don't let the heavy mineral be dropped! ${CommonStratDefinitions.heavyMinerals}`,
		requirements: {
			mission: (m) =>
				m.primary === PrimaryObjective.pointExtraction ||
				m.biome === BiomeType.hollowBough ||
				m.biome === BiomeType.crystallineCaverns ||
				m.biome === BiomeType.fungusBogs ||
				m.biome === BiomeType.saltPits ||
				m.biome === BiomeType.sandblastedCorridors ||
				m.biome === BiomeType.radioactiveExclusionZone ||
				m.secondary === SecondaryObjective.gunkSeed,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Mission biome must have heavy minerals or gunk seeds. Team must have 2+ dwarves.',
		missionRequirementsLikelihood: mustMeetAny(specificPrimaries(1), specificBiomes(6), specificSecondaries(1)),
	},
	{
		id: 24,
		name: 'WWWWWW',
		summary: 'Hold W.',
		details: 'Never stop moving forward.',
	},
	{
		id: 25,
		name: 'Monkeying Around',
		summary: 'Monkey walk everywhere.',
		details:
			'Whenever moving, you must strafe back and forth in the direction perpendicular to where you are going, e.g. spamming A-D-A-D when holding W. Encouraged to make monkey noises.',
	},
	{
		id: 26,
		name: 'Poor Support Structure',
		summary: 'No support tools.',
		details: 'No using your support tools (satchel charge, sentry gun(s), shield generator, or flare gun).',
	},
	{
		id: 27,
		name: 'Forgot to Bring Protection',
		summary: 'No armor upgrades.',
		details: 'Unequip all armor upgrades. If the daily special is Red Rock Blaster, you may not order it.',
		tags: [StratTag.loadout],
	},
	{
		id: 28,
		name: 'A Stable Shooting Stance',
		summary: "Can't move while shooting.",
		details: 'No pressing movement keys while shooting.',
	},
	{
		id: 29,
		name: 'Follow the Leader',
		summary: 'One dwarf leads, and the rest must follow.',
		details:
			'All dwarves must remain within 10m cylinder centered on the leader. If they exit this range for any reason, they cannot mine, attack, or revive until they come closer again.',
		requirements: {
			mission: (m) => m.primary !== PrimaryObjective.escortDuty,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission primary objective must not be ${PrimaryObjective.escortDuty}. Team must have 2+ dwarves.`,
		missionRequirementsLikelihood: specificNotPrimaries(1),
		generateDynamicContent: (t) => `${sample(t.dwarves)?.name} is the Leader.`,
	},
	{
		id: 30,
		name: 'Gun Game',
		summary: 'Swap weapons after every kill.',
		details:
			'Whenever you kill an enemy that is not a grunt or small enemy, your next kill must be with a different weapon. Grenades are included.',
	},
	{
		id: 31,
		name: 'Equal Opportunity Destroyer',
		summary: 'Take turns to kill.',
		details:
			'Any dwarf may not have a longer than 30-second window to kill enemies. You may, at any time during your turn, "pass" to the next dwarf.',
		tags: [StratTag.communication],
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 32,
		name: 'Two Hackers Are Better Than One',
		summary: 'Perform both hacking pods at same time on industrial sabotage.',
		details:
			'Both hacking pods in an industrial sabotage mission must be started at the same time. Should one be stopped, it must either be immediately restarted, or the other must stop being defended and stop as soon as possible. If the latter is chosen, they must be restarted at the same time.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.industrialSabotage,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.industrialSabotage}. Team must have 2+ dwarves.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 33,
		name: 'Fragile: Do Not Drop',
		summary: 'Cannot drop egg or aquarq once exhumed, must take it back if dropped.',
		details:
			'Eggs and aquarqs may not be dropped until they are deposited. If they are dropped to the ground, they must be returned to their origin before being re-attempted. If thrown to another dwarf who catches them before they hit the ground, they will remain unbroken.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.eggHunt || m.primary === PrimaryObjective.pointExtraction,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.eggHunt} or ${PrimaryObjective.pointExtraction}.`,
		missionRequirementsLikelihood: specificPrimaries(2),
	},
	{
		id: 34,
		name: 'Hi-Ho, Silver!',
		summary: 'One person has to ride molly whole mission.',
		details:
			'One person must remain on the M.U.L.E. for an entire mission. If they fall off, they should get back on immediately. Other dwarves may call Molly (and therefore you) to any location as needed.',
		requirements: {
			mission: (m) =>
				m.primary !== PrimaryObjective.pointExtraction && m.primary !== PrimaryObjective.onSiteRefining,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Mission must have Molly. Team must have 2+ dwarves.',
		missionRequirementsLikelihood: specificNotPrimaries(2),
		generateDynamicContent: (t) => `${sample(t.dwarves)?.name} is the Molly-rider.`,
	},
	{
		id: 35,
		name: 'Designated Driver',
		summary:
			'One chosen dwarf must remain on the Drilldozer for the whole mission until the heartstone is deposited.',
		details:
			'One person must remain on the Drilldozer for an entire mission. If they fall off, they should get back on immediately.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.escortDuty,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.escortDuty}. Team must have 2+ dwarves.`,
		missionRequirementsLikelihood: specificPrimaries(1),
		generateDynamicContent: (t) => `${sample(t.dwarves)?.name} is the Designated Driver.`,
	},
	{
		id: 36,
		name: 'Shoot Your Way Out',
		summary: 'Only primary and secondary weapons may be used for combat.',
		details:
			'You may only use your primary and secondary weapons for combat. This means grenades, pickaxes, drills, sentries, and flare guns may not be used for combat.',
	},
	{
		id: 37,
		name: 'Caught With Your Pick Out',
		summary: 'Pickaxe may not be used unless power-picking.',
		details: `You may not use your pickaxe for mining, combat, or otherwise. You can use your power attack. (Hint: ${ActivePerkType.berzerker} perk is allowed). ${DwarfClass.driller} recommended.`,
	},
	{
		id: 38,
		name: 'Prepare for Trouble...',
		summary: 'Re-roll the strat twice and do both.',
		details: '',
	},
	{
		id: 39,
		name: 'Make It Count',
		summary: 'No calling resupplies.',
		details: 'Broken supply pods are allowed.',
	},
	{
		id: 40,
		name: 'Coordinated Effort',
		summary: 'Pull all eggs at same time.',
		details:
			'All eggs must be pulled within 30 seconds of each other. You may need to prepare in order for all to be pulled at once.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.eggHunt,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.eggHunt}. Team must have 2+ dwarves.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 41,
		name: "You've Got This Covered",
		summary: 'Everyone takes a turn with killing bugs during Ommoran phase(s).',
		details:
			'Each dwarf is assigned phase(s) of the Ommoran. During your phase, only you may kill bugs. Others may defend themselves from bugs immediately targeting them, but otherwise cannot contribute to the Ommoran fight. Anyone may repair the Drilldozer.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.escortDuty,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.escortDuty}. Team must have 2+ dwarves.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 42,
		name: 'Retro Gaming',
		summary: 'Turn resolution scale to minimum.',
		details: 'Turn your resolution scaling to 0% and anti-aliasing off in the graphics settings.',
		tags: [StratTag.settings],
	},
	{
		id: 43,
		name: 'Drinking on the Job',
		summary: 'Must play the mission drunk.',
		details:
			"For maximum drunkenness:\nIf buying the daily special, sober up afterwards (via Leaf Lover's Special, Blackout Stout, or suicide) before buying the following drinks: Gut Wrecker, Blacklock Lager, and Oily Oaf. This will take you to 99% drunkenness.\nAs host (if the host wants additional challenge), press Q to delete these drinks. You will instead drink a Blackout Stout right before getting into the pod (with everyone already in) for 100% drunkenness.",
		tags: [StratTag.nausea],
	},
	{
		id: 44,
		name: 'Pedial Control Scheme',
		summary: 'Play with one hand and one foot',
		details: 'Replace one of the hands you use for controlling your character with a foot.',
		tags: [StratTag.settings],
	},
	{
		id: 45,
		name: 'Stand Your Ground',
		summary: 'No moving during swarms.',
		details:
			'No pressing movement keys whenever swarm music is playing.\nOn Escort Duty, this includes the swarms when Doretta is moving or stopped. However, you may move during phases 2 and 4 only of the Ommoran Heartstone.',
		requirements: {
			mission: (m) => m.primary !== PrimaryObjective.elimination,
		},
		writtenRequirements: `Mission primary objective must not be ${PrimaryObjective.elimination}.`,
		missionRequirementsLikelihood: specificNotPrimaries(1),
	},
	{
		id: 46,
		name: 'Overkill',
		summary: 'Must overheat/burn whole clip before stop firing.',
		details:
			'You must continue firing until your clip is empty or your gun overheats before you may stop firing. You may hold charged shots on weapons that have charged shots.',
	},
	{
		id: 47,
		name: 'Bottom to Top',
		summary: 'Do mining mission backwards.',
		details: `Drill or run to the end of the mining mission as soon as possible. You may not mine anything on your way there or kill any stationary enemies (unless you are unable to revive a dwarf otherwise) even in the starting room. Do your best to not pay attention to the caves if you happen to pass through any part. The end of the mining mission is always southwest from the start of the mission. Dig this way at a downward angle, using the terrain scanner to try to stay near the cave system. If you must pass through because you ran out of drill ammo, you may. It might be a good idea to bring more than one ${DwarfClass.driller} if the mission is particularly long.`,
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.miningExpedition,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.miningExpedition}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 48,
		name: 'Taking the Scenic Route',
		summary: 'Each pipe has to wrap around the other two pumpjacks.',
		details:
			'Before connecting a pipe to a pumpjack, it must wrap around each of the other two pumpjacks. You may not un-build a pipe after it has been wrapped around a pumpjack.',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.onSiteRefining,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.onSiteRefining}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 49,
		name: 'Stony Rock: Pro Skater',
		summary: 'You may only move via pipes.',
		details:
			'Make your way to the on-site refinery asap. From then on you must travel only via walking on pipes, pipe riding, and any air time you get from hopping off of a pipe. Best get your minerals before you finish them, and good luck finding the wells!',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.onSiteRefining,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.onSiteRefining}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 50,
		name: 'What Took You So Long?',
		summary: `${DwarfClass.driller} must rush to the Ommoran and wait there.`,
		details: `${DwarfClass.driller} must rush to the Ommoran heartstone and wait there for the rest of the team to catch up.`,
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.escortDuty,
			team: (t) => t.dwarves.length >= 2 && t.dwarves.some((dwarf) => dwarf.classes.includes(DwarfClass.driller)),
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.escortDuty}. Team must have 2+ dwarves, one of which must play as ${DwarfClass.driller}`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 51,
		name: 'Shoddy Connection',
		summary: 'Only one dwarf can stand in the uplink/refuel zone at a time.',
		details: '',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.salvageOperation,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.salvageOperation}. Team must have 2+ dwarves.`,
		generateDynamicContent: (t) => `${sample(t.dwarves)?.name} is the only one allowed in the uplink/refuel zone.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 52,
		name: 'She Blocked Your Number',
		summary: "Can't call Molly.",
		details: '',
		requirements: {
			mission: (m) =>
				m.primary !== PrimaryObjective.pointExtraction && m.primary !== PrimaryObjective.onSiteRefining,
		},
		writtenRequirements: 'Mission must have Molly.',
		missionRequirementsLikelihood: specificNotPrimaries(2),
	},
	{
		id: 53,
		name: 'Pretty Souvenirs',
		summary: 'Each person brings an aquarq home.',
		details:
			"You may coordinate by pulling the extra aquarqs early and bringing them to the mine-head (without depositing) before calling the drop-pod. The only excuse for not bringing an aquarq home is if there aren't enough for everyone.",
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.pointExtraction,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.pointExtraction}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 54,
		name: 'All Your Eggs in One Basket',
		summary: 'Carry all your eggs/aquarqs together without depositing.',
		details:
			'Every gathered egg/aquarq must be carried to the next egg/aquarq until enough to complete the primary objective have been gathered in one location. From then they may be deposited in Molly (Eggs) or brought to the Mine-head (e.g. You must carry all 4 aquarqs to the 5th, and so on). The "Egg basket" may not be left completely unattended, but other dwarves may perform reconnaissance to find the optimal next egg/aquarq.',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.eggHunt || m.primary === PrimaryObjective.pointExtraction,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.eggHunt} or ${PrimaryObjective.pointExtraction}.`,
		missionRequirementsLikelihood: specificPrimaries(2),
	},
	{
		id: 55,
		name: 'Nature Conservationist',
		summary: 'Cannot destroy environmental hazards.',
		details:
			"You cannot destroy environmental hazards through intentional means (you will know if it was intentional or not). This includes the following: \n* Crystalline Caverns: Electrocrystals or cobwebs\n* Salt Pits: Unstable crystal or unstable platform\n* Fungus Bogs: Steam geysers, exploding plants, sticky goo, poison spores, glyphid eggs, hanging grassy vines\n* Radioactive Exclusion Zone: Volatile uranium, spider webs\n* Dense Biozone: Exploding plants, ejector cacti, spider webs, glyphid eggs, cave urchins, trapactus\n* Glacial Strata: Cryo bulbs, unstable ice, deep snow, crevasse cracks (don't cover them)\n* Hollow Bough: Creeper vines, bloated vines, thorn pots, goo sacks\n* Magma Core: Exploding plants, lava geysers, hot rock, small lava geysers.",
		requirements: {
			mission: (m) => m.biome !== BiomeType.azureWeald,
		},
		writtenRequirements: `Mission biome must not be ${BiomeType.azureWeald}.`,
		missionRequirementsLikelihood: specificNotBiomes(1),
	},
	{
		id: 56,
		name: 'First Is the Worst, Second Is the Best',
		summary: 'Have to finish secondary objective before starting primary objective.',
		details: '',
		tags: [StratTag.time],
	},
	{
		id: 57,
		name: 'Work Zone Speed Limit',
		summary: 'Only one dwarf can be in range of the dozer while it is in-transit.',
		details: '',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.escortDuty,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.escortDuty}. Team must have 2+ dwarves.`,
		generateDynamicContent: (t) => `${sample(t.dwarves)?.name} is the one who can be in-range of the dozer.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 58,
		name: "Now That's a Lot of Damage",
		summary: 'No repairing the drilldozer.',
		details:
			"The Drilldozer may not be repaired for any reason. It is recommended to pre-drill the mission before opening Doretta's cage to prepare.",
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.escortDuty,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.escortDuty}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 59,
		name: 'Finders Keepers',
		summary: 'Cannot attack bugs that have person in clutches.',
		details: '',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 60,
		name: "I'll Take You All On!",
		summary: 'Must fight all dreadnoughts at once.',
		details: '',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 61,
		name: 'Driller to C-4',
		summary: 'May only move to an area that another dwarf pings.',
		details:
			"Any dwarf may command any/all dwarves except for themselves. You may not ask someone to command you to go somewhere. Positioning is not very strict. You may mine minerals and kill things on the way to your target location and get there in your own time. (As long as you don't go too far out of the way) Once you reach the target location, you may do whatever you want but are confined to ~10m radius around the ping.",
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 62,
		name: 'Best Buds',
		summary: 'Bring comba bud home.',
		details: 'At least 1, but more encouraged.',
		requirements: {
			mission: (m) => m.biome === BiomeType.azureWeald,
		},
		writtenRequirements: `Mission biome must be ${BiomeType.azureWeald}.`,
		missionRequirementsLikelihood: specificBiomes(1),
	},
	{
		id: 63,
		name: "Won't Make It Through Customs",
		summary: 'Bring bough cones and tumbleweeds with you.',
		details: 'At least 1 per dwarf, but more encouraged.',
		requirements: {
			mission: (m) => m.biome === BiomeType.hollowBough,
		},
		writtenRequirements: `Mission biome must be ${BiomeType.hollowBough}.`,
		missionRequirementsLikelihood: specificBiomes(1),
	},
	{
		id: 64,
		name: 'Immersive Experience',
		summary: 'No HUD.',
		details: '',
	},
	{
		id: 65,
		name: 'Multitasking',
		summary: 'Play in windowed mode (quarter of screen).',
		details: '',
		tags: [StratTag.settings],
	},
	{
		id: 66,
		name: 'Dress Up Time',
		summary: "Everyone decides someone else's build.",
		details: '',
		tags: [StratTag.loadout],
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
		generateDynamicContent: (t) => {
			let result = '';
			const shuffled = shuffle(t.dwarves);
			shuffled.forEach(
				(dwarf, i) =>
					(result += `${i === 0 ? '' : `${dwarf.name}. `}${dwarf.name} will decide for ${
						i === shuffled.length - 1 ? `${shuffled[0].name}.` : ''
					}`)
			);
			return result;
		},
	},
	{
		id: 67,
		name: 'Rolling the Dice',
		summary: "All dwarves' builds are chosen at random",
		details: '',
		tags: [StratTag.loadout],
		generateDynamicContent: (t) => {
			let bestCombo: DwarfClass[];
			// Select a class for every dwarf. Maximize number of distinct classes.
			if (t.dwarves.length > 1) {
				const allCombos = shuffle(getAllCombinations<DwarfClass>(t.dwarves.map((dwarf) => dwarf.classes)));
				bestCombo = allCombos.reduce((best, combo) =>
					new Set(best).size > new Set(combo).size ? best : combo
				);
			} else {
				bestCombo = t.dwarves.map((dwarf) => sample(dwarf.classes)!);
			}
			// Generate a randomized build for each dwarf and return their descriptions.
			return t.dwarves
				.map((dwarf, i) => `Build for ${dwarf.name}:\n` + new RandomBuild(bestCombo[i]).toString())
				.join('\n');
		},
	},
	{
		id: 68,
		name: 'Avoid & Evade',
		summary: 'No killing stationary enemies.',
		details: `${CommonStratDefinitions.stationaryEnemies} You'll have to get creative with platform shields, tunnels, and drawing fire for your teammates. Exceptions can be made for The Caretaker, Korlok Tyrant-Weed, and all Rival Tech.`,
	},
	{
		id: 69,
		name: 'Wildlife Conservation',
		summary: 'No killing cave leeches.',
		details: '',
		requirements: {
			mission: (m) => m.warnings.includes(WarningType.caveLeechCluster),
		},
		writtenRequirements: `Mission warnings must include ${WarningType.caveLeechCluster}.`,
		missionRequirementsLikelihood: 1, // TODO: Educated guess
	},
	{
		id: 70,
		name: 'Cutting Back on E-Waste',
		summary: 'Industrial sabotage no killing turrets',
		details: 'Exception can be made for ceiling turrets in the Caretaker room.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.industrialSabotage,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.industrialSabotage}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 71,
		name: 'Team Take Down',
		summary:
			'Everyone must contribute to death of large enemies. If you kill before everyone has contributed, the team must kill you.',
		details: `${CommonStratDefinitions.largeEnemies}`,
		tags: [StratTag.communication],
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 72,
		name: 'Hold Down the Fort',
		summary: 'Cannot move while in uplink/refuel.',
		details:
			'You may not press movement keys while uplink/refuel is in progress. You also may not create a bunker.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.salvageOperation,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.salvageOperation}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 73,
		name: 'Hoxxes Is Not Wheelchair Accessible',
		summary: `All dwarves must play as ${DwarfClass.scout}. Cannot move while grounded.`,
		details:
			'You may use movement keys to strafe while in the air, but should remain stationary while on the ground.',
		requirements: {
			team: (t) => t.dwarves.every((dwarf) => dwarf.classes.includes(DwarfClass.scout)),
		},
		writtenRequirements: `All dwarves must play as ${DwarfClass.scout}.`,
	},
	{
		id: 74,
		name: 'Aerial Support',
		summary: 'Gunners must stay on ziplines.',
		details: `${DwarfClass.gunner}s can take some time to clear initial enemies and set up ziplines. Set up ASAP and get up. Must stay up until drop-pod is called. If killed, must get back on ASAP. Can go down for resupplies if needed.`,
		requirements: {
			mission: (m) =>
				m.primary === PrimaryObjective.eggHunt ||
				m.primary === PrimaryObjective.pointExtraction ||
				m.primary === PrimaryObjective.onSiteRefining,
			team: (t) => t.dwarves.length >= 2 && t.dwarves.some((dwarf) => dwarf.classes.includes(DwarfClass.gunner)),
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.eggHunt}, ${PrimaryObjective.pointExtraction}, or ${PrimaryObjective.onSiteRefining}. Team must have 2+ dwarves, at least one of which must play as ${DwarfClass.gunner}`,
		missionRequirementsLikelihood: specificPrimaries(3),
	},
	{
		id: 75,
		name: 'The Floor Is Lava',
		summary: 'Must avoid touching cave floors.',
		details:
			'Everyone must walk on platforms or provided things (dozer, refinery mine-head, loot-bugs, silicates harvesters, gem outcrops, geysers, etc.)',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary !== PrimaryObjective.miningExpedition,
		},
		writtenRequirements: `Mission primary objective must not be ${PrimaryObjective.miningExpedition}.`,
		missionRequirementsLikelihood: specificNotPrimaries(1),
	},
	{
		id: 76,
		name: 'On a Diet',
		summary: 'No eating red sugar.',
		details: 'Vampire and resupplying is allowed to regain health, but no red sugar.',
	},
	{
		id: 77,
		name: 'Bound Familiar',
		summary: `Everyone runs ${ActivePerkType.beastMaster}, you may only engage in combat while your Steeve is alive.`,
		details: `${ActivePerkType.beastMaster} perk is required. When your Steeve dies, you must avoid all combat, but may still contribute to objectives by gathering resources. Additionally, you must pet Steeve every time you gain health.`,
		tags: [StratTag.loadout],
	},
	{
		id: 78,
		name: 'Conscientious Objector',
		summary: 'One dwarf is a conscientious objector (no killing).',
		details:
			'The Conscientious objector is encouraged to help out in any way they can, but must live a life of non-violence. Any loadout configuration which may cause accidental damage to enemies is not allowed (e.g. Thorns). Weapons can be used as utility (e.g. EPC mining, drilling/exploding tunnels, boomstick w/ special powder, hoverclock). There is backup order of Conscientious objectors who will not be able to kill enemies if the main Conscientious objector is killed, so it in your best interest to keep them alive. There will always be at least one living dwarf who is not allowed to kill enemies.',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
		generateDynamicContent: (t) => `${sample(t.dwarves)?.name} is the Conscientious Objector.`,
	},
	{
		id: 79,
		name: 'All for One',
		summary: 'Private resupply pods.',
		details: 'The dwarf who calls a resupply pod is the only one who can take ammo from it.',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 80,
		name: 'Make Your Own Way',
		summary: "Cannot use other's traversal tools (including drill tunnels)",
		details: 'Does not include simple tunnels through dirt.',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 81,
		name: 'Just Like My Ex',
		summary: 'Only unstable OCs.',
		details: '',
		tags: [StratTag.loadout],
	},
	{
		id: 82,
		name: 'As All Things Should Be',
		summary: 'Only balanced OCs.',
		details: '',
		tags: [StratTag.loadout],
	},
	{
		id: 83,
		name: 'Clean Energy',
		summary: 'Only clean OCs.',
		details: '',
		tags: [StratTag.loadout],
	},
	{
		id: 84,
		name: 'Four Peas in a Pod',
		summary: 'Everyone sticks together.',
		details: 'Everyone must stay within 10m of all other dwarves at all times.',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 85,
		name: 'Social Distancing',
		summary: 'Must stay away from your teammates.',
		details:
			'Must try to stay 15m away from all teammates at all times. You may only get close to revive. Social Distancing also applies to machine events.',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 86,
		name: 'Water, Earth, Fire, Air',
		summary: 'Everyone runs a different elemental build.',
		details:
			"All dwarves must pick an element for their build and cannot have any means of applying elements that belong to someone else's build. Elements include fire, ice, electric, corrosive, poison, and radiation.",
		tags: [StratTag.loadout],
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 87,
		name: 'Save Your Ammunition!',
		summary: 'Standard grunts can only be killed by pick.',
		details: '',
		requirements: {
			mission: (m) => m.anomaly === AnomalyType.criticalWeakness, // Or Skull Crusher Ale on tap... :shrug:
		},
		writtenRequirements: `Mission anomalies must include ${AnomalyType.criticalWeakness}.`,
		missionRequirementsLikelihood: 1, // TODO: Educated guess
	},
	{
		id: 88,
		name: 'Variety Is the Spice of Life',
		summary: 'No one can have the same perks.',
		details:
			'Perks should be claimed round-robin. Be selfish. Claim the perks you want most personally without regard for team synergy.',
		tags: [StratTag.loadout],
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 89,
		name: 'Leg Transplant',
		summary: 'Legs cannot be added to their intended mini-mule.',
		details: 'Mini-mule legs cannot be used to repair the mini-mule they spawned closest to.',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.salvageOperation,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.salvageOperation}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 90,
		name: 'Overly Committed',
		summary: 'Cannot cancel anything.',
		details:
			'Once you start an action, you have to see it through. This includes mining an ore vein, taking or calling a resupply, reviving, reloading, etc. If this causes you to die, then so be it. If possible, you should finish the action after you are revived.',
	},
	{
		id: 91,
		name: 'Protect Me!',
		summary: 'Cannot kill anything aggro on you.',
		details:
			'You must call your teammates to kill any enemies which are targeting you, or run away. You cannot attack them yourself.',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 92,
		name: 'Contents May Explode If Shot',
		summary: 'Cannot shoot the exploders.',
		details:
			'Exploders may only be killed with melee attacks, letting them explode on their own, or having another exploder kill them.',
		requirements: {
			mission: (m) => m.warnings.includes(WarningType.exploderInfestation),
		},
		writtenRequirements: `Mission warnings must include ${WarningType.exploderInfestation}.`,
		missionRequirementsLikelihood: 1, // TODO: Educated guess
	},
	{
		id: 93,
		name: 'Hitching a Ride',
		summary: 'No using your own traversal tools.',
		details: `${DwarfClass.driller} may make a tunnel, but must backtrack and not use the tunnel after is it completed. ${DwarfClass.driller} may use drills for combat. ${DwarfClass.engineer} may not step on their own platforms. ${DwarfClass.scout} may use their grappling hook to launch another dwarf, but must return to where they started after. ${DwarfClass.driller} may dig through dirt.`,
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 94,
		name: "You're Grounded",
		summary: 'Cannot jump.',
		details: '',
	},
	{
		id: 95,
		name: 'No Way Forward',
		summary: 'Cannot press W.',
		details: '',
	},
	{
		id: 96,
		name: 'Agoraphobia',
		summary: "Can't travel the cave using the cave.",
		details:
			"You must drill your own way to everything and can't travel any distance using the pre-generated cave. You can drill into existing cave to spot minerals, but you'll have to find another way to get to them.",
		tags: [StratTag.time],
	},
	{
		id: 97,
		name: 'Monogamous Relationship',
		summary: 'Only one dwarf can call Molly.',
		details: '',
		requirements: {
			mission: (m) =>
				m.primary !== PrimaryObjective.pointExtraction && m.primary !== PrimaryObjective.onSiteRefining,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Mission must have Molly. Team must have 2+ dwarves.',
		generateDynamicContent: (t) => `${sample(t.dwarves)?.name} is the only one who can call Molly.`,
		missionRequirementsLikelihood: specificNotPrimaries(2),
	},
	{
		id: 98,
		name: 'A Long and Complex Strategy',
		summary: 'The next mission must be length 3, complexity 3.',
		details: '',
		requirements: {
			mission: (m) => !m,
		},
		writtenRequirements: 'Mission must be length 3, complexity 3.',
		missionRequirementsLikelihood: 1,
	},
	{
		id: 99,
		name: 'All the Groceries in One Trip',
		summary: 'Cannot deposit anything until the team has collectively completed secondary.',
		details:
			'"Collectively completed" entails the necessary amount to complete the secondary objective stored in the mineral bags of any number of dwarves. Gunk seeds can be gathered in one spot to be considered "collectively competed". If only 2 dwarves and the secondary is dystrum, you\'ll have to use perks and/or armor upgrades such that you have 100 total bag capacity.',
		tags: [StratTag.time],
	},
	{
		id: 100,
		name: 'Endangered Species',
		summary: 'Cannot kill the next encountered bulk detonator.',
		details: '',
		tags: [StratTag.queue],
	},
	{
		id: 101,
		name: 'Small Game Hunting',
		summary: "Can't kill large enemies.",
		details: `${CommonStratDefinitions.largeEnemies} Exception can be made for dreadnoughts on ${PrimaryObjective.elimination} missions.`,
		requirements: {
			mission: (m) =>
				m.primary !== PrimaryObjective.escortDuty &&
				m.primary !== PrimaryObjective.industrialSabotage &&
				m.primary !== PrimaryObjective.salvageOperation,
		},
		writtenRequirements: `Mission primary objective must not be ${PrimaryObjective.escortDuty}, ${PrimaryObjective.industrialSabotage}, or ${PrimaryObjective.salvageOperation}.`,
		missionRequirementsLikelihood: specificNotPrimaries(3),
	},
	{
		id: 102,
		name: 'Bad Navigator',
		summary: 'No using the terrain scanner.',
		details: '',
	},
	{
		id: 103,
		name: 'Designated Miner',
		summary: 'Only one dwarf can mine, but they cannot deposit.',
		details:
			'The designated miner is the only one who is allowed to mine any resources. Their bag will likely be full before others are able to start getting minerals. The designated miner can deposit if the primary objective cannot be completed without their resources. Other dwarves can still mine dirt/terrain and pick up resources that are not mined with a pickaxe. The designated miner must be the one to dig up large minerals.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.miningExpedition,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.miningExpedition}. Team must have 2+ dwarves.`,
		missionRequirementsLikelihood: specificPrimaries(1),
		generateDynamicContent: (t) =>
			`${sample(t.dwarves)?.name} is the only one who can mine, but they may not deposit.`,
	},
	{
		id: 104,
		name: 'Every Dwarf for Themselves',
		summary:
			'Can only attack enemies which are aggressive towards you. Your fellow dwarves must fend for themselves.',
		details: 'Enemies which are attacking or approaching you with reasonable suspicion may be attacked.',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 105,
		name: 'Team Commander',
		summary: "One person is in charge of everyone's actions.",
		details: '',
		tags: [StratTag.communication],
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
		generateDynamicContent: (t) => `${sample(t.dwarves)?.name} is the Team Commander.`,
	},
	{
		id: 106,
		name: 'Private Bunkers',
		summary: 'During fuel cells and uplinks, everyone stays in their own private bunker.',
		details: `During fuel cells and uplinks, each dwarf must stay in their own private bunker. You may not exit your bunker for any reason until the progress bar has been completed, though you may expand your bunker.`,
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.salvageOperation,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.salvageOperation}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 107,
		name: 'To My Happy Place',
		summary: 'Bunker any time swarm music is playing.',
		details:
			'Whenever swarm music is playing, you must enter a bunker and remain there until the swarm music is over. You may not do anything (shoot bugs, mine, or revive) until you are in your bunker.',
	},
	{
		id: 108,
		name: 'The Best Offense',
		summary: `All dwarves must play as ${DwarfClass.engineer} with gemini turrets and at least one of: turret whip, EM discharge, turret arc.`,
		details: '',
		tags: [StratTag.loadout],
		requirements: {
			team: (t) =>
				t.dwarves.length >= 2 && t.dwarves.every((dwarf) => dwarf.classes.includes(DwarfClass.engineer)),
		},
		writtenRequirements: `Team must have 2+ dwarves. All dwarves must play as ${DwarfClass.engineer}.`,
	},
	{
		id: 109,
		name: 'Designated Medic',
		summary: 'Determine a designated medic who is the only one who can revive.',
		details: 'If the designated medic is downed, they can only be revived if all living dwarves revive together.',
		requirements: {
			team: (t) => t.dwarves.length >= 3,
		},
		writtenRequirements: 'Team must have 3+ dwarves.',
		generateDynamicContent: (t) => `${sample(t.dwarves)?.name} is the Designated Medic.`,
	},
	{
		id: 110,
		name: 'Pogo',
		summary: 'Cannot stop jumping.',
		details: 'You must jump as often as possible for the whole mission.',
	},
	{
		id: 111,
		name: 'Safehouse',
		summary: 'Must build a house and go there during swarms.',
		details: 'Try to make it as "house-like" as possible. For large caves, multiple safe-houses can be made.',
	},
	{
		id: 112,
		name: 'Divide and Conquer',
		summary: 'Split the cave and only take care of your zone.',
		details:
			'For Point Extraction, split the cave into equal-sized slices centered on mine-head. 1 dwarf per zone. For Escort, split the map into port and starboard sides of Doretta. 1-2 dwarves per zone.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.pointExtraction || m.primary === PrimaryObjective.escortDuty,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.pointExtraction} or ${PrimaryObjective.escortDuty}. Team must have 2+ dwarves.`,
		missionRequirementsLikelihood: specificPrimaries(2),
	},
	{
		id: 113,
		name: "That's Not My Job",
		summary: 'One person designated for each type of mineral.',
		details:
			'Each of the following minerals will be randomly assigned to a dwarf: morkite, nitra, secondary objective, and all other resources. You may not collect or deposit anything not assigned to you. This includes shooting down gunk seeds or mining heavy minerals.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.miningExpedition,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.miningExpedition}. Team must have 2+ dwarves.`,
		missionRequirementsLikelihood: specificPrimaries(1),
		generateDynamicContent: (t) => {
			const responsibilities = [
				'gather Morkite',
				'gather Nitra',
				'perform the secondary objective',
				'gather all other resources',
			];
			const shuffled = shuffle(t.dwarves);
			return responsibilities
				.map(
					(responsibility, i) =>
						`${shuffled[i % shuffled.length]?.name} is the only one who may ${responsibility}.`
				)
				.join(' ');
		},
	},
	{
		id: 114,
		name: 'Elephant in the Room',
		summary: 'If there is a haunted cave do it and no one mention the ghost.',
		details: 'Cannot ping the ghost or acknowledge its existence in text/voice chats.',
		requirements: {
			mission: (m) => m.warnings.includes(WarningType.hauntedCave),
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission warnings must include ${WarningType.hauntedCave}. Team must have 2+ dwarves.`,
		missionRequirementsLikelihood: 1, // TODO: Educated guess
	},
	{
		id: 115,
		name: 'New High Score',
		summary: 'Do whatever mission has the highest warning bonus.',
		details: '',
		requirements: {
			mission: (m) => !m,
		},
		writtenRequirements: 'Must choose the mission with the highest warning bonus.',
		missionRequirementsLikelihood: 1,
	},
	{
		id: 116,
		name: 'Crunchy on the Outside, Gooey on the Inside',
		summary: "Must pickaxe q'ronars to death.",
		details: '',
		requirements: {
			mission: (m) => m.biome !== BiomeType.sandblastedCorridors,
		},
		writtenRequirements: `Mission biome must not be ${BiomeType.sandblastedCorridors}.`,
		missionRequirementsLikelihood: specificNotBiomes(1),
	},
	{
		id: 117,
		name: 'A Dish Best Served Cold',
		summary: 'No using fire.',
		details:
			'Must perform a Rival Presence or Industrial Sabotage mission without fire-based weapons. (No flamethrower, no fire damage perks on minigun/PGL, etc.)',
		requirements: {
			mission: (m) =>
				m.primary === PrimaryObjective.industrialSabotage || m.warnings.includes(WarningType.rivalPresence),
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.industrialSabotage}, or mission warnings must include ${WarningType.rivalPresence}.`,
		missionRequirementsLikelihood: mustMeetAny(specificPrimaries(1), 1), // TODO: Educated guess on warnings
	},
	{
		id: 118,
		name: 'Cruelty-Free Slaughterhouse',
		summary: 'Everyone must pet loot-bugs before killing them.',
		details:
			'All dwarves must pet loot-bugs before killing them, but you must kill them. No exceptions for hard-to-reach loot-bugs!',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 119,
		name: 'Sdlking Iw Hdra', // cspell:disable-line
		summary: 'Inverted movement key controls (A ⇔ D, W ⇔ S).',
		details: '',
		tags: [StratTag.settings, StratTag.nausea],
	},
	{
		id: 120,
		name: 'Flight Controls',
		summary: 'Invert mouse Y movement.',
		details: '',
		tags: [StratTag.settings, StratTag.nausea],
	},
	{
		id: 121,
		name: 'Noise-canceling Headphones',
		summary: 'Set voiceline volume at max and everything low.',
		details: '',
		tags: [StratTag.settings],
	},
	{
		id: 122,
		name: 'A Successful Hunt',
		summary: `Rock and stone after every large enemy killed.`,
		details: `${CommonStratDefinitions.largeEnemies}`,
	},
	{
		id: 123,
		name: 'The Only Way to Be Born',
		summary: `Only reload with ${PassivePerkType.bornReady}.`,
		details: 'May not use weapons that cannot be reloaded.',
		tags: [StratTag.loadout],
	},
	{
		id: 124,
		name: 'Fair Fights',
		summary: "Can't attack things others have already attacked.",
		details: "Doesn't apply to dreadnoughts.",
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 125,
		name: 'I Need a Medic Up Here',
		summary: `${DwarfClass.scout}'s job to die in inconvenient places.`,
		details: `${DwarfClass.scout} must down themselves in an inconvenient place after [Choose] (a) Every swarm (or b) After the primary, and again after the secondary objectives are completed. ${DwarfClass.scout} must be revived.`,
		tags: [StratTag.time],
		requirements: {
			team: (t) => t.dwarves.length >= 2 && t.dwarves.every((dwarf) => dwarf.classes.includes(DwarfClass.scout)),
		},
		writtenRequirements: `Team must have 2+ dwarves, and one of them must play as ${DwarfClass.scout}`,
	},
	{
		id: 126,
		name: 'Down to the Wire',
		summary: 'Cant start the next machine event until drop pod is on the way.',
		details: 'If a machine event is there, you must do it, but cannot start it until the drop pod has been called.',
		tags: [StratTag.queue],
	},
	{
		id: 127,
		name: 'Scrawny Green-beard',
		summary:
			'One dwarf must use no upgrades, no OCs, no additional perk slots (only 1 passive and 1 active), and default weapons.',
		details:
			'Roll a 6-sided die. Pretend to be leveled at [Roll] * 4. Recall, mods are unlocked at the following levels:\nPrimary/traversal: 1,4,8,12,(16)\nSecondary/armor/support: 1,5,10,15,(20)\nPickaxe: 4,8\nGrenade: 1,5,10',
		tags: [StratTag.loadout],
		generateDynamicContent: (t) =>
			`${sample(t.dwarves)?.name} is the Scrawny Green-Beard. They must pretend to be level ${sample([
				4, 8, 12, 16, 20, 24,
			])}.`,
	},
	{
		id: 128,
		name: 'Take One Down, Pass It Around',
		summary: 'Everyone has to pass around heavy minerals before depositing.',
		details: `Only once the heavy mineral has been held by all dwarves may it be deposited. ${CommonStratDefinitions.heavyMinerals}`,
		requirements: {
			mission: (m) =>
				m.primary === PrimaryObjective.pointExtraction ||
				m.biome === BiomeType.hollowBough ||
				m.biome === BiomeType.crystallineCaverns ||
				m.biome === BiomeType.fungusBogs ||
				m.biome === BiomeType.saltPits ||
				m.biome === BiomeType.sandblastedCorridors ||
				m.biome === BiomeType.radioactiveExclusionZone ||
				m.secondary === SecondaryObjective.gunkSeed,
			team: (t) => t.dwarves.length >= 2,
		},
		missionRequirementsLikelihood: mustMeetAny(specificPrimaries(1), specificBiomes(6), specificSecondaries(1)),
		writtenRequirements: `Mission must contain heavy minerals. Team must have 2+ dwarves.`,
	},
	{
		id: 129,
		name: 'To the Fallen',
		summary: 'You must bury your dead and pay respects before reviving them.',
		details: `Dig a hole under downed dwarves (and cover it if an ${DwarfClass.engineer} is alive). Have a funeral procession and pay respects before digging up and reviving the downed dwarf.`,
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 130,
		name: 'Jammed Jams',
		summary: 'No music.',
		details: 'Set music to 0% in the audio settings.',
		tags: [StratTag.settings],
	},
	{
		id: 131,
		name: 'The Circle of Life',
		summary: 'Each dwarf has a dedicated reviver and revivee.',
		details:
			'Each dwarf may only revive a particular dwarf. e.g. A revives B. B revives C. C revives D. D revives A. Order must be determined in advance.',
		requirements: {
			team: (t) => t.dwarves.length >= 3,
		},
		writtenRequirements: 'Team must have 3+ dwarves.',
		generateDynamicContent: (t) => {
			let result = '';
			const shuffled = shuffle(t.dwarves);
			shuffled.forEach(
				(dwarf, i) =>
					(result += `${i === 0 ? '' : `${dwarf.name}. `}${dwarf.name} can only revive ${
						i === shuffled.length - 1 ? `${shuffled[0].name}.` : ''
					}`)
			);
			return result;
		},
	},
	{
		id: 132,
		name: 'Raising Livestock',
		summary: 'Minerals must be fed to loot-bugs before being picked up.',
		details: `Make your best effort to mine minerals with EPC, C4 or drills and not pick them up until they are eaten first. May be helpful to bring more than 1 ${DwarfClass.driller}.`,
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.onSiteRefining,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.onSiteRefining}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 133,
		name: 'Fratricide',
		summary: 'Next dreadnought twins, kill one, but leave the other alive.',
		details:
			'The next time you summon Dreadnought twins, (unless it was the last egg of the mission) pick one twin to focus on. The other cannot be attacked until another dreadnought egg has been popped. Once another egg is popped, you must make your best attempt to keep the HP of the remaining twin and the new dreadnought close.',
		tags: [StratTag.queue],
	},
	{
		id: 134,
		name: 'Carrion Flies',
		summary: "Can't kill the bugs aggro'd on a downed dwarf.",
		details: '',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 135,
		name: 'Med-kits',
		summary: 'Only one revive per resupply (max one at time).',
		details:
			"All dwarves start with one imaginary med-kit. When you revive another dwarf, your imaginary med-kit is consumed. You can only get another by resupplying. The maximum number of held imaginary med-kits is one per dwarf, so if you resupply when you already have one - you still just have one. If you're out of med-kits, you may not revive a dwarf. If the only med-kits left are held by downed dwarves, they may be revived but it will consume their med-kit. If all dwarves are out of med-kits, the remaining dwarves better stay alive and figure out how to call a resupply soon.",
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 136,
		name: "I'm Busy Here",
		summary: 'Cannot revive during swarm or boss/miniboss.',
		details:
			'If swarm music is playing or a boss bar is visible, dwarves may not be revived. During escort duty, dwarves may be revived during phases 2 and 4 of the Ommoran heartstone.',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 137,
		name: 'Dwarfsicle',
		summary: 'Cannot unfreeze yourself.',
		details:
			'You must get a fellow dwarf to unfreeze you. You cannot contribute to the thawing process by pressing A or D. You may also not warm yourself up in hot springs or with fire damage.',
		requirements: {
			mission: (m) => m.biome === BiomeType.glacialStrata,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission biome must be ${BiomeType.glacialStrata}. Team must have 2+ dwarves.`,
		missionRequirementsLikelihood: specificBiomes(1),
	},
	{
		id: 138,
		name: "Oh My Beard, It's Ugly!",
		summary: "Can't look at each other.",
		details:
			"Don't look at your fellow dwarves. Avoid having them visible on your screen unless 20m apart. If over 20m apart, avoid having them in or near your reticle. Make your best effort. If you violate one of the rules, you may comment on how ugly they are.",
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 139,
		name: 'Ambidextrous',
		summary: 'Swap your mouse and key hands.',
		details: '',
		tags: [StratTag.settings],
	},
	{
		id: 140,
		name: '12 Peas in a Pod',
		summary: 'Gunk seeds can only be deposited in the drop pod.',
		details: 'The secondary objective must be completed.',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.secondary === SecondaryObjective.gunkSeed,
		},
		writtenRequirements: `Mission secondary objective must be ${SecondaryObjective.gunkSeed}.`,
		missionRequirementsLikelihood: specificSecondaries(1),
	},
	{
		id: 141,
		name: "I'm Gonna Make You Watch",
		summary: 'Kill one dreadnought twin before attacking the other.',
		details: '',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 142,
		name: 'Spiderman',
		summary: 'Dreadnought fight while everyone is on ziplines.',
		details:
			'You may not dismount the zipline unless you are knocked down by a dreadnought attack. Exception may be made for a downed teammate, but you may not shoot while on the ground and must both return ASAP.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
			team: (t) => t.dwarves.some((dwarf) => dwarf.classes.includes(DwarfClass.gunner)),
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}. At least 1 dwarf must play as ${DwarfClass.gunner}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 143,
		name: 'Passive Aggression',
		summary: 'No active perks.',
		details: '',
		tags: [StratTag.loadout],
	},
	{
		id: 144,
		name: 'Bring the B-Tiers',
		summary: `No ${ActivePerkType.ironWill}, ${ActivePerkType.dash}, ${PassivePerkType.resupplier}, ${ActivePerkType.fieldMedic}, or ${PassivePerkType.bornReady}.`,
		details: '',
		tags: [StratTag.loadout],
	},
	{
		id: 145,
		name: 'Close Quarters',
		summary: 'Fight all dreadnoughts in the tunnels between rooms.',
		details: '',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 146,
		name: 'The Pit',
		summary: 'Perform all uplink/fuel cells in a deep pit.',
		details: 'Can be carved out with C4s or drilling. Must be at least 10m deep. Cannot be turned into a bunker.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.salvageOperation,
			team: (t) => t.dwarves.length >= 2 && t.dwarves.some((dwarf) => dwarf.classes.includes(DwarfClass.driller)),
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.salvageOperation}, and at least 1 dwarf must play as ${DwarfClass.driller}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 147,
		name: 'Quick Flicks',
		summary: 'Play with high sensitivity/DPI.',
		details:
			"(By adjusting in-game sensitivity, mouse DPI, and/or cursor speed in OS settings) You must set your total sensitivity to 4x the setting you normally play at. If you can't go that high, just crank everything to maximum.",
		tags: [StratTag.settings],
	},
	{
		id: 148,
		name: 'Slow but Steady',
		summary: 'Play with low sensitivity/DPI.',
		details:
			"(By adjusting in-game sensitivity, mouse DPI, and/or cursor speed in OS settings) You must set your total sensitivity to 1/4th the setting you normally play at. If you can't go that low, just crank everything to minimum.",
		tags: [StratTag.settings],
	},
	{
		id: 149,
		name: 'Like a Gangsta',
		summary: 'Hold mouse sideways.',
		details:
			'Turn your mouse 90 degrees either way so that it points directly towards or away from your keyboard. You must use your mouse like this for the entire mission. You may not turn your hand/wrist/arm too so that your hand is oriented properly with respect to the mouse.',
		tags: [StratTag.settings, StratTag.nausea],
	},
	{
		id: 150,
		name: 'Sneaky Beaky Like',
		summary: 'Exploder infest on mute.',
		details: 'Sounds effects must be muted so you cannot hear exploders charging up.',
		tags: [StratTag.settings],
		requirements: {
			mission: (m) => m.warnings.includes(WarningType.exploderInfestation),
		},
		writtenRequirements: `Mission warnings must include ${WarningType.exploderInfestation}.`,
		missionRequirementsLikelihood: 1, // TODO: Educated guess
	},
	{
		id: 151,
		name: 'Flashbang',
		summary: 'Swap F and G keybinds.',
		details: `Run grenades that are capable of friendly fire (HE grenades for ${DwarfClass.driller}, plasma bursters for ${DwarfClass.engineer}, and cryo grenades for ${DwarfClass.scout}).`,
		tags: [StratTag.settings],
	},
	{
		id: 152,
		name: 'Fat Fingered',
		summary: 'Randomly re-mapped controls (non movement or pickaxe).',
		details:
			'Use random number generator to determine how to remap non-movement and non-mouse keybinds (1, 2, 3, 4, 5, Q, E, R, F, G, X, C, V, M, Ctrl).',
		tags: [StratTag.settings],
		generateDynamicContent: (_) => {
			const controls = [
				'Primary weapon (default: 1)',
				'Secondary weapon (default: 2)',
				'Traversal tool (default: 3)',
				'Support tool (default: 4)',
				'Resupply (default: 5)',
				'Previous item (default: Q)',
				'Activate (default: E)',
				'Reload (default: R)',
				'Flare (default: F)',
				'Grenade (default: G)',
				'Shout (default: X)',
				'Call MULE (default: C)',
				'Salute (default: V)',
				'Map (default: M)',
				'Laser pointer (default: Ctrl',
			];
			const remappedControls = shuffle(controls);
			return controls
				.map((control, i) => `"${control}" should be remapped to "${remappedControls[i]}".`)
				.join('\n');
		},
	},
	{
		id: 153,
		name: 'My Right or Your Right?',
		summary: 'Swap L and R audio.',
		details: '',
		tags: [StratTag.settings],
	},
	{
		id: 154,
		name: 'NASCAR Pit Stop',
		summary: 'Speedrun the drilldozer refueling process',
		details: `Perform the refueling process in as little time as possible and press the button to continue as soon as it is available. You may drill ahead to dozer stopping points and prepare for a faster refuel if you'd like.`,
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.escortDuty,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.escortDuty}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 155,
		name: 'Unfriendly Fire',
		summary: 'Settle your differences when friendly-fire occurs.',
		details:
			'If you shoot or are shot by a teammate, you and your teammate must engage in a death match without hesitation. Any amount of friendly fire counts. Both dwarves are required to fight; one dwarf may not choose to not fight back.\nWhen in doubt, shoot them anyway.',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Team must have 2+ dwarves.`,
	},
	{
		id: 156,
		name: 'Onslaught',
		summary: "Can't call the drop-pod until the 25 minute mark.",
		details:
			'The drop pod may not be called on point extraction until the mission timer has hit the 25:00 minute mark.',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.pointExtraction,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.pointExtraction}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 157,
		name: 'Pump the Jams!',
		summary: 'Crank up your in-game music.',
		details: 'Using the in-game volume mixer, double music volume, and halve all other volumes.',
		tags: [StratTag.settings],
	},
	{
		id: 158,
		name: 'Keep It Up',
		summary: `All dwarves must play as ${DwarfClass.scout}. You must remain in the air as much as possible.`,
		details:
			"Recommended to use hoverclock, boomstick w/ special powder, and/or hover boots if you're concerned you can't complete this challenge. You may take advantage of low gravity missions if there is one. You may make exceptions for actions that require you to be grounded such as resupplying, depositing, or uplinks/refueling.",
		requirements: {
			team: (t) => t.dwarves.every((dwarf) => dwarf.classes.includes(DwarfClass.scout)),
		},
		writtenRequirements: `All dwarves must play as ${DwarfClass.scout}.`,
	},
	{
		id: 159,
		name: 'Ant Raid',
		summary: 'Fight dreadnoughts in tunnels dug by hand/drill or previous dreadnoughts.',
		details: `Recommended bringing at least 2 ${DwarfClass.driller}s.`,
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}. Team must have 2+ dwarves.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 160,
		name: 'Up Close and Personal',
		summary: 'Leeches must be killed with pickaxe only.',
		details: '',
	},
	{
		id: 161,
		name: 'One Before Three',
		summary: 'During Mactera waves prioritize Spawn > Brundles > Trijaws.',
		details: '',
		requirements: {
			mission: (m) => m.warnings.includes(WarningType.macteraPlague),
		},
		writtenRequirements: `Mission warnings must include ${WarningType.macteraPlague}.`,
		missionRequirementsLikelihood: 1, // TODO: Educated guess
	},
	{
		id: 162,
		name: 'You Had One Job',
		summary: 'Can only satisfy your team role.',
		details: `e.g. ${DwarfClass.scout} picks off high priority targets (large enemies, spitters) and bugs about to nip a dwarf, ${DwarfClass.driller} handles fodder enemies like grunts and swarmers, etc.`,
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 163,
		name: 'Swarmageddongeddon',
		summary: 'Cannot shoot swarmers.',
		details: '',
		requirements: {
			mission: (m) => m.warnings.includes(WarningType.swarmageddon),
		},
		writtenRequirements: `Mission warnings must include ${WarningType.swarmageddon}.`,
		missionRequirementsLikelihood: 1, // TODO: Educated guess
	},
	{
		id: 164,
		name: 'Finish Them Off',
		summary: 'Cannot shoot regenerating bugs.',
		details:
			'Bugs that are in the process of regenerating may not be shot. This includes bugs under the protection/healing of a warden. This means you should finish anything off lest it heal.',
		requirements: {
			mission: (m) => m.warnings.includes(WarningType.regenerativeBugs),
		},
		writtenRequirements: `Mission warnings must include ${WarningType.regenerativeBugs}.`,
		missionRequirementsLikelihood: 1, // TODO: Educated guess
	},
	{
		id: 165,
		name: 'Nurse Molly',
		summary: 'Can only revive when Molly is present.',
		details: 'Must have the M.U.L.E. sitting on a downed dwarf before they can be revived.',
		requirements: {
			mission: (m) =>
				m.primary !== PrimaryObjective.onSiteRefining && m.primary !== PrimaryObjective.pointExtraction,
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Mission must have Molly. Team must have 2+ dwarves.',
		missionRequirementsLikelihood: specificNotPrimaries(2),
	},
	{
		id: 166,
		name: 'Elitist',
		summary: 'No killing elites.',
		details: 'Exceptions can be made for mactera and grunt slashers.',
		requirements: {
			mission: (m) =>
				m.warnings.includes(WarningType.eliteThreat) &&
				m.primary !== PrimaryObjective.escortDuty &&
				m.primary !== PrimaryObjective.industrialSabotage &&
				m.primary !== PrimaryObjective.salvageOperation,
		},
		writtenRequirements: `Mission warnings must include ${WarningType.eliteThreat}, and mission primary objective must not be ${PrimaryObjective.escortDuty}, ${PrimaryObjective.industrialSabotage}, or ${PrimaryObjective.salvageOperation}.`,
		missionRequirementsLikelihood: mustMeetAll(specificNotPrimaries(3), 1), // TODO: Educated guess on warning
	},
	{
		id: 167,
		name: 'Extended Mag',
		summary: 'Must empty both guns before reloading, then reload both before firing.',
		details: `No drak, cryo cannon, EPC, wave cooker, minigun, shard diffractor, or ${PassivePerkType.bornReady}.`,
		tags: [StratTag.loadout],
	},
	{
		id: 168,
		name: 'REALLY Make It Count',
		summary: '3-3 no resupply.',
		details:
			'You must do a length 3, complexity 3 mission without calling resupply pods. Broken resupply pods are allowed.',
		requirements: {
			mission: (m) => !m,
		},
		writtenRequirements: 'Mission length and complexity must both be 3.',
		missionRequirementsLikelihood: 1,
	},
	{
		id: 169,
		name: 'Shiny New Toys',
		summary: 'Use newest guns/grenades/etc.',
		details: 'Newest = most recently released, or latest in the list',
		tags: [StratTag.loadout],
	},
	{
		id: 170,
		name: 'G-Team',
		summary: 'Must fill each drop pod seat with a gunk seed.',
		details:
			'If the secondary objective cannot be completed without depositing some of the 4 gunk seeds, they can be taken out and deposited after all seated.',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.secondary === SecondaryObjective.gunkSeed,
		},
		writtenRequirements: `Mission secondary objective must be ${SecondaryObjective.gunkSeed}.`,
		missionRequirementsLikelihood: specificSecondaries(1),
	},
	{
		id: 171,
		name: 'The Silent Treatment',
		summary: 'No voice or text comms throughout the mission.',
		details:
			"Includes external voice-chat applications. You may use any other in-game communication methods (shouting, pinging, etc.) You may continue to use comms for non-mission related conversation. You may use use comms to get someone's attention for something in-game.",
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 172,
		name: 'Underclocked',
		summary: 'No overclocks.',
		details: '',
		tags: [StratTag.loadout],
	},
	{
		id: 173,
		name: 'Mutually-Assured Destruction',
		summary: 'Everyone run fat boy PGL with "nails and tape" and "proximity trigger".',
		details: '',
		tags: [StratTag.loadout],
		requirements: {
			team: (t) =>
				t.dwarves.length >= 2 && t.dwarves.every((dwarf) => dwarf.classes.includes(DwarfClass.engineer)),
		},
		writtenRequirements: `Team must have 2+ dwarves. All dwarves must play as ${DwarfClass.engineer}.`,
	},
	{
		id: 174,
		name: 'Impenetrable Firewall',
		summary: 'No hacking during rival presence.',
		details:
			'Must perform a rival presence without hacking. This includes hacking the turret controller or patrol bots. The comms router event is an exception to this rule.',
		requirements: {
			mission: (m) => m.warnings.includes(WarningType.rivalPresence),
		},
		writtenRequirements: `Mission warnings must include ${WarningType.rivalPresence}.`,
		missionRequirementsLikelihood: 1, // TODO: Educated guess
	},
	{
		id: 175,
		name: 'Need Air',
		summary: 'Molly, Mine-head, and On-site refinery may not be used for getting oxygen.',
		details:
			"You must get all your oxygen from resupply pods. You'd better get your first one quick. Exception can be made for depositing at refinery / mine-head if you have a large quantity of items to deposit (40+ minerals or multiple aquarqs). Same goes for Molly in mining / egg missions.",
		requirements: {
			mission: (m) => m.warnings.includes(WarningType.lowOxygen),
		},
		writtenRequirements: `Mission warnings must include ${WarningType.lowOxygen}.`,
		missionRequirementsLikelihood: 1, // TODO: Educated guess
	},
	{
		id: 176,
		name: 'Top to Bottom',
		summary:
			'Fight the next OMEN tower from top to bottom (cannot damage lower sections before destroying the ones above them).',
		details:
			'Next time an OMEN tower machine event is discovered, the layers must be destroyed from top to bottom. The next layer may not be attacked until the layer above it is destroyed.',
		tags: [StratTag.queue],
	},
	{
		id: 177,
		name: 'Going Legit',
		summary: 'Fight the next OMEN without any cheese strats.',
		details:
			"Next time an OMEN tower machine event is discovered, no cheese strats may be employed to float above the radius pulse gun's lasers. This includes using Molly, platforms, resupplies, or ziplines.",
		tags: [StratTag.queue],
	},
	{
		id: 178,
		name: 'Big Game Hunter',
		summary: 'One dwarf is responsible for killing all large enemies.',
		details: `One dwarf is designated as the "Big Game Hunter". They are the only one who may kill large enemies. ${CommonStratDefinitions.largeEnemies}. Exception can be made for dreadnoughts on ${PrimaryObjective.elimination} missions.`,
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
		generateDynamicContent: (t) => `${sample(t.dwarves)?.name} is the Big Game Hunter.`,
	},
	{
		id: 179,
		name: 'Strip Mining',
		summary: 'Must dig to each room.',
		details:
			'You must dig by hand or drill to the next room in a mining mission. You cannot use the pre-generated tunnels. You may only enter the tunnels to look for objectives after the entire cave has been explored and one or more objectives are not yet complete.',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.miningExpedition,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.miningExpedition}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 180,
		name: 'Picking on the Little Guy',
		summary: 'Must always prioritize killing the smallest enemy you see.',
		details: '',
	},
	{
		id: 181,
		name: 'I Have the High Ground',
		summary: 'Can only shoot bugs below you.',
		details:
			'You may only shoot bugs that are below you. You may get above them in any way, including standing on higher terrain, jumping, bouncing on them, using ziplines, etc.',
	},
	{
		id: 182,
		name: "The King's Guard",
		summary: 'One dwarf is the "Dwarf King" and must be protected at all costs.',
		details:
			'One dwarf is the "Dwarf King" and must be protected at all costs. The Dwarf King has no responsibilities for contributing to the objective and actively seeks out danger. If the Dwarf King is killed, whoever they deem to have failed them the most must be executed/suicided. The executed dwarf is then revived and joins the King\'s Guard as a "new hire". The other guards are encouraged to mock the ("dead") ex-guard. The drop pod may not leave without the Dwarf King.',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
		generateDynamicContent: (t) => `${sample(t.dwarves)?.name} is the Dwarf King.`,
	},
	{
		id: 183,
		name: 'Call in the Nukes',
		summary: 'Intentionally fail next comms router to take out enemies.',
		details:
			'Next time a comms router season event is discovered, it must be started and then intentionally failed to nuke a swarm or dreadnought(s).',
		tags: [StratTag.queue],
	},
	{
		id: 184,
		name: 'Think of the Children',
		summary: "Can't kill q'ronar younglings.",
		details:
			"May not kill any q'ronar younglings. It is recommended to coax them into man-made or natural pits to keep them contained.",
		requirements: {
			mission: (m) => m.biome === BiomeType.saltPits,
		},
		writtenRequirements: `Mission biome must be ${BiomeType.saltPits}.`,
		missionRequirementsLikelihood: specificBiomes(1),
	},
	{
		id: 185,
		name: 'No More Glyphids Jumping on the Bed',
		summary: 'Destroy the Ommoran bed so no bugs can reach the dozer.',
		details: '',
		tags: [StratTag.time],
	},
	{
		id: 186,
		name: 'Tight Schedule',
		summary: 'Must do the next machine event while the drill-dozer is vulnerable.',
		details: 'Do any events after the dozer has been started but before completing the Ommoran heartstone.',
		tags: [StratTag.queue],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.escortDuty,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.escortDuty}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 187,
		name: 'Weed Makes You Do Crazy Things',
		summary: 'Fight the next Tyrant Weed up close and personal.',
		details: 'Everyone must remain within 15m of the next Tyrant weed after it has been started. No using cover.',
		tags: [StratTag.queue],
	},
	{
		id: 188,
		name: 'Let Them Come',
		summary: 'Must fight all dreadnoughts without leaving spawn room.',
		details: `You cannot leave the starting room until all dreadnoughts are dead. You must pop them using The Mole on ${DwarfClass.gunner}'s coil gun.`,
		tags: [StratTag.loadout],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
			team: (t) => t.dwarves.every((dwarf) => dwarf.classes.includes(DwarfClass.gunner)),
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}. At least one dwarf must play as ${DwarfClass.gunner}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 189,
		name: "Let's Get 'Er Done",
		summary: 'No area prep, must fight dreadnought in whatever room their egg is in.',
		details: '',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 190,
		name: 'Master Fingerer',
		summary: 'Must hold mouse off desk and move by manipulating the sensor with your finger.',
		details: 'Recommended to invert y-axis and adjust sensitivity for easier time.',
		tags: [StratTag.settings, StratTag.nausea],
	},
	{
		id: 191,
		name: 'Uncovered Manhole',
		summary: 'Dig holes in spawn and fight dreadnoughts there without falling in.',
		details: `Fight dreadnoughts in spawn. Dig many holes straight down that are deep enough to get stuck. Any mix of drill-sized and pick-sized holes will suffice. ${DwarfClass.engineer}s are encouraged to cover manholes if their fellow dwarves fall in.`,
		tags: [StratTag.time],
	},
	{
		id: 192,
		name: 'Forward Thinker',
		summary: 'Cannot move any direction but forward.',
		details: 'Cannot use A, S, D keys.',
	},
	{
		id: 193,
		name: 'Crossed Wires',
		summary: 'Pair hacking pods to the wrong power station on industrial sabotage.',
		details: '',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.industrialSabotage,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.industrialSabotage}.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 194,
		name: 'Rodeo',
		summary: 'Attack prospector only while bouncing on it',
		details: 'Next time a prospector is encountered, you may only shoot it when bouncing on top of it.',
		tags: [StratTag.queue],
	},
	{
		id: 195,
		name: 'Hot Potato',
		summary: 'Make an assembly line to destroy your next tritilyte deposit.',
		details:
			'Next time a tritilyte deposit is discovered, all nanite bombs must be passed between all dwarves before being thrown at the deposit. (The final dwarf may also shoot the nanite bombs if needed)',
		tags: [StratTag.queue],
		requirements: {
			team: (t) => t.dwarves.length >= 3,
		},
		writtenRequirements: 'Team must have 3+ dwarves.',
	},
	{
		id: 196,
		name: 'Take No Bets',
		summary: 'Bum rush the next BET-C.',
		details:
			"Bum rush the next BET-C. As soon as you hear BET-C, you must drop everything you're doing to go jump it as soon as possible. When you jump her, get and stay up close and personal until either BET-C or the dwarves are dead.",
		tags: [StratTag.queue],
	},
	{
		id: 197,
		name: 'Jaws',
		summary: "Can't kill Nayaka Trawlers (sand sharks).",
		details: '',
		requirements: {
			mission: (m) => m.biome === BiomeType.sandblastedCorridors,
		},
		writtenRequirements: `Mission biome must be ${BiomeType.sandblastedCorridors}.`,
		missionRequirementsLikelihood: specificBiomes(1),
	},
	{
		id: 198,
		name: 'Just Like Me Mum',
		summary: 'Slow down dreadnoughts as much as possible.',
		details:
			'Combine sludge, electric dot, neuro-lasso, IFG, cwc slowdown, pheromone, neurotoxin, stun, and cryo to make dreadnoughts as slow as possible.',
		tags: [StratTag.loadout],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
			team: (t) => t.dwarves.length >= 3,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}. Team must have 3+ dwarves.`,
		missionRequirementsLikelihood: specificPrimaries(1),
	},
	{
		id: 199,
		name: 'Flyswatter',
		summary: 'Must kill flying enemies using only melee attacks',
		details: '',
	},
	{
		id: 200,
		name: 'Touched by an Angel',
		summary: 'Must escape to the drop-pod by riding a cave angel.',
		details: '',
		requirements: {
			mission: (m) =>
				m.biome === BiomeType.azureWeald &&
				(m.primary === PrimaryObjective.eggHunt ||
					m.primary === PrimaryObjective.onSiteRefining ||
					m.primary === PrimaryObjective.pointExtraction),
		},
		writtenRequirements: `Mission biome must be ${BiomeType.azureWeald}, and mission primary objective must be ${PrimaryObjective.eggHunt}, ${PrimaryObjective.onSiteRefining}, or ${PrimaryObjective.pointExtraction}.`,
		missionRequirementsLikelihood: mustMeetAll(specificBiomes(1), specificPrimaries(3)),
	},
	{
		id: 201,
		name: 'Hide Yo Kids',
		summary:
			'The next Mactera Grabber cannot be attacked. You must let it grab and voluntarily release someone first.',
		details: '',
		tags: [StratTag.queue],
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 202,
		name: 'Where No Dwarf Has Gone Before',
		summary: 'You may only use traversal tools to reach a location another dwarf has already reached.',
		details:
			'For example, someone will have to pick and climb up to ledges, or drop down into chasms before another dwarf can use their traversal tools to make them more navigable. Can use traversal tools for non-traversal purposes (i.e. making a roof or drilling bugs)',
		requirements: {
			team: (t) => t.dwarves.length >= 2,
		},
		writtenRequirements: 'Team must have 2+ dwarves.',
	},
	{
		id: 203,
		name: 'Handle With Care',
		summary: 'Next time a tritilyte deposit is discovered, bring an extra nanite bomb into the drop pod.',
		details: '',
		tags: [StratTag.queue],
	},
	{
		id: 204,
		name: 'Active Engagement',
		summary: 'No passive perks.',
		details: '',
		tags: [StratTag.loadout],
	},
	{
		id: 205,
		name: 'Role Reversal',
		summary: 'Everyone must swap classes and loadouts with another dwarf.',
		details: '',
		tags: [StratTag.loadout],
		requirements: {
			team: (t) => t.dwarves.length >= 2 && t.dwarves.every((dwarf) => dwarf.classes.length >= 2),
		},
		writtenRequirements: 'Team must have 2+ dwarves and all be flexible about which class they play.',
		generateDynamicContent: (t) => {
			let result = '';
			const shuffled = shuffle(t.dwarves);
			shuffled.forEach(
				(dwarf, i) =>
					(result += `${i === 0 ? '' : `${dwarf.name}'s loadout. `}${dwarf.name} must take ${
						i === shuffled.length - 1 ? `${shuffled[0].name}'s loadout.` : ''
					}`)
			);
			return result;
		},
	},
	{
		id: 206,
		name: 'Mission Speedrun Any%',
		summary: 'Perform the next mission as fast as possible.',
		details: 'Skip unnecessary minerals, push all buttons immediately, etc.',
	},
	{
		id: 207,
		name: 'Lone Wolf',
		summary: 'Leave Bosco at the space rig.',
		details:
			'Bosco can be left in the space rig by unchecking the checkbox in the bottom left corner of the Bosco upgrades terminal.',
		requirements: {
			team: (t) => t.dwarves.length === 1,
		},
		writtenRequirements: 'Team must be a single dwarf.',
	},
	{
		id: 208,
		name: 'Realistic Grapple Physics',
		summary: `All dwarves must play as ${DwarfClass.scout}. You cannot grapple downwards.`,
		details: '',
		requirements: {
			team: (t) => t.dwarves.every((dwarf) => dwarf.classes.includes(DwarfClass.scout)),
		},
		writtenRequirements: `All dwarves must play as ${DwarfClass.scout}.`,
	},
	// Leave lithophage until the end
	// Break lithophage by hand (C4, drills, pickaxe)
	// Rockpox enemies must be melee'd
	// Bombardier - throw prox mines, run to them and pick them up. If triggered, wait for it to depleted then continue // Too boring?
	// Meteor event with only 1 rock cracker (queue)
];

/*
 * Helper functions for estimating likelihood of mission requirements being met
 * Note: These functions (falsely) assume that all objectives and biomes are equally likely
 */

/**
 * @param n - The number of specific allowed primary objectives
 * @returns - The estimated likelihood that any given mission meets the requirements
 */
function specificPrimaries(n: number) {
	return n / Object.keys(PrimaryObjective).length;
}

/**
 * @param n - The number of specific disallowed primary objectives
 * @returns - The estimated likelihood that any given mission meets the requirements
 */
function specificNotPrimaries(n: number) {
	return (Object.keys(PrimaryObjective).length - n) / Object.keys(PrimaryObjective).length;
}

/**
 * @param n - The number of specific allowed secondary objectives
 * @returns - The estimated likelihood that any given mission meets the requirements
 */
function specificSecondaries(n: number) {
	return n / Object.keys(SecondaryObjective).length;
}

/**
 * @param n - The number of specific disallowed secondary objectives
 * @returns - The estimated likelihood that any given mission meets the requirements
 */
function specificNotSecondaries(n: number) {
	return (Object.keys(SecondaryObjective).length - n) / Object.keys(SecondaryObjective).length;
}

/**
 * @param n - The number of specific allowed biomes
 * @returns - The estimated likelihood that any given mission meets the requirements
 */
function specificBiomes(n: number) {
	return n / Object.keys(BiomeType).length;
}

/**
 * @param n - The number of specific disallowed biomes
 * @returns - The estimated likelihood that any given mission meets the requirements
 */
function specificNotBiomes(n: number) {
	return (Object.keys(BiomeType).length - n) / Object.keys(BiomeType).length;
}

/**
 * @param numbers - A list of independent odds
 * @returns - The likelihood of any one of the input odds being met
 */
function mustMeetAny(...numbers: number[]) {
	if (numbers.length === 0) console.error('No numbers were provided');
	if (numbers.some((n) => n > 1 || n < 0)) console.error('Numbers must be within range [0, 1]');
	return numbers.reduce((a, b) => a + b - a * b);
}

/**
 * @param numbers - A list of independent odds
 * @returns - The likelihood of all of the input odds being met
 */
function mustMeetAll(...numbers: number[]) {
	if (numbers.length === 0) console.error('No numbers were provided');
	if (numbers.some((n) => n > 1 || n < 0)) console.error('Numbers must be within range [0, 1]');
	return numbers.reduce((a, b) => a * b, 1);
}
