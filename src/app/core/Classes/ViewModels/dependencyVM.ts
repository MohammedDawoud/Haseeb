export class DependencyVM {
    dependencyId: number;
    predecessorId: number;
    successorId: number;
    type: number;
    taskCode: string | null;
    taskName: string | null;
    startDate: string | null;
    endDate: string | null;
}