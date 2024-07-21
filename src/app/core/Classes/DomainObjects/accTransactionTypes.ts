import { Auditable } from "./auditable";

export class AccTransactionTypes extends Auditable {
    transactionTypeId: number;
    nameAr: string | null;
    nameEn: string | null;
}