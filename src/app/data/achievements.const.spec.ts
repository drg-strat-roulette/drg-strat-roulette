import { cloneDeep } from 'lodash-es';
import { Achievement } from '../models/achievement.model';
import { validLowerInTitleCase } from '../utilities/general-functions.utils';
import { achievementsList } from './achievements.const';
import { isUUID } from '../utilities/uuid.utils';

describe('Achievement list', () => {
	let achievements: Achievement[] = [];

	beforeEach(() => {
		achievements = cloneDeep(achievementsList);
	});

	it('should have unique ids for each achievement', () => {
		const numUniqueIds = new Set(achievements.map((a) => a.id)).size;
		expect(numUniqueIds).toBe(achievements.length);
	});

	it('should have unique ids for each subTask', () => {
		for (const a of achievements) {
			const subTasks = a.subTasks ?? [];
			const numUniqueIds = new Set(subTasks.map((s) => s.id)).size;
			expect(numUniqueIds).toBe(subTasks.length);
		}
	});

	it('should have UUIDs for each subTask', () => {
		for (const a of achievements) {
			for (const s of a.subTasks ?? []) {
				expect(isUUID(s.id)).toBe(true);
			}
		}
	});

	it('should have UUIDs for each achievement', () => {
		for (const a of achievements) {
			expect(isUUID(a.id)).toBe(true);
		}
	});

	it('should have unique names for each achievement', () => {
		const numUniqueNames = new Set(achievements.map((a) => a.name)).size;
		expect(numUniqueNames).toBe(achievements.length);
	});

	it('should have unique descriptions for each achievement', () => {
		const numUniqueDescriptions = new Set(achievements.map((a) => a.description)).size;
		expect(numUniqueDescriptions).toBe(achievements.length);
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
			const desc = achievement.description;
			const startsWithCapital = desc[0] === desc[0].toUpperCase();
			const endsWithPeriod = desc[desc.length - 1] === '.';
			const endsWithParenAndHasPeriod = desc[desc.length - 1] === ')' && desc.includes('.');
			if (!startsWithCapital) console.error(`Achievement desc does not start with capital letter: "${desc}"`);
			if (!endsWithPeriod && !endsWithParenAndHasPeriod)
				console.error(`Achievement desc does not end with a period or paren: "${desc}"`);
			expect(startsWithCapital).toBeTrue();
			expect(endsWithPeriod || endsWithParenAndHasPeriod).toBeTrue();
		}
	});

	it('should spell out short numbers in achievement names and descriptions', () => {
		const exceptionWords = ['hazard', 'length', 'complexity', 'level'];
		const isShortNumber = (w: string) => /^\d+$/.test(w) && w.length === 1;
		const followsExceptionWord = (words: string[], i: number) =>
			i > 0 && exceptionWords.includes(words[i - 1].toLowerCase());
		for (const achievement of achievements) {
			const nameWords = achievement.name.split(' ');
			const descWords = achievement.description.split(' ');
			const shortNumberInName = nameWords.some((w, i) => isShortNumber(w) && !followsExceptionWord(nameWords, i));
			const shortNumberInDesc = descWords.some((w, i) => isShortNumber(w) && !followsExceptionWord(descWords, i));
			if (shortNumberInName) console.error(`[1-9] in name: "${achievement.name}"`);
			if (shortNumberInDesc) console.error(`[1-9] in description: "${achievement.description}"`);
			expect(shortNumberInName).toBeFalse();
			expect(shortNumberInDesc).toBeFalse();
		}
	});

	it('should have distinct IDs and Names for each subCheckbox', () => {
		const achievementsWithSubCheckboxes = achievements.filter((a) => a.subTasks);
		for (const achievement of achievementsWithSubCheckboxes) {
			const numUniqueIds = new Set(achievement?.subTasks?.map((a) => a.id)).size;
			const numUniqueNames = new Set(achievement?.subTasks?.map((a) => a.name)).size;
			expect(numUniqueIds).toBe(achievement.subTasks?.length ?? 0);
			expect(numUniqueNames).toBe(achievement.subTasks?.length ?? 0);
		}
	});

	it('should not have any Fandom links!', () => {
		for (const achievement of achievements) {
			expect(achievement.link?.url.toLowerCase()).not.toContain('fandom');
		}
	});

	it('should sum up to 420 total achievements in Deep Rock Galactic!', () => {
		expect(69 + achievements.length).toBe(420);
	});
});
