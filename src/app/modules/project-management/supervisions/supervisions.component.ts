import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestApiService } from 'src/app/shared/services/api.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SupervisionsService } from 'src/app/core/services/pro_Services/supervisions.service';
import { environment } from 'src/environments/environment';
import { Pro_SupervisionDetails } from 'src/app/core/Classes/DomainObjects/pro_SupervisionDetails';
import { ProjectService } from 'src/app/core/services/pro_Services/project.service';
import { Pro_Super_PhaseDet } from 'src/app/core/Classes/DomainObjects/pro_Super_PhaseDet';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NgxPrintElementService } from 'ngx-print-element';
import printJS from 'print-js';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-supervisions',
  templateUrl: './supervisions.component.html',
  styleUrls: ['./supervisions.component.scss'],
})
export class SupervisionsComponent {
  title: any = {
    main: {
      name: {
        ar: 'إدارة المشاريع',
        en: 'Projects Manegment',
      },
      link: '/customers',
    },
    sub: {
      ar: 'متابعة طلعات الإشراف',
      en: 'Supervision',
    },
  };

  displayedColumns: string[] = [
    'name',
    'projectNumber',
    'orderNumber',
    'stage',
    'assignedTo',
    'assignedDate',
    'status',
    'operations',
  ];
  data: any = {
    supervision: [],
    supervisionDetails: [],
    phaseDetails: [],
    filter: {
      enable: false,
      date: null,
      Search_user: null,
    },
    phases: {
      id: 0,
      nameAr: null,
      nameEn: null,
    },
    superPhases: [],
    superPhasesTemp: [],
  };
  dataSourceTemp: any = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  checkedEmail: any;
  checkedPhone: any;
  EmailValue: any;
  PhoneValue: any;
  checkedEmailAdmin: any;
  checkedPhoneAdmin: any;
  EmailValueAdmin: any;
  PhoneValueAdmin: any;

  GetCustomersByProjectId(id: any) {
    this._projectService.GetCustomersByProjectId(id).subscribe((data) => {
      this.checkedEmail = false;
      this.checkedPhone = false;
      this.EmailValue = data.result.customerEmail;
      this.PhoneValue = data.result.customerMobile;
    });
  }
  GetUserById(id: any) {
    this._projectService.GetUserById(id).subscribe((data) => {
      console.log('GetUserById');
      console.log(data);

      this.checkedEmailAdmin = false;
      this.checkedPhoneAdmin = false;
      this.EmailValueAdmin = data.result.email;
      this.PhoneValueAdmin = data.result.mobile;
    });
  }
  userG: any = {};

  constructor(
    private modalService: BsModalService,
    private modalService2: NgbModal,
    private api: RestApiService,
    private _supervisionsService: SupervisionsService,
    private _projectService: ProjectService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private print: NgxPrintElementService,
    private authenticationService: AuthenticationService
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.getData();
    this.FillAllUsersSelectAll();
    this.getorddata();
    this.data.supervisionDetails = [];
    this.data.phaseDetails = [];
  }
  OrganizationData: any;


  WhatsAppData: any={
    sendactivation:false,
    sendactivationOffer:false,
    sendactivationProject:false,
    sendactivationSupervision:false,
  };
  ngOnInit(): void {
    this._sharedService.GetWhatsAppSetting().subscribe((data: any) => {
      if(data?.result!=null){this.WhatsAppData=data?.result;}
      else{this.WhatsAppData={sendactivation:false,sendactivationOffer:false,sendactivationProject:false,sendactivationSupervision:false,};}
    });
  }


