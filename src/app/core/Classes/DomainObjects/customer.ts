import { Auditable } from "./auditable";
import { City } from "./city";
import { Accounts } from "./accounts";
import { Project } from "./project";
import { Invoices } from "./invoices";
import { Transactions } from "./transactions";
import { Users } from "./users";

export class Customer extends Auditable {
    customerId: number;
    customerCode: string | null;
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
    commercialRegInvoice:string|null;
    commercialRegDate: string | null;
    commercialRegHijriDate: string | null;
    accountId: number | null;
    generalManager: string | null;
    agentName: string | null;
    agentType: number | null;
    agentNumber: string | null;
    agentAttachmentUrl: string | null;
    responsiblePerson: string | null;
    branchId: number;
    isPrivate: boolean;
    compAddress: string | null;
    postalCodeFinal: string | null;
    externalPhone: string | null;
    country: string | null;
    neighborhood: string | null;
    streetName: string | null;
    buildingNumber: string | null;
    cityId: number | null;
    city: City | null;
    accounts: Accounts | null;
    projects: Project[] | null;
    invoicess: Invoices[] | null;
    transactions: Transactions[] | null;
    addUsers: Users | null;
    // accountName:string|null;
    // accountCodee:number|null;
}
