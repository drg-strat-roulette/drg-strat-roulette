import { Component } from '@angular/core';
import { strategies } from './data/strats.const';
import * as lodash from 'lodash';
import { Strategy, stratTagInfo, StratTagObject } from './models/strat.interface';
import { Dwarf, DwarfClass } from './models/team.interface';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'drg-strat-roulette';
	strat: Strategy | undefined;
	dwarves: Dwarf[] = [];
	dwarfClasses: DwarfClass[] = Object.values(DwarfClass);
	tags: StratTagObject[] = stratTagInfo.map((tagInfo) => ({
		...tagInfo,
		checked: true,
	}));
	settingsMenuCollapsed = false;
	specificMissions = false;

	rollStrat() {
		// Filter out strategies based on tags
		const excludedTags = this.tags.filter((tag) => !tag.checked).map((tag) => tag.type);
		let candidateStrats = strategies.filter((strat) => !strat.tags?.some((tag) => excludedTags.includes(tag)));

		// If dwarf names have not been properly filled out, auto-populate with some data
		this.dwarves.forEach((dwarf, i) => {
			dwarf.name = (dwarf.name ?? '').length === 0 ? `Dwarf #${i + 1}` : dwarf.name;
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
		this.dwarves.push({
			classes: Object.values(DwarfClass),
		});
	}

	removeDwarf(index: number) {
		this.dwarves.splice(index, 1);
	}
}
