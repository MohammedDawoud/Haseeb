import { Auditable } from "./auditable";
import { City } from "./city";

export class Acc_Suppliers extends Auditable {
    supplierId: number;
    nameAr: string | null;
    nameEn: string | null;
    taxNo: string | null;
    phoneNo: string | null;
    accountId: number | null;
    compAddress: string | null;
    postalCodeFinal: string | null;
    externalPhone: string | null;
    country: string | null;
    neighborhood: string | null;
    streetName: string | null;
    buildingNumber: string | null;
    cityId: number | null;
    city: City | null;
}
