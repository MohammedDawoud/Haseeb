import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
import { GeneralAlertComponent } from './general-alert/general-alert.component';
import { EmployeeDataComponent } from './employee-data/employee-data.component';
import { StaffcontractsComponent } from './staffcontracts/staffcontracts.component';
import { StaffHolidaysComponent } from './staff-holidays/staff-holidays.component';
import { EmployeeLoanComponent } from './employee-loan/employee-loan.component';
import { PayrollMarchesComponent } from './payroll-marches/payroll-marches.component';
import { SalarySetupComponent } from './salary-setup/salary-setup.component';
import { AdvanceToEmployeesComponent } from './advance-to-employees/advance-to-employees.component';
import { CarMovementComponent } from './car-movement/car-movement.component';
import { EmployeesArchiveComponent } from './employees-archive/employees-archive.component';
import { AttendencelocationComponent } from './attendencelocation/attendencelocation.component';
import { AttendenceLocationListComponent } from './attendence-location-list/attendence-location-list.component';
import { AttendanceListComponent } from './attendanceList/attendanceList.component';
import { AttendencelocationnewComponent } from './attendencelocationnew/attendencelocationnew.component';
import { EditattendencelocationComponent } from './editattendencelocation/editattendencelocation.component';
import { EmployeePermissionsComponent } from './employee-permissions/employee-permissions.component';
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'generalAlert' },
  { path: 'generalAlert', component: GeneralAlertComponent },
  { path: 'employeeData', component: EmployeeDataComponent },
  { path: 'staffcontracts', component: StaffcontractsComponent },
  { path: 'staffHolidays', component: StaffHolidaysComponent },
  { path: 'EmployeeLoan', component: EmployeeLoanComponent },
  { path: 'PayrollMarches', component: PayrollMarchesComponent },
  { path: 'SalarySetup', component: SalarySetupComponent },
  { path: 'AdvanceToEmployees', component: AdvanceToEmployeesComponent },
  { path: 'CarMovement', component: CarMovementComponent },
  { path: 'EmployeesArchive', component: EmployeesArchiveComponent },
  {
    path: 'AttendanceAndDepartureOfEmployees',
    component: AttendanceAndDepartureOfEmployeesComponent,
  },
  { path: 'ManualAttendance', component: ManualAttendanceComponent },
  { path: 'ApplicationAttendance', component: ApplicationAttendanceComponent },
  { path: 'AbsenteeStaff', component: AbsenteeStaffComponent },
  { path: 'AbsenteesToday', component: AbsenteesTodayComponent },
  { path: 'LateEmployees', component: LateEmployeesComponent },
  { path: 'LateToday', component: LateTodayComponent },
  { path: 'EarlyExit', component: EarlyExitComponent },
  { path: 'NotLoggedOut', component: NotLoggedOutComponent },
  {
    path: 'AttendanceAndDeparture',
    component: AttendanceAndDepartureComponent,
  },
  {
    path: 'attendencelocation',
    component: AttendencelocationComponent,
  },
  {
    path: 'attendencelocationnew/:name',
    component: AttendencelocationnewComponent,
  },
  {
    path: 'attendence-location-list',
    component: AttendenceLocationListComponent,
  },
  {
    path: 'attendanceList',
    component: AttendanceListComponent,
  },
  {
    path: 'editattendencelocation',
    component: EditattendencelocationComponent,
  },
  {
    path: 'employee-permissions',
    component: EmployeePermissionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesAffairsRoutingModule {}
