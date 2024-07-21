import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from 'src/app/shared/services/api.service';
import { fade } from 'src/app/shared/animations/toggleBtn.animation';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EmployeeArchiveServiceService } from 'src/app/core/services/Employees-Services/employee-archive-service.service';
import { EmployeesServiceService } from 'src/app/core/services/Employees-Services/employees-service.service';
import { EmployeesVM } from 'src/app/core/Classes/ViewModels/employeesVM';
import { Employees } from 'src/app/core/Classes/DomainObjects/employees';
import { Loan } from 'src/app/core/Classes/DomainObjects/loan';
import { Allowance } from 'src/app/core/Classes/DomainObjects/allowance';
import { AllowanceType } from 'src/app/core/Classes/DomainObjects/allowanceType';
import { DiscountReward } from 'src/app/core/Classes/DomainObjects/discountReward';
import { Vacation } from 'src/app/core/Classes/DomainObjects/vacations';
import { VacationType } from 'src/app/core/Classes/DomainObjects/vacationType';
import { City } from 'src/app/core/Classes/DomainObjects/city';
import { Department } from 'src/app/core/Classes/DomainObjects/department';
import { Job } from 'src/app/core/Classes/DomainObjects/job';
import { Nationality } from 'src/app/core/Classes/DomainObjects/nationality';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { SharedService } from 'src/app/core/services/shared.service';
import { NgxPrintElementService } from 'ngx-print-element';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
interface Item {
  id: number;
  name: string;
}
@Component({
  selector: 'app-employees-archive',
  templateUrl: './employees-archive.component.html',
  styleUrls: ['./employees-archive.component.scss'],
  animations: [fade],
  providers: [DatePipe],
})
export class EmployeesArchiveComponent {
  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'ارشيف الموظفين',
      en: 'Staff Archive',
    },
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  data: any = {
    employeesArchive: new MatTableDataSource([{}]),
    filter: {
      show: 1,
    },
    employeeAttachment: [],
    employeeAllowances: [],
    employeeVacations: [],
    employeeDisscount: [],
    employeeAlloans: [],
    selectedAttachment: {
      AttachmentId: 0,
      AttachmentName: '',
      Date: '',
      Notes: '',
    },
    selectedVacations: {
      vacationType: '',
      Date: '',
      vacationReason: '',
    },
  };
  searchBox: any = {
    open: false,
    searchType: null,
  };
  statics: any = {
    open: false,
    data: {
      WithoutContracts: 0,
      WithoutMedicalInsurance: 0,
      DidnotStartWork: 0,
      HaveCustodies: 0,
      HaveLoans: 0,
      HaveDicounts: 0,
    },
  };

  EmpSearchObj: any = {
    employeeNameAr: null,
    nationalId: null,
    mobile: null,
    passportNo: null,
    email: null,
    employeeNo: null,
  };
  displayedColumns: string[] = [
    'EmployeeName',
    'EmpServiceDuration',
    'NationalityName',
    'BranchName',
    'WorkStartDate',
    'EndWorkDate',
    'ResonLeave',
    'Mobile',
    'operations',
  ];
  /////////////////////////////general////////////////////////////
  usersselect: any;
  nationalitiesslect: Item[];
  jobselect: any;
  departmentselect: any;
  branchselect: any;
  nationalitysourceselected: any;
  bankselect: any;
  dawamselect: any;
  Months: any;
  rewardstatus: any;
  ///////////////////////////////////////
  users: any;
  nationalities: any;
  job: any;
  department: any;
  branch: any;
  nationalitysource: any;
  //nationality
  nationalitylist: any;
  nationalitynamear: any;
  nationalitynameen: any;
  nationalityid = 0;
  public _natinalityobj: Nationality;
  nationalityiddelete: any;
  //job
  joblist: any;
  jobnamear: any;
  jobnameen: any;
  jobid = 0;
  public _jobobj: Job;
  jobiddelete: any;
  //department
  departmentlist: any;
  departmentnamear: any;
  departmentnameen: any;
  departmentid = 0;
  public _departmentobj: Department;
  departmentiddelete: any;
  //city
  citylist: any;
  citynamear: any;
  citynameen: any;
  cityid = 0;
  public _cityobj: City;
  cityiddelete: any;
  //////////////////////////////////////////////
  //department
  vacationtypelist: any;
  vacationtypenamear: any;
  vacationtypenameen: any;
  vacationtypeid = 0;
  public _vacationtypeobj: VacationType;
  vacationtypeiddelete: any;
  vacationtypenote: any;
  vacationtypeselect: any;
  /////////////////////////////////////////////
  //vacation
  vacationDetails: any = {
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
    vacationReason: null,
  };
  public _vacationobj: Vacation;
  vacationiddelete: any;
  vacationselect: any;
  vacationlist: any;
  /////////////////////////////////////////////
  //Discount Reward

  discountRewardobj: any = {
    discountRewardId: 0,
    discountRewardName: null,
    monthnm: null,
    status: null,
    amount: null,
    notes: null,
  };

  public _discountrewardobj: DiscountReward;
  discountrewardiddelete: any;
  discountrewardselect: any;
  discountrewardlist: any;
  ///////////////////////////////////////////////////

  /////////////////////////////////////////////
  //Allownce Type

  AllownceTypeobj: any = {
    AllownceTypeId: 0,
    nameAr: null,
    nameEn: null,
    notes: null,
  };

  public _allowncetype: AllowanceType;
  allowncetypeiddelete: any;
  allowncetypeselect: any;
  allowncetypelist: any;
  ///////////////////////////////////////////////////
  //Allownce

  Allownceobj: any = {
    AllownceId: 0,
    AllownceTypeId: null,
    amount: null,
    monthNo: null,
  };

  public _allownce: Allowance;
  allownceiddelete: any;
  allownceselect: any;
  allowncelist: any;

  //////////////////////////////////////////////////////////////
  //Loan

  loanobj: any = {
    loanId: 0,
    date: null,
    amount: null,
    monthNo: null,
    startMonth: null,
    notes: null,
  };

  public _loan: Loan;
  loaniddelete: any;
  loanlist: any;
  ///////////////////////////////////////////////////

  empid = '0';
  employeeid = 0;
  vacationid = 0;
  modalDetails: any = {
    employeeId: null,
    employeeNo: null,
    employeeNameAr: null,
    employeeNameEn: null,
    educationalQualification: null,
    birthDate: null,
    birthPlace: null,
    maritalStatus: null,
    childrenNo: null,
    gender: null,
    nationalityId: null,
    religionId: null,
    userId: null,
    jobId: null,
    departmentId: null,
    deppID: null,
    branchId: null,
    telephone: null,
    mobile: null,
    email: null,
    address: null,
    nationalId: null,
    nationalIdSource: null,
    nationalIdEndDate: null,
    nationalIdEndHijriDate: null,
    file: null,
    photoUrl: null,
    addusername: null,
    adddate: null,
    addhigridate: null,
    employeeimg: null,
  };

  EmpOffDocObj: any = {
    employeeId: null,
    passportNo: null,
    passportSource: null,
    passportNoDate: null,
    passportEndDate: null,
    contractNo: null,
    contractStartDate: null,
    contractEndDate: null,
    medicalNo: null,
    medicalSource: null,
    medicalStartDate: null,
    medicalEndDate: null,
    dawamId: null,
    timeDurationLate: null,
    earlyLogin: null,
    logoutDuration: null,
    afterLogoutTime: null,
    salary: null,
    bonus: null,
    bankId: null,
    bankCardNo: null,
    taamen: null,
    vacationEndCount: null,
    housingsalary: null,
    pastVacationsCount: null,
    tameen2: null,
  };
  EmpAttachmentObj: any = {
    attachmentId: null,
    attachmentName: null,
    date: null,
    hijriDate: null,
    notes: null,
    file: null,
  };

  public _employessVM: EmployeesVM;
  public _employess: Employees;
  employeeselect: any;
  employeeworkerselect: any;
  vacationBalance = 0;
  Salary = 0;
  vVacationDays = 0;
  VacationIsDiscount: any;
  employeeidtodelete: any;
  environmnt = environment.PhotoURL;
  lang: any = 'ar';
  datePrintJournals: any = this._sharedService.date_TO_String(new Date());
  logourl: any;
  userG: any = {};

  constructor(
    private api: RestApiService,
    private modalService: NgbModal,
    private _employreeArchiveService: EmployeeArchiveServiceService,
    private _EmpService: EmployeesServiceService,
    private datePipe: DatePipe,
    private _sharedService: SharedService,

    private printing: NgxPrintElementService,
    private authenticationService: AuthenticationService,
    private toast: ToastrService,
    private translate: TranslateService
  ) {
    this.getData();
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    this.userG = this.authenticationService.userGlobalObj;
  }

  getData() {
    debugger;
    this._employreeArchiveService.GetAllArchivesEmployees().subscribe({
      next: (data: any) => {
        // assign data to table
        debugger;
        this.data.employeesArchive = new MatTableDataSource(data.result);
        this.data.employeesArchive.paginator = this.paginator;
        this.data.employeesArchive.sort = this.sort;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getuserData(userid: any) {
    this._EmpService.GetUserById(userid).subscribe({
      next: (data: any) => {
        debugger;
        // assign data to table
        this.modalDetails.addusername = data.result.fullName;
        if (data.result.imgUrl != null && data.result.imgUrl != '') {
          this.modalDetails.photoUrl =
            environment.PhotoURL + data.result.imgUrl;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  GetEmployeeStatistics() {
    this._EmpService.GetEmployeeStatistics().subscribe({
      next: (data: any) => {
        debugger;

        this.statics.data.WithoutContracts = data.result.WwthoutContracts ?? 0;
        this.statics.data.WithoutMedicalInsurance =
          data.result.withoutMedicalInsurance ?? 0;
        this.statics.data.HaveCustodies = data.result.didnotStartWork ?? 0;
        this.statics.data.HaveCustodies = data.result.haveCustodies ?? 0;
        this.statics.data.HaveLoans = data.result.haveLoans ?? 0;
        this.statics.data.HaveDicounts = data.result.haveDicounts ?? 0;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  SearchEmployees() {
    debugger;
    this._employessVM = new EmployeesVM();
    this._employessVM.employeeNameAr = this.EmpSearchObj.employeeNameAr;
    this._employessVM.nationalId = this.EmpSearchObj.nationalId;
    this._employessVM.mobile = this.EmpSearchObj.mobile;
    this._employessVM.passportNo = this.EmpSearchObj.passportNo;
    this._employessVM.email = this.EmpSearchObj.email;
    this._employessVM.employeeNo = this.EmpSearchObj.employeeNo;

    this._employreeArchiveService
      .SearchArchiveEmployees(this._employessVM)
      .subscribe({
        next: (data: any) => {
          // assign data to table
          debugger;
          this.data.employeesArchive = new MatTableDataSource(data.result);
          this.data.employeesArchive.paginator = this.paginator;
          this.data.employeesArchive.sort = this.sort;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  filluserselect() {
    this._EmpService.FillAllUsersSelectAll().subscribe((data) => {
      this.usersselect = data;
    });
  }
  FillBranchSelect() {
    this._EmpService.FillBranchSelect().subscribe((data) => {
      this.branchselect = data;
    });
  }
  FillCitySelect() {
    this._EmpService.FillCitySelect().subscribe((data) => {
      this.nationalitysourceselected = data;
    });
  }
  FillDepartmentSelectByType() {
    this._EmpService.FillDepartmentSelectByType().subscribe((data) => {
      this.departmentselect = data;
    });
  }
  FillNationalitySelect() {
    this._EmpService.FillNationalitySelect().subscribe((data) => {
      this.nationalitiesslect = data;
    });
  }
  FillJobSelect() {
    this._EmpService.FillJobSelect().subscribe((data) => {
      this.jobselect = data;
    });
  }
  FillBankSelect() {
    this._EmpService.FillBankSelect().subscribe((data) => {
      this.bankselect = data;
    });
  }
  FillAttendanceTimeSelect() {
    this._EmpService.FillAttendanceTimeSelect().subscribe((data) => {
      this.dawamselect = data;
    });
  }
  FillVacationTypeSelect() {
    this._EmpService.FillVacationTypeSelect().subscribe((data) => {
      this.vacationtypeselect = data;
    });
  }

  FillAllowanceTypeSelect() {
    this._EmpService.FillAllowanceTypeSelect().subscribe((data) => {
      this.allowncetypeselect = data;
    });
  }

  ///////////////////////////////nationality crud operations/////////////////////////////
  GetAllNationalities() {
    this._EmpService.GetAllNationalities().subscribe((data) => {
      debugger;
      this.nationalitylist = data.result;
    });
  }
  /////////////////////////////////////jobs Crud Operations/////////////////////////////
  GetAllJobs() {
    this._EmpService.GetAllJobs().subscribe((data) => {
      debugger;
      this.joblist = data.result;
    });
  }

  /////////////////////////////Department crud operations ////////////////////////////////////////////
  GetAllDepartmentbyType() {
    this._EmpService.GetAllDepartmentbyType().subscribe((data) => {
      debugger;
      this.departmentlist = data.result;
    });
  }
  /////////////////////////////Cities crud operations ////////////////////////////////////////////
  GetAllCities() {
    this._EmpService.GetAllCities().subscribe((data) => {
      debugger;
      this.citylist = data.result;
    });
  }

  ///////////////////////////////////VacationType crud operations ////////////////////////////////////////////
  GetAllVacationsTypes() {
    this._EmpService.GetAllVacationsTypes().subscribe((data) => {
      debugger;
      this.vacationtypelist = data.result;
    });
  }

  /////////////////////////////////////////vacation crude operations///////////////////////////////////////////////////////////
  GetAllVacations() {
    this._EmpService
      .GetAllVacationsArchived(this.employeeid, '')
      .subscribe((data) => {
        debugger;
        this.vacationlist = data.result;
        console.log('vacations', data);
      });
  }

  //////////////////////////////////////////////////////Discount Reward Crud Operations////////////////////////////////////////////////////////////////
  GetAllDiscountRewards() {
    this._EmpService
      .GetAllDiscountRewards(this.employeeid, '')
      .subscribe((data) => {
        debugger;
        this.discountrewardlist = data.result;
        console.log(data);
      });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////Allownce Type Crud Operations////////////////////////////////////////////////////////////////
  GetAllAllowncetype() {
    this._EmpService.GetAllAllowancesTypes('').subscribe((data) => {
      debugger;
      this.allowncetypelist = data.result;
      console.log(data);
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////Allownce  Crud Operations////////////////////////////////////////////////////////////////
  GetAllAllownce() {
    this._EmpService.GetAllAllowances(this.employeeid, '').subscribe((data) => {
      debugger;
      this.allowncelist = data.result;
      console.log(data);
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////loans  Crud Operations////////////////////////////////////////////////////////////////
  GetAllLoans() {
    this._EmpService.GetAllLoansE(this.employeeid, '').subscribe((data) => {
      debugger;
      this.loanlist = data.result;
      console.log(data);
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  selectedItem: any; // You might want to define a type for your selected item

  selectedText: string;
  attachmentidtodelete: any;
  onSelectionChange() {
    // Assuming ng-select provides you with the selected item
    debugger;
    const selectedItem = this.nationalitiesslect.find(
      (itemm) => itemm.id === this.modalDetails.nationalityId
    );
    if (selectedItem) {
      this.selectedText = selectedItem.name;
    } else {
      this.selectedText = '';
    }
  }

  setempdatatoedit(data: any) {
    debugger;
    //employee data
    this.modalDetails.employeeId = data.employeeId;
    this.modalDetails.employeeNo = data.employeeNo;
    this.modalDetails.employeeNameAr = data.employeeNameAr;
    this.modalDetails.employeeNameEn = data.employeeNameEn;
    this.modalDetails.educationalQualification = data.educationalQualification;
    this.modalDetails.birthDate = new Date(data.birthDate);
    this.modalDetails.birthPlace = data.birthPlace;
    this.modalDetails.maritalStatus = data.maritalStatus;
    this.modalDetails.childrenNo = data.childrenNo;
    this.modalDetails.gender = data.gender;
    this.modalDetails.nationalityId = data.nationalityId;
    this.modalDetails.religionId = data.religionId;
    this.modalDetails.userId = data.userId;
    this.modalDetails.jobId = data.jobId;
    this.modalDetails.departmentId = data.departmentId;
    this.modalDetails.deppID = data.deppID;
    this.modalDetails.branchId = data.branchId;
    this.modalDetails.telephone = data.telephone;
    this.modalDetails.mobile = data.mobile;
    this.modalDetails.email = data.email;
    this.modalDetails.address = data.address;
    this.modalDetails.nationalId = data.nationalId;
    this.modalDetails.nationalIdSource = data.nationalIdSource;
    this.modalDetails.nationalIdEndDate =
      data.nationalIdEndDate == null ? null : new Date(data.nationalIdEndDate);
    this.modalDetails.nationalIdEndHijriDate =
      data.nationalIdEndHijriDate == null ||
      data.nationalIdEndHijriDate == 'Invalid Date'
        ? null
        : new Date(data.nationalIdEndHijriDate);
    this.modalDetails.file = data.file;
    this.modalDetails.photoUrl = data.photoUrl;
    this.modalDetails.employeeimg = data.photoUrl;
    debugger;
    this.onSelectionChange();
    console.log(this.modalDetails);
    this.getuserData(data.addUser);
    //this.modalDetails.adddate=data.addDate;
    this.modalDetails.adddate = this.datePipe.transform(
      data.addDate,
      'YYYY-MM-dd'
    );

    //official document data

    this.EmpOffDocObj.employeeId = data.employeeId;
    this.EmpOffDocObj.passportNo = data.passportNo;
    this.EmpOffDocObj.passportSource = data.passportSource;
    this.EmpOffDocObj.passportNoDate = new Date(data.passportNoDate);
    this.EmpOffDocObj.passportEndDate = new Date(data.passportEndDate);
    this.EmpOffDocObj.contractNo = data.contractNo;
    this.EmpOffDocObj.contractStartDate = data.contractStartDate;
    this.EmpOffDocObj.contractEndDate = data.contractEndDate;
    this.EmpOffDocObj.medicalNo = data.medicalNo;
    this.EmpOffDocObj.medicalSource = data.medicalSource;
    this.EmpOffDocObj.medicalStartDate = new Date(data.medicalStartDate);
    this.EmpOffDocObj.medicalEndDate = new Date(data.medicalEndDate);
    this.EmpOffDocObj.dawamId = data.dawamId;
    this.EmpOffDocObj.timeDurationLate = data.timeDurationLate;
    this.EmpOffDocObj.earlyLogin = data.earlyLogin;
    this.EmpOffDocObj.logoutDuration = data.logoutDuration;
    this.EmpOffDocObj.afterLogoutTime = data.afterLogoutTime;
    this.EmpOffDocObj.salary = data.salary;
    this.EmpOffDocObj.bonus = data.bonus;
    this.EmpOffDocObj.bankId = data.bankId;
    this.EmpOffDocObj.bankCardNo = data.bankCardNo;
    this.EmpOffDocObj.taamen = data.taamen;
    this.EmpOffDocObj.housingsalary = data.allowances;
    let vacationBalance = data.VacationEndCount;

    if (vacationBalance == '' || vacationBalance == null) vacationBalance = 0;
    if (vacationBalance <= 30) {
      this.EmpOffDocObj.vacationEndCount = vacationBalance;
      this.EmpOffDocObj.pastVacationsCount = 0;
    } else {
      this.EmpOffDocObj.vacationEndCount = 30;
      var past = vacationBalance - 30;

      this.EmpOffDocObj.pastVacationsCount = past;
    }

    if (data.salary != null && data.taamen != null) {
      var tamnvalue = (parseFloat(data.Salary) * data.taamen) / 100;

      this.EmpOffDocObj.tameen2 = tamnvalue + ' ريال شهرياً';
    } else {
      this.EmpOffDocObj.tameen2 = '';
    }
  }

  //    dateIsValid(dateStr:any) {
  //     const regex = /^\d{4}-\d{2}-\d{2}$/;

  //     if (dateStr.match(regex) === null) {
  //         return false;
  //     }

  //     const date = new Date(dateStr);

  //     const timestamp = date.getTime();

  //     if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
  //         return false;
  //     }

  //     return true;
  // }
  GetAllAttachments() {
    debugger;
    this._EmpService.GetAllAttachments(this.employeeid).subscribe((data) => {
      console.log(data);
      this.data.employeeAttachment = data.result;
    });
  }
  downloadFile(data: any) {
    var link = environment.PhotoURL + data.attachmentUrl;
    window.open(link, '_blank');
  }

  ngOnInit(): void {
    this.GetEmployeeStatistics();
    this.GetOrganizationData();

    this.Months = [
      { id: 1, Name: 'يناير' },
      { id: 2, Name: 'فبراير' },
      { id: 3, Name: 'مارس' },
      { id: 4, Name: 'إبريل' },
      { id: 5, Name: 'مايو' },
      { id: 6, Name: 'يونية' },
      { id: 7, Name: 'يوليو' },
      { id: 8, Name: 'أغسطس' },
      { id: 9, Name: 'سبتمبر' },
      { id: 10, Name: 'أكتوبر' },
      { id: 11, Name: 'نوفمبر' },
      { id: 12, Name: 'ديسمبر' },
    ];

    this.rewardstatus = [
      { id: 1, Name: 'خصم' },
      { id: 2, Name: 'مكافأة' },
    ];
  }

  deletedEmployee: any;
  applyFilter(event: Event) {}
  open(content: any, data?: any, type?: any) {
    if (data && type == 'editemployee') {
      this.employeeid = data.employeeId;
      this.empid = data.employeeId;
      this.FillBranchSelect();
      this.FillCitySelect();
      this.FillDepartmentSelectByType();
      this.FillJobSelect();
      this.FillNationalitySelect();
      this.filluserselect();
      this.FillBankSelect();
      this.FillAttendanceTimeSelect();
      this.FillAllowanceTypeSelect();
      this.GetAllNationalities();
      this.GetAllJobs();
      this.GetAllDepartmentbyType();
      this.GetAllCities();
      this.GetAllAttachments();
      this.GetAllVacationsTypes();
      this.FillVacationTypeSelect();
      this.GetAllVacations();
      this.GetAllDiscountRewards();
      this.GetAllAllowncetype();
      this.GetAllAllownce();
      this.GetAllLoans();
      this.setempdatatoedit(data);
    }
    debugger;
    if (data && type == 'deletearchivedemployee') {
      this.deletedEmployee = data.employeeId;
    }
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: type ? false : true,
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        (result) => {
          // this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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
      // FileUploadValidators.accept(['image/*']),
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
  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getmonthname(monthn: any) {
    if (monthn == 1) {
      return 'يناير';
    } else if (monthn == 2) {
      return 'فبراير';
    } else if (monthn == 3) {
      return 'مارس';
    } else if (monthn == 4) {
      return 'ابريل';
    } else if (monthn == 5) {
      return 'مايو';
    } else if (monthn == 6) {
      return 'يونيه';
    } else if (monthn == 7) {
      return 'يوليو';
    } else if (monthn == 8) {
      return 'أغسطس';
    } else if (monthn == 9) {
      return 'سبتمبر';
    } else if (monthn == 10) {
      return 'اكتوبر';
    } else if (monthn == 11) {
      return 'نوفمبر';
    } else if (monthn == 12) {
      return 'ديسمبر';
    } else {
      return '';
    }
  }

  //#region Print
  ///////////////////////print///////////////////////////
  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }
  PrintEmp() {
    this.printDiv('reportemployee');
  }
  printDiv(id: any) {
    this.printing.print(id, environment.printConfig);
  }
  employeemodelprint: any = {
    employeeNameAr: null,
    departmentName: null,
    nationalityName: null,
    jobName: null,
    educationalQualification: null,
    workStartDate: null,
    lastVacation: null,
    vacationEndCount: null,
    bankName: null,
    bankCardNo: null,
    salary: null,

    nationalId: null,
    nationalIdDate: null,
    nationalIdEndDate: null,
    medicalNo: null,
    medicalSource: null,
    medicalStartDate: null,
    medicalEndDate: null,
    passportNo: null,
    passportNoDate: null,
    passportEndDate: null,
  };
  Allownces: any = null;
  SumAllownces: any = null;
  discounts: any = null;
  Loans: any = null;
  Loanvms: any = null;
  TotalVal: any = null;
  MonthlyTotalloan: any = null;
  PaidTotal: any = null;
  remainTotal: any = null;
  Rewards: any = null;
  TotalRewards: any = null;
  VacVMs: any = null;
  Totalvac: any = null;
  excpecTotalDays: any = null;
  actuallTotalDays: any = null;
  Nationalsource: any = null;
  PassportSource: any = null;
  printemployeecard(empid: any) {
    debugger;
    this._EmpService
      .PrintEmployeeIdentityReports(empid.employeeId)
      .subscribe((data) => {
        console.log('employeedata', data);
        this.employeemodelprint = {
          employeeNameAr: data.employee.employeeNameAr,
          departmentName: data.employee.departmentName,
          nationalityName: data.employee.nationalityName,
          jobName: data.employee.jobName,
          educationalQualification: data.employee.educationalQualification,
          workStartDate: data.employee.workStartDate,
          lastVacation: data.lastVacation,
          vacationEndCount: data.employee.vacationEndCount,
          bankName: data.employee.bankName,
          bankCardNo: data.employee.bankCardNo,
          salary: data.employee.salary,

          nationalId: data.employee.nationalId,
          nationalIdDate: data.employee.nationalIdDate,
          nationalIdEndDate: data.employee.nationalIdEndDate,
          medicalNo: data.employee.medicalNo,
          medicalSource: data.employee.medicalSource,
          medicalStartDate: data.employee.medicalStartDate,
          medicalEndDate: data.employee.medicalEndDate,
          passportNo: data.employee.passportNo,
          passportNoDate: data.employee.passportNoDate,
          passportEndDate: data.employee.passportEndDate,
        };
        this.Allownces = data.allowances;
        this.SumAllownces = data.sumAllownces;
        this.discounts = data.discounts;
        this.Loans = data.loans;
        this.Loanvms = data.Loanvms;
        this.TotalVal = data.totalVal;
        this.MonthlyTotalloan = data.monthlyTotalloan;
        this.PaidTotal = data.paidTotal;
        this.remainTotal = data.remainTotal;
        this.Rewards = data.rewards;
        this.TotalRewards = data.totalRewards;
        this.VacVMs = data.vacVMs;
        this.Totalvac = data.totalvac;
        this.excpecTotalDays = data.excpecTotalDays;
        this.actuallTotalDays = data.actuallTotalDays;
        this.Nationalsource = data.nationalsource;
        this.PassportSource = data.passportSource;
        const timeoutDuration = 5000;

        setTimeout(() => {
          // Code to be executed after the timeout
          this.printDiv('reportemployeeecard');
        }, timeoutDuration);
      });
  }

  DeleteEmployee() {
    debugger;
    this._EmpService
      .RemoveEmployee(this.deletedEmployee)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          // this.employeeid=  result.returnedParm;
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }
  //#endregion
}
