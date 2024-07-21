import { Auditable } from "./auditable";
import { Users } from "./users";
import { Project } from "./project";

export class ProjectWorkers extends Auditable {
    workerId: number;
    projectId: number | null;
    userId: number | null;
    branchId: number | null;
    workerType: number | null;
    users: Users | null;
    project: Project | null;
}