  getorddata() {
    this.api.GetOrganizationDataLogin().subscribe((data: any) => {
      this.OrganizationData = data.result;
    });
  }
  getData() {
    this._supervisionsService.GetAllSupervisions(null).subscribe((data) => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  load_AllUsersSelect: any;
  load_AllUsersSelect_M: any;

  FillAllUsersSelectAll() {
    this._supervisionsService.FillAllUsersSelectAll().subscribe((data) => {
      console.log(data);
      this.load_AllUsersSelect = data;
      this.load_AllUsersSelect_M = data;
    });
  }
  load_CustomerSelect: any;
  FillCustomerSelectWProC_Supervision() {
    this.load_ProjectSelect = [];
    this._supervisionsService
      .FillCustomerSelectWProC_Supervision()
      .subscribe((data) => {
        console.log(data);
        this.load_CustomerSelect = data;
      });
  }
  load_ProjectSelect: any;
  FillProjectSelectByCustomerId2_Supervision() {
    this.load_ProjectSelect = [];
    this.modalDetails.ProjectId = null;
    this.resetFn();
    if (this.modalDetails.CustomerId != null) {
      this._supervisionsService
        .FillProjectSelectByCustomerId2_Supervision(
          this.modalDetails.CustomerId
        )
        .subscribe((data) => {
          console.log(data);
          this.load_ProjectSelect = data;
        });
    }
  }
  load_SuperPhasesSelect: any;
  FillSuperPhasesSelect() {
    this._supervisionsService.FillSuperPhasesSelect().subscribe((data) => {
      console.log(data);
      this.load_SuperPhasesSelect = data;
      this.data.superPhases = data;
      this.data.superPhasesTemp = data;
    });
  }
  load_ContractorsSelect: any;
  FillContractorsSelect() {
    this._supervisionsService.FillContractorsSelect().subscribe((data) => {
      console.log(data);
      this.load_ContractorsSelect = data;
    });
  }
  load_MunicipalsSelect: any;
  FillMunicipalsSelect() {
    this._supervisionsService.FillMunicipalsSelect().subscribe((data) => {
      console.log(data);
      this.load_MunicipalsSelect = data;
    });
  }
  load_SubMunicipalitysSelect: any;
  FillSubMunicipalitysSelect() {
    this._supervisionsService.FillSubMunicipalitysSelect().subscribe((data) => {
      console.log(data);
      this.load_SubMunicipalitysSelect = data;
    });
  }
  load_BuildTypeSelect: any;
  FillBuildTypeSelect() {
    this._supervisionsService.FillBuildTypeSelect().subscribe((data) => {
      console.log(data);
      this.load_BuildTypeSelect = data;
    });
  }

  SearchUserChange() {
    if (this.data.filter.date != null) {
      var from = this._sharedService.date_TO_String(this.data.filter.date[0]);
      var to = this._sharedService.date_TO_String(this.data.filter.date[1]);
      this.RefreshData(from, to);
    } else {
      this.RefreshData(null, null);
    }
  }
  load_AllSuperPhaseDet: any;
  GetAllSuperPhaseDet() {
    this.load_AllSuperPhaseDet = [];
    if (this.modalDetails.PhaseId != null) {
      this._supervisionsService
        .GetAllSuperPhaseDet(this.modalDetails.PhaseId)
        .subscribe((data) => {
          console.log(data);
          this.load_AllSuperPhaseDet = data;
        });
    } else {
      this.toast.error('أختر مرحلة أولا', this.translate.instant('Message'));
      return;
    }
  }
  CheckDate(event: any) {
    if (event != null) {
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      this.RefreshData(from, to);
    } else {
      this.RefreshData(null, null);
    }
  }
  RefreshData(from: any, to: any) {
    this._supervisionsService
      .GetAllBySupervisionSearch(
        null,
        null,
        this.data.filter.Search_user,
        null,
        from,
        to
      )
      .subscribe((data) => {
        console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSourceTemp = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
  //-----------------------------------------------------------------
  closeResult = '';

  open(content: any, data?: any, type?: any, idRow?: any) {
    this.modalService2
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type
          ? type == 'contract' ||
            type == 'file' ||
            type == 'contracts' ||
            type == 'deletePaymentModal'
            ? 'md'
            : type == 'EditPaymentModal'
            ? 'lg'
            : 'xl'
          : 'lg',
        centered: type
          ? type == 'contracts' ||
            type == 'EditPaymentModal' ||
            type == 'deletePaymentModal'
            ? true
            : false
          : true,
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
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  applyFilter(event: any) {
    debugger;
    const val = event.target.value.toLowerCase();
    const tempsource = this.dataSourceTemp.filter(function (d: any) {
      return (
        d.customerName?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.projectNo?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        String(d.number)?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.phaseName?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.receivedUserName?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.superDateConfirm?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.superStatusName?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  CustomerIdChange() {
    this.FillProjectSelectByCustomerId2_Supervision();
  }
  ProjectIdChange() {
    if (this.modalDetails.ProjectId != null) {
      this.GenerateNextSupNumber();
      this.GetProjectDataOffice();
      this.modalDetails.SupervisionDate = new Date();
      this.modalDetails.VisitDate = new Date();
    } else {
      this.modalDetails.SupervisionDate = null;
      this.modalDetails.VisitDate = null;
    }
  }
  PhaseIdChange() {
    this.GetAllSuperPhaseDet();
  }
  GetProjectDataOffice() {
    if (this.modalDetails.ProjectId != null) {
      this.FillAllUsersSelectAll();
      this.FillContractorsSelect();
      this.FillMunicipalsSelect();
      this.FillSubMunicipalitysSelect();
      this.FillBuildTypeSelect();

      this._supervisionsService
        .GetProjectDataOffice(this.modalDetails.ProjectId)
        .subscribe((data) => {
          this.modalDetails.OfficeName = data.co_opOfficeName;
          this.modalDetails.LicenseNumber = data.licenseNo;
          this.modalDetails.OutlineNo = data.catego;
          this.modalDetails.PieceNo = data.proPieceNumber;
          this.modalDetails.AdwARid = data.adwAR;
          this.modalDetails.DistrictName = data.districtName;
          this.modalDetails.ProBuildingDisc = data.proBuildingDisc;
          this.modalDetails.WorkerNameSelectId = data.contractorSelectId;
          this.modalDetails.MunicipalSelectId = data.municipalId;
          this.modalDetails.SubMunicipalitySelectId = data.subMunicipalityId;
          this.modalDetails.ProBuildingTypeSelectId = data.buildingType;
        });
    } else {
      this.resetFn();
    }
  }
  resetFn() {
    this.load_ContractorsSelect = [];
    this.load_MunicipalsSelect = [];
    this.load_SubMunicipalitysSelect = [];
    this.load_BuildTypeSelect = [];
    this.load_AllUsersSelect_M = [];

    this.modalDetails.VisitDate = null;
    this.modalDetails.SupervisionNumber = null;
    this.modalDetails.SupervisionDate = null;
    this.modalDetails.WorkerNameSelectId = null;
    this.modalDetails.RecevierSelectId = null;
    this.modalDetails.OfficeName = null;
    this.modalDetails.LicenseNumber = null;
    this.modalDetails.OutlineNo = null;
    this.modalDetails.PieceNo = null;
    this.modalDetails.MunicipalSelectId = null;
    this.modalDetails.SubMunicipalitySelectId = null;
    this.modalDetails.ProBuildingTypeSelectId = null;
    this.modalDetails.ProBuildingDisc = null;
    this.modalDetails.DistrictName = null;
    this.modalDetails.AdwARid = null;
  }
  GenerateNextSupNumber() {
    this.modalDetails.SupervisionNumber = null;
    this._supervisionsService.GenerateNextSupNumber().subscribe((data) => {
      this.modalDetails.SupervisionNumber = data;
    });
  }
  ClearData() {
    this.FillCustomerSelectWProC_Supervision();
    this.FillSuperPhasesSelect();
    this.load_ContractorsSelect = [];
    this.load_MunicipalsSelect = [];
    this.load_SubMunicipalitysSelect = [];
    this.load_BuildTypeSelect = [];
    this.load_AllUsersSelect_M = [];
    this.modalDetails.SupervisionId = 0;
    this.modalDetails.CustomerId = null;
    this.modalDetails.ProjectId = null;
    this.modalDetails.PhaseId = null;
    this.modalDetails.VisitDate = null;
    this.modalDetails.SupervisionNumber = null;
    this.modalDetails.SupervisionDate = null;
    this.modalDetails.WorkerNameSelectId = null;
    this.modalDetails.RecevierSelectId = null;
    this.modalDetails.OfficeName = null;
    this.modalDetails.LicenseNumber = null;
    this.modalDetails.OutlineNo = null;
    this.modalDetails.PieceNo = null;
    this.modalDetails.MunicipalSelectId = null;
    this.modalDetails.SubMunicipalitySelectId = null;
    this.modalDetails.ProBuildingTypeSelectId = null;
    this.modalDetails.ProBuildingDisc = null;
    this.modalDetails.DistrictName = null;
    this.modalDetails.AdwARid = null;
  }
  AddPopup() {
    this.ClearData();
  }
  EditSupervision(data: any) {
    this.ClearData();
    this.FillAllUsersSelectAll();
    this.FillContractorsSelect();
    this.FillMunicipalsSelect();
    this.FillSubMunicipalitysSelect();
    this.FillBuildTypeSelect();

    // console.log("data");
    // console.log(data);

    this.modalDetails.SupervisionId = data.supervisionId;
    this.modalDetails.CustomerId = data.customerId;
    this.modalDetails.ProjectId = data.projectId;
    this.FillProjectSelectByCustomerId2_Supervision();
    this.modalDetails.ProjectId = data.projectId;
    this.modalDetails.PhaseId = data.phaseId;
    this.modalDetails.VisitDate = this._sharedService.String_TO_date(
      data.visitDate
    );
    this.modalDetails.SupervisionNumber = data.number;
    this.modalDetails.SupervisionDate = this._sharedService.String_TO_date(
      data.date
    );
    this.modalDetails.WorkerNameSelectId = data.workerId;
    this.modalDetails.RecevierSelectId = data.receivedEmpId;
    this.modalDetails.OfficeName = data.officeName;
    this.modalDetails.LicenseNumber = data.licenseNo;
    this.modalDetails.OutlineNo = data.outlineNo;
    this.modalDetails.PieceNo = data.pieceNo;
    this.modalDetails.MunicipalSelectId = data.municipalSelectId;
    this.modalDetails.SubMunicipalitySelectId = data.subMunicipalitySelectId;
    this.modalDetails.ProBuildingTypeSelectId = data.proBuildingTypeSelectId;
    this.modalDetails.ProBuildingDisc = data.proBuildingDisc;
    this.modalDetails.DistrictName = data.districtName;
    this.modalDetails.AdwARid = data.adwARid;
    this.GetAllSuperPhaseDet();
  }

  saveSuperPhases() {
    if (this.data.phases.nameAr == null || this.data.phases.nameEn == null) {
      this.toast.error('من فضلك أكمل البيانات', this.translate.instant('Message'));
      return;
    }
    if(this.data.phases.id<=14 && this.data.phases.id>0)
      {
        this.toast.error('لا يمكنك التعديل علي هذه المرحلة', this.translate.instant('Message'));
        return;
      }
    var SuperPhasesObj: any = {};
    SuperPhasesObj.PhaseId = this.data.phases.id;
    SuperPhasesObj.NameAr = this.data.phases.nameAr;
    SuperPhasesObj.NameEn = this.data.phases.nameEn;

    var obj = SuperPhasesObj;
    this._supervisionsService.SaveSuperPhases(obj).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.resetSuperPhases();
        this.FillSuperPhasesSelect();
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
  }
  resetSuperPhases() {
    this.data.phases.id = 0;
    this.data.phases.nameAr = null;
    this.data.phases.nameEn = null;
  }
  applyFilteSuperPhases(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.data.superPhasesTemp.filter(function (d: any) {
      return (
        d.name?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.nameEn?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.data.superPhases = tempsource;
  }
  SuperPhaseRowSelected: any;

  getSuperPhaseRow(row: any) {
    this.SuperPhaseRowSelected = row;
    console.log(this.SuperPhaseRowSelected);
  }

  confirmSuperPhasesDelete() {
    this._supervisionsService
      .DeleteSuperPhases(this.SuperPhaseRowSelected.id)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          this.FillSuperPhasesSelect();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  disableButtonSave_Supervision = false;

  SupervisionAvailability(model: any) {
    if (this.modalDetails.PhaseId == null) {
      this.toast.error('من فضلك أختر مرحلة', this.translate.instant('Message'));
      return;
    }
    var SuperCode = this.load_SuperPhasesSelect.filter(
      (a: { id: any }) => a.id == this.modalDetails.PhaseId
    )[0].superCode;
    if (SuperCode != 14) {
      if (
        this.modalDetails.ProjectId == null ||
        this.modalDetails.SupervisionNumber == null ||
        this.modalDetails.RecevierSelectId == null ||
        this.modalDetails.PhaseId == null ||
        this.modalDetails.MunicipalSelectId == null ||
        this.modalDetails.SubMunicipalitySelectId == null ||
        this.modalDetails.ProBuildingDisc == null ||
        this.modalDetails.WorkerNameSelectId == null
      ) {
        this.toast.error('من فضلك أكمل البيانات', this.translate.instant('Message'));
        return;
      }
    }
    // this.modalDetails.OfficeName==null|| this.modalDetails.OfficeName=="" ||
    if (
      this.modalDetails.LicenseNumber == '0' ||
      this.modalDetails.OutlineNo == 0 ||
      this.modalDetails.PieceNo == '0' ||
      this.modalDetails.DistrictName == null ||
      this.modalDetails.DistrictName == '' ||
      this.modalDetails.AdwARid == 0
    ) {
      this.toast.error(
        'من فضلك أكمل بيانات المشروع من تفاصيل المشروع',
        this.translate.instant('Message')
      );
      return;
    }
    var SupervisionsObj: any = {};
    var SupervisionsDetailsList: any = [];

    SupervisionsObj.SupervisionId = this.modalDetails.SupervisionId;

    SupervisionsObj.ProjectId = this.modalDetails.ProjectId;
    SupervisionsObj.Number = this.modalDetails.SupervisionNumber;
    SupervisionsObj.ManagerNotes = '';
    SupervisionsObj.ReceivedEmpId = this.modalDetails.RecevierSelectId;
    SupervisionsObj.PhaseId = this.modalDetails.PhaseId;
    SupervisionsObj.PieceNo = String(this.modalDetails.PieceNo);
    SupervisionsObj.LicenseNo = String(this.modalDetails.LicenseNumber);
    SupervisionsObj.OutlineNo = String(this.modalDetails.OutlineNo);
    SupervisionsObj.Date = this._sharedService.date_TO_String(
      this.modalDetails.SupervisionDate
    );
    SupervisionsObj.VisitDate = this._sharedService.date_TO_String(
      this.modalDetails.VisitDate
    );
    SupervisionsObj.MunicipalSelectId = this.modalDetails.MunicipalSelectId;
    SupervisionsObj.SubMunicipalitySelectId =
      this.modalDetails.SubMunicipalitySelectId;
    SupervisionsObj.ProBuildingTypeSelectId =
      this.modalDetails.ProBuildingTypeSelectId;
    SupervisionsObj.DistrictName = this.modalDetails.DistrictName;
    SupervisionsObj.ProBuildingDisc = this.modalDetails.ProBuildingDisc;
    SupervisionsObj.AdwARid = this.modalDetails.AdwARid;
    SupervisionsObj.WorkerId = this.modalDetails.WorkerNameSelectId;

    var CheckValid = 1;
    this.load_AllSuperPhaseDet.forEach((element: any) => {
      if (element.nameAr == null) {
        CheckValid = 0;
      }
    });
    if (CheckValid == 0) {
      this.toast.error('من فضلك أكمل بيانات بنود المرحلة', this.translate.instant('Message'));
      return;
    }

    this.load_AllSuperPhaseDet.forEach((element: any) => {
      var SupervisionsDetailsObj: any = {};

      SupervisionsDetailsObj.NameAr = element.nameAr;
      SupervisionsDetailsObj.Note = element.note;
      SupervisionsDetailsObj.IsRead = 0;

      SupervisionsDetailsList.push(SupervisionsDetailsObj);
    });
    SupervisionsObj.SupervisionDetails = SupervisionsDetailsList;

    this.disableButtonSave_Supervision = true;
    setTimeout(() => {
      this.disableButtonSave_Supervision = false;
    }, 7000);
    console.log(SupervisionsObj);
    var obj = SupervisionsObj;
    this._supervisionsService
      .SupervisionAvailability(obj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
          model?.hide();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  modalDetails: any = {
    SupervisionId: 0,
    CustomerId: null,
    ProjectId: null,
    PhaseId: null,
    VisitDate: null,
    SupervisionNumber: null,
    SupervisionDate: null,
    WorkerNameSelectId: null,
    RecevierSelectId: null,
    OfficeName: null,
    LicenseNumber: null,
    OutlineNo: null,
    PieceNo: null,
    MunicipalSelectId: null,
    SubMunicipalitySelectId: null,
    ProBuildingTypeSelectId: null,
    ProBuildingDisc: null,
    DistrictName: null,
    AdwARid: null,
    type: '',
  };
  modal?: BsModalRef;
  addNewSupervision?: BsModalRef;

  resetModal() {
    this.modalDetails = {
      AgencData: null,
      CustomerNameAr: null,
      CustomerNameEn: null,
      Id: null,
      ResponsiblePerson: null,
      Name: null,
      CustomerId: null,
      BranchId: null,
      CustomerCode: null,
      CustomerName: null,
      CustomerNationalId: null,
      NationalIdSource: null,
      CustomerAddress: null,
      CustomerEmail: null,
      CustomerPhone: null,
      CustomerMobile: null,
      CustomerTypeId: '1',
      Notes: null,
      LogoUrl: null,
      AttachmentUrl: null,
      CommercialActivity: null,
      CommercialRegister: null,
      CommercialRegDate: null,
      CommercialRegHijriDate: null,
      AccountId: null,
      ProjectNo: null,
      GeneralManager: null,
      AgentName: null,
      AgentType: null,
      AgentNumber: null,
      AgentAttachmentUrl: null,
      AccountName: null,
      AddDate: null,
      CustomerTypeName: null,
      AddUser: null,
      CompAddress: null,
      PostalCodeFinal: null,
      ExternalPhone: null,
      Country: null,
      Neighborhood: null,
      StreetName: null,
      BuildingNumber: null,
      CommercialRegInvoice: null,
      CityId: null,
      CityName: null,
      NoOfCustProj: null,
      NoOfCustProjMark: null,
      AddedcustomerImg: null,
      Projects: null,
      AccountCodee: null,
      TotalRevenue: null,
      TotalExpenses: null,
      Invoices: null,
      Transactions: null,
    };
  }
  log(asd: any) {
    console.log(asd);
  }

  //----------------------------- Supervision Options ------------------------------------

  SupervisionRowSelected: any;
  getSupervisionRow(row: any) {
    this.SupervisionRowSelected = row;
    console.log(this.SupervisionRowSelected);
  }
  availableSupervision() {
    var type = 0;
    var typeAdmin = 0;
    if (this.checkedEmail == true) type = 1;
    else if (this.checkedPhone == true) type = 2;
    else if (this.checkedEmail == true && this.checkedPhone == true) type = 3;

    if (this.checkedEmailAdmin == true) typeAdmin = 1;
    else if (this.checkedPhoneAdmin == true) typeAdmin = 2;
    else if (this.checkedEmailAdmin == true && this.checkedPhone == true)
      typeAdmin = 3;
    this._supervisionsService
      .ConfirmSupervision(
        this.SupervisionRowSelected.supervisionId,
        type,
        typeAdmin
      )
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
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
  confirmDelete() {
    this._supervisionsService
      .DeleteSupervision(this.SupervisionRowSelected.supervisionId)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
        } else {
          this.toast.error(
            result.reasonPhrase,
            this.translate.instant('Message')
          );
        }
      });
  }

  checkedClient: any = false;
  checkedCont: any = false;
  checkedOffice: any = false;
  resetCheckbox() {
    this.checkedClient = false;
    this.checkedCont = false;
    this.checkedOffice = false;
  }
  SendMSupervision() {
    if (
      this.checkedClient == false &&
      this.checkedCont == false &&
      this.checkedOffice == false
    ) {
      this.toast.error(
        'من فضلك أختر بريد واحد علي الأقل',
        this.translate.instant('Message')
      );
      return;
    }
    var checkedObj: any = {};
    checkedObj.SupervisionId = this.SupervisionRowSelected.supervisionId;
    if (this.checkedClient == true) checkedObj.EmailStatusCustomer = 1;
    else checkedObj.EmailStatusCustomer = 0;
    if (this.checkedCont == true) checkedObj.EmailStatusContractor = 1;
    else checkedObj.EmailStatusContractor = 0;
    if (this.checkedOffice == true) checkedObj.EmailStatusOffice = 1;
    else checkedObj.EmailStatusOffice = 0;

    this._supervisionsService
      .SendMSupervision(checkedObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
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
  SendWSupervision2() {
    if (
      this.checkedClient == false &&
      this.checkedCont == false &&
      this.checkedOffice == false
    ) {
      this.toast.error(
        'من فضلك أختر رقم واحد علي الأقل',
        this.translate.instant('Message')
      );
      return;
    }
    var checkedObj: any = {};
    checkedObj.SupervisionId = this.SupervisionRowSelected.supervisionId;
    checkedObj.environmentURL = environment.PhotoURL;
    if (this.checkedClient == true) checkedObj.EmailStatusCustomer = 1;
    else checkedObj.EmailStatusCustomer = 0;
    if (this.checkedCont == true) checkedObj.EmailStatusContractor = 1;
    else checkedObj.EmailStatusContractor = 0;
    if (this.checkedOffice == true) checkedObj.EmailStatusOffice = 1;
    else checkedObj.EmailStatusOffice = 0;

    this._supervisionsService
      .SendWSupervision(checkedObj)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
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

  uploadedFiles: any=[];

  SendWSupervision(element:any,modal:any) {
    debugger
    if (this.checkedClient == false &&this.checkedCont == false &&this.checkedOffice == false) {
      this.toast.error('من فضلك أختر رقم واحد علي الأقل',this.translate.instant('Message'));
      return;
    }
    console.log(element);
    // return;
    const formData = new FormData();
    if (element.files.length > 0) {
      formData.append('UploadedFile', element.files[0]);
      formData.append('SupervisionId', this.SupervisionRowSelected.supervisionId);
      if (this.checkedClient == true) formData.append('EmailStatusCustomer', "1");
      else formData.append('EmailStatusCustomer', "0");
      if (this.checkedCont == true) formData.append('EmailStatusContractor', "1");
      else formData.append('EmailStatusContractor', "0");
      if (this.checkedOffice == true) formData.append('EmailStatusOffice', "1");
      else formData.append('EmailStatusOffice', "0");
      // formData.append('Notes', element.WhatsAppText);
      formData.append('environmentURL', environment.PhotoURL);

      this._supervisionsService
        .SendWSupervision(formData)
        .subscribe((result: any) => {
          if (result.statusCode == 200) {
            modal?.hide();
            this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
          } else {
            this.toast.error(this.translate.instant(result.reasonPhrase), this.translate.instant('Message'));
          }
        });
    }
    else
    {
      this.toast.error(this.translate.instant("أختر الملف"), this.translate.instant('Message'));
    }
  }



  PhaseDetailsGrid: any = {
    supervisionId: null,
    customerName: null,
    phaseId: null,
    phaseName: null,
    DetailsList: [],
  };
  resetPhaseDetailsGrid() {
    this.PhaseDetailsGrid = {
      supervisionId: null,
      customerName: null,
      phaseId: null,
      phaseName: null,
      DetailsList: [],
    };
  }
  GetAllSupervisionDetailsBySuperId(ele: any, model: any) {
    this.resetPhaseDetailsGrid();
    this.PhaseDetailsGrid.supervisionId = ele.supervisionId;
    this.PhaseDetailsGrid.customerName = ele.customerName;
    this.PhaseDetailsGrid.phaseId = ele.phaseId;
    this.PhaseDetailsGrid.phaseName = ele.phaseName;

    this._supervisionsService
      .GetAllSupervisionDetailsBySuperId(ele.supervisionId)
      .subscribe((data) => {
        console.log(data);
        this.PhaseDetailsGrid.DetailsList = data;
        console.log(this.PhaseDetailsGrid.DetailsList);
        model?.show();
      });
  }
  addNewRow() {
    var maxVal = 0;
    debugger;
    if (this.PhaseDetailsGrid.DetailsList.length > 0) {
      maxVal = Math.max(
        ...this.PhaseDetailsGrid.DetailsList.map(
          (o: { superDetId: any }) => o.superDetId
        )
      );
    } else {
      maxVal = 0;
    }
    let Task = {
      superDetId: maxVal + 1,
      nameAr: null,
      Note: null,
      isRead: 0,
      imageUrl: null,
    };
    this.PhaseDetailsGrid.DetailsList.push(Task);
  }

  deleteRow(idRow: any) {
    debugger;
    let index = this.PhaseDetailsGrid.DetailsList.findIndex(
      (d: { superDetId: any }) => d.superDetId == idRow
    );
    this.PhaseDetailsGrid.DetailsList.splice(index, 1);
  }

  downloadFile(data: any) {
    debugger;
    var link = environment.PhotoURL + data.imageUrl;
    window.open(link, '_blank');
  }
  public _pro_SupervisionDetails: Pro_SupervisionDetails;
  SaveSuperDet(modal: any) {
    var CheckValid = 1;
    this.PhaseDetailsGrid.DetailsList.forEach((element: any) => {
      if (element.nameAr == null) {
        CheckValid = 0;
      }
    });
    if (CheckValid == 0) {
      this.toast.error('من فضلك أكمل البيانات', this.translate.instant('Message'));
      return;
    }
    var _pro_SupervisionDetailsList: any = [];
    debugger;
    this.PhaseDetailsGrid.DetailsList.forEach((element: any) => {
      this._pro_SupervisionDetails = new Pro_SupervisionDetails();
      this._pro_SupervisionDetails.superDetId = 0;
      this._pro_SupervisionDetails.supervisionId =
        this.PhaseDetailsGrid.supervisionId;
      this._pro_SupervisionDetails.nameAr = element.nameAr;
      this._pro_SupervisionDetails.note = element.note;
      this._pro_SupervisionDetails.isRead = element.isRead;
      this._pro_SupervisionDetails.imageUrl = element.imageUrl;

      _pro_SupervisionDetailsList.push(this._pro_SupervisionDetails);
    });

    this._supervisionsService
      .SaveSuperDet(_pro_SupervisionDetailsList)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.PhaseDetailsGrid.DetailsList = [];
          this.GetAllSupervisionDetailsBySuperId(this.PhaseDetailsGrid, null);
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });

    console.log('this.PhaseDetailsGrid.DetailsList');
    console.log(this.PhaseDetailsGrid.DetailsList);
  }
  //-----------------------(End)---- Supervision Options ------------------------------------

  addNewRow_AddSup() {
    debugger;
    console.log('----------------------');
    console.log(this.load_AllSuperPhaseDet);
    var maxVal = 0;
    debugger;
    if (this.load_AllSuperPhaseDet.length > 0) {
      maxVal = Math.max(
        ...this.load_AllSuperPhaseDet.map(
          (o: { phaseDetailesId: any }) => o.phaseDetailesId
        )
      );
    } else {
      maxVal = 0;
    }
    let Task = {
      phaseDetailesId: maxVal + 1,
      nameAr: null,
      Note: null,
      isRead: 0,
      imageUrl: null,
    };
    this.load_AllSuperPhaseDet.push(Task);
  }

  deleteRow_AddSup(idRow: any) {
    debugger;
    let index = this.load_AllSuperPhaseDet.findIndex(
      (d: { phaseDetailesId: any }) => d.phaseDetailesId == idRow
    );
    this.load_AllSuperPhaseDet.splice(index, 1);
  }
  public _Details: Pro_Super_PhaseDet;

  SaveSuperDet_AddSup(modal: any) {
    var CheckValid = 1;
    this.load_AllSuperPhaseDet.forEach((element: any) => {
      if (element.nameAr == null) {
        CheckValid = 0;
      }
    });
    if (CheckValid == 0) {
      this.toast.error('من فضلك أكمل البيانات', this.translate.instant('Message'));
      return;
    }
    var _DetailsList: any = [];
    debugger;
    this.load_AllSuperPhaseDet.forEach((element: any) => {
      this._Details = new Pro_Super_PhaseDet();
      this._Details.phaseDetailesId = 0;
      this._Details.phaseId = this.modalDetails.PhaseId;
      this._Details.nameAr = element.nameAr;
      //this._Details.note=element.note;
      _DetailsList.push(this._Details);
    });

    this._supervisionsService
      .SaveSuperPhaseDet(_DetailsList)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.load_AllSuperPhaseDet = [];
          this.GetAllSuperPhaseDet();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });

    console.log('this.load_AllSuperPhaseDet');
    console.log(this.load_AllSuperPhaseDet);
  }

  decline() {}
  CheckExist(value: any) {
    if (value != null) return true;
    else return false;
  }
  showmsg(msg: any) {
    this.toast.error(msg, this.translate.instant('Message'));
  }

  SupervisionPrintBase: any = null;
  CustomDataPrintBase: any = {
    OrgImg: null,
  };
  resetCustomDataContract() {
    this.SupervisionPrintBase = null;
    this.CustomDataPrintBase = {
      OrgImg: null,
    };
  }
  PrintSupervisionBase(obj: any) {
    debugger;
    this._supervisionsService
      .PrintSupervisionMail(obj.supervisionId)
      .subscribe((data) => {
        debugger;
        this.SupervisionPrintBase = data;
        if (this.SupervisionPrintBase?.org_VD.logoUrl)
          this.CustomDataPrintBase.OrgImg =
            environment.PhotoURL + this.SupervisionPrintBase?.org_VD.logoUrl;
        else this.CustomDataPrintBase.OrgImg = null;
        console.log(obj);
        console.log(this.SupervisionPrintBase);
      });
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
  GetStatusName(item: any) {
    if (item.isRead == 1) {
      return 'تم الأستلام';
    } else if (item.isRead == 1) {
      return 'غير متوفر';
    } else {
      return 'لم يتم الاستلام';
    }
  }

  SupervisionPrintData: any = null;
  CustomDataSupervision: any = {
    OrgImg: null,
    BaladyImg: null,
    hammerCourt: null,
    HeadImageUrl: null,
    HeadImageUrl2: null,
    stampUrl: null,
  };
  SupervisionReport(obj: any) {
    this._supervisionsService
      .ChangeSupervision(obj.supervisionId, obj.superCode)
      .subscribe((data) => {
        this.SupervisionPrintData = data;
        this.CustomDataSupervision.BaladyImg = '/assets/images/logo_Balady.png';
        this.CustomDataSupervision.hammerCourt =
          '/assets/images/hammerCourt.png';
        console.log('this.SupervisionPrintData');
        console.log('-------------------------------------');
        console.log(this.SupervisionPrintData);
        console.log(this.CustomDataSupervision.stampUrl);

        if (
          this.SupervisionPrintData.supervision.length > 0 &&
          this.SupervisionPrintData?.supervision[0].headImageUrl
        )
          this.CustomDataSupervision.HeadImageUrl =
            environment.PhotoURL +
            this.SupervisionPrintData?.supervision[0].headImageUrl;
        else this.CustomDataSupervision.HeadImageUrl = null;

        if (
          this.SupervisionPrintData.supervision.length > 0 &&
          this.SupervisionPrintData?.supervision[0].headImageUrl2
        )
          this.CustomDataSupervision.HeadImageUrl2 =
            environment.PhotoURL +
            this.SupervisionPrintData?.supervision[0].headImageUrl2;
        else this.CustomDataSupervision.HeadImageUrl2 = null;

        if (this.SupervisionPrintData?.stampUrl)
          this.CustomDataSupervision.stampUrl =
            environment.PhotoURL + '/' + this.SupervisionPrintData?.stampUrl;
        else this.CustomDataSupervision.stampUrl = null;

        if (this.SupervisionPrintData?.org_VD.logoUrl)
          this.CustomDataSupervision.OrgImg =
            environment.PhotoURL + this.SupervisionPrintData?.org_VD.logoUrl;
        else this.CustomDataSupervision.OrgImg = null;
      });
  }

  counter(i: number) {
    return new Array(i);
  }
}
