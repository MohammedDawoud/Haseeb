import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AdvanceToEmployeeService } from 'src/app/core/services/Employees-Services/advance-to-employee.service';
import { StaffholidayServiceService } from 'src/app/core/services/Employees-Services/staffholiday-service.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { VacationVM } from 'src/app/core/Classes/ViewModels/vacationVM';
import { ToastrService } from 'ngx-toastr';
import { Vacation } from 'src/app/core/Classes/DomainObjects/vacations';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-staff-holidays',
  templateUrl: './staff-holidays.component.html',
  styleUrls: ['./staff-holidays.component.scss'],
  providers: [DatePipe],
})
export class StaffHolidaysComponent implements OnInit {
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
      ar: 'الإجازات',
      en: 'Vacations',
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
    'to',
    'deductionFromSalary',
    'amount',
    'operations',
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
    vacationType: null,
    date: null,
    from: null,
    to: null,
    discound: null,
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
  vacationtypeselect: any;
  vacationstatusselect: any;
  employeeselect: any;
  employeeworkerselect: any;
  vacationBalance = 0;
  Salary = 0;
  vVacationDays = 0;
  VacationIsDiscount: any;
  public _vacationVM: VacationVM;
  public _vacation: Vacation;
  lang: any = 'ar';
  userG: any = {};
  datePrintJournals: any = this.datePipe.transform(new Date(), 'YYYY-MM-dd');
  logourl: any;

  constructor(
    private modalService: NgbModal,
    private _advaceofempservice: AdvanceToEmployeeService,
    private _staffholidayservice: StaffholidayServiceService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private print: NgxPrintElementService,
    private api: RestApiService,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this.dataSourceWaitingVacation = new MatTableDataSource([{}]);
    this.dataSourceAcceptingVacation = new MatTableDataSource([{}]);

    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    this._vacationVM = new VacationVM();
    this._vacation = new Vacation();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
  }

