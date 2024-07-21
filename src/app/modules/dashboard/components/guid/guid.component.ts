import { Component, ViewChild } from '@angular/core';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Guide_QuestionsAnswers } from 'src/app/core/Classes/DomainObjects/Guide_QuestionsAnswers';
import { GuideDepartmentDetails } from 'src/app/core/Classes/DomainObjects/guideDepartmentDetails';
import { GuideDepartments } from 'src/app/core/Classes/DomainObjects/guideDepartments';
import { GuidrviceService } from 'src/app/core/services/Dashboard-Services/guidrvice.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RestApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-guid',
  templateUrl: './guid.component.html',
  styleUrls: ['./guid.component.scss'],
})
export class GuidComponent {
  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  columns: any = [];

  isEditable: any = {};

  title: any = {
    main: {
      name: {
        ar: 'لوحة التحكم',
        en: 'Control Panel',
      },
      link: '/dash/support',
    },
    sub: {
      ar: ' مكتبة الشروحات      ',
      en: 'Library of explanations',
    },
  };
  step: any = 1;
  qa: any;
  closeResult = '';

  items = ['First', 'Second', 'Third'];

  departs: any = [
    { id: 1, name: 'asddvv' },
    { id: 2, name: 'werweq' },
    { id: 3, name: 'vvbasv' },
  ];

  accItems = ['First', 'Second', 'Third'];

