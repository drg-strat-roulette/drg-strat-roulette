import { cloneDeep } from 'lodash-es';

/**
 * @param min - Lower bound of range
 * @param max - Upper bound of range
 * @returns A random number in the range [min, max)
 */
export function getRandomNumber(min: number, max: number) {
	if (min > max) {
		throw 'Invalid range';
	}
	return Math.random() * (max - min) + min;
}

/**
 * @param min - Lower bound of range
 * @param max - Upper bound of range
 * @returns A random integer in the range [min, max]
 */
export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	if (min > max) {
		throw 'Invalid range';
	}
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Selects multiple distinct items from a list
 * @param sourceList - List to select items from
 * @param num - Number of items to be selected
 * @returns - A list of the selected items
 */
export function selectMultipleDistinct<T>(sourceList: T[], num: number): T[] {
	if (sourceList.length < num) {
		throw 'Cannot select more items than are in the source list';
	}
	const list = cloneDeep(sourceList);
	const results: T[] = [];
	for (let i = 0; i < num; i++) {
		results.push(list.splice(getRandomInt(0, list.length - 1), 1)[0]);
	}
	return results;
}

/**
 * Takes an array of sub-arrays and returns every possible combination of 1 element chosen from each sub-array
 * @param lists - Array of sub-arrays to be selected from
 */
export function getAllCombinations<T>(lists: any[][]): T[][] {
	return lists.reduce((a, b) => a.reduce((r, v) => r.concat(b.map((w) => [].concat(v as any, w as any)) as any), []));
}
