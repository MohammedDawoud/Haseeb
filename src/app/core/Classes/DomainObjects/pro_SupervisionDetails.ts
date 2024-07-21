import { Auditable } from "./auditable";
import { Supervisions } from "./supervisions";

export class Pro_SupervisionDetails extends Auditable {
    superDetId: number;
    supervisionId: number | null;
    nameAr: string | null;
    nameEn: string | null;
    note: string | null;
    isRead: number | null;
    branchId: number | null;
    imageUrl: string | null;
    theNumber: string | null;
    theLocation: string | null;
    supervisions: Supervisions | null;
}