  rows = [
    { id: 1, name_ar: 'اسم النشاط 1', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط 2', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط 3', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
  ];
  temp: any = [
    { id: 1, name_ar: 'اسم النشاط 1', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط 2', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط 3', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 1, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 2, name_ar: 'اسم النشاط', name_en: 'test test' },
    { id: 3, name_ar: 'اسم النشاط', name_en: 'test test' },
  ];
  userType: any;
  userG: any = {};
  constructor(
    private api: RestApiService,
    private modalService: NgbModal,
    private _guidservice: GuidrviceService,
    private translate: TranslateService,
    private toast: ToastrService,
    private authenticationService: AuthenticationService
  ) {
    this.getData();
    this.userG = this.authenticationService.userGlobalObj;
    this.userType = this.userG.userName;
  }
  getData() {
    this.api.get('../../../../../../assets/dropMenu.json').subscribe({
      next: (data: any) => {
        // assign requests to table
        this.qa = data.qa;
      },
      error: (error) => {
        // console.log(error);
      },
    });
  }
  link: any;
  linkname: any;

  open(content: any, type?: any, data?: any) {
    debugger;
    if (data == 'deletedept') {
      this.DepartmentDelete = type.depId;
    }
    if (data == 'OpenVideo') {
      this.link = type.link;
      this.linkname = type.nameAR;
    }
    if (data == 'editdeprtmentdetail') {
      this.refreshModel();
      this.DepartmentDetailsObj.depDetailsId = type.depDetailsId;
      this.DepartmentDetailsObj.depId = type.depId;
      this.DepartmentDetailsObj.depNameAr = type.depNameAr;
      this.DepartmentDetailsObj.header = type.header;
      this.DepartmentDetailsObj.link =
        'https://www.youtube.com/embed/' + type.link;
      this.DepartmentDetailsObj.text = type.text;
      this.DepartmentDetailsObj.type = type.type;
      this.DepartmentDetailsObj.nameAR = type.nameAR;
      this.DepartmentDetailsObj.nameEn = type.nameEn;
    }
    if (data == 'addnewdepartmentdetails') {
      this.refreshModel();
    }
    if (data == 'deletedeptdetails') {
      this.DepartmentDetailsDelete = type.depDetailsId;
    }
    if (data == 'editquestions') {
      this.refreshquestionModel();
      this.QuestionAnswersObj.guide_QuestionsAnswersId =
        type.guide_QuestionsAnswersId;
      this.QuestionAnswersObj.questionAr = type.questionAr;
      this.QuestionAnswersObj.questionEn = type.questionEn;
      this.QuestionAnswersObj.answersAr = type.answersAr;
      this.QuestionAnswersObj.answersEn = type.answersEn;
    }
    if (data == 'addquestion') {
      this.refreshquestionModel();
    }
    if (data == 'deletequestions') {
      this.QuestionAnswersDelete = type.guide_QuestionsAnswersId;
    }
    this.modalService
      .open(content, {
        animation: true,
        centered: true,
        size:
          type != 'delete'
            ? 'lg'
            : data == 'OpenVideo'
            ? '2xl'
            : type == 'delete'
            ? 'md'
            : 'xl',
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  confirm() {}

  saveOption(data: any) {}

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d: any) {
      return d.name_ar.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;

    if (this.table) {
      this.table!.offset = 0;
    }
  }

  // Save row
  save(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    // console.log('Row saved: ' + rowIndex);
    // console.log(row);
  }

  // Delete row
  delete(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.rows.splice(rowIndex, 1);
    // console.log('Row deleted: ' + rowIndex);
  }
  ////////////////////////////////////////Region Department ///////////////////////////////////////
  ngOnInit(): void {
    this.GetAllDeps();
    this.GetAllDepDetails2();
    this.GetAllQuestionAnswers();
  }
  DepartmentList: any;
  DepartmentDelete: any;
  DepartmentObj: any = {
    depId: 0,
    depNameAr: null,
    depNameEn: null,
  };
  GetAllDeps() {
    this._guidservice.GetAllDeps().subscribe((data) => {
      this.DepartmentList = data.result;
      console.log('data', data.result);
    });
  }
  editdepartment(data: any) {
    debugger;
    this.DepartmentObj.depId = data.depId;
    this.DepartmentObj.depNameAr = data.nameAr;
    this.DepartmentObj.depNameEn = data.nameEn;
  }
  SaveDepartment() {
    debugger;
    if (
      this.DepartmentObj.depNameAr == null ||
      this.DepartmentObj.depNameEn == null
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    var _dept = new GuideDepartments();
    _dept.depId = this.DepartmentObj.depId;
    _dept.depNameAr = this.DepartmentObj.depNameAr;
    _dept.depNameEn = this.DepartmentObj.depNameEn;
    this._guidservice.SaveGroups(_dept).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.GetAllDeps();
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        // this.refreshData();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }

  deletedepartment() {
    debugger;

    this._guidservice
      .DeleteDept(this.DepartmentDelete)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.GetAllDeps();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  ///////////////////////////////////////////Department Details////////////////////////////////////
  DepartmentDetails: any[];
  DepartmentDetailsMain: any;
  DepartmentDetailsarch: any;
  DepartmentDetails2: any;
  DepartmentDetailsDelete: any;
  DepartmentDetailsObj: any = {
    depDetailsId: 0,
    depId: null,
    type: null,
    header: null,
    link: null,
    text: null,
    nameAR: null,
    nameEn: null,
  };
  GetAllDepDetails2() {
    this._guidservice
      .GetAllDepDetails2(this.DepartmentDetailsarch ?? '')
      .subscribe((data) => {
        debugger;
        // this.DepartmentDetailsMain.guideDepartments = [];
        // this.DepartmentDetails = [];
        this.DepartmentDetails = data.result;
        this.DepartmentDetailsMain = this.DepartmentDetails.find(
          (item) => item.depId === 1
        );
        const index = this.DepartmentDetails.findIndex(
          (item) => item.depId === 1
        );
        this.DepartmentDetailsMain =
          this.DepartmentDetailsMain?.guideDepartments;
        if (index !== -1) {
          // Remove the item from the list
          this.DepartmentDetails.splice(index, 1);
        }
        this.DepartmentDetails2 = this.DepartmentDetails;
        console.log('data details', data.result);
      });
  }
  SaveDetails(modal: any) {
    debugger;
    if (
      this.DepartmentDetailsObj.depId == null ||
      this.DepartmentDetailsObj.link == null ||
      this.DepartmentDetailsObj.nameAR == null ||
      this.DepartmentDetailsObj.nameEn == null
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    var _dept = new GuideDepartmentDetails();
    _dept.depDetailsId = this.DepartmentDetailsObj.depDetailsId ?? 0;
    _dept.depId = this.DepartmentDetailsObj.depId;
    _dept.header = this.DepartmentDetailsObj.header;
    _dept.link = this.getVedioId(this.DepartmentDetailsObj.link);
    _dept.text = this.DepartmentDetailsObj.text;
    _dept.type = this.DepartmentDetailsObj.type ?? 0;
    _dept.nameAR = this.DepartmentDetailsObj.nameAR;
    _dept.nameEn = this.DepartmentDetailsObj.nameEn;
    this._guidservice.SaveDetails(_dept).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.GetAllDepDetails2();
        modal.dismiss();

        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        // this.refreshData();
      } else {
        this.toast.error(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    });
  }

  //Get Embeded Vedieo from youtube url
  getVedioId(url: any) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  }

  refreshModel() {
    this.DepartmentDetailsObj.depDetailsId = 0;
    this.DepartmentDetailsObj.depId = 0;
    this.DepartmentDetailsObj.depNameAr = null;
    this.DepartmentDetailsObj.header = null;
    this.DepartmentDetailsObj.link = null;
    this.DepartmentDetailsObj.text = null;
    this.DepartmentDetailsObj.type = 0;
    this.DepartmentDetailsObj.nameAR = null;
    this.DepartmentDetailsObj.nameEn = null;
  }

  deletedepartmentdetails() {
    debugger;

    this._guidservice
      .DeleteDetails(this.DepartmentDetailsDelete)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.GetAllDepDetails2();

          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  ///////////////////////////////////////////Question Answers  ////////////////////////////////////
  QuestionAnswers: any;
  QuestionAnswersDelete: any;
  QuestionAnswersObj: any = {
    guide_QuestionsAnswersId: null,
    questionAr: null,
    questionEn: null,
    answersAr: null,
    answersEn: null,
  };
  GetAllQuestionAnswers() {
    this._guidservice.GetAllQuestionAnswers().subscribe((data) => {
      debugger;

      this.QuestionAnswers = data.result;
      console.log('data questions', data.result);
    });
  }
  SaveQuestionAnswers(modal: any) {
    debugger;
    if (
      this.QuestionAnswersObj.questionAr == null ||
      this.QuestionAnswersObj.questionEn == null ||
      this.QuestionAnswersObj.answersAr == null ||
      this.QuestionAnswersObj.answersEn == null
    ) {
      this.toast.error(
        'من فضلك اكمل البيانات',
        this.translate.instant('Message')
      );
      return;
    }
    var _question = new Guide_QuestionsAnswers();
    _question.guide_QuestionsAnswersId =
      this.QuestionAnswersObj.guide_QuestionsAnswersId ?? 0;
    _question.questionAr = this.QuestionAnswersObj.questionAr;
    _question.questionEn = this.QuestionAnswersObj.questionEn;
    _question.answersAr = this.QuestionAnswersObj.answersAr;
    _question.answersEn = this.QuestionAnswersObj.answersEn;
    this._guidservice
      .SaveQuestionAnswers(_question)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.GetAllQuestionAnswers();
          modal.dismiss();

          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  refreshquestionModel() {
    this.QuestionAnswersObj.guide_QuestionsAnswersId = 0;
    this.QuestionAnswersObj.questionAr = null;
    this.QuestionAnswersObj.questionEn = null;
    this.QuestionAnswersObj.answersAr = null;
    this.QuestionAnswersObj.answersEn = null;
  }

  deletequestionAnswers() {
    debugger;

    this._guidservice
      .DeleteQuestionAnswers(this.QuestionAnswersDelete)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          this.GetAllQuestionAnswers();

          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          // this.refreshData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
}
