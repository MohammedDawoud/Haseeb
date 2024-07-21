import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminProfileComponent } from '../dashboard/components/admin-profile/admin-profile.component';
import { GuidComponent } from './components/guid/guid.component';
import { SupportComponent } from './components/support/support.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { MessagesComponent } from './components/messages/messages.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'admin-profile', component: AdminProfileComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'support', component: SupportComponent },
  { path: 'guide', component: GuidComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
