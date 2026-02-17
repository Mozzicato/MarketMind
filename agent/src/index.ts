import { recordSaleAction } from "./actions/recordSale";
import { requestLoanAction } from "./actions/requestLoan";
import { paySupplierAction } from "./actions/paySupplier";
import { updateCreditScoreAction } from "./actions/updateCreditScore";
import { getAdviceAction } from "./actions/getAdvice";
import { businessStateProvider } from "./providers/businessState";

export const MarketMindPlugin = {
    name: "marketmind",
    description: "Financial agent for informal market vendors on Celo",
    actions: [
        recordSaleAction,
        requestLoanAction,
        paySupplierAction,
        updateCreditScoreAction,
        getAdviceAction
    ],
    providers: [businessStateProvider],
    evaluators: []
};

export default MarketMindPlugin;
