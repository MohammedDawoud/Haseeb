import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent {
  constructor(private api: RestApiService, private modalService: NgbModal) {
    let messages = [
      {
        sender: 'asdaw',
        reciever: 'asdaw',
        date: '2-2-2022',
        topic: 'topic',
        text: 'te qwd qwd xt',
      },
      {
        sender: 'ffwefwef',
        reciever: 'asdaw',
        date: '2-2-2022',
        topic: 'topic',
        text: 'text',
      },
      {
        sender: 'zdczdc',
        reciever: 'asdaw',
        date: '2-2-2022',
        topic: 'topic',
        text: 'text',
      },
      {
        sender: 'qdq',
        reciever: 'asdaw',
        date: '2-2-2022',
        topic: 'topic',
        text: 'textdwq wqd',
      },
    ];
    this.data.data = new MatTableDataSource(messages);
    this.data.data.paginator = this.paginator;
    this.data.data.sort = this.sort;
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  title: any = {
    main: {
      name: {
        ar: 'الرسائل',
        en: 'Messages',
      },
      link: '/dash/messages',
    },
    sub: {
      ar: 'الوارد ',
      en: 'Inbox',
    },
  };
  data: any = {
    type: '0',
    data: new MatTableDataSource([{}]),
  };
  columns: any = ['sender', 'topic', 'text', 'date', 'delete'];
  setCustomersType(type: any) {
    // change table cells
    if (type == '0') {
      this.columns = ['sender', 'topic', 'text', 'date', 'delete'];
      this.title.sub = { ar: 'الوارد ', en: 'Inbox' };
    } else if (type == '1') {
      this.columns = ['reciever', 'topic', 'text', 'date', 'delete'];
      this.title.sub = { ar: 'الصادر', en: 'Sender' };
    } else {
      this.columns = ['sender', 'reciever', 'topic', 'text', 'date'];
      this.title.sub = { ar: ' سلة المهملات', en: ' Trash ' };
    }
    // assign data
  }
  open(content: any, data: any, size: any, positions?: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: size,
        centered: !positions ? true : false,
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
}
