import { ReactElement } from "react";
import { Link } from "react-router-dom";
import { styled } from "@linaria/react";
import Account from "../../service/model/Account";
import BalanceWithCurrency from "../bases/BalanceWithCurrency";
import Drawer from "../bases/Drawer";
import Switch from "../bases/Switch";
import { Box, Container, Flex, Grid, Separator, Text } from "@radix-ui/themes";
import React from "react";
import { useAtom } from "jotai";
import { isHideBalanceOnMenuState } from "../../common/shareState";

interface MenuProps {
    accounts: Account[];
    totalAccountBalance: number;
    signOutFunc: () => void;
    version: string;
}

const Version = styled.div`
    position: absolute;
    bottom: 16px;
    right: 0;
    font-size: 0.5em;
    margin-right: 5px;
`;
const SignOut = styled.a`
    cursor: pointer;
    color: inherit;
`;
const hideBalanceSwitchId = "hideBalanceSwitch";
const preventDrawerCloseIdList = ["rt-SwitchButton", "rt-SwitchThumb", hideBalanceSwitchId];

const Menu: React.FC<MenuProps> = (props) => {
    const [isHideBalance, setIsHideBalance] = useAtom<boolean>(isHideBalanceOnMenuState);
    const onHideBalanceChangeHandler = () => {
        setIsHideBalance((prevState) => {
            const nextState = !prevState;

            return nextState;
        });
    };
    const getMenuTitle = (title: string) => (
        <Flex my="3">
            <Text size="1" color="gray">
                {title.toUpperCase()}
            </Text>
        </Flex>
    );
    const getMenuContent = (title: string, link: string) => (
        <Flex align="center">
            <Flex width="32px" justify="center">
                <Separator orientation="vertical" size="2" />
            </Flex>
            <Text ml="2">
                <Link to={link} style={{ color: "inherit" }}>
                    {title}
                </Link>
            </Text>
        </Flex>
    );
    const getMenuContentWithChildren = (element: ReactElement) => (
        <Flex align="center">
            <Flex width="32px" justify="center">
                <Separator orientation="vertical" size="2" />
            </Flex>
            <Text ml="2">{element}</Text>
        </Flex>
    );

    return (
        <Drawer preventCloseIdOrClassList={preventDrawerCloseIdList}>
            <Container mt="6" px="6">
                <Grid columns="2" gap="2">
                    <Box style={{ gridColumn: "1 / 3" }}>
                        <Text color="gray" size="1">
                            ACCOUNTS
                        </Text>
                    </Box>
                    {props.accounts.map((x) => (
                        <React.Fragment key={x.id}>
                            <Box>
                                <Text>{x.name}</Text>
                            </Box>
                            <Box ml="2" key={x.name + "Balance"}>
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
                        name={hideBalanceSwitchId}
                        isRounded
                        isOn={isHideBalance}
                        onChange={onHideBalanceChangeHandler}
                        label="Hide balance"
                        size="small"
                        isRtl
                    />
                </Flex>
                {getMenuTitle("page")}
                {getMenuContent("Home", "/")}
                {getMenuTitle("Setting")}
                {getMenuContent("Account", "/account/setting")}
                {getMenuContent("Category", "/category/setting")}
                {getMenuContent("Page", "/page/setting")}
                {getMenuTitle("Misc")}
                {getMenuContentWithChildren(
                    <SignOut onClick={props.signOutFunc}>Sign out</SignOut>
                )}
            </Container>
            <Version>v{props.version}</Version>
        </Drawer>
    );
};

export default Menu;
