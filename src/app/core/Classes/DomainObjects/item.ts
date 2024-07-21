import { Auditable } from "./auditable";

export class Item extends Auditable {
    itemId: number;
    nameAr: string | null;
    nameEn: string | null;
    typeId: number | null;
    quantity: number | null;
    price: number;
    sachetNo: string | null;
    formNo: string | null;
    color: string | null;
    issuancePlace: string | null;
    issuanceDate: string | null;
    issuanceHijriDate: string | null;
    issuanceEndDate: string | null;
    issuanceEndHijriDate: string | null;
    supplyDate: string | null;
    supplyHijriDate: string | null;
    plateNo: string | null;
    insuranceNo: string | null;
    insuranceEndDate: string | null;
    insuranceEndHijriDate: string | null;
    liscenceFileUrl: string | null;
    insuranceFileUrl: string | null;
    branchId: number | null;
    status: number | null;
    ramainder: number | null;
}