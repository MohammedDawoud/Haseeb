import { Auditable } from "./auditable";
import { Employees } from "./employees";

export class PayrollMarches extends Auditable {
    payrollId: number;
    empId: number | null;
    monthNo: number;
    postDate: string | null;
    mainSalary: number | null;
    salaryOfThisMonth: number | null;
    bonus: number | null;
    communicationAllawance: number | null;
    professionAllawance: number | null;
    transportationAllawance: number | null;
    housingAllowance: number | null;
    monthlyAllowances: number | null;
    extraAllowances: number | null;
    totalRewards: number | null;
    totalDiscounts: number | null;
    totalLoans: number | null;
    totalSalaryOfThisMonth: number | null;
    totalAbsDays: number | null;
    totalVacations: number | null;
    isPostVoucher: boolean | null;
    taamen: string | null;
    isPostPayVoucher: boolean | null;
    employee: Employees | null;
}
