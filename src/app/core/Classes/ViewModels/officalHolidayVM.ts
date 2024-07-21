import { Auditable } from "../DomainObjects/auditable";

export class OfficalHolidayVM extends Auditable {
    id: number;
    fromDate: string;
    toDate: string;
    description: string | null;
}