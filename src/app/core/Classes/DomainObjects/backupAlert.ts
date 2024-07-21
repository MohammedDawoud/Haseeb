import { Auditable } from "./auditable";

export class BackupAlert extends Auditable {
    alertId: number;
    userId: number | null;
    alertSms: number | null;
    alertTimeType: number | null;
    alert_IsSent: number | null;
    alertNextTime: string | null;
    alertTime: string | null;
}