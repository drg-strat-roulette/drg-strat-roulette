export interface Achievement {
	id: number;
	name: string;
	description: string;
	subTasks?: { id: number; name: string }[];
	countNeeded?: number;
	link?: { text: string; url: string };
	// category?: string; // Category or subAchievements or both?
}

export interface AchievementProgress {
	id: number;
	completedAt?: string;
	count?: number;
	subTasksCompleted?: number[];
}

export interface DisplayedAchievement extends AchievementProgress, Achievement {
	display: boolean;
}
