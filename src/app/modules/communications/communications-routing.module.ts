import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxSearchComponent } from './box-search/box-search.component';
import { FilesSearchComponent } from './files-search/files-search.component';
import { InboxComponent } from './inbox/inbox.component';
import { OutboxComponent } from './outbox/outbox.component';
import { InboxAddComponent } from './inbox-add/inbox-add.component';
import { OutboxAddComponent } from './outbox-add/outbox-add.component';

const routes: Routes = [
  { path: '', redirectTo: 'Outbox', pathMatch: 'full' },
  { path: 'OutboxAdd', component: OutboxAddComponent },
  { path: 'InboxAdd', component: InboxAddComponent },
  { path: 'Outbox', component: OutboxComponent },
  { path: 'Inbox', component: InboxComponent },
  { path: 'OutInboxFiles', component: FilesSearchComponent },
  { path: 'OutInboxSearch', component: BoxSearchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationsRoutingModule {}
