import { DisplayedAchievement } from '../models/achievement.interface';
import { getUUID } from '../utilities/uuid.utils';

export const MOCK_DISPLAYED_ACHIEVEMENT: DisplayedAchievement = {
	order: 0,
	id: getUUID(),
	display: true,
	name: 'MOCK DISPLAYED ACHIEVEMENT',
	description: 'MOCK DISPLAYED ACHIEVEMENT DESCRIPTION',
};
