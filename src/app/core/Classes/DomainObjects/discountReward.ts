import { Auditable } from "./auditable";
import { Employees } from "./employees";
import { Transactions } from "./transactions";

export class DiscountReward extends Auditable {
    discountRewardId: number;
    employeeId: number | null;
    amount: number | null;
    date: string | null;
    startDate: string | null;
    endDate: string | null;
    hijriDate: string | null;
    type: number | null;
    notes: string | null;
    monthNo: number | null;
    employees: Employees | null;
    transactionDetails: Transactions[] | null;
}
