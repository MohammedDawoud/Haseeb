import { ProjectPhasesTasksVM } from "./projectPhasesTasksVM";
import { TasksDependencyVM } from "./tasksDependencyVM";

export class ProjectTasksNodeVM {
    nodeDataArray: ProjectPhasesTasksVM[] | null;
    linkDataArray: TasksDependencyVM[] | null;
    firstLevelNode: ProjectPhasesTasksVM[] | null;
}
