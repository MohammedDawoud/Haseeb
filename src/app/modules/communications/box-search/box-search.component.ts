import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RestApiService } from 'src/app/shared/services/api.service';
@Component({
  selector: 'app-box-search',
  templateUrl: './box-search.component.html',
  styleUrls: ['./box-search.component.scss'],
})
export class BoxSearchComponent {
  title: any = {
    main: {
      name: {
        ar: 'الاتصالات الإدارية',
        en: 'Administrative Communications',
      },
      link: '/communications',
    },
    sub: {
      ar: 'بحث في الصادر و الوارد',
      en: 'Search in InOutBox',
    },
  };
  data: any = {
    tempData: null,
    outinboxfile: new MatTableDataSource([{}]),
    filter: {
      enable: false,
      date: null,
      searchType: null,
    },
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'OutInTypeName',
    'Number',
    'RelatedToName',
    'Date',
    'Topic',
    'FileCount',
    'ProjectNumber',
    'CustomerName',
    'ArchiveFilesName',
    'SideFromName',
    'SideToName',
    'operations',
  ];
  constructor(private api: RestApiService) {
    this.getData();
  }

  getData() {
    this.api.get('../../../../../../assets/calls.json').subscribe({
      next: (data: any) => {
        // assign data to table
        this.data.outinboxfile = new MatTableDataSource(data.outinboxfile);
        this.data.outinboxfile.paginator = this.paginator;
        this.data.outinboxfile.sort = this.sort;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  applyFilter(event: Event) {}
}
