import {
	AnomalyType,
	BiomeType,
	PrimaryObjective,
	SecondaryObjective,
	WarningType,
} from '../models/missions.interface';

/*
 * Constants and helper functions for estimating the likelihood of mission requirements being met
 * - Many of these (perhaps falsely) assume that all possibilities are equally likely
 * - Anomaly/warning chances are based on a small sample size of data
 * - Precision is not super important, because reality will always be biased by player preference
 */

// Odds of a mission having an anomaly
const ANOMALY_CHANCE = 0.216;
export const SPECIFIC_ANOMALY_CHANCE = ANOMALY_CHANCE / Object.keys(AnomalyType).length;

// Odds of a mission having a (non-lithophage) warning
const WARNING_CHANCE = 0.279;
export const SPECIFIC_WARNING_CHANCE = WARNING_CHANCE / (Object.keys(WarningType).length - 1);

// Odds of a mission having a lithophage warning
export const LITHOPHAGE_WARNING_CHANCE = 0.171;

/**
 * @param n - The number of specific allowed primary objectives
 * @returns - The estimated likelihood that any given mission meets the requirements
 */
export function specificPrimaries(n: number) {
	return n / Object.keys(PrimaryObjective).length;
}

/**
 * @param n - The number of specific disallowed primary objectives
 * @returns - The estimated likelihood that any given mission meets the requirements
 */
export function specificNotPrimaries(n: number) {
	return (Object.keys(PrimaryObjective).length - n) / Object.keys(PrimaryObjective).length;
}

/**
 * @param n - The number of specific allowed secondary objectives
 * @returns - The estimated likelihood that any given mission meets the requirements
 */
export function specificSecondaries(n: number) {
	return n / Object.keys(SecondaryObjective).length;
}

/**
 * @param n - The number of specific disallowed secondary objectives
 * @returns - The estimated likelihood that any given mission meets the requirements
 */
export function specificNotSecondaries(n: number) {
	return (Object.keys(SecondaryObjective).length - n) / Object.keys(SecondaryObjective).length;
}

/**
 * @param n - The number of specific allowed biomes
 * @returns - The estimated likelihood that any given mission meets the requirements
 */
export function specificBiomes(n: number) {
	return n / Object.keys(BiomeType).length;
}

/**
 * @param n - The number of specific disallowed biomes
 * @returns - The estimated likelihood that any given mission meets the requirements
 */
export function specificNotBiomes(n: number) {
	return (Object.keys(BiomeType).length - n) / Object.keys(BiomeType).length;
}

/**
 * @param numbers - A list of independent odds
 * @returns - The likelihood of any one of the input odds being met
 */
export function mustMeetAny(...numbers: number[]) {
	if (numbers.length === 0) console.error('No numbers were provided');
	if (numbers.some((n) => n > 1 || n < 0)) console.error('Numbers must be within range [0, 1]');
	return numbers.reduce((a, b) => a + b - a * b);
}

/**
 * @param numbers - A list of independent odds
 * @returns - The likelihood of all of the input odds being met
 */
export function mustMeetAll(...numbers: number[]) {
	if (numbers.length === 0) console.error('No numbers were provided');
	if (numbers.some((n) => n > 1 || n < 0)) console.error('Numbers must be within range [0, 1]');
	return numbers.reduce((a, b) => a * b, 1);
}
