import { Auditable } from "./auditable";

export class Acc_Packages extends Auditable {
    packageId: number;
    packageName: string | null;
    meterPrice1: number | null;
    meterPrice2: number | null;
    meterPrice3: number | null;
    packageRatio1: number | null;
    packageRatio2: number | null;
    packageRatio3: number | null;
}