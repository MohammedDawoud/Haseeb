import { Auditable } from "./auditable";
import { Employees } from "./employees";
import { NodeLocations } from "./nodeLocations";
import { Users } from "./users";
import { TaskType } from "./taskType";

export class Settings extends Auditable {
    settingId: number;
    descriptionAr: string | null;
    descriptionEn: string | null;
    parentId: number | null;
    projSubTypeId: number | null;
    type: number | null;
    timeMinutes: number | null;
    isUrgent: boolean | null;
    isTemp: boolean | null;
    taskType: number | null;
    orderNo: number | null;
    startDate: string | null;
    endDate: string | null;
    percentComplete: number | null;
    cost: number | null;
    branchId: number | null;
    notes: string | null;
    userId: number | null;
    timeType: number | null;
    locationId: number | null;
    copySettingId: number | null;
    priority: number | null;
    execPercentage: number | null;
    isMerig: number | null;
    endTime: string | null;
    requirmentId: number | null;
    employees: Employees | null;
    nodeLocations: NodeLocations | null;
    users: Users | null;
    taskTypeModel: TaskType | null;
}
