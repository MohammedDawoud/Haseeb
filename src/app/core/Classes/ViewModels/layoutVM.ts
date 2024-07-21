export class LayoutVM {
    notificationsCount: number;
    allertCount: number | null;
    tasksByUserCount: number | null;
    myInboxCount: number | null;
    projectCount: number | null;
    currency: SelectVM | null;
    year: SelectVM | null;
    workOrderCount: number | null;
    taskCount: number | null;
    onlineUser: number | null;
}

export class SelectVM {
    id: number | null;
    name: number | null;
}