import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AchievementsComponent } from './components/achievements/achievements/achievements.component';
import { StratsComponent } from './components/strats/strats.component';

const routes: Routes = [
	{ path: 'strats', component: StratsComponent },
	{ path: 'achievements', component: AchievementsComponent },
	{ path: '**', redirectTo: 'strats' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
