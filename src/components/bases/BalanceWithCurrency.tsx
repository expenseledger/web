import { formatNumber } from "../../common/utils";
import { Currency, currencySymbols } from "../../service/constants";
import { Text } from "@radix-ui/themes";

interface BalanceWithCurrecyProps {
    balance: number;
    currency: Currency;
    isHideBalance?: boolean;
}

const BalanceWithCurrency: React.FC<BalanceWithCurrecyProps> = (props) => (
    <>
        <Text>{currencySymbols[props.currency]}</Text>
        <Text ml="1">{props.isHideBalance ? "XXXX.XX" : formatNumber(props.balance)}</Text>
    </>
);

export default BalanceWithCurrency;
