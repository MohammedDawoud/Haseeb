import { Auditable } from "./auditable";

export class OutInBoxSerial extends Auditable {
    outInSerialId: number;
    name: string | null;
    code: string | null;
    lastNumber: number | null;
    type: number | null;
    branchId: number | null;
}