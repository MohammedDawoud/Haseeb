import { Auditable } from "./auditable";
import { Branch } from "./branch";

export class AttendenceDevice extends Auditable {
    attendenceDeviceId: number;
    deviceIP: string | null;
    port: string | null;
    machineNumber: string | null;
    branchId: number;
    branchName: Branch | null;
    lastUpdate: string;
}
