import { useRecoilValue } from "recoil";
import { currencyState } from "../../common/shareState";
import { formatNumber } from "../../common/utils";
import { Text } from "@radix-ui/themes";

interface BalanceWithCurrecyProps {
    balance: number;
    isHideBalance?: boolean;
}

const BalanceWithCurrency: React.FC<BalanceWithCurrecyProps> = (props) => {
    const currency = useRecoilValue(currencyState);

    return (
        <>
            <Text>{currency}</Text>
            <Text ml="1">{props.isHideBalance ? "XXXX.XX" : formatNumber(props.balance)}</Text>
        </>
    );
};

export default BalanceWithCurrency;
