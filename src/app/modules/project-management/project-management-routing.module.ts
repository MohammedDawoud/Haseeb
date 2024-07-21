import { ShowProjectSettingComponent } from './show-project-setting/show-project-setting.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersPriceComponent } from './offers-price/offers-price.component';
import { FollowProjectComponent } from './follow-project/follow-project.component';
import { FileUploaderCenterComponent } from './file-uploader-center/file-uploader-center.component';
import { PerformanceReportComponent } from './performance-report/performance-report.component';
import { ProjectCostComponent } from './project-cost/project-cost.component';
import { ProjectRequirementsComponent } from './project-requirements/project-requirements.component';
import { ProjectSettingComponent } from './project-setting/project-setting.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { ProjectsArchiveComponent } from './projects-archive/projects-archive.component';
import { ProjectsTasksReportComponent } from './projects-tasks-report/projects-tasks-report.component';
import { SupervisionsComponent } from './supervisions/supervisions.component';
import { TrackMissionsComponent } from './track-missions/track-missions.component';
import { UserProjectsComponent } from './user-projects/user-projects.component';
import { UserTasksComponent } from './user-tasks/user-tasks.component';
import { WorkOrdersComponent } from './work-orders/work-orders.component';
import { TrackProjectsComponent } from './track-projects/track-projects.component';
import { ProjectSettingRunningComponent } from './project-setting-running/project-setting-running.component';
import { FileUploaderCenterNewComponent } from './file-uploader-center-new/file-uploader-center-new.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'offers-price' },
  // { path: 'file-uploader-center', component: FileUploaderCenterComponent },
  { path: 'file-uploader-center-new', component: FileUploaderCenterNewComponent },
  { path: 'follow-project', component: FollowProjectComponent },
  { path: 'offers-price', component: OffersPriceComponent },
  { path: 'performance-report', component: PerformanceReportComponent },
  { path: 'project-cost', component: ProjectCostComponent },
  { path: 'project-requirements', component: ProjectRequirementsComponent },
  { path: 'project-setting', component: ProjectSettingComponent },
  { path: 'project-setting-running', component: ProjectSettingRunningComponent },
  { path: 'show-project-setting', component: ShowProjectSettingComponent },
  { path: 'project-status', component: ProjectStatusComponent },
  { path: 'project-archive', component: ProjectsArchiveComponent },
  { path: 'project-tasks-report', component: ProjectsTasksReportComponent },
  { path: 'supervisions', component: SupervisionsComponent },
  { path: 'track-missions', component: TrackMissionsComponent },
  { path: 'track-projects', component: TrackProjectsComponent },
  { path: 'user-projects', component: UserProjectsComponent },
  { path: 'user-tasks', component: UserTasksComponent },
  { path: 'work-orders', component: WorkOrdersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectManagementRoutingModule {}
