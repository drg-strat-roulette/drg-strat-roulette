export interface Achievement {
	id: string;
	name: string;
	description: string;
	subTasks?: { id: string; name: string }[];
	countNeeded?: number;
	link?: { text: string; url: string };
	// category?: string; // Category or subAchievements or both?
}

export interface AchievementProgress {
	id: string;
	completedAt?: string;
	count?: number;
	subTasksCompleted?: string[];
}

export interface DisplayedAchievement extends AchievementProgress, Achievement {
	order: number;
	display: boolean;
}
