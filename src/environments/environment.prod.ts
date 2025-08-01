export const environment = {
  production: true,
  apiEndPoint: 'https://haseeb-api.tameercloud.com/api/',
  PhotoURL: 'https://haseeb-api.tameercloud.com',
  LabaikEndpoint: 'https://api2.tameercloud.com/api/',
  labaikphoto: 'https://api2.tameercloud.com',
  printConfig: {
    printMode: 'template', // template
    popupProperties:
      'toolbar=false,scrollbars=false,resizable=yes,top=0,left=0,fullscreen=yes',
    pageTitle: 'tameer cloud',
    templateString: '{{printBody}}',
    styles: [
      '.customReport{@page{margin:0}}',
      '*{font-family: Cairo; }',
      '#report, .terms ,.firstPage{page-break-inside: auto;page-break-after: always;}',
      '.table-responsive, .ngx-datatable { font-family: Cairo; display: block;margin: 2em auto;width: 100%;page-break-inside: auto;page-break-after: always;}',
      '.page-count { display: none; }',
      '.invoiceNe-header {  display: flex;  align-items: center;  gap: 150px;  // justify-content: space-between;  padding: 3px 10px;}.invoiceNe-header p {  font-size: 18px;}.invoiceNe-header h1 {  font-size: 22px; }.invoiceNe-header .headerNe-right-side {  padding: 0px;}.headerNe-center-side {  text-align: center;  /*padding-right: 10px;      padding-left: 10px;*/}.headerNe-center-side h3:first-child {  margin-bottom: 7px;}.headerNe-center-side h3 {  margin: 0;  border: 1px solid #000;  padding-right: 20px;  padding-left: 20px;}.invoiceNe-header .header-left-side ul {  list-style: none;}.invoiceNe-header .header-left-side ul li {  list-style: none;}.fontNe-red {  color: #fb3030;}.fontNe-purble {  color: #5127ba;}.firstNe-table-main-heading {  display: flex;  align-items: flex-start;  justify-content: space-between;}.firstNe-table-main-heading ._mainNe-heading ul {  list-style: none;  display: flex;  margin: 0;  padding: 0;}.firstNe-table-main-heading ._mainNe-heading ul li {  background-color: #b4e7ce;  padding: 5px 10px;  text-align: center;  display: flex;  flex-direction: column;  justify-content: center;}.firstNe-table-main-heading ._mainNe-heading ul li span {  display: block;}.firstNe-table-main-heading ._mainNe-heading ul li:not(:last-child) {  margin-left: 10px;  padding-left: 75px;  padding-right: 75px;}.tableI tr th,.tableI tr td {  border-left: 1px solid #ccc;}.tableI tr th:last-child,.tableI tr td:last-child {  border-left: 0 !important;}.tableI tr td {  border-bottom: 1px solid #ccc;}.tableI tr:last-child td {  border-bottom: 0 !important;}.invoiceNe-content {  padding: 0px 5px;  color: #000000;}.invoiceNe-content .firstNe-table {  width: 50%;  margin-bottom: 0px;}.tableI {  width: 100%;}.tableI thead,.tableI tbody {  width: 100%;}.invoiceNe-content .firstNe-table th,.invoiceNe-content .firstNe-table td {  width: 25%;  text-align: center;}.qrNe-code {  margin-bottom: 5px;}.qrNe-code img {  width: 110px;}/****invoiceNe-details***/.invoiceNe-details {  display: flex;}.invoiceNe-details .secondNe-table,.invoiceNe-details .thirdNe-table {  width: 50%;}.invoiceNe-details .thirdNe-table {  margin-right: 5px;}.invoiceNe-details .secondNe-table table,.invoiceNe-details .thirdNe-table table {  width: 100%;  border: 1px solid #ccc;}.invoiceNe-details .secondNe-table table td:first-child,.invoiceNe-details .secondNe-table table td:last-child,.invoiceNe-details .thirdNe-table table td:first-child,.invoiceNe-details .thirdNe-table table td:last-child {  width: 25%;}.invoiceNe-details .secondNe-table table td:last-child,.invoiceNe-details .thirdNe-table table td:last-child {  width: 25%;  text-align: left;}.invoiceNe-details .secondNe-table table td:nth-child(2),.invoiceNe-details .thirdNe-table table td:nth-child(2) {  width: 50%;}.invoiceNe-details .secondNe-table table tr:last-child td,.invoiceNe-details .thirdNe-table table tr:last-child td {  border-bottom: 0 !important;}.invoiceNe-details .secondNe-table table td:first-child,.invoiceNe-details .thirdNe-table table td:first-child {  border-right: 0 !important;  text-align: right !important;}.invoiceNe-details .tableNe-heading {  display: flex;  align-items: center;  justify-content: space-between;  padding: 3px 15px;  background-color: #d6dcf8;  margin: 0;}.invoiceNe-details .secondNe-table .tableNe-heading {  background-color: #d6dcf8;}.invoiceNe-details .thirdNe-table .tableNe-heading {  background-color: #d9ffed;}/*********totalNe-invoice*****/.totalNe-invoice {  margin-top: 5px;}.totalNe-invoice table {  width: 100%;  border-spacing: 0;}.totalNe-invoice thead th {  color: #000;  border-top: 1px solid #ccc;}.totalNe-invoice thead tr:last-child th {  background-color: #c2bfe9;}.totalNe-invoice h3 {  background-color: #ccc;  padding: 5px;  margin-bottom: 5px;}.totalNe-invoice thead th {  padding: 15px 0;}.totalNe-invoice thead th,.totalNe-invoice td {  border-right: 1px solid #ccc;}.totalNe-invoice thead th:last-child,.totalNe-invoice td:last-child {  border-left: 1px solid #ccc;}.totalNe-invoice td {  border-bottom: 1px solid #ccc;  padding: 5px;  text-align: center;}.invoiceNe-value {  display: flex;  align-items: flex-start;  justify-content: flex-start;  margin-bottom: 5px;  margin-left: 14px;}  ',
      '.invoiceNe-divided {   display: flex;   align-items: flex-start; justify-content: space-between; }',
      '.invoiceNe-value .invoiceNe-value-right-side {     margin-top: 5px;   }',
      '.invoiceNe-value-center-side {      margin-top: 5px;     margin-right: -100px;   }',
      '.invoiceNe-value-left-side { margin-right: 50px;   height: 150px;    width: 200px;  object-fit: cover; }',
      '.invoiceNe-value p {  margin-bottom: 0;  font-weight: bold; font-size: 14px; }',
      '.invoiceNe-footer {   text-align: center; }',
      '.invoiceNe-footer h4 {    font-size: 14px; } ',
      '.invoiceNe-footer p { margin-bottom: 0; font-size: 15px; }',
      '.header-title {	 position: relative;	 text-align: center;	 color: #559b0b;	 margin-bottom: 0 !important;	 font-size: 19px !important;	 line-height: 1.3em;	 margin-bottom: 20px !important;} .header-title::after, .header-title::before {	 content: "";	 position: absolute;	 top: 50%;	 transform: translateY(-50%);	 width: 25%;	 height: 10px;	 background-color: #0d706e;} .header-title::after {	 inset-inline-start: 0;} .header-title::before {	 inset-inline-end: 0;} .firstPage .row > * {	 padding-left: 5px !important;	 padding-right: 5px !important;} .firstPage span {	 font-size: 14px !important;} .firstPage span.selected {	 background-color: #fff;	 border-radius: 50px;	 padding: 3px 10px;	 border: 2px solid #86bf47;} .first-tabel {	/*margin-top: 50px;	*/} .first-tabel .green-dark {	 background-color: #0d706e;	 color: #fff;	 font-size: 25px;} .first-tabel thead tr th {	 border: 3px solid #fff;	/*border-bottom: 5px solid #fff;	*/	 font-size: 12px;} .first-tabel tbody tr p {	 height: auto !important;	 margin: 0px;} .light-greentbl {	 background-color: #85bd48 !important;	 box-shadow: none !important;} .light-bluetbl {	 background-color: #41c1cb !important;} .light-graytbl {	 background-color: #a6a6a6 !important;} .dark_greentbl {	 background-color: #07706d !important;} .first-tabel tbody .light-green {	 color: #fff;	 font-size: 30px;	 border-color: #fff !important;} .first-tabel tbody .light-green p {	 padding-right: 20px !important;} .first-tabel tbody .edit-f p {	 margin-top: 40%;} .first-tabel tbody .big-font {	 font-size: 17px !important;	 color: white;} .first-tabel tbody tr {	/*border: 5px solid #fff;	*/} .first-tabel tbody tr th, .first-tabel tbody tr td {	 border: 0px;	 border-right: 1px solid #fff;	 border-left: 1px solid #fff;} .borderless {	 border: 0px !important;} .lastLines {	 text-align: right;} .lastLines span {	 background-color: #800000 !important;	 color: white;} ',
      '.office_data {  border: 2px solid #0d706e;}.office_data *:not(i) {  font-size: 13px !important;}.office_data p {  margin: 0 !important;  padding: 2px 10px;  margin: 3px 0px !important;  border-right: 1px solid #fff;}',
      '.circleAccept{background-color: #fff;border: 3px solid #86bf47;border-radius: 33%;width: 32%;} .circleRefuse{background-color: #fff;border: 3px solid #e41313;border-radius: 33%;width: 32%;}.circleNote{background-color: #fff;border: 3px solid #0d706e;border-radius: 33%;width: 32%;}',
      '.grid-container {display: grid;grid-template-columns: auto auto;}  .grid-container2 {display: grid;grid-template-columns: auto auto auto;} .grid-container3 {display: grid;grid-template-columns: auto auto auto auto;} .square {height: 30px;width: 30px;border: 1px solid #000000;} .titleSup {background: rgba(0, 0, 0, 0.05) !important;font-weight: 600;} .text-center{text-align: center !important;}',
    ],
  },
  printConfig2: {
  printMode: 'template',
  popupProperties: 'toolbar=no,scrollbars=no,resizable=yes,top=0,left=0,fullscreen=yes',
  pageTitle: 'tameer cloud',
  templateString: '{{printBody}}',
  styles: [
    `* {
      font-family: Cairo, Arial, sans-serif;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }`,

    // General page/table
    `
    .page-table {
      background-color: #ffffff !important;
      padding: 30px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
    }

    table th, table td {
      padding: 8px;
      border: 1px solid #000 !important;
    }

    thead {
      background-color: midnightblue !important;
      color: white !important;
    }

    th {
      background-color: midnightblue !important;
      color: white !important;
      font-size: 13px;
    }

    .total-row, tr.total-row {
      background-color: #eee !important;
      font-weight: bold !important;
    }
    `,

    // Optional cover styles
    `
    .page-cover {
      background: url('/assets/images/cover-bg.jpeg') no-repeat center center !important;
      background-size: cover !important;
      height: 100vh;
      text-align: center;
      padding-top: 80px;
      color: black;
    }

    .page-cover h2 {
      color: red !important;
      font-weight: bold !important;
    }
    `
  ],
}
};
