import { DisplayedAchievement } from '../models/achievement.interface';

export const byCompletionDateThenByOrder = (a: DisplayedAchievement, b: DisplayedAchievement) =>
	(a.completedAt ?? 'z') > (b.completedAt ?? 'z')
		? -1
		: (a.completedAt ?? 'z') < (b.completedAt ?? 'z')
		? 1
		: a.order > b.order
		? 1
		: -1;
