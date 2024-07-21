import { Auditable } from "./auditable";

export class GuideDepartments extends Auditable {
    depId: number;
    depNameAr: string | null;
    depNameEn: string | null;
}