import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { RestApiService } from 'src/app/shared/services/api.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { OutInboxrviceService } from 'src/app/core/services/Communications/out-inboxrvice.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OutInBoxVM } from 'src/app/core/Classes/ViewModels/outInBoxVM';
import { OutInBox } from 'src/app/core/Classes/DomainObjects/outInBox';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent {
  title: any = {
    main: {
      name: {
        ar: 'الاتصالات الإدارية',
        en: 'Administrative Communications',
      },
      link: '/communications',
    },
    sub: {
      ar: 'البحث في الوارد',
      en: 'Search in Inbox',
    },
  };
  data: any = {
    tempData: null,
    alloutbox: new MatTableDataSource([{}]),
    filter: {
      enable: false,
      date: null,
      searchType: null,
    },
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
      @Output() customEvent = new EventEmitter<OutInBox>();

  displayedColumns: string[] = [
    'OutInTypeName',
    'inBox',
    'Number',
    'Date',
    'Topic',
    'FileCount',
    'ProjectNumber',
    'CustomerName',
    'OutInBoxTypeName',
    'ArchiveFilesName',
    'SideFromName',
    'SideToName',
    'operations',
  ];
  constructor(private api: RestApiService, private modalService: NgbModal,
    private _sharedService: SharedService, private _outboxservice: OutInboxrviceService,
    private router: Router,private toast: ToastrService, private translate: TranslateService) {
    this.getData();
  }
open(content: any, data: any, size: any) {
    this.data.tempData = data;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: size,
        centered: true,
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
  getData() {
    debugger
    console.log(this.filters);
    var _ouinbox = new OutInBoxVM();
    _ouinbox.type = 2;// this.filters.Type;
    _ouinbox.number = this.filters.Number;
    _ouinbox.sideToName = this.filters.SideToName;
    _ouinbox.sideFromName = this.filters.SideFromName;
    _ouinbox.outInBoxTypeName = this.filters.OutInBoxTypeName;
    _ouinbox.dateFrom = this.filters.DateFrom;
    _ouinbox.dateTo = this.filters.DateTo;
    _ouinbox.topic = this.filters.Topic;
    
    this._outboxservice.SearchOutbox(_ouinbox).subscribe({
      next: (data: any) => {
        // assign data to table
        debugger
        this.data.alloutbox = new MatTableDataSource(data);
        this.data.alloutbox.paginator = this.paginator;
        this.data.alloutbox.sort = this.sort;
      },
      error: (error) => {
        console.log(error);
      },
     });
  }
  emitCustomEvent() {
    const myObject: OutInBox = this.outboxedit; // { /* Create or fetch your object here */ };
    this.customEvent.emit(myObject);
  }
  outboxedit: any; //ServiceRequest;
  openEditoutbox(data: any) {
    debugger
        console.log(data);
        this.outboxedit = data;
    // this.modalService.open(content, { centered: true });
    this.router.navigate(['/communications/InboxAdd']); //,{ queryParams: { data: JSON.stringify(data) } });
    sessionStorage.setItem('serobj', JSON.stringify(data));
        
      }


  applyFilter(event: Event) { }
  filters: any={
    Type: 2,
    Number: null,
    Topic: null,
    SideToName: null,
    SideFromName: null,
    OutInBoxTypeName: null,
    DateFrom: null,
    DateTo:null,
    
  }
  CheckDate(event: any) {
    if (event != null) {
      debugger;
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.filters.DateFrom = from;
      this.filters.DateTo = to;
      this.getData();
    } else {
      this.filters.DateFrom = '';
      this.filters.DateTo = '';
      //this.RefreshData();
    }
  }
  cleardata() {
    if (this.data.filter.searchType == 1) {
    this.filters.Type= null;
    this.filters.Topic= null;
    this.filters.SideToName= null;
    this.filters.SideFromName= null;
    this.filters.OutInBoxTypeName= null;
    this.filters.DateFrom= null;
    this.filters.DateTo = null;
    }else if (this.data.filter.searchType == 2) {
          this.filters.Type= null;
    this.filters.Number= null;
    this.filters.SideToName= null;
    this.filters.SideFromName= null;
    this.filters.OutInBoxTypeName= null;
    this.filters.DateFrom= null;
    this.filters.DateTo = null;
    }else if (this.data.filter.searchType == 3) {
          this.filters.Type= null;
    this.filters.Number= null;
    this.filters.Topic= null;
    this.filters.SideFromName= null;
    this.filters.OutInBoxTypeName= null;
    this.filters.DateFrom= null;
    this.filters.DateTo = null;
    }else if (this.data.filter.searchType == 4) {
          this.filters.Type= null;
    this.filters.Number= null;
    this.filters.Topic= null;
    this.filters.SideToName= null;
    this.filters.OutInBoxTypeName= null;
    this.filters.DateFrom= null;
    this.filters.DateTo = null;
    }else if (this.data.filter.searchType == 5) {
    this.filters.Number= null;
    this.filters.Topic= null;
    this.filters.SideToName= null;
    this.filters.SideFromName= null;
    this.filters.OutInBoxTypeName= null;
    this.filters.DateFrom= null;
    this.filters.DateTo = null;
    } else {
    this.filters.Type= null;
     this.filters.Number= null;
    this.filters.Topic= null;
    this.filters.SideToName= null;
    this.filters.SideFromName= null;
    this.filters.OutInBoxTypeName= null;
    this.filters.DateFrom= null;
    this.filters.DateTo = null;
    }
  }
   DeleteOutInBox(modal:any) {
    debugger;
   
    this._outboxservice.DeleteOutInBox(this.data.tempData.outInBoxId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          modal.dismiss();
          this.getData();
         
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

    baseurl: any = environment.PhotoURL;

  AllFiles: any;
  GetAllFiles(outinboxid:any) {
    this._outboxservice.GetAllFiles(outinboxid).subscribe({
      next: (data: any) => {
        // assign data to table
        debugger
        this.AllFiles = data.result;
      },
      error: (error) => {
        console.log(error);
      },
     });
  }
}
