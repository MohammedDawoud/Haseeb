import { Auditable } from "./auditable";

export class EmailSetting extends Auditable {
    settingId: number;
    senderEmail: string | null;
    password: string | null;
    senderName: string | null;
    host: string | null;
    port: string | null;
    sSL: boolean;
    userId: number | null;
    branchId: number | null;
    displayName: string | null;
}