import { Auditable } from "./auditable";
import { Acc_CategorType } from "./acc_CategorType";

export class Acc_Categories extends Auditable {
    categoryId: number;
    nAmeAr: string | null;
    nAmeEn: string | null;
    code: string | null;
    note: string | null;
    price: number | null;
    categorTypeId: number | null;
    accountId: number | null;
    categorType: Acc_CategorType | null;
}
