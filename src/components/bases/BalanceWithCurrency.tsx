import { useRecoilValue } from "recoil";
import { currencyState } from "../../common/shareState";
import { formatNumber } from "../../common/utils";

interface BalanceWithCurrecyProps {
    balance: number;
    isHideBalance?: boolean;
}

const BalanceWithCurrency: React.FC<BalanceWithCurrecyProps> = (props) => {
    const currency = useRecoilValue(currencyState);

    return (
        <>
            <span>{currency}</span>
            <span className="ml-1">
                {props.isHideBalance ? "XXXX.XX" : formatNumber(props.balance)}
            </span>
        </>
    );
};

export default BalanceWithCurrency;
