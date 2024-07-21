import { Auditable } from "./auditable";

export class NotificationSettings extends Auditable {
    settingId: number;
    iDEndCount: number | null;
    passportCount: number | null;
    licesnseCount: number | null;
    contractCount: number | null;
    medicalCount: number | null;
    vacancyCount: number | null;
    loanCount: number | null;
    branchId: number | null;
}