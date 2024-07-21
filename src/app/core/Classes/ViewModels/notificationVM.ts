import { Employees } from './../DomainObjects/employees';

export class NotificationVM {
    notificationId: number;
    name: string | null;
    date: string | null;
    hijriDate: string | null;
    sendUserId: number | null;
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
    projectNo: string | null;
    attachmentUrl: string | null;
    type: number | null;
    employees: Employees[];
    empName: string | null;
    userName: string | null;
    receivedUserName: string | null;
    dateDifference: string | null;
    sendUserName: string | null;
    sendUserImgUrl: string | null;
    receivedUserImgUrl: string | null;
    title: string | null;
    taskId: number | null;
    isHidden: boolean | null;
    nextTime: string | null;
    dayes: string | null;
    time: string | null;
}
