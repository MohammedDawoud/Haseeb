import { Auditable } from "./auditable";
import { OffersPrices } from "./offersPrices";

export class OffersConditions extends Auditable {
    offersConditionsId: number;
    offerConditiontxt: string | null;
    offerId: number | null;
    branchId: number;
    isconst: number | null;
    offerConditiontxt_EN: string | null;
    offersPrices: OffersPrices | null;
}
