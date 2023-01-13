import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Account from "../../service/model/Account";
import BalanceWithCurrency from "../bases/BalanceWithCurrency";
import Drawer from "../bases/Drawer";

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
const EqualSign = styled.div`
    text-align: right;
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
            <div className="container is-mobile is-fluid mt-5">
                <aside className="menu">
                    <p className="menu-label">Accounts</p>
                    <ul className="menu-list">
                        {props.accounts.map((x) => (
                            <li key={x.name}>
                                <div className="columns is-mobile">
                                    <div className="column is-half">{x.name}</div>
                                    <div className="column">
                                        <BalanceWithCurrency
                                            balance={x.balance}
                                            isHideBalance={isHideBalance}
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                        <li>
                            <div className="columns is-mobile">
                                <EqualSign className="column is-half">=</EqualSign>
                                <div className="column has-text-weight-bold">
                                    <BalanceWithCurrency
                                        balance={props.totalAccountBalance}
                                        isHideBalance={isHideBalance}
                                    />
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="columns is-mobile">
                                <HideBalanceContainer className="column field hideBalanceSwitch mr-6">
                                    <input
                                        id={hideBalanceSwitchId}
                                        type="checkbox"
                                        name={hideBalanceSwitchId}
                                        className="switch is-rounded is-outlined is-small is-rtl"
                                        checked={isHideBalance}
                                        onChange={onHideBalanceChangeHandler}
                                    />
                                    <label id={hideBalanceSwitchId} htmlFor={hideBalanceSwitchId}>
                                        Hide balance
                                    </label>
                                </HideBalanceContainer>
                            </div>
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
