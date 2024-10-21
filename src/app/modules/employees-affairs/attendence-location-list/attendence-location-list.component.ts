import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AttendenceLocationService } from 'src/app/core/services/Employees-Services/attendence-location.service';
@Component({
  selector: 'app-attendence-location-list',
  templateUrl: './attendence-location-list.component.html',
  styleUrls: ['./attendence-location-list.component.scss']
})
export class AttendenceLocationListComponent {
  title: any = {
    main: {
      name: {
        ar: 'لوحة التحكم',
        en: 'Control Panel',
      },
      link: '/controlpanel',
    },
    sub: {
      ar: 'مواقع العمل ',
      en: ' Work Location',
    },
  };

  displayedColumns: string[] = [
    'name',
    //'distance',
    'Latitude',
    'Longitude',

    'operations',
  ];
  dataSource: MatTableDataSource<any>;


  constructor(
    private modalService: NgbModal,
    private _attendencelocation: AttendenceLocationService,
    private toast: ToastrService,
    private translate: TranslateService
    ,private router: Router
  ) {
    this.dataSource = new MatTableDataSource([{}]);

  }

  ngOnInit(): void {
    this.GetAllAttendencelocations();
  }
  closeResult = '';
  deletedrow:any;

  open(content: any, data?: any, type?: any,idRow?:any) {
    var sizet="lg";
    sizet=type ? (type == 'delete' ? 'md' : 'xl') : 'lg';
    this.deletedrow=data; 
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


  GetAllAttendencelocations() {
    this._attendencelocation.GetAllAttendencelocations('').subscribe((data) => {
      this.dataSource = new MatTableDataSource(data.result);
    });
  }



  openEditlocation(data?: any) {
    debugger
    console.log(data);
    // this.modalService.open(content, { centered: true });
    //this.router.navigate(['/employees/editattendencelocation']);//,{ queryParams: { data: JSON.stringify(data) } });
    this.router.navigate(['/employees/attendencelocationnew/'+data.attendenceLocationSettingsId+'']);//,{ queryParams: { data: JSON.stringify(data) } });
    sessionStorage.setItem('attlocationobj',  JSON.stringify(data));
  }

  confirmLocDelete() {
    this._attendencelocation.DeleteAttendenceLocation(this.deletedrow.attendenceLocationSettingsId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant("Message"));
        this.GetAllAttendencelocations();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }
  
}
