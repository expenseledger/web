import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Account from "../../service/model/Account";
import BalanceWithCurrency from "../bases/BalanceWithCurrency";
import Drawer from "../bases/Drawer";
import Switch from "../bases/Switch";
import { Box, Container, Flex, Grid, Separator, Text } from "@radix-ui/themes";

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
`;
const HideBalanceContainer = styled.div`
    text-align: right;
`;
const hideBalanceSwitchId = "hideBalanceSwitch";
const preventDrawerCloseIdList = [hideBalanceSwitchId];

const Menu: React.FC<MenuProps> = (props) => {
    const [isHideBalance, setIsHideBalance] = useState<boolean>(
        window.localStorage.getItem("isHideBalanceOnMenu") === "true"
    );
    const onHideBalanceChangeHandler = () => {
        setIsHideBalance((prevState) => {
            const nextState = !prevState;
            window.localStorage.setItem("isHideBalanceOnMenu", nextState.toString());
            return nextState;
        });
    };

    return (
        <Drawer preventCloseIdOrClassList={preventDrawerCloseIdList}>
            <Container mt="6" px="6">
                <Grid columns="2" gap="2">
                    <Box style={{ gridColumn: "1 / 3" }}>
                        <Text>Accounts</Text>
                    </Box>
                    {props.accounts.map((x) => (
                        <>
                            <Box key={x.name}>
                                <Text key={x.name + "TextName"}>{x.name}</Text>
                            </Box>
                            <Box ml="2" key={x.name + "Balance"}>
                                <BalanceWithCurrency
                                    balance={x.balance}
                                    isHideBalance={isHideBalance}
                                />
                            </Box>
                        </>
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
                <Flex mt="3">
                    <Text>Page</Text>
                </Flex>
                <Flex mt="3" align="center">
                    <Flex width="6" justify="center">
                        <Separator orientation="vertical" size="2" />
                    </Flex>
                    <Text ml="2">
                        <Link to="/">Home</Link>
                    </Text>
                </Flex>
                <Flex align="center">
                    <Flex width="6" justify="center">
                        <Separator orientation="vertical" size="2" />
                    </Flex>
                    <Text ml="2">Home</Text>
                </Flex>
            </Container>
            <div className="container is-mobile is-fluid mt-5">
                <aside className="menu">
                    <p className="menu-label">Page</p>
                    <ul className="menu-list">
                        <li>
                            <ul>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <p className="menu-label">Setting</p>
                    <ul className="menu-list">
                        <li>
                            <ul>
                                <li>
                                    <Link to="/account/setting">Account</Link>
                                </li>
                                <li>
                                    <Link to="/category/setting">Category</Link>
                                </li>
                                <li>
                                    <Link to="/page/setting">Page</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <p className="menu-label">Misc</p>
                    <ul className="menu-list">
                        <li>
                            <ul>
                                <SignOut onClick={props.signOutFunc}>Sign out</SignOut>
                            </ul>
                        </li>
                    </ul>
                </aside>
            </div>
            <Version>v{props.version}</Version>
        </Drawer>
    );
};

export default Menu;
