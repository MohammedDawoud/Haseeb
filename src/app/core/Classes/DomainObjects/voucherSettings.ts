import { Auditable } from "./auditable";
import { Accounts } from "./accounts";

export class VoucherSettings extends Auditable {
    settingId: number;
    type: number;
    accountId: number;
    userId: number | null;
    branchId: number;
    accounts: Accounts | null;
}
