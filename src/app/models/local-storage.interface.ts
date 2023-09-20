export enum StratKeys {
	settings = 'settings',
	queuedStrategies = 'queued-strategies',
	recentStrategies = 'recent-strategies',
	hasSeenWelcomeDialog = 'has-seen-welcome-dialog',
}

export enum AchievementKeys {
	hasSeenAchievementsWelcomeDialog = 'has-seen-achievements-welcome-dialog',
	progress = 'achievement-progress',
	completedAll = 'completed-all-achievements',
}

export const CROSS_TAB_SYNC_PREFIX = 'cross-tab-sync';

export enum CrossTabSyncType {
	achievementProgressUpdated = 'achievement-progress-updated',
	stratSettingsUpdated = 'strat-settings-updated',
	queuedStratsUpdated = 'queued-strats-updated',
	recentStratsUpdated = 'recent-strats-updated',
	forceReload = 'force-reload',
}

export interface CrossTabSync {
	id: string;
	sessionId: string;
	change: CrossTabSyncType;
}

export const queuedStrategiesVersion = 1;
