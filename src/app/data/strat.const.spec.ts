import { cloneDeep, rest, words } from 'lodash-es';
import { Strategy } from '../models/strat.interface';
import { strategies } from './strats.const';

describe('Strategy list', () => {
	let strats: Strategy[] = [];
	beforeEach(() => {
		strats = cloneDeep(strategies);
	});
	describe('Strategy names and ids', () => {
		it('should have unique names for each strategy', () => {
			const numUniqueNames = new Set(strats.map((s) => s.name)).size;
			expect(numUniqueNames).toBe(strats.length);
		});

		it('should have unique ids for each strategy', () => {
			const numUniqueIds = new Set(strats.map((s) => s.id)).size;
			expect(numUniqueIds).toBe(strats.length);
		});

		it('should start with id=1 and count up from there', () => {
			const strategyIds = strats.map((s) => s.id);
			expect(Math.min(...strategyIds)).toBe(1);
			expect(Math.max(...strategyIds)).toBe(strats.length);
		});

		it('should be sorted by id', () => {
			const sortedStrategies = cloneDeep(strats).sort((a, b) => a.id - b.id);
			for (const [idx, strat] of strats.entries()) {
				expect(strat.id).toBe(sortedStrategies[idx].id);
			}
		});

		it('should have Capital Cased names for each strategy', () => {
			// Articles, conjunctions, and short prepositions should not be capitalized in titles (unless they're the first or last word)
			const validLower = ['a', 'an', 'the', 'and', 'but', 'for', 'or', 'nor', 'at', 'by', 'to', 'in', 'of', 'on'];
			for (const strat of strats) {
				const wordsInName = strat.name.replace(/[^a-z0-9 ]/gi, '').split(' ');
				for (const [idx, word] of wordsInName.entries()) {
					const firstLetter = word[0];
					if (firstLetter) {
						const shouldBeLower =
							idx !== 0 && idx !== wordsInName.length - 1 && validLower.includes(word.toLowerCase());
						const isLower = firstLetter !== firstLetter.toUpperCase();
						if (shouldBeLower !== isLower) console.error(strat.name);
						expect(shouldBeLower).toBe(isLower);
					}
				}
			}
		});
	});

	describe('Strategy requirements', () => {
		it('should have written requirements on all strategies with requirements', () => {
			for (const strat of strats) {
				if (strat.requirements) {
					expect(strat.writtenRequirements).toBeTruthy();
				}
			}
		});

		it('should have requirements containing the words "Dwarf" or "Dwarves" if there are team requirements', () => {
			for (const strat of strats) {
				if (strat.requirements?.team) {
					const containsDwarfOrDwarves =
						strat.writtenRequirements?.toLowerCase().includes('dwarf') ||
						strat.writtenRequirements?.toLowerCase().includes('dwarves');
					if (!containsDwarfOrDwarves) console.error(strat.name);
					expect(containsDwarfOrDwarves).toBeTrue();
				}
			}
		});

		it('should have requirements containing the word "Mission" if there are mission requirements', () => {
			for (const strat of strats) {
				if (strat.requirements?.mission) {
					const containsMission = strat.writtenRequirements?.toLowerCase().includes('mission');
					if (!containsMission) console.error(strat.name);
					expect(containsMission).toBeTrue();
				}
			}
		});

		it('should have a mission compatibility likelihood defined on all strategies with mission requirements', () => {
			for (const strat of strats) {
				if (strat.requirements?.mission) {
					expect(strat.missionReqChance).toBeDefined();
					expect(strat.missionReqChance).toBeGreaterThanOrEqual(0.01);
					expect(strat.missionReqChance).toBeLessThanOrEqual(1);
				}
			}
		});
	});
});
