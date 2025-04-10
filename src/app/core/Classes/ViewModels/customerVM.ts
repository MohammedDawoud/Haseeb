import { ProjectVM } from "./projectVM";
import { InvoicesVM } from "./invoicesVM";
import { TransactionsVM } from "./transactionsVM";

export class CustomerVM {
    id: number;
    name: string | null;
    customerId: number;
    branchId: number | null;
    customerCode: string | null;
    customerName: string | null;
    customerNameAr: string | null;
    customerNameEn: string | null;
    customerNationalId: string | null;
    nationalIdSource: number | null;
    customerAddress: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    customerMobile: string | null;
    customerTypeId: number | null;
    notes: string | null;
    logoUrl: string | null;
    attachmentUrl: string | null;
    commercialActivity: string | null;
    commercialRegister: string | null;
    commercialRegDate: string | null;
    commercialRegHijriDate: string | null;
    accountId: number | null;
    projectNo: string | null;
    generalManager: string | null;
    agentName: string | null;
    agentType: number | null;
    agentNumber: string | null;
    agentAttachmentUrl: string | null;
    responsiblePerson: string | null;
    accountName: string | null;
    addDate: string | null;
    customerTypeName: string | null;
    addUser: string | null;
    compAddress: string | null;
    postalCodeFinal: string | null;
    externalPhone: string | null;
    country: string | null;
    neighborhood: string | null;
    streetName: string | null;
    buildingNumber: string | null;
    commercialRegInvoice: string | null;
    cityId: number | null;
    cityName: string | null;
    noOfCustProj: number | null;
    noOfCustProjMark: string | null;
    addedcustomerImg: string | null;
    projects: ProjectVM[]=[];
    accountCodee: string | null;
    totalRevenue: number | null;
    totalExpenses: number | null;
    invoices: InvoicesVM[]=[];
    transactions: TransactionsVM[]=[];
}
