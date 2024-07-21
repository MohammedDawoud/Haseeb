import { Auditable } from "./auditable";
import { Employees } from "./employees";
import { Project } from "./project";
import { Users } from "./users";
// import { Employees } from "./Employees";
// import { Users } from "./Users";
// import { Project } from "./Project";

export class Notification extends Auditable {
    notificationId: number;
    name: string | null;
    date: string | null;
    hijriDate: string | null;
    sendUserId: number | null;
    departmentId: number | null;
    receiveUserId: number | null;
    description: string | null;
    done: boolean | null;
    allUsers: boolean | null;
    actionUser: number | null;
    actionDate: string | null;
    isRead: boolean | null;
    sendDate: string | null;
    readingDate: string | null;
    projectId: number | null;
    attachmentUrl: string | null;
    type: number | null;
    branchId: number | null;
    taskId: number | null;
    assignedUsersIds: number[] | null;
    employees: Employees | null;
    users: Users | null;
    receiveUsers: Users | null;
    title: string | null;
    isHidden: boolean | null;
    project: Project | null;
    nextTime: string | null;
}
