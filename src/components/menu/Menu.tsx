import React from "react";
import {
    GearIcon,
    HomeIcon,
    PersonIcon,
    ExitIcon,
    CardStackIcon,
    ReaderIcon,
} from "@radix-ui/react-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Account from "../../service/model/Account";
import BalanceWithCurrency from "../bases/BalanceWithCurrency";
import Drawer from "../bases/Drawer";
import Switch from "../bases/Switch";
import { Box, Card, Flex, Grid, Separator, Text } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { isHideBalanceOnMenuState } from "../../common/shareState";

interface MenuProps {
    accounts: Account[];
    totalAccountBalance: number;
    signOutFunc: () => void;
    version: string;
}

const BottomMenuWrapper = styled.div`
    position: fixed;
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%);
    width: min(420px, calc(100vw - 24px));
    z-index: 1000;
    padding-bottom: env(safe-area-inset-bottom, 0px);

    @media (max-width: 768px) {
        width: calc(100vw - 16px);
        transform: translateX(-50%);
    }
`;

const BottomMenuBar = styled.div`
    border-radius: 18px;
    background: var(--gray-2);
    border: none;
    box-shadow: none;
`;

const TabButton = styled.button<{ $active: boolean }>`
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
    font-size: 12px;
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

    const isSheetOpen = activeTab === "account" || activeTab === "settings";

    React.useEffect(() => {
        if (location.pathname === "/") {
            setActiveTab("home");
            return;
        }

        setActiveTab("none");
    }, [location.pathname]);

    const onHideBalanceChangeHandler = () => {
        setIsHideBalance((prevState) => {
            const nextState = !prevState;

            return nextState;
        });
    };

    const navigateToHome = () => {
        setActiveTab("home");
        navigate("/");
    };

    const closeSheet = () => {
        setActiveTab(location.pathname === "/" ? "home" : "none");
    };

    return (
        <>
            <Drawer
                position="bottom"
                open={activeTab === "account"}
                onOpenChange={(open) => {
                    if (!open) {
                        closeSheet();
                    }
                }}
                backdropOpacity={0.45}>
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
            <Drawer
                position="bottom"
                open={activeTab === "settings"}
                onOpenChange={(open) => {
                    if (!open) {
                        closeSheet();
                    }
                }}
                backdropOpacity={0.45}>
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
                    <Separator size="4" />
                    <Flex align="center" gap="2">
                        <ReaderIcon />
                        <Link to="/category/setting" onClick={closeSheet}>
                            Category
                        </Link>
                    </Flex>
                    <Separator size="4" />
                    <Flex align="center" gap="2">
                        <GearIcon />
                        <Link to="/page/setting" onClick={closeSheet}>
                            Page
                        </Link>
                    </Flex>
                    <Separator size="4" />
                    <Flex align="center" gap="2">
                        <ExitIcon />
                        <ActionText onClick={props.signOutFunc}>Sign out</ActionText>
                    </Flex>
                    <Version>v{props.version}</Version>
                </Flex>
            </Drawer>

            <BottomMenuWrapper>
                <BottomMenuBar>
                    <Flex justify="between" align="center" p="3">
                        <TabButton $active={activeTab === "home"} onClick={navigateToHome}>
                            <HomeIcon />
                            <Text size="1" color={activeTab === "home" ? "iris" : "gray"}>
                                Home
                            </Text>
                        </TabButton>
                        <TabButton
                            $active={activeTab === "account"}
                            onClick={() => setActiveTab("account")}>
                            <PersonIcon />
                            <Text size="1" color={activeTab === "account" ? "iris" : "gray"}>
                                Account
                            </Text>
                        </TabButton>
                        <TabButton
                            $active={activeTab === "settings"}
                            onClick={() => setActiveTab("settings")}>
                            <GearIcon />
                            <Text size="1" color={activeTab === "settings" ? "iris" : "gray"}>
                                Settings
                            </Text>
                        </TabButton>
                    </Flex>
                </BottomMenuBar>
            </BottomMenuWrapper>
        </>
    );
};

export default Menu;
