import { CustomerPaymentsVM } from "./customerPaymentsVM";

export class PaymentReceiptVoucherVM {
    paymentNo: number;
    paymentDate: string | null;
    paymentDateHijri: string | null;
    voucherDate: string | null;
    voucherDateHijri: string | null;
    voucherAmount: number | null;
    voucherAmountValText: string | null;
    voucherTaxAmount: number | null;
    totalVoucherAmount: number | null;
    requiredAmount: number | null;
    accountName: string | null;
    branchName: string | null;
    voucherNumber: string | null;
    projectNumber: string | null;
    customerName: string | null;
    contractNumber: string | null;
    totalPiad: number;
    totalRemaining: number;
    taxCode: string | null;
    voucherDescription: string | null;
    organizationLogoUrl: string | null;
    organizationAddress: string | null;
    organizationPhone: string | null;
    organizationName: string | null;
    organizationWebSite: string | null;
    organizationMail: string | null;
    organizationCityName: string | null;
    paidCustomerPayments: CustomerPaymentsVM[];
}
