import { Auditable } from "../DomainObjects/auditable";
export class PayrollMarchesVM extends Auditable {
    payrollId: number;
    empId: number;
    empName: string | null;
    monthNo: number;
    monthName: string | null;
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
    isPostPayVoucher: boolean | null;
    taamen: string | null;
}