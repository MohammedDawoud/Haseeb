import { Auditable } from "./auditable";

export class TransactionTypes extends Auditable {
    transactionTypeId: number;
    nameAr: string | null;
    nameEn: string | null;
}