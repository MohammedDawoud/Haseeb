import { Auditable } from "./auditable";
import { OffersPrices } from "./offersPrices";
import { Acc_Services_Price } from "./acc_Services_Price";

export class OfferService extends Auditable {
    offersServicesId: number;
    offerId: number | null;
    serviceId: number | null;
    serviceQty: number | null;
    serviceoffertxt: string | null;
    branchId: number | null;
    taxType: number | null;
    serviceamountval: number | null;
    offersPrices: OffersPrices | null;
    serviceprice: Acc_Services_Price | null;
}
