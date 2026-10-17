import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Text } from "@radix-ui/themes";
import { Dayjs } from "dayjs";

interface MonthPickerProps {
    month: Dayjs;
    onChange: (month: Dayjs) => void;
}

const MonthPicker: React.FC<MonthPickerProps> = (props) => {
    return (
        <Flex justify="between" align="center">
            <IconButton
                variant="ghost"
                aria-label="Previous month"
                onClick={() => props.onChange(props.month.subtract(1, "M"))}>
                <ChevronLeftIcon width="24" height="24" />
            </IconButton>
            <Text size="6" weight="bold">
                {props.month.format("MMMM YYYY")}
            </Text>
            <IconButton
                variant="ghost"
                aria-label="Next month"
                onClick={() => props.onChange(props.month.add(1, "M"))}>
                <ChevronRightIcon width="24" height="24" />
            </IconButton>
        </Flex>
    );
};

export default MonthPicker;
