export class AttendeesVM {
    attendeesId: number;
    empId: number | null;
    date: string | null;
    dayOfWeek: string | null;
    day: number | null;
    status: number | null;
    workMinutes: number | null;
    actualWorkMinutes: number | null;
    isLate: boolean;
    lateMinutes: number | null;
    isOverTime: boolean | null;
    overTimeMinutes: number | null;
    discount: number | null;
    bonus: number | null;
    isVacancy: boolean | null;
    isLateCheckIn: boolean | null;
    lateCheckInMinutes: number | null;
    isEarlyCheckOut: boolean | null;
    earlyCheckOutMin: number | null;
    isEntry: boolean | null;
    isOut: boolean | null;
    isRealVacancy: boolean | null;
    isVacancyEmp: boolean | null;
    isDone: boolean | null;
    attTimeId: number | null;
    branchId: number | null;
    employeeName: string | null;
    employeeMobile: string | null;
    attendenceDifference: number | null;
}

export class Thing {
    tbxDeviceIP: string | null;
    tbxPort: string | null;
    tbxBranchId: string | null;
    tbxAttendenceDeviceId: string | null;
    tbxMachineNumber: string | null;
}