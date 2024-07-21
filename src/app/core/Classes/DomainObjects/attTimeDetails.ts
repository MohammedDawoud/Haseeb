import { Auditable } from "./auditable";
import { AttendaceTime } from "./attendaceTime";

export class AttTimeDetails extends Auditable {
    timeDetailsId: number;
    attTimeId: number | null;
    day: number;
    dayDate: string | null;
    _1StFromHour: string | null;
    _1StToHour: string | null;
    _2ndFromHour: string | null;
    _2ndToHour: string | null;
    isWeekDay: boolean | null;
    branchId: number;
    attendaceTime: AttendaceTime | null;
}