  getemployeeselect() {
    debugger;
    this._advaceofempservice.FillEmployeeSelect().subscribe((data) => {
      debugger;

      this.employeeselect = data;
    });
  }
  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }

  FillSelectEmployeeWorkers() {
    debugger;
    this._staffholidayservice.FillSelectEmployeeWorkers().subscribe((data) => {
      debugger;

      this.employeeworkerselect = data;
    });
  }
  Getemployeebyid() {
    this._staffholidayservice
      .GetEmployeeById(this.modalDetails.employeeId)
      .subscribe((data) => {
        debugger;
        if (data.result.dawamId == 0) {
          this.toast.error('يرجي ضبط دوام الموظف', 'رسالة');
        } else {
          this.vacationBalance =
            data.result.vacationEndCount == null
              ? 0
              : data.result.vacationEndCount;
          this.Salary = data.result.salary == null ? 0 : data.result.salary;
        }
      });
  }

  GetNetVacationDays(pVacationBalance: any, from: any, to: any) {
    this._staffholidayservice
      .GetNetVacationDays(
        from,
        to,
        this.modalDetails.employeeId,
        this.modalDetails.vacationType
      )
      .subscribe((data) => {
        debugger;
        this.vVacationDays = data;
        if (this.vVacationDays > 0) {
          if (this.vVacationDays > pVacationBalance || pVacationBalance == 0) {
            //$('input#IsDiscounttxt').prop('disabled', true);
            //$('input#IsDiscounttxt').prop('checked', true);
            //$('input#IsDiscounttxt').change();
            if (pVacationBalance == 0 || pVacationBalance == null) {
              this.modalDetails.vacationbalance = 0;
              this.toast.error('المستخدم ليس لديه رصيد إجازات مستحق ', 'رسالة');
            } else {
              this.toast.error(
                'رصيد إجازات الموظف لا تكفي أيام الإجازات المطلوبة وهي  ' +
                  this.vVacationDays +
                  ' و يخصم المتبقي من الإجازة من مرتب الموظف',
                'رسالة'
              );

              this.modalDetails.discound = false;
            }
            this.modalDetails.discound = true;
            this.isdiscountchange();
            // this.modalDetails.discountamount=
          } else {
            this.modalDetails.discound = false;
            this.modalDetails.vacationbalance = '0';
            this.modalDetails.discountamount = '';
            this.isdiscountchange();
          }
        }
      });
  }

  isdiscountchange() {
    debugger;

    if (this.modalDetails.discound == true) {
      this.modalDetails.vacationbalance = null;
      let SalaryDiscount = 0;
      if (this.Salary > 0) {
        if (this.vVacationDays > this.vacationBalance) {
          //حالة الخصم من المرتب إجبارية
          SalaryDiscount =
            (this.vVacationDays - this.vacationBalance) * (this.Salary / 30);
          this.modalDetails.discountamount = SalaryDiscount.toFixed(2);
          this.VacationIsDiscount = 0;

          if (this.vacationBalance > 0) {
            this.modalDetails.vacationbalance = this.vacationBalance;
          }
        } else {
          // حالة الخصم إختيارية
          SalaryDiscount = this.vVacationDays * (this.Salary / 30);
          this.modalDetails.discountamount = SalaryDiscount.toFixed(2);
          this.VacationIsDiscount = 1;
          this.modalDetails.vacationbalance = null;
        }
      }
    } else {
      this.modalDetails.discountamount = null;
      this.VacationIsDiscount = 0;
      if (this.vacationBalance == 0 || this.vacationBalance == null) {
        this.modalDetails.vacationbalance = '0';
      } else {
        this.modalDetails.vacationbalance = this.vVacationDays;
      }
    }
  }

  fillvacationtype() {
    debugger;
    this._staffholidayservice.fillvacationtype().subscribe((data) => {
      debugger;

      this.vacationtypeselect = data;
    });
  }

  SaveVacationWorkers(modal: any) {
    debugger;
    if (
      this.modalDetails.vacationType == null ||
      this.modalDetails.from == null ||
      this.modalDetails.employeeId == null ||
      this.modalDetails.to == null ||
      this.modalDetails.date == null
    ) {
      this.toast.error('من فضلك اكمل البيانات', 'رسالة');
      return;
    }
    if (
      this.modalDetails.discound == false &&
      this.modalDetails.vacationbalance == 0
    ) {
      this.toast.error('يرجي اختيار خصم من الراتب ', 'رسالة');
      return;
    }
    this._vacation = new Vacation();
    this._vacation.employeeId = this.modalDetails.employeeId;
    this._vacation.vacationId = 0;
    this._vacation.vacationTypeId = this.modalDetails.vacationType;
    this._vacation.startDate = this._sharedService.date_TO_String(
      this.modalDetails.from
    );
    this._vacation.endDate = this._sharedService.date_TO_String(
      this.modalDetails.to
    );
    this._vacation.date = this._sharedService.date_TO_String(
      this.modalDetails.date
    );
    this._vacation.vacationStatus = 1;
    this._vacation.isDiscount = this.modalDetails.discound;

    if (this.modalDetails.discound == true) {
      this._vacation.discountAmount = this.modalDetails.discountamount;
    }
    debugger;
    this._staffholidayservice
      .SaveVacationWorkers(this._vacation)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          modal.dismiss();
          debugger;
          if (this.control?.value[0] != null) {
            const formData = new FormData();

            formData.append('postedFiles', this.control?.value[0]);
            formData.append('VacationId', result.returnedParm.toString());

            this._staffholidayservice
              .UploadVacationImage(formData)
              .subscribe((result) => {
                if (result.statusCode == 200) {
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
          this.GetAllVacationsSearch(0);
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
  ConvertToAdmin() {
    this._staffholidayservice
      .UpdateDecisionType_V(this.vacationtoconvertadmin)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetAllVacationsSearch(0);
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

  returntowork() {
    this._staffholidayservice
      .UpdateBackToWork_V(this.vacationtoreturnwork)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetAllVacationsSearch(0);
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
    this._staffholidayservice
      .DeleteVacation(this.vacationtodalete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetAllVacationsSearch(0);
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

  GetAllVacationsSearch(issearched: any) {
    debugger;
    this._vacationVM = new VacationVM();
    this._vacationVM.employeeId = this.data.filter.employeeId;
    this._vacationVM.vacationTypeId = this.data.filter.vacationType;
    this._vacationVM.startDate = this.data.filter.startDate;
    this._vacationVM.endDate = this.data.filter.endDate;
    this._vacationVM.vacationStatus = this.data.filter.vacationStatus;
    this._vacationVM.isDiscount = this.data.filter.isdiscount;

    if (issearched == 1) {
      this._vacationVM.isSearch = true;
    } else {
      this._vacationVM.isSearch = false;
    }
    this._staffholidayservice
      .GetAllVacationsSearch(this._vacationVM)
      .subscribe({
        next: (data: any) => {
          // assign data to table
          debugger;
          console.log(data.result);
          this.vacations = new MatTableDataSource(data.result);
          this.dataSource = new MatTableDataSource(this.vacations.filteredData);
          this.dataSource.paginator = this.paginator;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  search: any;
  GetAllVacationsw() {
    debugger;
    this.search = '';
    this._staffholidayservice
      .GetAllVacationsw(this.search)
      .subscribe((data) => {
        debugger;
        console.log(data);
        for (const item of data.result) {
          if (item.vacationStatus == 2) {
            this.acceptingVacation.push(item);
            this.dataSourceAcceptingVacation = new MatTableDataSource(
              this.acceptingVacation
            );
          } else if (item.vacationStatus == 3) {
          } else {
            this.waitingVacation.push(item);
            this.dataSourceWaitingVacation = new MatTableDataSource(
              this.waitingVacation
            );
          }

          console.log(item);
        }
        console.log(this.acceptingVacation);
        console.log(this.waitingVacation);
      });
  }

  ngOnInit(): void {
    this.getemployeeselect();
    this.fillvacationtype();
    this.GetAllVacationsSearch(0);
    this.GetOrganizationData();
    this.vacationstatusselect = [
      { id: 1, name: ' تقديم طلب' },
      { id: 2, name: ' تم الموافقة علي الطلب' },
      { id: 3, name: ' رفض الطلب' },
      { id: 4, name: ' مراجعة' },
      { id: 5, name: ' تاجيل' },
    ];

    this.GetAllVacationsw();
  }

  withReason = false;
  open(content: any, data?: any, type?: any, info?: any) {
    if (data && type == 'edit') {
      this.modalDetails = data;
      this.modalDetails['id'] = '1';
    }
    this.FillSelectEmployeeWorkers();
    if (data && type == 'Converttoadmin') {
      this.vacationtoconvertadmin = data.vacationId;
    }
    if (data && type == 'returnwork') {
      this.vacationtoreturnwork = data.vacationId;
    }
    if (data && type == 'delete') {
      this.vacationtodalete = data.vacationId;
    }

    if (type == 'withreason') {
      this.withReason = true;
    } else {
      this.withReason = false;
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
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any, type?: any): string {
    this.modalDetails = {
      id: null,
      employeeName: null,
      vacationType: null,
      date: null,
      from: null,
      to: null,
      discound: null,
      file: null,
    };

    this.control.clear();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // delete
  confirm() {}
  downloadFile(data: any) {
    var link = environment.PhotoURL + data;
    window.open(link, '_blank');
  }

  EditVacationRequest() {
    console.log(this.modalDetails);
  }
  AddVacationRequest() {
    console.log(this.modalDetails);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // upload img ]
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public readonly control = new FileUploadControl(
    {
      listVisible: true,
      // accept: ['image/*'],
      discardInvalid: true,
      multiple: false,
    },
    [
      FileUploadValidators.accept(['image/*']),
      FileUploadValidators.filesLimit(1),
    ]
  );
  private subscription?: Subscription;

  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => this.uploadedFile.next(e.target.result);
      fr.readAsDataURL(file);
    } else {
      this.uploadedFile.next('');
    }
  }

  CheckDate(event: any) {
    if (event != null) {
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.data.filter.startDate = from;
      this.data.filter.endDate = to;
      this.GetAllVacationsSearch(1);
    } else {
      this.data.filter.DateFrom_P = '';
      this.data.filter.DateTo_P = '';
      //this.RefreshData();
    }
  }

  Checkfromdate() {
    debugger;
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
    debugger;
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
    if (this.modalDetails.employeeId == null) {
      this.modalDetails.to = '';
      this.toast.error('اختر الموظف', 'رسالة');
      return;
    }

    if (this.modalDetails.vacationType == null) {
      this.modalDetails.to = '';
      this.toast.error('اخترنوع الاجازه', 'رسالة');
    }
    this.GetNetVacationDays(
      this.vacationBalance,
      this._sharedService.date_TO_String(this.modalDetails.from),
      this._sharedService.date_TO_String(this.modalDetails.to)
    );
  }
  printmodel: any = {
    employeeName: null,
    employeeJob: null,
    employeeNo: null,
    nationalitiId: null,
    branchName: null,
    vacatuinType: null,
    timestr: null,
    status: null,
    acceptedUser: null,
    vacationReason: null,
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

    this.printmodel.vacationReason = null;
    this.printmodel.vacatuinType = null;
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
    this.printmodel.employeeName = data.employeeName;
    this.printmodel.employeeJob = data.employeeJob;
    this.printmodel.employeeNo = data.employeeNo;
    this.printmodel.nationalitiId = data.identityNo;
    this.printmodel.branchName = data.branchName;

    this.printmodel.vacationReason = data.vacationReason;
    this.printmodel.vacatuinType = data.vacationTypeName;
    this.printmodel.timestr = data.timeStr;
    this.printmodel.status = data.vacationStatusName;
    this.printmodel.acceptedUser = data.acceptUser;

    this.printmodel.from = data.startDate;
    this.printmodel.to = data.endDate;
    this.printmodel.date = data.date;
    this.printmodel.isDiscount = data.isDiscount;
    this.printmodel.acceptedDate = data.acceptedDate;
  }
  PrintVacation() {
    const timeoutDuration = 5000;

    setTimeout(() => {
      // Code to be executed after the timeout
      this.printDiv('reportholiday');
    }, timeoutDuration);
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
}
