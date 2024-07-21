import { SettingsVM } from "./settingsVM";
import { DependencySettingsVM } from "./dependencySettingsVM";

export class TasksNodeVM {
    nodeDataArray: SettingsVM[] | null;
    linkDataArray: DependencySettingsVM[] | null;
    firstLevelNode: SettingsVM[] | null;
}
