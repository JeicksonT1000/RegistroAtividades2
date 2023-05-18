import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ActivitiesTimerComponent } from './components/activities-timer/activities-timer.component';
import { ActivityLogsComponent } from './components/activity-logs/activity-logs.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: LoginComponent },
  {
    path: 'registro-atividades',
    component: ActivityLogsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cronometro',
    component: ActivitiesTimerComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
