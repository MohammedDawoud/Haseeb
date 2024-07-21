import { Auditable } from "./auditable";
import { Employees } from "./employees";

export class Attendees extends Auditable {
    attendeesId: number;
    empId: number | null;
    date: string | null;
    dayOfWeek: string | null;
    day: number | null;
    status: number;
    workMinutes: number;
    actualWorkMinutes: number;
    isLate: boolean;
    lateMinutes: number;
    isOverTime: boolean;
    overTimeMinutes: number;
    discount: number;
    bonus: number;
    isVacancy: boolean;
    isLateCheckIn: boolean;
    lateCheckInMinutes: number;
    isEarlyCheckOut: boolean;
    earlyCheckOutMin: number;
    isEntry: boolean;
    isOut: boolean;
    isRealVacancy: boolean;
    isVacancyEmp: boolean;
    isDone: boolean;
    attTimeId: number | null;
    branchId: number;
    employees: Employees | null;
}
