/** Keys used by Strategies page for interfacing with LocalStorage */
export enum StratKeys {
	settings = 'settings',
	queuedStrategies = 'queued-strategies',
	recentStrategies = 'recent-strategies',
	hasSeenWelcomeDialog = 'has-seen-welcome-dialog',
}

/** Keys used by Achievements page for interfacing with LocalStorage */
export enum AchievementKeys {
	hasSeenAchievementsWelcomeDialog = 'has-seen-achievements-welcome-dialog',
	progress = 'achievement-progress',
	completedAll = 'completed-all-achievements',
}

/** String pre-pended to all cross-tab-sync keys used in LocalStorage */
export const CROSS_TAB_SYNC_PREFIX = 'cross-tab-sync';

/** Types of information that are cross-tab synced */
export enum CrossTabSyncType {
	achievementProgressUpdated = 'achievement-progress-updated',
	stratSettingsUpdated = 'strat-settings-updated',
	queuedStratsUpdated = 'queued-strats-updated',
	recentStratsUpdated = 'recent-strats-updated',
	forceReload = 'force-reload',
}

/** Information sent in a cross-tab sync message */
export interface CrossTabSync {
	id: string;
	sessionId: string;
	change: CrossTabSyncType;
}

/** Current version of queued strategies (used to automatically delete data with old format) */
export const queuedStrategiesVersion = 1;
