import { Auditable } from "./auditable";
import { Customer } from "./customer";
import { Users } from "./users";

export class CustomerSMS extends Auditable {
    sMSId: number;
    customerId: number | null;
    senderUser: number | null;
    sMSText: string | null;
    sMSSubject: string | null;
    date: string | null;
    hijriDate: string | null;
    allCustomers: boolean;
    branchId: number | null;
    customer: Customer | null;
    users: Users | null;
    assignedCustomersSMSIds: number[] | null;
}
