import { Component } from '@angular/core';
import { strategies } from './data/strats.const';
import * as lodash from 'lodash';
import { Strategy, stratTagInfo, StratTagObject } from './models/strat.interface';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'drg-strat-roulette';
	strat: Strategy | undefined;
	tags: StratTagObject[] = stratTagInfo.map((tagInfo) => ({
		...tagInfo,
		checked: true,
	}));

	rollStrat() {
		const excludedTags = this.tags.filter((tag) => !tag.checked).map((tag) => tag.type);
		const candidateStrats = strategies.filter((strat) => !strat.tags?.some((tag) => excludedTags.includes(tag)));
		this.strat = lodash.sample(candidateStrats);
	}
}
