import { cloneDeep } from 'lodash-es';
import { Achievement } from '../models/achievement.model';
import { validLowerInTitleCase } from '../utilities/general-functions.utils';
import { achievementsList } from './achievements.const';

describe('Achievement list', () => {
	let achievements: Achievement[] = [];
	beforeEach(() => {
		achievements = cloneDeep(achievementsList);
	});
	describe('Achievement names and ids', () => {
		it('should have unique names for each achievement', () => {
			const numUniqueNames = new Set(achievements.map((a) => a.name)).size;
			expect(numUniqueNames).toBe(achievements.length);
		});

		it('should have unique ids for each achievement', () => {
			const numUniqueIds = new Set(achievements.map((a) => a.id)).size;
			expect(numUniqueIds).toBe(achievements.length);
		});

		it('should start with id=1 and count up from there', () => {
			const achievementIds = achievements.map((a) => a.id);
			expect(Math.min(...achievementIds)).toBe(1);
			expect(Math.max(...achievementIds)).toBe(achievements.length);
		});

		it('should be sorted by id', () => {
			const sortedAchievements = cloneDeep(achievements).sort((a, b) => a.id - b.id);
			for (const [idx, strat] of achievements.entries()) {
				expect(strat.id).toBe(sortedAchievements[idx].id);
			}
		});

		it('should have Title Cased names for each achievement', () => {
			for (const achievement of achievements) {
				const wordsInName = achievement.name.replace(/[^a-z0-9 ]/gi, '').split(' ');
				for (const [idx, word] of wordsInName.entries()) {
					const firstLetter = word[0];
					if (firstLetter) {
						const shouldBeLower =
							idx !== 0 &&
							idx !== wordsInName.length - 1 &&
							validLowerInTitleCase.includes(word.toLowerCase());
						const isLower = firstLetter !== firstLetter.toUpperCase();
						if (shouldBeLower !== isLower)
							console.error(`Achievement: "${achievement.name}" is not Title Cased on word: "${word}"`);
						expect(shouldBeLower).toBe(isLower);
					}
				}
			}
		});

		it('should have descriptions that start with capital letters and end with periods', () => {
			for (const achievement of achievements) {
				const startsWithCapital = achievement.description[0] === achievement.description[0].toUpperCase();
				const endsWithPeriod = achievement.description[achievement.description.length - 1] === '.';
				if (!startsWithCapital)
					console.error(`Achievement desc does not start with capital letter: "${achievement.description}"`);
				if (!endsWithPeriod)
					console.error(`Achievement desc does not end with a period: "${achievement.description}"`);
				expect(startsWithCapital).toBeTrue();
				expect(endsWithPeriod).toBeTrue();
			}
		});

		xit('should sum up to 420 total achievements in Deep Rock Galactic!', () => {
			expect(69 + achievements.length).toBe(420);
		});
	});
});
