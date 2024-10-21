import { Auditable } from "./auditable";

export class AttendenceLocationSettings extends Auditable {
    attendenceLocationSettingsId: number;
    name: string | null;
    distance: number | null;
    latitude: string | null;
    longitude: string | null;
}