import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class HeaderControlsService {
	public infoButtonPressed$: Subject<void> = new Subject();
	public shareButtonPressed$: Subject<void> = new Subject();

	constructor() {}
}
