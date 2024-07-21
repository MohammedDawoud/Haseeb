import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationComponent } from './organization/organization.component';
import { ActionsComponent } from './actions/actions.component';
import { BackupComponent } from './backup/backup.component';
import { GroupsComponent } from './groups/groups.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'organization' },
  { path: 'organization', component: OrganizationComponent },
  { path: 'actions', component: ActionsComponent },
  { path: 'backup', component: BackupComponent },
  { path: 'users', component: UsersComponent },
  { path: 'groups', component: GroupsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlPanelRoutingModule {}
