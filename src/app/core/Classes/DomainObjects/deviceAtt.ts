import { Auditable } from "./auditable";

export class DeviceAtt extends Auditable {
    id: number;
    deviceId: string | null;
    lastUpdate: string;
}