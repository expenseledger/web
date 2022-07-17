import { useRecoilValue } from "recoil";
import { currencyState } from "../../common/shareState";
import { formatNumber } from "../../common/utils";

interface BalanceWithCurrecyProps {
    balance: number;
}

const BalanceWithCurrency: React.FC<BalanceWithCurrecyProps> = (props) => {
    const currency = useRecoilValue(currencyState);

    return (
        <>
            <span>{currency}</span>
            <span className="ml-1">{formatNumber(props.balance)}</span>
        </>
    );
};

export default BalanceWithCurrency;
