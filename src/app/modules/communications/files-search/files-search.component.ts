import { Component } from '@angular/core';
import { RestApiService } from 'src/app/shared/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-files-search',
  templateUrl: './files-search.component.html',
  styleUrls: ['./files-search.component.scss'],
})
export class FilesSearchComponent {
  title: any = {
    main: {
      name: {
        ar: 'الاتصالات الإدارية',
        en: 'Administrative Communications',
      },
      link: '/communications',
    },
    sub: {
      ar: 'بحث في الملفات ',
      en: 'Search in Fiels',
    },
  };

  data: any = {
    tempData: null,
    fileContact: [],
    filter: {
      enable: false,
      date: null,
    },
  };
  constructor(private api: RestApiService, private modalService: NgbModal) {
    this.getData();
  }
  open(content: any, data: any) {
    this.data.tempData = data;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
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
    this.api.get('../../../../../../assets/calls.json').subscribe({
      next: (data: any) => {
        // assign data to table
        this.data.fileContact = data.fileContact;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  applyFilter(event: Event) {}
}
