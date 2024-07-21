import { Auditable } from "./auditable";
import { VacationType } from "./vacationType";
import { Employees } from "./employees";
import { Users } from "./users";

export class Vacation extends Auditable {
    vacationId: number;
    employeeId: number | null;
    vacationTypeId: number | null;
    startDate: string | null;
    startHijriDate: string | null;
    endDate: string | null;
    endHijriDate: string | null;
    vacationReason: string | null;
    vacationStatus: number | null;
    isDiscount: boolean;
    discountAmount: number | null;
    userId: number | null;
    branchId: number;
    date: string | null;
    acceptedDate: string | null;
    daysOfVacation: number | null;
    decisionType: number | null;
    backToWorkDate: string | null;
    acceptedUser: number | null;
    vacationTypeName: VacationType | null;
    employeeName: Employees | null;
    userAcccept: Users | null;
    fileUrl: string | null;
    fileName: string | null;
}
