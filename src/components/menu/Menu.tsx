import React from "react";
import {
    GearIcon,
    HomeIcon,
    ExitIcon,
    CardStackIcon,
    ReaderIcon,
    IdCardIcon,
} from "@radix-ui/react-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Account from "../../service/model/Account";
import BalanceWithCurrency from "../bases/BalanceWithCurrency";
import Drawer from "../bases/Drawer";
import Switch from "../bases/Switch";
import { Box, Flex, Grid, Separator, Text } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { isHideBalanceOnMenuState } from "../../common/shareState";
import { color } from "../../common/constants";

interface MenuProps {
    accounts: Account[];
    totalAccountBalance: number;
    signOutFunc: () => void;
    version: string;
}

const BottomMenuWrapper = styled.div`
    position: fixed;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    width: min(var(--container-size-2, 688px), calc(100vw - (var(--space-6) * 2)));
    z-index: 1000;
    padding-bottom: env(safe-area-inset-bottom, 0px);
`;

const BottomMenuBar = styled.div`
    border-radius: 18px;
    background: var(--gray-2);
    border: none;
    box-shadow: none;
`;

const TabButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: transparent;
    border: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    padding: 0;
`;

const Version = styled.div`
    font-size: 10px;
    opacity: 0.7;
`;

const ActionText = styled.span`
    cursor: pointer;
`;

type ActiveTab = "none" | "home" | "account" | "settings";

const Menu: React.FC<MenuProps> = (props) => {
    const [isHideBalance, setIsHideBalance] = useAtom<boolean>(isHideBalanceOnMenuState);
    const [activeTab, setActiveTab] = React.useState<ActiveTab>("none");
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (location.pathname === "/") {
            setActiveTab("home");
            return;
        }

        setActiveTab("none");
    }, [location.pathname]);

    const onHideBalanceChangeHandler = () => {
        setIsHideBalance((prev) => !prev);
    };

    const navigateToHome = () => {
        setActiveTab("home");
        navigate("/");
    };

    const closeSheet = () => {
        setActiveTab(location.pathname === "/" ? "home" : "none");
    };

    const handleBottomDrawerOpenChange = (open: boolean) => {
        if (!open) {
            closeSheet();
        }
    };

    const handleDrawerTabClick = (tab: Extract<ActiveTab, "account" | "settings">) => {
        setActiveTab((prev) =>
            prev === tab ? (location.pathname === "/" ? "home" : "none") : tab
        );
    };

    return (
        <>
            <Drawer open={activeTab === "account"} onOpenChange={handleBottomDrawerOpenChange}>
                <Text color="gray" size="1">
                    ACCOUNTS
                </Text>
                <Grid columns="2" gap="2" mt="2">
                    {props.accounts.map((x) => (
                        <React.Fragment key={x.id}>
                            <Box>
                                <Text>{x.name}</Text>
                            </Box>
                            <Box ml="2">
                                <BalanceWithCurrency
                                    balance={x.balance}
                                    isHideBalance={isHideBalance}
                                />
                            </Box>
                        </React.Fragment>
                    ))}
                    <Flex justify="end">
                        <Text mr="2">=</Text>
                    </Flex>
                    <Box ml="2">
                        <Text weight="bold">
                            <BalanceWithCurrency
                                balance={props.totalAccountBalance}
                                isHideBalance={isHideBalance}
                            />
                        </Text>
                    </Box>
                </Grid>
                <Flex justify="end" mt="3">
                    <Switch
                        name="hideBalanceSwitch"
                        isRounded
                        isOn={isHideBalance}
                        onChange={onHideBalanceChangeHandler}
                        label="Hide balance"
                        size="small"
                        isRtl
                    />
                </Flex>
            </Drawer>
            <Drawer open={activeTab === "settings"} onOpenChange={handleBottomDrawerOpenChange}>
                <Text color="gray" size="1">
                    SETTINGS
                </Text>
                <Flex direction="column" gap="3" mt="2">
                    <Flex align="center" gap="2">
                        <CardStackIcon />
                        <Link to="/account/setting" onClick={closeSheet}>
                            Account
                        </Link>
                    </Flex>
                    <Flex align="center" gap="2">
                        <ReaderIcon />
                        <Link to="/category/setting" onClick={closeSheet}>
                            Category
                        </Link>
                    </Flex>
                    <Flex align="center" gap="2">
                        <GearIcon />
                        <Link to="/page/setting" onClick={closeSheet}>
                            Page
                        </Link>
                    </Flex>
                    <Flex align="center" gap="2">
                        <ExitIcon />
                        <ActionText onClick={props.signOutFunc}>Sign out</ActionText>
                    </Flex>
                    <Flex justify="end">
                        <Version>v{props.version}</Version>
                    </Flex>
                </Flex>
            </Drawer>

            <BottomMenuWrapper>
                <BottomMenuBar>
                    <Flex justify="between" align="center" p="3">
                        <TabButton onClick={navigateToHome}>
                            <HomeIcon color="gray" />
                            <Text size="2" color="gray">
                                Home
                            </Text>
                        </TabButton>
                        <TabButton onClick={() => handleDrawerTabClick("account")}>
                            <IdCardIcon
                                color={activeTab === "account" ? color.primaryIcon : "gray"}
                            />
                            <Text size="2" color={activeTab === "account" ? color.primary : "gray"}>
                                Account
                            </Text>
                        </TabButton>
                        <TabButton onClick={() => handleDrawerTabClick("settings")}>
                            <GearIcon
                                color={activeTab === "settings" ? color.primaryIcon : "gray"}
                            />
                            <Text
                                size="2"
                                color={activeTab === "settings" ? color.primary : "gray"}>
                                Setting
                            </Text>
                        </TabButton>
                    </Flex>
                </BottomMenuBar>
            </BottomMenuWrapper>
        </>
    );
};

export default Menu;
