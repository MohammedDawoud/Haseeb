import { Auditable } from "./auditable";
import { Pro_Super_PhaseDet } from "./pro_Super_PhaseDet";

export class Pro_Super_Phases extends Auditable {
    phaseId: number;
    nameAr: string | null;
    nameEn: string | null;
    isRead: boolean | null;
    userId: number | null;
    note: string | null;
    branchId: number | null;
    superCode: string | null;
    superPhaseDet: Pro_Super_PhaseDet[] | null;
}