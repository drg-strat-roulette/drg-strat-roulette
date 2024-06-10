/** Static information defining an achievement */
export interface Achievement {
	/** Achievement unique identifier */
	id: string;
	/** Friendly name */
	name: string;
	/** Description */
	description: string;
	/** List of sub-tasks which make up this achievement */
	subTasks?: {
		/** Sub-task unique identifier */
		id: string;
		/** Friendly name */
		name: string;
	}[];
	/** Number needed for achievement completion */
	countNeeded?: number;
	/** Link to provide relevant information */
	link?: {
		/** Link text to be displayed */
		text: string;
		/** URL link navigates to */
		url: string;
	};
}

/** Information stored to track achievement progress */
export interface AchievementProgress {
	/** Achievement unique identifier */
	id: string;
	/** ISO timestamp at which achievement was completed. `undefined` if not completed. */
	completedAt?: string;
	/** Number completed */
	count?: number;
	/** IDs of the completed sub-tasks */
	subTasksCompleted?: string[];
}

export interface DisplayedAchievement extends AchievementProgress, Achievement {
	/** Original index of achievement in source list. Used to maintain fixed order of incomplete achievements. */
	order: number;
	/** Whether or not the achievement should be displayed */
	display: boolean;
}

export interface RecentlyCompletedAchievement {
	/** Achievement which was recently completed */
	achievement: DisplayedAchievement;
	/** Function to be called when the RecentlyCompletedAchievement popup expires */
	kill: () => void;
	/** Function to be called if the RecentlyCompletedAchievement popup undo button is pressed */
	undo: () => void;
}
