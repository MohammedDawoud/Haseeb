import { Auditable } from "./auditable";

export class NodeLocations extends Auditable {
    locationId: number;
    settingId: number | null;
    taskId: number | null;
    location: string | null;
    projectId: number | null;
    proSubTypeId: number | null;
    empId: number | null;
}