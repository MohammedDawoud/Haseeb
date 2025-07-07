import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGaugeModule } from 'ngx-gauge';

import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { OffersPriceComponent } from './offers-price/offers-price.component';
import { TrackProjectsComponent } from './track-projects/track-projects.component';
import { TrackMissionsComponent } from './track-missions/track-missions.component';
import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { ProjectSettingComponent } from './project-setting/project-setting.component';
import { ProjectRequirementsComponent } from './project-requirements/project-requirements.component';
import { FileUploaderCenterComponent } from './file-uploader-center/file-uploader-center.component';
import { ProjectsArchiveComponent } from './projects-archive/projects-archive.component';
//import { SupervisionsComponent } from './supervisions/supervisions.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { FollowProjectComponent } from './follow-project/follow-project.component';
import { PerformanceReportComponent } from './performance-report/performance-report.component';
import { UserProjectsComponent } from './user-projects/user-projects.component';
import { UserTasksComponent } from './user-tasks/user-tasks.component';
import { ProjectsTasksReportComponent } from './projects-tasks-report/projects-tasks-report.component';
import { ProjectCostComponent } from './project-cost/project-cost.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TreeNgxModule } from 'tree-ngx';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
//import { ProjectDetailsComponent } from './track-projects/project-details/project-details.component';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';
import { AgmCoreModule } from '@agm/core';
import { GoDiagramComponent } from './gojsDiagram/go-diagram/go-diagram.component';
import { ProjectSettingRunningComponent } from './project-setting-running/project-setting-running.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ShowProjectSettingComponent } from './show-project-setting/show-project-setting.component';
import { FileUploaderCenterNewComponent } from './file-uploader-center-new/file-uploader-center-new.component';
import { NgOtpInputModule } from 'ng-otp-input';


@NgModule({
  declarations: [
    OffersPriceComponent,
    TrackProjectsComponent,
    TrackMissionsComponent,
    WorkOrdersComponent,
    ProjectSettingComponent,
    ProjectRequirementsComponent,
    FileUploaderCenterComponent,
    ProjectsArchiveComponent,
    //SupervisionsComponent,
    ProjectStatusComponent,
    FollowProjectComponent,
    PerformanceReportComponent,
    UserProjectsComponent,
    UserTasksComponent,
    ProjectsTasksReportComponent,
    ProjectCostComponent,
    //ProjectDetailsComponent,
    GoDiagramComponent,
    ProjectSettingRunningComponent,
    ShowProjectSettingComponent,
    FileUploaderCenterNewComponent
  ],
  imports: [
    CommonModule,
    ProjectManagementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    MatIconModule,
    MatRadioModule,
    NgbModule,
    MatProgressBarModule,
    ModalModule,
    TreeNgxModule,
    TabsModule,
    TimepickerModule,
    NgApexchartsModule,
    BsDropdownModule,
    MatStepperModule,
    NgxHijriGregorianDatepickerModule,
    NgxGaugeModule,
    AgmCoreModule,
    DragDropModule,
    NgOtpInputModule,
    

  ],
})
export class ProjectManagementModule {}
