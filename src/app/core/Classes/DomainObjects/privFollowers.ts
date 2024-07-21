import { Auditable } from "./auditable";
import { Users } from "./users";
import { ProjectPhasesTasks } from "./projectPhasesTasks";

export class PrivFollowers extends Auditable {
    privFollowerID: number | null;
    userID: number | null;
    taskID: number | null;
    flag: number | null;
    users: Users | null;
    projectPhasesTasks: ProjectPhasesTasks | null;
}
