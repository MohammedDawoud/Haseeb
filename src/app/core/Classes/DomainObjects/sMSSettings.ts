import { Auditable } from "./auditable";

export class SMSSettings extends Auditable {
    settingId: number;
    mobileNo: string | null;
    password: string | null;
    senderName: string | null;
    userId: number;
    branchId: number;
    apiUrl: string | null;
    userName: string | null;
}