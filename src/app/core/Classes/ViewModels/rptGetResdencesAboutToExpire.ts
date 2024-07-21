export class rptGetResdencesAboutToExpireVM {
    nationalId: string | null;
    nameAr: string | null;
    nationality: string | null;
    nationalIdEndDate: string | null;
    notifiDate: string | null;
    department: string | null;
    branch: string | null;
}

export class rptGetResdencesExpiredVM {
    nationalId: string | null;
    nameAr: string | null;
    nationality: string | null;
    nationalIdEndDate: string | null;
    department: string | null;
    branch: string | null;
}

export class rptGetOfficialDocsAboutToExpire {
    nameAr: string | null;
    number: string | null;
    docSource: string | null;
    expiredDate: string | null;
    notifiDate: string | null;
    branch: string | null;
}

export class rptGetOfficialDocsExpiredVM {
    nameAr: string | null;
    number: string | null;
    docSource: string | null;
    expiredDate: string | null;
    branch: string | null;
}

export class GetOfficialPapersStatitecsVM {
    resAboutToExpire: string | null;
    resExpired: string | null;
    papAboutToExpire: string | null;
    papExpired: string | null;
    deservedServices: string | null;
    vacation: string | null;
    empLoans: string | null;
    empContract: string | null;
}

export class rptGetDeservedServicesVM {
    number: string | null;
    accCode: string | null;
    department: string | null;
    expireDate: string | null;
    branch: string | null;
}

export class rptGetAboutToStartVacationsVM {
    empNo: string | null;
    empName: string | null;
    nationality: string | null;
    depName: string | null;
    branch: string | null;
    startDate: string | null;
}

export class rptGetEmpContractsAboutToExpireVM {
    contractNo: string | null;
    nameAr: string | null;
    nationality: string | null;
    department: string | null;
    branch: string | null;
    contractEndDate: string | null;
}