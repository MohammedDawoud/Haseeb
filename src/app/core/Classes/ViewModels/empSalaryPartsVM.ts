import { Allowance } from "../DomainObjects/allowance";

export class EmpSalaryPartsVM {
    communication: Allowance | null;
    profession: Allowance | null;
    transportation: Allowance | null;
    housingAllowance: Allowance | null;
}
