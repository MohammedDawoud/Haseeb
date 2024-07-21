export class VacationVM {
    vacationId: number;
    employeeId: number | null;
    vacationTypeId: number | null;
    startDate: string | null;
    startHijriDate: string | null;
    endDate: string | null;
    endHijriDate: string | null;
    vacationReason: string | null;
    vacationStatus: number | null;
    isDiscount: boolean | null;
    discountAmount: number | null;
    userId: number | null;
    vacationTypeName: string | null;
    vacationStatusName: string | null;
    employeeName: string | null;
    isSearch: boolean;
    date: string | null;
    acceptedDate: string | null;
    daysOfVacation: number;
    timeStr: string | null;
    branchName: string | null;
    decisionType: number | null;
    backToWorkDate: string | null;
    acceptUser: string | null;
    fileUrl: string | null;
    fileName: string | null;
}