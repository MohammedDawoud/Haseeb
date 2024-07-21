export class CustomerMailVM {
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
    senderUserName: string | null;
    customerEmail: string | null;
    assignedCustomersIds: number[];
}