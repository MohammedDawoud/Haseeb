import { Auditable } from "./auditable";
import { AttTimeDetails } from "./attTimeDetails";

export class AttendaceTime extends Auditable {
    timeId: number;
    code: string | null;
    nameAr: string | null;
    nameEn: string | null;
    notes: string | null;
    userId: number | null;
    branchId: number | null;
    attTimeDetails: AttTimeDetails[] | null;
}
