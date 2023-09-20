import { v4 as uuidV4, v5 as uuidV5, validate } from 'uuid';

const NS = '68709af5-b9a3-45c2-9a34-8042ad2843e7';

/**
 * Randomly generates an optionally seeded UUID
 * @param seed - Seed which will deterministically generate UUID if provided
 * @returns - UUID
 */
export function getUUID(seed?: string) {
	if (seed === undefined) {
		return uuidV4();
	} else {
		return uuidV5(seed, NS);
	}
}

export function isUUID(s: string) {
	return validate(s);
}
