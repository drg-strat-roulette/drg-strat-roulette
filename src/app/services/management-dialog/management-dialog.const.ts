export enum ManagementDialogConfigs {
	feedback,
	welcomeStrats,
	welcomeAchievements,
	achievementsCompleted,
}

export interface ManagementDialogConfig {
	title: string;
	text: string[];
	buttonText: string;
	signedManagement: boolean;
}

export const managementDialogConfigs: Map<ManagementDialogConfigs, ManagementDialogConfig> = new Map([
	[
		ManagementDialogConfigs.feedback,
		{
			title: 'We want to hear from you!',
			text: [
				`We're always looking for ways to improve this dwarven accomplishment program. It's hosted on a <a href="https://github.com/drg-strat-roulette/drg-strat-roulette.github.io" target="_blank">public GitHub repository</a>. There, you can <a href="https://github.com/drg-strat-roulette/drg-strat-roulette.github.io/issues" target="_blank">report issues</a>, or <a href="https://github.com/drg-strat-roulette/drg-strat-roulette.github.io/discussions" target="_blank">join in discussions</a>. Discussions are a great way to get in direct contact with management and your fellow miners. You can ask questions, share ideas or suggestions, give feedback, or simply share your experiences! If you want to give feedback without management knowing your identity, you can also send feedback anonymously through <a href="https://forms.gle/9G7Y3nQoa54X6kKi6" target="_blank">a Google Form</a>.`,
			],
			buttonText: 'Close',
			signedManagement: true,
		},
	],
	[
		ManagementDialogConfigs.welcomeStrats,
		{
			title: 'Attention, miner!',
			text: [
				`Before you embark on your next mission, make sure you check the settings to customize your challenge. You can select which types of strategies to avoid, which mission you're about to tackle, and which classes you and your team are ready to rock. Once you're done, hit the "Roll a strategy" button and see what fate has in store for you. A random strategy that matches your preferences will be assigned. Your objective is to complete the mission while following the strategy as closely as possible. You can share the strategy with your team by sending them the link, copying it to your clipboard, or shouting it out loud.`,
				`Some strategies have specific requirements, but other than that, there are no official rules to follow. You are expected to follow the strategy with honor and courage. Some strategies may require some level of "Scout's honor" (so don't be a leaf-lover!). Remember, the most important thing is to have fun - so feel free to bend the rules as you see fit. Now get to work, miner!`,
			],
			buttonText: 'Close',
			signedManagement: true,
		},
	],
	[
		ManagementDialogConfigs.welcomeAchievements,
		{
			title: 'Attention, miner!',
			text: [
				`This dwarven accomplishment program offers you 351 extra challenges to prove your worth to Deep Rock Galactic. This makes a total of 420 achievements if you've completed the 69 in the prior dwarven accomplishment program. Mark your achievements as you complete them and your progress will be recorded. Don't be a leaf-lover and rely on your previous accomplishments - start from scratch! Unless we say otherwise, you can do any challenge on any Hazard Level - but we expect you should face them on your regular difficulty level. And remember, if you prove your worth to Deep Rock Galactic, your efforts will be rewarded!`,
			],
			buttonText: 'Close',
			signedManagement: true,
		},
	],
	[
		ManagementDialogConfigs.achievementsCompleted,
		{
			title: "Congratulations, you've proved yourself an exceptional miner!",
			text: [
				`Through a truly astounding feat of dwarven valor - you've completed all achievements this dwarven accomplishment program has to offer! This is a rare and remarkable accomplishment that few others have ever accomplished. You've proven yourself to be a peerless legend of the mining industry; a master of exploration, combat, and teamwork. You have collected more minerals, killed more bugs, and drank more beers than most miners will in their entire careers. You have earned the respect and admiration of your fellow dwarves, and the gratitude of management. You are a shining example of what it means to be a part of Deep Rock Galactic.`,
				`You are the best of the best, miner. We look forward to your continued success. Rock and stone!`,
			],
			buttonText: 'Back to mining!',
			signedManagement: true,
		},
	],
]);
