import { DisplayedAchievement } from '../models/achievement.model';

export const byCompletionDateThenById = (a: DisplayedAchievement, b: DisplayedAchievement) =>
	(a.completedAt ?? 'z') > (b.completedAt ?? 'z')
		? -1
		: (a.completedAt ?? 'z') < (b.completedAt ?? 'z')
		? 1
		: a.id > b.id
		? 1
		: -1;
