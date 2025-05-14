import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgxPrintElementService } from 'ngx-print-element';
import { ToastrService } from 'ngx-toastr';
import { Permissions } from 'src/app/core/Classes/DomainObjects/Permissions';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AdvanceToEmployeeService } from 'src/app/core/services/Employees-Services/advance-to-employee.service';
import { EmployeePermissionsService } from 'src/app/core/services/Employees-Services/employee-permissions.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-permissions',
  templateUrl: './employee-permissions.component.html',
  styleUrls: ['./employee-permissions.component.scss'],
  providers: [DatePipe],
})
export class EmployeePermissionsComponent {
@ViewChild(DatatableComponent) table: DatatableComponent | any;

  isEditable: any = {};

  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'الاذونات',
      en: 'permissions',
    },
  };

  showDate = false;

  selectedUser: any;
  users: any;

  closeResult = '';

  displayedColumns: string[] = [
    'employeName',
    'vacationType',
    'vacationStatus',
    'manager',
    'from',
    'operations'
   
  ];

  dataSource: MatTableDataSource<any>;
  dataSourceWaitingVacation: MatTableDataSource<any>;
  dataSourceAcceptingVacation: MatTableDataSource<any>;

  displayedColumnsWaitingVacation: string[] = [
    'date',
    'employeeName',
    'vacationType',
    'discoundType',
    'startDate',
    'duration',
    'dicesion',
  ];

  displayedColumnsAcceptingVacation: string[] = [
    'date',
    'employeeName',
    'vacationType',
    'discoundType',
    'duration',
    'endDate',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalDetails: any = {
    id: null,
    employeeId: null,
    permissionType: null,
    date: null,
    from: null,
    to: null,
    reason: null,
    file: null,
    vacationbalance: null,
    discountamount: null,
  };

  data: any = {
    filter: {
      employeeId: null,
      vacationType: null,
      vacationStatus: null,
      startDate: null,
      endDate: null,
      date: null,
      isdiscount: null,
    },
  };

  vacationtoconvertadmin: any;
  vacationtodalete: any;
  vacationtoreturnwork: any;

  vacations: any;
  waitingVacation: any[] = [];
  acceptingVacation: any[] = [];
  typeselect: any;
  permissionstatusselect: any;
  employeeselect: any;
  employeeworkerselect: any;
  vacationBalance = 0;
  Salary = 0;
  vVacationDays = 0;
  VacationIsDiscount: any;
  lang: any = 'ar';
  userG: any = {};
  datePrintJournals: any = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
  logourl: any;
  public _perm: Permissions;

  constructor(
    private modalService: NgbModal,
    private _advaceofempservice: AdvanceToEmployeeService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private print: NgxPrintElementService,
    private api: RestApiService,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe,
    private _permissionservice: EmployeePermissionsService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.dataSourceWaitingVacation = new MatTableDataSource([{}]);
    this.dataSourceAcceptingVacation = new MatTableDataSource([{}]);

       this._perm = new Permissions();
   
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
    this.GetAllPermissions();
    this.fillvacationtype();
    this.FillSelectEmployeeWorkers();
    this.getemployeeselect();
    this.GetOrganizationData();
    this.permissionstatusselect = [
      { id: 1, name: ' تقديم طلب' },
      { id: 2, name: ' تم  تحويل الطلب الي الادارة' },
      { id: 3, name: ' تمت الموافقة علي الطلب' },
      { id: 4, name: ' تم رفض الطلب' },
    ];

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  withReason = false;
  savemodal:any;
  permissiontoconvertadmin:any;
  permissiontodalete:any;
  open(content: any, data?: any, type?: any, info?: any) {

    if(data && type=='saveperm'){
      this.savemodal=data;
    }
    if (data && type == 'Converttoadmin') {
      this.permissiontoconvertadmin = data.permissionId;
    }
    if (data && type == 'delete') {
      this.permissiontodalete = data.permissionId;
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: true,
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
       
      );
  }


  searchtext:any;
  employeeid:any;
  type:any;
  status:any;
  fromdate:any=null;
  todate:any=null;

  GetAllPermissions() {
debugger

      this._permissionservice.GetAllPermissions(this.employeeid??'',this.type??'',
        this.status??'',this.fromdate??'',this.todate??'', this.searchtext??'')
        .subscribe({
          next: (data: any) => {
          
            this.vacations = new MatTableDataSource(data);
            this.dataSource = new MatTableDataSource(this.vacations.filteredData);
            this.dataSource.paginator = this.paginator;
          },
          error: (error) => {
          },
        });
    }

    CheckDate(event: any) {
      if (event != null) {
        var from = this._sharedService.date_TO_String(event[0]);
        var to = this._sharedService.date_TO_String(event[1]);
        //this.RefreshData_ByDate(from,to);
        this.fromdate = from;
        this.todate= to;
        this.GetAllPermissions();
      } else {
        this.data.filter.DateFrom_P = '';
        this.data.filter.DateTo_P = '';
        //this.RefreshData();
      }
    }
  
    Checkfromdate() {
      //debugger;
      const today = new Date();
  
      // Extract the date part from the DateTime value
      const dateTimeDate = new Date(
        this.modalDetails.from.getFullYear(),
        this.modalDetails.from.getMonth(),
        this.modalDetails.from.getDate()
      );
  
      // Extract the date part from today's date
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
  
      if (this.withReason == false) {
        // Compare the date parts
        if (dateTimeDate.getTime() < todayDate.getTime()) {
          // if(this.modalDetails.from < new Date())
          // {
          this.modalDetails.from = '';
          this.toast.error('تاريخ البداية اصغر من تاريخ اليوم', 'رسالة');
          return;
        }
      }
      if (this.modalDetails.to != null) {
        const dateTimetoDate = new Date(
          this.modalDetails.to.getFullYear(),
          this.modalDetails.to.getMonth(),
          this.modalDetails.to.getDate()
        );
  
        if (dateTimeDate.getTime() > dateTimetoDate.getTime()) {
          this.modalDetails.from = '';
          this.toast.error('تاريخ البداية اكبر من تاريخ النهاية', 'رسالة');
          return;
        }
      }
    }
    Checktodate() {
      //debugger;
      const today = new Date();
  
      // Extract the date part from the DateTime value
      const dateTimeDate = new Date(
        this.modalDetails.from.getFullYear(),
        this.modalDetails.from.getMonth(),
        this.modalDetails.from.getDate()
      );
      const dateTimeDateto = new Date(
        this.modalDetails.to.getFullYear(),
        this.modalDetails.to.getMonth(),
        this.modalDetails.to.getDate()
      );
  
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
  
      if (this.withReason == false) {
        if (dateTimeDateto.getTime() < dateTimeDate.getTime()) {
          this.modalDetails.to = '';
          this.toast.error('تاريخ النهاية اصغر من تاريخ اليوم', 'رسالة');
          return;
        }
      }
      if (this.modalDetails.from != null) {
        if (dateTimeDateto.getTime() < dateTimeDate.getTime()) {
          this.modalDetails.to = '';
          this.toast.error('تاريخ البداية اكبر من تاريخ النهاية', 'رسالة');
          return;
        }
      }

    }

    getemployeeselect() {
      this._advaceofempservice.FillEmployeeSelect().subscribe((data) => {
  
        this.employeeselect = data;
      });
    }
    Permissiontypeselect:any;
    fillvacationtype() {
      //debugger;
      this._permissionservice.FillPermissionTypeSelect().subscribe((data) => {
        //debugger;
  
        this.Permissiontypeselect = data;
      });
    }

    FillSelectEmployeeWorkers() {
      //debugger;
      this._permissionservice.FillSelectEmployeeWorkers().subscribe((data) => {
        //debugger;
  
        this.employeeworkerselect = data;
      });
    }


    SavePermission(modal: any) {
        //debugger;
        if (
          this.modalDetails.employeeId == null ||
          this.modalDetails.permissionType == null ||
          this.modalDetails.date == null
        ) {
          this.toast.error('من فضلك اكمل البيانات', 'رسالة');
          return;
        }
         this._perm = new Permissions();
         this._perm.EmpId = this.modalDetails.employeeId;
        this._perm.PermissionId = 0;
        this._perm.TypeId = this.modalDetails.permissionType;
        this._perm.Date = this._sharedService.date_TO_String(
          this.modalDetails.date
        );
      
        this._perm.Status = 1;
        this._perm.Reason = this.modalDetails.reason;
    
        this._permissionservice
          .SavePermission(this._perm)
          .subscribe((result: any) => {
            if (result.statusCode == 200) {
              modal.dismiss();
              this.savemodal.dismiss();
              this.toast.success(
                this.translate.instant(result.reasonPhrase),
                this.translate.instant('Message')
              );
            }
            this.GetAllPermissions();
             
          });
      }

      ConvertToAdmin() {
        this._permissionservice
          .Updatepermission(this.permissiontoconvertadmin,2,'')
          .subscribe((result: any) => {
         
            if (result.statusCode == 200) {
              this.GetAllPermissions();
              this.toast.success(
                this.translate.instant(result.reasonPhrase),
                this.translate.instant('Message')
              );
            } else {
              this.toast.error(
                this.translate.instant(result.reasonPhrase),
                this.translate.instant('Message')
              );
            }
          });
      }

      delete() {
        this._permissionservice
          .DeletePermissions(this.permissiontodalete)
          .subscribe((result: any) => {
          
            if (result.statusCode == 200) {
              this.GetAllPermissions();
              this.toast.success(
                this.translate.instant(result.reasonPhrase),
                this.translate.instant('Message')
              );
            } else {
              this.toast.error(
                this.translate.instant(result.reasonPhrase),
                this.translate.instant('Message')
              );
            }
          });
      }


      printmodel: any = {
        employeeName: null,
        employeeJob: null,
        employeeNo: null,
        nationalitiId: null,
        branchName: null,
        type: null,
        timestr: null,
        status: null,
        acceptedUser: null,
        reason: null,
        from: null,
        to: null,
        date: null,
        isDiscount: null,
        acceptedDate: null,
      };
      refreshprintdata() {
        this.printmodel.employeeName = null;
        this.printmodel.employeeJob = null;
        this.printmodel.employeeNo = null;
        this.printmodel.nationalitiId = null;
        this.printmodel.branchName = null;
    
        this.printmodel.reason = null;
        this.printmodel.type = null;
        this.printmodel.timestr = null;
        this.printmodel.status = null;
        this.printmodel.acceptedUser = null;
    
        this.printmodel.from = null;
        this.printmodel.to = null;
        this.printmodel.date = null;
        this.printmodel.isDiscount = null;
        this.printmodel.acceptedDate = null;
      }
      setdatatoprint(data: any) {
        this.refreshprintdata();
        console.log(data);
        debugger;
        this.printmodel.employeeName = data.employeName;
        this.printmodel.employeeJob = data.employeeJob;
        this.printmodel.employeeNo = data.employeeNo;
        this.printmodel.nationalitiId = data.identityNo;
        this.printmodel.branchName = data.branchName;
    
        this.printmodel.reason = data.reason;
        this.printmodel.type = data.permissionTypeName;
        this.printmodel.status = data.statusName;
        this.printmodel.acceptedUser = data.acceptUser;
    
       
        this.printmodel.date = data.date;
        this.printmodel.acceptedDate = data.acceptedDate;
      }
      PrintVacation() {
        const timeoutDuration = 5000;
    
        setTimeout(() => {
          // Code to be executed after the timeout
          this.printDiv('reportpermission');
        }, timeoutDuration);
      }
      printDiv(id: any) {
        this.print.print(id, environment.printConfig);
      }
      GetOrganizationData() {
        this._sharedService.GetOrganizationData().subscribe((data) => {
          this.logourl = environment.PhotoURL + data.logoUrl;
        });
      }
}
