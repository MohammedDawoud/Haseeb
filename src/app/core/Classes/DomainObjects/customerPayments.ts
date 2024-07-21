import { Auditable } from "./auditable";
import { OffersPrices } from "./offersPrices";
import { Contracts } from "./contracts";
import { Accounts } from "./accounts";

export class CustomerPayments extends Auditable {
    paymentId: number;
    paymentNo: number | null;
    contractId: number | null;
    paymentDate: string | null;
    paymentDateHijri: string | null;
    amount: number;
    taxAmount: number;
    totalAmount: number;
    amountValueText: string | null;
    transactionId: number | null;
    invoiceId: number | null;
    toAccountId: number | null;
    isPaid: boolean;
    branchId: number | null;
    offerId: number | null;
    isconst: number | null;
    serviceId: number | null;
    amountValueText_EN: string | null;
    amountPercentage: number | null;
    offersPrices: OffersPrices | null;
    contracts: Contracts | null;
    accounts: Accounts | null;
    paymentDatestring: string | null;
}
