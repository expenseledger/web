import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import Category from "../service/Model/Category";
import Wallet from "../service/Model/Wallet";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";
import TextField from "./bases/TextField";
import { HomeState } from "./Home";
import "./More.scss";

interface MoreState extends HomeState {
    currentValue: CurrentValue;
    transactionTypeTabActive: boolean[];
}

interface CurrentValue {
    fromWallet?: Wallet;
    toWallet?: Wallet;
    category?: Category;
    amount: number;
    date: string;
    description: string;
    [key: string]: any;
}

class More extends React.Component<RouteComponentProps, MoreState> {
    public constructor(props: any) {
        super(props);

        this.state = this.initializeState(this.props.location.state);
    }

    public render() {
        return (
            <div className="more__content">
                <div>
                    <Link to="/">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                </div>
                <div className="tabs is-toggle">
                    {this.renderTransactoinTypeTab()}
                </div>
                <div className="more__content__category">
                    <span className="more__content__category__title">Category </span>
                    <Dropdown
                        className="more__content__category__dropdown"
                        default={this.state.currentValue.category && this.state.currentValue.category.name}
                        options={this.state.categories.map(x => x.name)}
                        updateSelectedValue={this.updateSelectedCategory}
                    />
                </div>
                <div className="more__content__transaction">
                    <div className="more__content__transaction__from">
                        <span className="more__content__transaction__from__title">From </span>
                        <Dropdown
                            className="more__content__transaction__from__dropdown"
                            default={this.state.currentValue.fromWallet && this.state.currentValue.fromWallet.name}
                            options={this.state.wallets.map(x => x.name)}
                            updateSelectedValue={this.updateSelectedFromWallet}
                        />
                        <span className="more__content__transaction__from__balance"> {this.state.currentValue.fromWallet ? this.state.currentValue.fromWallet.balance : 0} THB</span>
                    </div>
                    <div className="more__content__transaction__to">
                        <span className="more__content__transaction__to__title">To </span>
                        <Dropdown
                            className="more__content__transaction__to__dropdown"
                            default={this.state.currentValue.toWallet && this.state.currentValue.toWallet.name}
                            options={this.state.wallets.map(x => x.name)}
                            updateSelectedValue={this.updateSelectedToWallet}
                        />
                        <span className="more__content__transaction__to__balance"> {this.state.currentValue.toWallet ? this.state.currentValue.toWallet.balance : 0} THB </span>
                    </div>
                </div>
                <div className="more__content__date">
                    <span className="more__content__date__title">Date</span>
                    <DateBox className="more__content__date__box" name="date" updateValue={this.updateSelectedDate} />
                </div>
                <div className="more__content__amount">
                    <span className="more__content__amount__title">Amount</span>
                    <TextBox className="more__content__amount__box" updateValue={this.updateExpense} name="expnese" />
                </div>
                <div className="more__content__description">
                    <span className="more__content__description__title">Description</span>
                    <TextField className="more__content__description__box" name="description" updateValue={this.updateDescription} />
                </div>
                <div>
                    <Button value="Add" />
                </div>
            </div>
        );
    }

    private renderTransactoinTypeTab() {
        const transactionTypes = ["Expense", "Income", "Transfer"];

        return (
            <ul>
                {transactionTypes.map((t, idx) => <li className={this.state.transactionTypeTabActive[idx] ? "is-active" : ""} key={t} data-id={idx} onClick={this.transactionTypeTabOnClickHandler}><a>{t}</a></li>)}
            </ul>
        );
    }

    private transactionTypeTabOnClickHandler = (e: any) => {
        const currentTabActive = [...this.state.transactionTypeTabActive];
        const tabActive = currentTabActive.map((t, idx) => idx === Number.parseInt(e.currentTarget.dataset.id, 10) ? true : false);

        this.setState({
            transactionTypeTabActive: tabActive,
        });
    }

    private updateSelectedCategory = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.category = this.state.categories.find(x => x.name === value);
        this.setState({
            currentValue
        });
    }

    private updateSelectedFromWallet = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.fromWallet = this.state.wallets.find(x => x.name === value);
        this.setState({
            currentValue
        });
    }

    private updateSelectedToWallet = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.toWallet = this.state.wallets.find(x => x.name === value);
        this.setState({
            currentValue
        });
    }

    private updateSelectedDate = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.date = value;
        this.setState({
            currentValue
        });
    }

    private updateExpense = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.amount = Number.parseFloat(value);
        this.setState({
            currentValue
        });
    }

    private updateDescription = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.description = value;
        this.setState({
            currentValue
        });
    }

    private initializeState(homeState: HomeState): MoreState {
        return {
            wallets: homeState.wallets,
            categories: homeState.categories,
            currentValue: {
                fromWallet: homeState.currentValue.wallet,
                toWallet: homeState.currentValue.wallet,
                category: homeState.currentValue.category,
                amount: homeState.currentValue.amount,
                date: homeState.currentValue.date,
                description: "",
            },
            transactionTypeTabActive: [false, false, false]
        };
    }
}

export default More;