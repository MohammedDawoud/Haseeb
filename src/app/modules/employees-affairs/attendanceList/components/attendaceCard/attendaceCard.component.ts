import { MatDialog } from '@angular/material/dialog';
// import { attendanceDataService } from './../../../../services/adttendace.service';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { EmployeesDataComponent } from '../employeesData/employeesData.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AttendenceLocationService } from 'src/app/core/services/Employees-Services/attendence-location.service';

@Component({
  selector: 'app-attendaceCard',
  templateUrl: './attendaceCard.component.html',
  styleUrls: ['./attendaceCard.component.scss'],
})
export class AttendaceCardComponent implements OnInit {
  @Input() taskName: string = '';
  @Input() locationid: number = 0;
  @Input() employeeCount: number = 0;

  deleted!: boolean;
  // attendanceDataService = inject(attendanceDataService);

  constructor(
    private modalService: NgbModal,
    private _attendencelocation: AttendenceLocationService,
    private toast: ToastrService,
    private translate: TranslateService
    ,private router: Router
  ) {

  }

  closeResult = '';
  publicDataEmp:any=null;
  open(content: any, data?: any, type?: any,idRow?:any) {
    if(type=="showEmployees")
    {
      this.GetAllEmployeesByLocationId();
    }
    if(type=="deleteEmpLocation")
    {
      this.publicDataEmp=data;
    }
    if(type=="ConvertEmpLocation")
    {
      this.publicDataEmp=data;
      this.FillLocations();
    }
    if(type=="AddEmpLocation")
    {
      this.FillAllEmps();
    }
    var sizet="lg";
    sizet=type ? (type == 'delete' ? 'md' : 'xl') : 'lg';
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: sizet,
        centered: type ? (type == 'delete' ? true : false) : false,
        backdrop : 'static',
        keyboard : false
      })
      .result.then(
        (result: any) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any, type?: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  dialog = inject(MatDialog);
  openDialog() {
    this.dialog.open(EmployeesDataComponent);
  }
  ngOnInit() {
    //this.get

    this.deleted = false;
  }
  openEditlocation() {
    debugger
    console.log(this.locationid);
    this.router.navigate(['/employees/attendencelocationnew/'+this.locationid+'']);
  }

  confirmLocDelete() {
    this._attendencelocation.DeleteAttendenceLocation(this.locationid).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.deleted = true;
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  locEmployeesDataSourceTemp:any = [];
  locEmployeesDataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginatorLocation') paginatorLocation!: MatPaginator;

  LocationDisplayedColumns: string[] = [
    // 'select',
    'employeeName',
    'jobName',
    'attendenceLocationName',
    'departmentName',
    'operations',
  ];
  GetAllEmployeesByLocationId(){
    debugger
    this._attendencelocation.GetAllEmployeesByLocationId(this.locationid).subscribe(data=>{
        this.locEmployeesDataSource = new MatTableDataSource(data.result);
        this.locEmployeesDataSourceTemp=data.result;
        this.locEmployeesDataSourceTemp.paginator = this.paginatorLocation;
        this.locEmployeesDataSourceTemp.sort = this.sort;
        console.log(this.locEmployeesDataSourceTemp);
    });
  }


  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.locEmployeesDataSourceTemp.filter(function (d: any) {
      return (d.employeeName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.jobName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.attendenceLocationName?.trim().toLowerCase().indexOf(val) !== -1 || !val)
       || (d.departmentName?.trim().toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.locEmployeesDataSource = new MatTableDataSource(tempsource);
    this.locEmployeesDataSource.paginator = this.paginatorLocation;
    this.locEmployeesDataSource.sort = this.sort;
  }

  // selection = new SelectionModel<any>(true, []);
  // select: any = {
  //   selected: null,
  // };
  // /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.locEmployeesDataSource.data?.length;
  //   return numSelected === numRows;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // toggleAllRows() {
  //   if (this.isAllSelected()) {
  //     this.selection.clear();
  //     return;
  //   }
  //   this.selection.select(...this.locEmployeesDataSource.data);
  // }

  // /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: any): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
  //     row.position + 1
  //   }`;
  // }

  confirmDeleteEmpLocation(){
    this._attendencelocation.DeleteEmplocation(this.publicDataEmp.empId,this.locationid).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.GetAllEmployeesByLocationId();
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }

// EmpAllowObj:any={
//   allowallsite:false,
//   allowoutsidesite:false,
// }

  AllowEmployeesites(type:any,element:any){
    debugger
    var Check=false;
    if(type==1)Check=element.allowallsite;
    else Check=element.allowoutsidesite;

    this._attendencelocation.AllowEmployeesites(element.empId,Check,type).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.GetAllEmployeesByLocationId();
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }

  LocationSelect:any=null;
  LocationAllEmpList: any;
  FillLocations() {
    this._attendencelocation.FillAttendenceLocation().subscribe((data) => {
        this.LocationAllEmpList = data;
      });
  }
  ConvertEmpLocation(modal: any) { 
    debugger
    if (this.LocationSelect == null) {
      this.toast.error('من فضلك أختر موقع', 'رسالة');
      return;
    }
    this._attendencelocation.ConvertEmplocation(this.publicDataEmp.empId,this.publicDataEmp.locationId,this.LocationSelect).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          modal?.dismiss();
          this.GetAllEmployeesByLocationId();
          this.FillLocations();
          this.LocationSelect = null;
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }


  EmpSelect: any=null;
  AllEmpList: any;
  FillAllEmps() {
    this._attendencelocation.FillSelectEmployee().subscribe((data) => {
        this.AllEmpList = data;
      });
  }
  SaveEmpLocation(modal: any) { 
    if (this.EmpSelect == null) {
      this.toast.error('من فضلك أختر الموظف', 'رسالة');
      return;
    }
    this._attendencelocation.SaveEmplocation(this.EmpSelect,this.locationid).subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          modal?.dismiss();
          this.GetAllEmployeesByLocationId();
          this.FillAllEmps();
          this.EmpSelect = null;
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

}
