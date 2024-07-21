import { Auditable } from "./auditable";

export class Currency extends Auditable {
    currencyId: number;
    currencyCode: string | null;
    currencyNameAr: string | null;
    currencyNameEn: string | null;
    partCount: number;
    partNameAr: string | null;
    partNameEn: string | null;
    exchangeRate: number;
    branchId: number;
}