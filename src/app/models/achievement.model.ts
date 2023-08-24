export interface Achievement {
	id: number;
	name: string;
	description: string;
	subCheckboxes?: { id: number; name: string }[];
	counter?: number;
	link?: { text: string; url: string }; // TODO: Display
	ignoreHazard?: boolean;
	// subAchievements?: number[];
	// category?: string; // Category or subAchievements or both?
}
