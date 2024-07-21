import { Auditable } from "./auditable";

export class Pro_SuperContractor extends Auditable {
    contractorId: number;
    nameAr: string | null;
    nameEn: string | null;
    email: string | null;
    commercialRegister: string | null;
    phoneNo: string | null;
}