import { Auditable } from "./auditable";

export class OfficalHoliday extends Auditable {
    id: number;
    fromDate: string;
    toDate: string;
    description: string | null;
}