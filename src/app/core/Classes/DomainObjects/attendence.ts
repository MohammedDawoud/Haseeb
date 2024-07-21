import { Auditable } from "./auditable";
import { Employees } from "./employees";
import { Branch } from "./branch";

export class Attendence extends Auditable {
    attendenceId: number;
    empId: number;
    realEmpId: number;
    day: string | null;
    checkIn: string | null;
    checkOut: string | null;
    isLate: boolean | null;
    lateDuration: number | null;
    isOverTime: boolean | null;
    sameDate: string | null;
    isDone: boolean | null;
    branchId: number;
    type: number;
    source: number;
    hint: string | null;
    shiftTime: number;
    checkType: string | null;
    checkTime: Date;
    workCode: string | null;
    done: boolean;
    moveTime: number;
    attendenceDate: string | null;
    attendenceHijriDate: string | null;
    employees: Employees | null;
    branch: Branch | null;
    month: string | null;
    location: string | null;
    latitude: string | null;
    longitude: string | null;
    fromApplication: number | null;
    comment: string | null;
    Hour:string |null;
    Minute:string |null;
}
