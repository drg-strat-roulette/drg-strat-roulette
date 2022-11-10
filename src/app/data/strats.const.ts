import {
	AnomalyType,
	BiomeType,
	PrimaryObjective,
	SecondaryObjective,
	WarningType,
} from '../models/missions.interface';
import { Strategy, StratTag } from '../models/strat.interface';
import { DwarfType } from '../models/team.interface';

export const strategies: Strategy[] = [
	{
		id: 1,
		name: 'Surgical team',
		summary: 'All living dwarves move revive downed players together.',
		details:
			'If a dwarf goes down, all dwarves still standing must gather around their corpse. They may not start reviving until all dwarves are present and must begin reviving at the same time.',
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
		name: "Got Any AA's?",
		summary: 'No flashlight.',
		details: 'Turn off your flashlight for the whole mission.',
	},
	{
		id: 7,
		name: 'Advanced Darkness',
		summary: 'No lights (flashlight, flare, or flare gun).',
		details: "Turn off your flashlight and don't throw any flares. If scout, you may not use your flare gun.",
	},
	{
		id: 8,
		name: 'Firing Squad',
		summary: 'All players must play as Gunner.',
		details: '',
		tags: [StratTag.class],
	},
	{
		id: 9,
		name: "Drill 'Em and Grill 'Em",
		summary: 'All players must play as Driller.',
		details: '',
		tags: [StratTag.class],
	},
	{
		id: 10,
		name: 'Swinger Party',
		summary: 'All players must play as Scout.',
		details: '',
		tags: [StratTag.class],
	},
	{
		id: 11,
		name: 'Engineer Is Engi-here',
		summary: 'All players must play as Engineer.',
		details: '',
		tags: [StratTag.class],
	},
	{
		id: 12,
		name: 'Trouble Getting Around',
		summary: 'No traversal tools.',
		details:
			"No using traversal tools for any reason. This includes driller's drills for combat. Unbind your traversal tool key.",
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
		summary: 'Fight one dreadnought with pickaxes, drills, and axes.',
		details:
			"Must fight one dreadnought with your only pickaxe, drills, and axes. Dealer's choice if 1 or both twins are required, and if hiveguard sentinels have to be melee'd too.",
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}.`,
	},
	{
		id: 16,
		name: 'Double Trouble',
		summary: 'Double modifier',
		details: 'Do whatever mission has a double modifier.',
	},
	{
		id: 17,
		name: 'Back To Basics (Primary)',
		summary: 'No mods or overclocks on primary weapons.',
		details: '',
		tags: [StratTag.loadout],
	},
	{
		id: 18,
		name: 'Back To Basics (Secondary)',
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
		details:
			"As soon as a heavy mineral is discovered, it must be carried for the entirety of the mission. The heavy mineral can be handed off to another dwarf but must not touch the ground. Don't let the heavy mineral be dropped! Heavy minerals include compressed gold, bittergems, aquarqs, enor pearls, jadiz, or gunk seeds in a pinch.",
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
		},
		writtenRequirements: 'Mission biome must have heavy minerals or gunk seeds.',
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
		name: 'Forgot To Bring Protection',
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
		summary: 'One player leads, and the rest must follow.',
		details:
			'All players must remain within 10m of the leader. If they exit this range for any reason, they cannot mine, attack, or revive until they come closer again.',
		requirements: {
			mission: (m) => m.primary !== PrimaryObjective.escortDuty,
		},
		writtenRequirements: `Mission primary objective must not be ${PrimaryObjective.escortDuty}.`,
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
			'Any player may not have a longer than 30-second window to kill enemies. You may, at any time during your turn, "pass" to the next player.',
		tags: [StratTag.communication],
	},
	{
		id: 32,
		name: 'Two Hackers Are Better Than One',
		summary: 'Perform both hacking pods at same time on industrial sabotage.',
		details:
			'Both hacking pods in an industrial sabotage mission must be started at the same time. Should one be stopped, it must either be immediately restarted, or the other must stop being defended and stop as soon as possible. If the latter is chosen, they must be restarted at the same time.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.industrialSabotage,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.industrialSabotage}.`,
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
		},
		writtenRequirements: 'Mission must have Molly.',
	},
	{
		id: 35,
		name: 'Designated Driver',
		summary:
			'One chosen player must remain on the Drilldozer for the whole mission until the heartstone is deposited.',
		details:
			'One person must remain on the Drilldozer for an entire mission. If they fall off, they should get back on immediately.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.escortDuty,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.escortDuty}.`,
	},
	{
		id: 36,
		name: 'Shoot Your Way Out',
		summary: 'Only primary and secondary weapons for combat.',
		details:
			'You may only use your primary and secondary weapons for combat. This means grenades, drills, sentries, and flare guns may not be used for combat.',
	},
	{
		id: 37,
		name: 'Caught With Your Pick Out',
		summary: 'Pickaxe may not be used unless power-picking.',
		details:
			'You may not use your pickaxe for mining, combat, or otherwise. You can use your power attack. (Hint: Berserker perk is allowed). Driller recommended.',
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
			'All eggs must be pulled within 30 seconds of each other. This means you may have to prepare in order for all to be pulled at once.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.eggHunt,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.eggHunt}.`,
	},
	{
		id: 41,
		name: "You've Got This Covered",
		summary: 'Everyone takes a turn with killing bugs during Ommoran phase(s).',
		details:
			'Each player is assigned phase(s) of the Ommoran. During your phase, only you may kill bugs. Others may defend themselves from bugs immediately targeting them, but otherwise cannot contribute to the Ommoran fight. Anyone may repair the Drilldozer.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.escortDuty,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.escortDuty}.`,
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
		name: 'Drinking On The Job',
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
		name: 'Bottom To Top',
		summary: 'Do mining mission backwards.',
		details:
			'Drill to the end of the mining mission at the very beginning. You may not mine anything on your way there or kill any stationary enemies (unless you are unable to revive a dwarf otherwise) even in the starting room. Do your best to not pay attention to the caves if you happen to pass through any part. The end of the mining mission is always southwest from the start of the mission. Dig this way at a downward angle, using the terrain scanner to try to stay near the cave system. If you must pass through because you ran out of drill ammo, you may. It might be a good idea to bring more than one driller if the mission is particularly long.',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.miningExpedition,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.miningExpedition}.`,
	},
	{
		id: 48,
		name: 'Taking The Scenic Route',
		summary: 'Each pipe has to wrap around the other two pumpjacks.',
		details:
			'Before connecting a pipe to a pumpjack, it must wrap around each of the other two pumpjacks. You may not un-build a pipe after it has been wrapped around a pumpjack.',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.onSiteRefining,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.onSiteRefining}.`,
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
	},
	{
		id: 50,
		name: 'What Took You So Long?',
		summary: 'One player must rush to the Ommoran and wait there.',
		details:
			'One player (presumably the driller) must rush to the Ommoran heartstone and wait there for the rest of the team to catch up.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.escortDuty,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.escortDuty}.`,
	},
	{
		id: 51,
		name: 'Shoddy Connection',
		summary: 'Only one person can stand in the uplink/refuel zone at a time.',
		details: '',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.salvageOperation,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.salvageOperation}.`,
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
	},
	{
		id: 54,
		name: 'All Your Eggs In One Basket',
		summary: 'Carry all your eggs/aquarqs together without depositing.',
		details:
			'Every gathered egg/aquarq must be carried to the next egg/aquarq until enough to complete the primary objective have been gathered in one location. From then they may be deposited in Molly (Eggs) or brought to the Mine-head (e.g. You must carry 9 aquarqs to the 10th before returning them all in a length 3 mission). The "Egg basket" may not be left completely unattended, but other dwarves may perform reconnaissance to find the optimal next egg/aquarq.',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.eggHunt || m.primary === PrimaryObjective.pointExtraction,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.eggHunt} or ${PrimaryObjective.pointExtraction}.`,
	},
	{
		id: 55,
		name: 'Nature Conservationist',
		summary: 'Cannot destroy environmental hazards.',
		details:
			"You cannot destroy environmental hazards through intentional means (you will know if it was intentional or not). This includes the following, divided into biomes: \n* Crystalline Caverns: Electrocrystals or cobwebs\n* Salt Pits: Unstable crystal or unstable platform\n* Fungus Bogs: Steam geysers, exploding plants, sticky goo, poison spores, glyphid eggs, hanging grassy vines\n* Radioactive Exclusion Zone: Volatile uranium, spider webs\n* Dense Biozone: Exploding plants, ejector cacti, spider webs, glyphid eggs, cave urchins, trapactus\n* Glacial Strata: Cryo bulbs, unstable ice, deep snow, crevasse cracks (don't cover them)\n* Hollow Bough: Creeper vines, bloated vines, thorn pots, goo sacks\n* Magma Core: Exploding plants, lava geysers, hot rock, small lava geysers.",
		requirements: {
			mission: (m) => m.biome !== BiomeType.azureWeald,
		},
		writtenRequirements: `Mission biome must not be ${BiomeType.azureWeald}.`,
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
		summary: 'Only one person in range of dozer while in-transit.',
		details: '',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.escortDuty,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.escortDuty}.`,
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
	},
	{
		id: 59,
		name: 'Finders Keepers',
		summary: 'Cannot attack bugs that have person in clutches.',
		details: '',
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
	},
	{
		id: 61,
		name: 'Driller To C-4',
		summary: 'May only move to an area that another dwarf pings.',
		details:
			"Any dwarf may command any/all dwarves except for themselves. You may not ask someone to command you to go somewhere. Positioning is not very strict. You may mine minerals and kill things on the way to your target location and get there in your own time. (As long as you don't go too far out of the way) Once you reach the target location, you may do whatever you want but are confined to ~10m radius around the ping.",
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
	},
	{
		id: 63,
		name: "Won't Make It Through Customs",
		summary: 'Bring bough cones and tumbleweeds with you.',
		details: 'At least 1 per player, but more encouraged.',
		requirements: {
			mission: (m) => m.biome === BiomeType.hollowBough,
		},
		writtenRequirements: `Mission biome must be ${BiomeType.hollowBough}.`,
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
	},
	{
		id: 67,
		name: 'Rolling The Dice',
		summary: "All weapons, oc's and mods are chosen at random.",
		details: '',
		tags: [StratTag.loadout],
	},
	{
		id: 68,
		name: 'Avoid & Evade',
		summary: 'No killing stationary enemies.',
		details:
			"Stationary enemies include Cave Leech, Spitball Infector, Glyphid Brood Nexus, Stabber Vine, Deeptora Honeycomb, and Deeptora Bough Wasp Nest. You'll have to get creative with platform shields, tunnels, and drawing fire for your teammates. Exceptions can be made for The Caretaker, Korlok Tyrant-Weed, and all Rival Tech.",
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
	},
	{
		id: 70,
		name: 'Cutting Back on e-Waste',
		summary: 'Industrial sabotage no killing turrets',
		details: 'Exception can be made for ceiling turrets in the Caretaker room.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.industrialSabotage,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.industrialSabotage}.`,
	},
	{
		id: 71,
		name: 'Team Take Down',
		summary:
			'Everyone must contribute to death of large enemies. If you kill before everyone has contributed, the team must kill you.',
		details: '',
		tags: [StratTag.communication],
	},
	{
		id: 72,
		name: 'Hold Down The Fort',
		summary: 'Cannot move while in uplink/refuel.',
		details:
			'You may not press movement keys while uplink/refuel is in progress. You also may not create a bunker.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.salvageOperation,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.salvageOperation}.`,
	},
	{
		id: 73,
		name: 'Hoxxes Is Not Wheelchair Accessible',
		summary: "All scouts. Can't move while grounded.",
		details:
			'You may use movement keys to strafe while in the air, but should remain stationary while on the ground.',
		tags: [StratTag.class],
	},
	{
		id: 74,
		name: 'Aerial Support',
		summary: 'Gunners must stay on ziplines.',
		details:
			'Gunners can take some time to clear initial enemies and set up ziplines. Set up ASAP and get up. Must stay up until drop-pod is called. If killed, must get back on ASAP. Can go down for resupplies if needed.',
		requirements: {
			mission: (m) =>
				m.primary === PrimaryObjective.eggHunt ||
				m.primary === PrimaryObjective.pointExtraction ||
				m.primary === PrimaryObjective.onSiteRefining,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.eggHunt}, ${PrimaryObjective.pointExtraction}, or ${PrimaryObjective.onSiteRefining}.`,
	},
	{
		id: 75,
		name: 'The Floor Is Lava',
		summary: 'Must avoid touching cave floors.',
		details:
			'Everyone can only walk on platforms (or provided things: dozer, refinery mine-head, loot-bugs silicates harvesters, gem outcrops, geysers, etc.)',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary !== PrimaryObjective.miningExpedition,
		},
		writtenRequirements: `Mission primary objective must not be ${PrimaryObjective.miningExpedition}.`,
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
		summary: 'Everyone runs beast master, you may only engage in combat while your Steeve is alive.',
		details:
			'Beast master perk is required. When your Steeve dies, you must avoid all combat, but may still contribute to objectives by gathering resources. Additionally, you must pet Steeve every time you gain health.',
		tags: [StratTag.loadout],
	},
	{
		id: 78,
		name: 'Conscientious Objector',
		summary: 'One player is a conscientious objector (no killing).',
		details:
			'The Conscientious objector is encouraged to help out in any way they can, but must live a life of non-violence. Any loadout configuration which may cause accidental damage to enemies is not allowed (e.g. Thorns). Weapons can be used as utility (e.g. EPC mining, drilling/exploding tunnels, boomstick w/ special powder, hoverclock). There is backup order of Conscientious objectors who will not be able to kill enemies if the main Conscientious objector is killed, so it in your best interest to keep them alive. There will always be at least one living dwarf who is not allowed to kill enemies.',
	},
	{
		id: 79,
		name: 'All For One',
		summary: 'Private resupply pods.',
		details: 'The player who calls a resupply pod is the only one who can take ammo from it.',
	},
	{
		id: 80,
		name: 'Make Your Own Way',
		summary: "Cannot use other's traversal tools (including drill tunnels)",
		details: 'Does not include simple tunnels through dirt.',
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
	},
	{
		id: 85,
		name: 'Social Distancing',
		summary: 'Must stay away from your teammates.',
		details:
			'Must try to stay 15m away from all teammates at all times. You may only get close to revive. Social Distancing also applies to machine events.',
	},
	{
		id: 86,
		name: 'Water, Earth, Fire, Air',
		summary: 'Everyone does different elemental build.',
		details:
			"All dwarves must pick an element for their build and cannot have any means of applying elements that belong to someone else's build. Elements include fire, ice, electric, corrosive, poison, and radiation.",
		tags: [StratTag.loadout],
	},
	{
		id: 87,
		name: 'Save Your Ammunition!',
		summary: 'Standard grunts can only be killed by pick.',
		details: '',
		requirements: {
			mission: (m) => m.anomalies.includes(AnomalyType.criticalWeakness), // Or Skull Crusher Ale on tap... :shrug:
		},
		writtenRequirements: `Mission anomalies must include ${AnomalyType.criticalWeakness}.`,
	},
	{
		id: 88,
		name: 'Variety Is the Spice of Life',
		summary: 'No one can have the same perks.',
		details:
			'Perks should be claimed round-robin. Be selfish. Claim the perks you want most personally with regard for team synergy.',
		tags: [StratTag.loadout],
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
	},
	{
		id: 93,
		name: 'Hitching a Ride',
		summary: 'No using your own traversal tools.',
		details:
			'Driller may make a tunnel, but must backtrack and not use the tunnel after is it completed. Driller may use drills for combat. Engineer may not step on their own platforms. Scout may use their grappling hook to launch another player, but must return to where they started after. Driller may dig through dirt.',
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
			"You heard me. You must drill your own way to everything and can't travel any distance using the pre-generated cave. You can drill into existing caves for reconnaissance to spot minerals, but you'll have to find another way to get to them.",
		tags: [StratTag.time],
	},
	{
		id: 97,
		name: 'Monogamous Relationship',
		summary: 'Only one person can call molly.',
		details: '',
		requirements: {
			mission: (m) =>
				m.primary !== PrimaryObjective.pointExtraction && m.primary !== PrimaryObjective.onSiteRefining,
		},
		writtenRequirements: 'Mission must have Molly.',
	},
	{
		id: 98,
		name: 'A Long and Complex Strategy',
		summary: 'The next mission must be length 3, complexity 3.',
		details: '',
	},
	{
		id: 99,
		name: 'All The Groceries In One Trip',
		summary: 'Cannot deposit anything until the team has collectively completed secondary.',
		details:
			'"Collectively completed" entails the necessary amount to complete the secondary objective stored in the mineral bags of any number of dwarves. Gunk seeds can be gathered in one spot to be considered "collectively competed". If only 2 players and the secondary is dystrum, you\'ll have to use perks and/or armor upgrades such that you have 100 total bag capacity.',
		tags: [StratTag.time],
	},
	{
		id: 100,
		name: 'Endangered Species',
		summary: "Can't kill bulk detonators.",
		details: '',
	},
	{
		id: 101,
		name: 'Small Game Hunting',
		summary: "Can't kill big targets.",
		details: 'Cannot kill praetorians, oppressors, bulks, etc. Dreadnoughts may still be killed.', // TODO: Define "big targets"
		requirements: {
			mission: (m) =>
				m.primary !== PrimaryObjective.escortDuty &&
				m.primary !== PrimaryObjective.industrialSabotage &&
				m.primary !== PrimaryObjective.salvageOperation,
		},
		writtenRequirements: `Mission primary objective must not be ${PrimaryObjective.escortDuty}, ${PrimaryObjective.industrialSabotage}, or ${PrimaryObjective.salvageOperation}.`,
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
		summary: 'Only one person can mine for everyone but cannot deposit.',
		details:
			'The designated miner is the only one who is allowed to mine any resources. Their bag will likely be full before others are able to start getting minerals. The designated miner can deposit if the primary objective cannot be completed without their resources. Other players can still mine dirt/terrain and pick up resources that are not mined with a pickaxe. The designated miner must be the one to exhume large minerals such as jadiz, compressed gold, etc.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.miningExpedition,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.miningExpedition}.`,
	},
	{
		id: 104,
		name: 'Every Dwarf for Themselves',
		summary:
			'Can only attack enemies which are aggressive towards you. Your fellow dwarves must fend for themselves.',
		details: 'Enemies which are attacking or approaching you with reasonable suspicion may be attacked.',
	},
	{
		id: 105,
		name: 'Commander',
		summary: "One person in charge of everyone's actions.",
		details: 'Do a rig minigame to determine commander?',
		tags: [StratTag.communication],
	},
	{
		id: 106,
		name: 'Private Bunkers',
		summary: 'During fuel cells and uplinks, everyone stays in their own private bunker.',
		details:
			'During fuel cells and uplinks, each dwarf must stay in their own private bunker. You may not exit your bunker for any reason until the progress bar has been completed, though you may expand your bunker. At least one engineer is required.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.salvageOperation,
			team: (t) => t.dwarves.some((d) => d.type === DwarfType.engineer || d.type === DwarfType.flexible),
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.salvageOperation}, and at least one dwarf must play as ${DwarfType.engineer}.`,
	},
	{
		id: 107,
		name: 'To My Happy Place',
		summary: 'Bunker any time swarm music is playing.',
		details:
			'Whenever swarm music is playing, you must enter a bunker and remain there until the swarm music is over. You may not do anything (shoot bugs, mine, or revive) until you are in your bunker. At least one engineer is required.',
		tags: [StratTag.class],
		requirements: {
			team: (t) => t.dwarves.some((d) => d.type === DwarfType.engineer || d.type === DwarfType.flexible),
		},
		writtenRequirements: `At least one dwarf must play as ${DwarfType.engineer}.`,
	},
	{
		id: 108,
		name: 'The Best Offense',
		summary:
			'Everyone must play as engineer with gemini turrets and at least one of each: turret whip, EM discharge, turret arc.',
		details: '',
		tags: [StratTag.loadout, StratTag.class],
	},
	{
		id: 109,
		name: 'Designated Medic',
		summary: 'Determine a designated medic who is the only one who can revive.',
		details:
			'Before starting, an order is also determined for "back-up" medics if the primary medic is down. The highest ranking living medic is always the only player who can revive others.',
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
			'For Point Extraction, split the cave into equal-sized slices centered on mine-head. 1 player per zone. For Escort, split the map into port and starboard sides of Doretta. 1-2 players per zone.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.pointExtraction || m.primary === PrimaryObjective.escortDuty,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.pointExtraction} or ${PrimaryObjective.escortDuty}.`,
	},
	{
		id: 113,
		name: "That's Not My Job",
		summary: 'One person designated for each type of mineral.',
		details:
			'Each of the following minerals will be randomly assigned to a dwarf: morkite, nitra, secondary objective, (crafting minerals + gold + phazyonite). You may not collect or deposit anything not assigned to you. This includes shooting down gunk seeds or exhuming jadiz/enor pearls.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.miningExpedition,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.miningExpedition}.`,
	},
	{
		id: 114,
		name: 'Elephant in the Room',
		summary: 'If there is a haunted cave do it and no one mention the ghost.',
		details: 'Cannot ping the ghost or acknowledge its existence in text/voice chats.',
		requirements: {
			mission: (m) => m.warnings.includes(WarningType.hauntedCave),
		},
		writtenRequirements: `Mission warnings must include ${WarningType.hauntedCave}.`,
	},
	{
		id: 115,
		name: 'New High Score',
		summary: 'Do whatever mission has the highest warning bonus.',
		details: '',
	},
	{
		id: 116,
		name: 'Crunchy On the Outside, Gooey On the Inside',
		summary: "Must pickaxe q'ronars to death.",
		details: '',
		requirements: {
			mission: (m) => m.biome !== BiomeType.sandblastedCorridors,
		},
		writtenRequirements: `Mission biome must not be ${BiomeType.sandblastedCorridors}.`,
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
	},
	{
		id: 118,
		name: 'Cruelty-Free Slaughterhouse',
		summary: 'Everyone must pet loot-bugs before killing them.',
		details:
			'All players must pet loot-bugs before killing them, but you must kill them. No exceptions for hard-to-reach loot-bugs!',
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
		summary: 'Rock and stone after every large enemy killed.',
		details: '',
	},
	{
		id: 123,
		name: 'The Only Way To Be Born',
		summary: 'Only reload with born ready.',
		details: 'May not use weapons without a reload.',
		tags: [StratTag.loadout],
	},
	{
		id: 124,
		name: 'Fair Fights',
		summary: "Can't attack things others have already attacked.",
		details: "Doesn't apply to dreadnoughts.",
	},
	{
		id: 125,
		name: 'I Need A Medic Up Here',
		summary: 'Scouts job to die in inconvenient places.',
		details:
			'Scout must down themselves in an inconvenient place after (a) Every swarm (or b) After the primary, and again after the secondary objectives are completed. Scout must be revived.',
		tags: [StratTag.time],
	},
	{
		id: 126,
		name: 'Down to the Wire',
		summary: 'Cant start machine event until drop pod is on the way.',
		details: 'If a machine event is there, you must do it, but cannot start it until the drop pod has been called.',
		tags: [StratTag.queue],
	},
	{
		id: 127,
		name: 'Scrawny Green-beard',
		summary:
			'One player can have no upgrades, OCs, default weapons. Roll a dice. What you get is what level you pretend to be. One perk slot each.',
		details:
			'primary/traversal: 1,4,8,12,(16)\nsecondary/armor/support: 1,5,10,15,(20)\npickaxe: 4,8\ngrenade: 1,5,10\nOnly perks in the first three tiers',
		tags: [StratTag.loadout],
	},
	{
		id: 128,
		name: 'Take One Down, Pass It Around',
		summary: 'Everyone has to pass around heavy minerals before depositing.',
		details: 'Only once the heavy mineral has been held by all players may it be deposited. Includes gunk seeds.',
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
		},
		writtenRequirements: `Mission must contain heavy minerals or gunk seeds.`,
	},
	{
		id: 129,
		name: 'To The Fallen',
		summary: 'You must bury your dead and pay respects before reviving them.',
		details:
			'Dig a hole under downed players (and cover it if an engineer is alive). Have a funeral procession and pay respects before digging up and reviving the downed player.',
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
			'Each player may only revive a particular player. e.g. A revives B. B revives C. C revives D. D revives A. Order must be determined in advance.',
		requirements: {
			team: (t) => t.dwarves.length >= 3,
		},
		writtenRequirements: `Team must have 3 or more players.`,
	},
	{
		id: 132,
		name: 'Raising Livestock',
		summary: 'Minerals must be fed to loot-bugs before being picked up.',
		details:
			'Make your best effort to mine minerals with EPC, C4 or drills and not pick them up until they are eaten first. May want to bring more than 1 driller.',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.onSiteRefining,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.onSiteRefining}.`,
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
	},
	{
		id: 135,
		name: 'Med-kits',
		summary: 'Only one revive per resupply (max one at time).',
		details:
			"All players start with one imaginary med-kit. When you revive another player, your imaginary med-kit is consumed. You can only get another by resupplying. The maximum number of held imaginary med-kits is one per dwarf, so if you resupply when you already have one - you still just have one. If you're out of med-kits, you may not revive a player. If the only med-kits left are held by downed players, they may be revived but it will consume their med-kit. If all players are out of med-kits, the remaining players better stay alive and figure out how to call a resupply soon.",
	},
	{
		id: 136,
		name: "I'm Busy Here",
		summary: 'Cannot revive during swarm or boss/miniboss.',
		details:
			'If swarm music is playing or a boss bar is visible, players may not be revived. During escort duty, players may be revived during phases 2 and 4 of the Ommoran heartstone.',
	},
	{
		id: 137,
		name: 'Dwarfsicle',
		summary: 'Cannot unfreeze yourself.',
		details:
			'You must get a fellow dwarf to unfreeze you. You cannot contribute to the thawing process by pressing A or D. You may also not warm yourself up in hot springs or with fire damage.',
	},
	{
		id: 138,
		name: "Oh My Beard, It's Ugly!",
		summary: "Can't look at each other.",
		details:
			"Don't look at your fellow dwarves. Avoid having them visible on your screen unless 20m apart. If over 20m apart, avoid having them in or near your reticle. Make your best effort. If you violate one of the rules, you may comment on how ugly they are.",
		requirements: {
			mission: (m) => m.biome === BiomeType.glacialStrata,
		},
		writtenRequirements: `Mission biome must be ${BiomeType.glacialStrata}.`,
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
		name: '12 Peas In A Pod',
		summary: 'Gunk seeds can only be deposited in the drop pod.',
		details: 'The secondary objective must be completed.',
		tags: [StratTag.time],
		requirements: {
			mission: (m) => m.secondary === SecondaryObjective.gunkSeed,
		},
		writtenRequirements: `Mission secondary objective must be ${SecondaryObjective.gunkSeed}.`,
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
	},
	{
		id: 142,
		name: 'Spiderman',
		summary: 'Dreadnought fight while everyone is on ziplines.',
		details:
			'You may not dismount the zipline unless you are knocked down by a dreadnought attack. Exception may be made for a downed teammate, but you may not shoot while on the ground and must both return ASAP.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}.`,
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
		summary: 'No iw, dash, resupplier, or field medic, born ready.',
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
	},
	{
		id: 146,
		name: 'The Pit',
		summary: 'Perform all uplink/fuel cells in a deep pit.',
		details: 'Can be carved out with C4s or drilling. Must be at least 10m deep. Cannot be turned into a bunker.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.salvageOperation,
			team: (t) => t.dwarves.some((d) => d.type === DwarfType.driller || d.type === DwarfType.flexible),
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.salvageOperation}, and the team must have at least one driller.`,
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
		name: 'Slow But Steady',
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
	},
	{
		id: 151,
		name: 'Flashbang',
		summary: 'Swap F and G keybinds.',
		details:
			'Run grenades that are capable of friendly fire (HE grenades for driller, plasma bursters for engineer, and cryo grenades for scout).',
		tags: [StratTag.settings],
	},
	{
		id: 152,
		name: 'Fat Fingered',
		summary: 'Randomly re-mapped controls (non movement or pickaxe).',
		details:
			'Use random number generator to determine how to remap non-movement and non-mouse keybinds (1, 2, 3, 4, 5, Q, E, R, F, G, X, C, V, M, Ctrl).',
		tags: [StratTag.settings, StratTag.nausea],
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
	},
	{
		id: 155,
		name: 'Unfriendly Fire',
		summary: 'Settle your differences when friendly-fire occurs.',
		details:
			'If you shoot or are shot by a teammate, you and your teammate must engage in a death match without hesitation. Any amount of friendly fire counts. Both players are required to fight; one dwarf may not choose to not fight back.\nWhen in doubt, shoot them anyway.',
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
		summary: 'All players are scout. You must remain in the air as much as possible.',
		details:
			"Recommended to use hoverclock, boomstick w/ special powder, and/or hover boots if you're concerned you can't complete this challenge. You may take advantage of low gravity missions if there is one. You may make exceptions for actions that require you to be grounded such as resupplying, depositing, or uplinks/refueling.",
		tags: [StratTag.class],
	},
	{
		id: 159,
		name: 'Ant Raid',
		summary: 'Fight dreadnoughts in tunnels dug by hand/drill or previous dreadnoughts.',
		details: 'Recommended bringing at least 2 drillers.',
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}.`,
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
	},
	{
		id: 162,
		name: 'You Had One Job',
		summary: 'Can only satisfy your team role.',
		details:
			'e.g. Scout picks off high priority targets (large enemies, spitters) and bugs about to nip a dwarf, Driller handles fodder enemies like grunts and swarmers, etc.',
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
	},
	{
		id: 165,
		name: 'Nurse Molly',
		summary: 'Can only revive when molly is there.',
		details: 'Must have the M.U.L.E. sitting on a downed dwarf before they can be revived.',
		requirements: {
			mission: (m) =>
				m.primary !== PrimaryObjective.onSiteRefining && m.primary !== PrimaryObjective.pointExtraction,
		},
		writtenRequirements: 'Mission must have Molly.',
	},
	{
		id: 166,
		name: 'Elitist',
		summary: 'No killing elites.',
		details: 'Exceptions can be made for mactera.',
		requirements: {
			mission: (m) =>
				m.warnings.includes(WarningType.eliteThreat) &&
				m.primary !== PrimaryObjective.escortDuty &&
				m.primary !== PrimaryObjective.industrialSabotage &&
				m.primary !== PrimaryObjective.salvageOperation,
		},
		writtenRequirements: `Mission warnings must include ${WarningType.eliteThreat}, and mission primary objective must not be ${PrimaryObjective.escortDuty}, ${PrimaryObjective.industrialSabotage}, or ${PrimaryObjective.salvageOperation}.`,
	},
	{
		id: 167,
		name: 'Extended Mag',
		summary: 'Must empty both guns before reloading, then reload both before firing.',
		details: 'No drak, cryo cannon, EPC, wave cooker, minigun, shard diffractor, or born ready.',
		tags: [StratTag.loadout],
	},
	{
		id: 168,
		name: 'REALLY Make It Count',
		summary: '3/3 no resupply.',
		details:
			'You must do a 3-3 mission with no resupply. You may not call resupplies even to damage enemies. Broken resupply pods are allowed.',
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
	},
	{
		id: 171,
		name: 'The Silent Treatment',
		summary: 'No voice or text comms throughout the mission (incl external).',
		details:
			"You may use any other in-game communication methods (shouting, pinging, etc.) You may continue to use comms for non-mission related conversation. You may use use comms to get someone's attention for something in-game.",
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
		summary: 'Everyone run fat boy pgl with "nails and tape" and "proximity trigger".',
		details: '',
		tags: [StratTag.loadout],
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
			"Next time an OMEN tower machine event is discovered, no cheese strats may be employed to float above the radius pulse gun's lasers. This includes using Molly, platforms, or ziplines.",
		tags: [StratTag.queue],
	},
	{
		id: 178,
		name: 'Big Game Hunter',
		summary: 'One player is responsible for taking out all big targets.',
		details:
			'One dwarf is designated as the "Big Game Hunter". They are the only one who may take out praetorians, oppressors, or bulk detonators.',
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
		summary: 'One player is the "Dwarf King" and must be protected at all costs.',
		details:
			'One player is the "Dwarf King" and must be protected at all costs. The Dwarf King has no responsibilities for contributing to the objective and actively seeks out danger. If the Dwarf King is killed, whoever they deem to have failed them the most must be executed/suicided. The executed player is then revived and joins the King\'s Guard as a "new hire". The other guards are encouraged to mock the ("dead") ex-guard. The drop pod may not leave without the Dwarf King.',
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
		summary: 'Must do events while the drill-dozer is out.',
		details: 'Do any events after the dozer has been started but before completing the Ommoran heartstone.',
		tags: [StratTag.queue],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.escortDuty,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.escortDuty}.`,
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
		details:
			"You cannot leave the starting room until all dreadnoughts are dead. You must pop them using The Mole on gunner's coil gun.",
		tags: [StratTag.loadout],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}.`,
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
		details:
			'Fight dreadnoughts in spawn. Dig many holes straight down that are deep enough to get stuck. Any mix of drill-sized and pick-sized holes will suffice. Engineers are encouraged to cover manholes if their fellow dwarves fall in.',
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
			'Next time a tritilyte deposit is discovered, all nanite bombs must be passed between all dwarves before being thrown at the deposit.',
		tags: [StratTag.queue],
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
		summary: "Can't kill trawlers (sand sharks).",
		details: '',
		requirements: {
			mission: (m) => m.biome === BiomeType.sandblastedCorridors,
		},
		writtenRequirements: `Mission biome must be ${BiomeType.sandblastedCorridors}.`,
	},
	{
		id: 198,
		name: 'Just Like Me Mum',
		summary: 'Slow down dreadnought as much as possible.',
		details:
			'Combine sludge, electric dot, neuro-lasso, IFG, cwc slowdown, pheromone, neurotoxin, stun, and cryo to make dreadnoughts as slow as possible.',
		tags: [StratTag.loadout],
		requirements: {
			mission: (m) => m.primary === PrimaryObjective.elimination,
		},
		writtenRequirements: `Mission primary objective must be ${PrimaryObjective.elimination}.`,
	},
	{
		id: 199,
		name: 'Flyswatter',
		summary: 'Must only use melee to kill flying enemies',
		details: '',
	},
	{
		id: 200,
		name: 'Touched By An Angel',
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
	},
	{
		id: 201,
		name: 'Hide Yo Kids',
		summary:
			'The next Mactera Grabber cannot be attacked. You must let it grab and voluntarily release someone first.',
		details: '',
		tags: [StratTag.queue],
	},
	{
		id: 202,
		name: 'Where No Dwarf Has Gone Before',
		summary: 'You may only use traversal tools to reach a location another dwarf has already reached.',
		details:
			'For example, someone will have to pick and climb up to ledges, or drop down into chasms before another dwarf can use their traversal tools to make them more navigable. Can use traversal tools for non-traversal purposes (i.e. making a roof or drilling bugs)',
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
		summary: 'Everyone must swap classes and loadouts with another player.',
		details: '',
		tags: [StratTag.loadout],
	},
	{
		id: 206,
		name: 'Mission Speedrun Any%',
		summary: 'Perform the next mission as fast as possible.',
		details: 'Skip unnecessary minerals, push all buttons immediately, etc.',
	},
];
