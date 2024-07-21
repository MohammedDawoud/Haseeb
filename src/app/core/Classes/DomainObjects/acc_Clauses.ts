import { Auditable } from "./auditable";

export class Acc_Clauses extends Auditable {
    clauseId: number;
    nameAr: string | null;
    nameEn: string | null;
}