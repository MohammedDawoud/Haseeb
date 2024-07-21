import { Auditable } from "./auditable";
import { Department } from "./department";
import { Banks } from "./banks";
import { Accounts } from "./accounts";
import { Contracts } from "./contracts";

export class Service extends Auditable {
    nameAr: string | null;
    serviceId: number;
    number: string | null;
    date: string | null;
    hijriDate: string | null;
    expireDate: string | null;
    expireHijriDate: string | null;
    userId: number | null;
    notes: string | null;
    departmentId: number | null;
    notifyCount: number | null;
    accountId: number | null;
    bankId: number | null;
    branchId: number;
    repeatAlarm: boolean;
    recurrenceRateId: number | null;
    attachmentUrl: string | null;
    department: Department | null;
    banks: Banks | null;
    account: Accounts | null;
    contracts: Contracts[] | null;
}
