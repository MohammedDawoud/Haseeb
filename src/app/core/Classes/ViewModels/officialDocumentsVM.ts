export class OfficialDocumentsVM {
    documentId: number;
    number: string | null;
    officialDocumentsName: string | null;
    nameAr: string | null;
    nameEn: string | null;
    date: string | null;
    hijriDate: string | null;
    expiredDate: string | null;
    expiredHijriDate: string | null;
    userId: number | null;
    notes: string | null;
    attachmentUrl: string | null;
    departmentId: number | null;
    notifyCount: number | null;
    branchId: number | null;
    departmentName: string | null;
    repeatAlarm: boolean;
    recurrenceRateId: number | null;
}