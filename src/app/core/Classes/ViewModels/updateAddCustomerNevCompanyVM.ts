export class updateAddCustomerNevCompanyVM {
    customerNameAr: string | null;
    customerNameEn: string | null;
    customerNationalId: string | null;
    nationalIdSource: number | null;  /* ده جهة الاصدار وعباره عن دروب واضافة جهة اصدار للمدينه*/
    branchId: number | null;
    customerEmail: string | null;
    customerPhone: string | null;
    customerMobile: string | null;
    externalPhone: string | null;
    country: string | null;
    neighborhood: string | null;
    streetName: string | null;
    buildingNumber: string | null;
    customerAddress: string | null;
    commercialRegister: string | null;
    notes: string | null;
    postalCodeFinal: string | null;
    compAddress: string | null; /****رقم الضريبي  */
    cityId: number | null;
    cityName: string | null;
    accountName: string | null;/**********بتتملي لما اختار البرانش من api AccMainBaranchid */
    agentName: string | null;
    agentType: number | null; /**اللي هو مندوب او وكيل static**/
    agentNumber: string | null;
    agentAttachmentUrl: string | null;
    
    generalManager: string | null;
    commercialActivity: string | null;
}

