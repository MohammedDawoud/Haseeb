import { Auditable } from "./auditable";
import { Pro_Super_Phases } from "./pro_Super_Phases";

export class Pro_Super_PhaseDet extends Auditable {
    phaseDetailesId: number;
    phaseId: number | null;
    nameAr: string | null;
    nameEn: string | null;
    note: string | null;
    isRead: boolean | null;
    branchId: number | null;
    pro_Super_Phases: Pro_Super_Phases | null;
}
