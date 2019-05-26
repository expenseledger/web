import * as React from "react";
import { RouteComponentProps } from "react-router";
import Category from "../service/Model/Category";
import Wallet from "../service/Model/Wallet";
import Button from "./bases/Button";
import Dropdown from "./bases/Dropdown";
import { HomeState } from "./Home";
import "./More.scss";
import TextField from "./bases/TextField";
import DateBox from "./bases/DateBox";
import TextBox from "./bases/TextBox";

interface MoreState extends HomeState {
    currentValue: CurrentValue;
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
            <div>
                <div className="tabs is-toggle">
                    <ul>
                        <li className="is-active"><a>Expense</a></li>
                        <li><a>Income</a></li>
                        <li><a>Transfer</a></li>
                    </ul>
                </div>
                <div>
                    <span>Category </span>
                    <Dropdown
                        default={this.state.currentValue.category && this.state.currentValue.category.name}
                        options={this.state.categories.map(x => x.name)}
                        updateSelectedValue={this.updateSelectedCategory}
                    />
                </div>
                <div>
                    <div>
                        <span>From </span>
                        <span>Balance {this.state.currentValue.fromWallet ? this.state.currentValue.fromWallet.balance : 0} THB</span>
                        <Dropdown
                            default={this.state.currentValue.fromWallet && this.state.currentValue.fromWallet.name}
                            options={this.state.wallets.map(x => x.name)}
                            updateSelectedValue={this.updateSelectedFromWallet}
                        />
                    </div>
                    <div>
                        <span>To </span>
                        <span>Balance {this.state.currentValue.toWallet ? this.state.currentValue.toWallet.balance : 0} THB </span>
                        <Dropdown
                            default={this.state.currentValue.toWallet && this.state.currentValue.toWallet.name}
                            options={this.state.wallets.map(x => x.name)}
                            updateSelectedValue={this.updateSelectedToWallet}
                        />
                    </div>
                </div>
                <div>
                    <span>Date</span>
                    <DateBox name="date" updateValue={this.updateSelectedDate} />
                </div>
                <div>
                    <span>Amount</span>
                    <TextBox className="content__expense__box" updateValue={this.updateExpense} name="expnese" />
                </div>
                <div>
                    <span>Description</span>
                    <TextField name="description" updateValue={this.updateDescription} />
                </div>
                <div>
                    <Button value="Add" />
                </div>
            </div>
        );
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
        };
    }
}

export default More;