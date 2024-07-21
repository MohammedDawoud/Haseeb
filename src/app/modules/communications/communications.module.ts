import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunicationsRoutingModule } from './communications-routing.module';
import { InboxComponent } from './inbox/inbox.component';
import { InboxAddComponent } from './inbox-add/inbox-add.component';
import { OutboxAddComponent } from './outbox-add/outbox-add.component';
import { OutboxComponent } from './outbox/outbox.component';
import { BoxSearchComponent } from './box-search/box-search.component';
import { FilesSearchComponent } from './files-search/files-search.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InboxComponent,
    InboxAddComponent,
    OutboxAddComponent,
    OutboxComponent,
    BoxSearchComponent,
    FilesSearchComponent,
  ],
  imports: [
    CommonModule,
    CommunicationsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class CommunicationsModule {}
