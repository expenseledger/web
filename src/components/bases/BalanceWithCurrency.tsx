import { useRecoilValue } from "recoil";
import { CurrencyState } from "../../common/shareState";
import { formatNumber } from "../../common/utils";

interface BalanceWithCurrecyProps {
    balance: number;
}

const BalanceWithCurrency: React.FC<BalanceWithCurrecyProps> = (props) => {
    const currency = useRecoilValue(CurrencyState);

    return (
        <>
            <span>{currency}</span>
            <span className="ml-1">{formatNumber(props.balance)}</span>
        </>
    );
};

export default BalanceWithCurrency;
