import { Injectable } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { CROSS_TAB_SYNC_PREFIX, CrossTabSync, CrossTabSyncType } from 'src/app/models/local-storage.interface';
import { getUUID } from 'src/app/utilities/uuid.utils';

const POLLING_INTERVAL_MS = 25;

@Injectable({
	providedIn: 'root',
})
export class CrossTabSyncService {
	// Unique ID for this tab session
	private sessionId = getUUID();

	// Updates from other tabs
	public get tabSync$() {
		return this.tabSyncSubject.asObservable();
	}
	private tabSyncSubject: Subject<CrossTabSyncType> = new Subject();

	// Last update for each type
	private lastTabSync: Map<string, string | null> = new Map(
		// Init with presently cached data
		Object.values(CrossTabSyncType).map((t) => [getKey(t), localStorage.getItem(getKey(t))])
	);

	constructor() {
		interval(POLLING_INTERVAL_MS).subscribe(() => {
			for (let type of Object.values(CrossTabSyncType)) {
				const key = getKey(type);
				// Check for updates in localStorage
				const tabSyncString = localStorage.getItem(key);
				if (!tabSyncString) {
					return;
				}
				const tabSync: CrossTabSync = JSON.parse(tabSyncString);

				// Emit the update received from another tab
				if (tabSyncString !== this.lastTabSync.get(key) && tabSync.sessionId !== this.sessionId) {
					this.lastTabSync.set(key, tabSyncString);
					this.tabSyncSubject.next(tabSync.change);

					// Other tabs indicated a reload is necessary
					if (tabSync.change === CrossTabSyncType.forceReload) {
						location.reload();
					}
				}
			}
		});
	}

	// Pushes an update to localStorage to be read by other tabs
	postUpdate(change: CrossTabSyncType) {
		const update: CrossTabSync = { id: getUUID(), sessionId: this.sessionId, change };
		localStorage.setItem(getKey(change), JSON.stringify(update));
	}
}

// Helper function to generate prefixed cross-tab-sync key for localStorage
function getKey(t: CrossTabSyncType) {
	return `${CROSS_TAB_SYNC_PREFIX}-${t}`;
}
