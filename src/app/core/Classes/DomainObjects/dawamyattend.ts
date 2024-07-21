import { Auditable } from "./auditable";

export class Dawamyattend extends Auditable {
    slNo: string | null;
    userID: string | null;
    recognitionType: string | null;
    processType: string | null;
    punchDateTime: string | null;
    deviceName: string | null;
}