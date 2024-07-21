import { AccountVM } from "./accountVM";

export class ProfitAndLossesVM {
    trading: AccountVM[] | null;
    inComeState: AccountVM[] | null;
    expenses: AccountVM[] | null;
}