import { Auditable } from "./auditable";
import { Customer } from "./customer";
import { Users } from "./users";

export class CustomerMail extends Auditable {
    mailId: number;
    customerId: number | null;
    senderUser: number | null;
    mailText: string | null;
    mailSubject: string | null;
    date: string | null;
    hijriDate: string | null;
    fileUrl: string | null;
    allCustomers: boolean;
    branchId: number | null;
    customer: Customer | null;
    users: Users | null;
    assignedCustomersIds: number[] | [];
}
