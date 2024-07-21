import { Pro_Super_PhaseDetVM } from "./pro_Super_PhaseDetVM";

export class Pro_Super_PhasesVM {
    phaseId: number;
    nameAr: string | null;
    nameEn: string | null;
    isRead: boolean | null;
    userId: number | null;
    note: string | null;
    branchId: number | null;
    superCode: string | null;
    superPhaseDet: Pro_Super_PhaseDetVM[] | null;
}
