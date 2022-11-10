import { Component } from '@angular/core';
import { strategies } from './data/strats.const';
import * as lodash from 'lodash';
import { Strategy, stratTagInfo, StratTagObject } from './models/strat.interface';
import { Dwarf, DwarfType } from './models/team.interface';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'drg-strat-roulette';
	strat: Strategy | undefined;
	dwarves: Dwarf[] = [];
	dwarfTypes: DwarfType[] = Object.values(DwarfType);
	tags: StratTagObject[] = stratTagInfo.map((tagInfo) => ({
		...tagInfo,
		checked: true,
	}));

	rollStrat() {
		// Filter out strategies based on tags
		const excludedTags = this.tags.filter((tag) => !tag.checked).map((tag) => tag.type);
		let candidateStrats = strategies.filter((strat) => !strat.tags?.some((tag) => excludedTags.includes(tag)));

		// If team details have not been properly filled out, auto-populate with some data
		this.dwarves.forEach((dwarf, i) => {
			dwarf.name = (dwarf.name ?? '').length === 0 ? `Dwarf #${i + 1}` : dwarf.name;
			dwarf.type = dwarf.type ?? DwarfType.flexible;
		});

		// Filter out strategies based on team details
		candidateStrats = candidateStrats.filter((strat) => {
			const func = strat.requirements?.team;
			if (func && this.dwarves.length > 0) {
				return func({ dwarves: this.dwarves });
			} else {
				return true;
			}
		});

		// Pick a random strategy from the candidate list
		this.strat = lodash.sample(candidateStrats);
	}

	addDwarf() {
		this.dwarves.push({});
	}

	removeDwarf(index: number) {
		this.dwarves.splice(index, 1);
	}
}