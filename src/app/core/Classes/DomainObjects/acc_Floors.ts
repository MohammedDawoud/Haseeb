import { Auditable } from "./auditable";

export class Acc_Floors extends Auditable {
    floorId: number;
    floorName: string | null;
    floorRatio: number | null;
}