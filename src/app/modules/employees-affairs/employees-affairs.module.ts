import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesAffairsRoutingModule } from './employees-affairs-routing.module';
import { AbsenteeStaffComponent } from './attendance-and-departure/statical-reports/absentee-staff/absentee-staff.component';
import { AbsenteesTodayComponent } from './attendance-and-departure/statical-reports/absentees-today/absentees-today.component';
import { LateEmployeesComponent } from './attendance-and-departure/statical-reports/late-employees/late-employees.component';
import { LateTodayComponent } from './attendance-and-departure/statical-reports/late-today/late-today.component';
import { EarlyExitComponent } from './attendance-and-departure/statical-reports/early-exit/early-exit.component';
import { NotLoggedOutComponent } from './attendance-and-departure/statical-reports/not-logged-out/not-logged-out.component';
import { AttendanceAndDepartureComponent } from './attendance-and-departure/statical-reports/attendance-and-departure/attendance-and-departure.component';
import { AttendanceAndDepartureOfEmployeesComponent } from './attendance-and-departure/attendance-and-departure-of-employees/attendance-and-departure-of-employees.component';
import { ManualAttendanceComponent } from './attendance-and-departure/manual-attendance/manual-attendance.component';
import { ApplicationAttendanceComponent } from './attendance-and-departure/application-attendance/application-attendance.component';
//import { GeneralAlertComponent } from './general-alert/general-alert.component';
import { EmployeeDataComponent } from './employee-data/employee-data.component';
import { StaffcontractsComponent } from './staffcontracts/staffcontracts.component';
import { StaffHolidaysComponent } from './staff-holidays/staff-holidays.component';
import { EmployeeLoanComponent } from './employee-loan/employee-loan.component';
import { PayrollMarchesComponent } from './payroll-marches/payroll-marches.component';
import { SalarySetupComponent } from './salary-setup/salary-setup.component';
import { AdvanceToEmployeesComponent } from './advance-to-employees/advance-to-employees.component';
import { CarMovementComponent } from './car-movement/car-movement.component';
import { EmployeesArchiveComponent } from './employees-archive/employees-archive.component';
// import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
// import { MatTableModule } from '@angular/material/table';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { MatInputModule } from '@angular/material/input';
// import { MatTabsModule } from '@angular/material/tabs';
// import { FileUploadModule } from '@iplab/ngx-file-upload';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { TranslateModule } from '@ngx-translate/core';
// import { NgApexchartsModule } from 'ng-apexcharts';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TreeviewModule } from 'ngx-treeview';

import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
// import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxHijriGregorianDatepickerModule } from 'ngx-hijri-gregorian-datepicker';
import { AgmCoreModule } from '@agm/core';
import { NgxGaugeModule } from 'ngx-gauge';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxEditorModule } from 'ngx-editor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
@NgModule({
  declarations: [
    AbsenteeStaffComponent,
    AbsenteesTodayComponent,
    LateEmployeesComponent,
    LateTodayComponent,
    EarlyExitComponent,
    NotLoggedOutComponent,
    AttendanceAndDepartureComponent,
    AttendanceAndDepartureOfEmployeesComponent,
    ManualAttendanceComponent,
    ApplicationAttendanceComponent,
    //GeneralAlertComponent,
    EmployeeDataComponent,
    StaffcontractsComponent,
    StaffHolidaysComponent,
    EmployeeLoanComponent,
    PayrollMarchesComponent,
    SalarySetupComponent,
    AdvanceToEmployeesComponent,
    CarMovementComponent,
    EmployeesArchiveComponent,
  ],
  imports: [
    CommonModule,
    EmployeesAffairsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule,

    TabsModule,
    MatTableModule,

    TranslateModule,
    NgSelectModule,
    FormsModule,
    NgxDatatableModule,
    PaginationModule,
    NgApexchartsModule,
    BsDatepickerModule,
    FileUploadModule,
    BsDropdownModule,
    TreeviewModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    NgxHijriGregorianDatepickerModule,
    AgmCoreModule,
    NgxGaugeModule,
    LeafletModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
  exports: [
    AbsenteeStaffComponent,
    AbsenteesTodayComponent,
    LateEmployeesComponent,
    LateTodayComponent,
    NgxEditorModule,
  ],
})
export class EmployeesAffairsModule {}
