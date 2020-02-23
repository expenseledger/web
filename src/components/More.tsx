import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import Category from "../service/model/Category";
import Wallet from "../service/model/Wallet";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";
import TextField from "./bases/TextField";
import "./More.scss";
import { TransactionType } from "../service/Constants";
import {
    AddExpenseRequest,
    AddIncomeRequest,
    AddTransferRequest
} from "../service/model/Requests";
import {
    addExpense,
    addIncome,
    addTransfer
} from "../service/TransactionService";
import { withAuthProtection } from "./hoc/WithAuthProtection";
import Layout from "./Layout";

interface MoreState {
    wallets: Wallet[];
    categories: Category[];
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
    private transactionType: TransactionType = "EXPENSE";

    public constructor(props: any) {
        super(props);

        this.state = this.initializeState(this.props.location.state);
    }

    public render() {
        return (
            <Layout isShowBackwardIcon={true}>
                <div className="more__content">
                    <div className="tabs is-toggle">
                        {this.renderTransactoinTypeTab()}
                    </div>
                    <div className="more__content__category">
                        <span className="more__content__category__title">
                            Category{" "}
                        </span>
                        <Dropdown
                            className="more__content__category__dropdown"
                            default={this.state.currentValue.category?.name}
                            options={this.state.categories.map(x => x.name)}
                            updateSelectedValue={this.updateSelectedCategory}
                        />
                    </div>
                    <div className="more__content__transaction">
                        {this.renderTransaction()}
                    </div>
                    <div className="more__content__date">
                        <span className="more__content__date__title">Date</span>
                        <DateBox
                            className="more__content__date__box"
                            name="date"
                            updateValue={this.updateSelectedDate}
                        />
                    </div>
                    <div className="more__content__amount">
                        <span className="more__content__amount__title">
                            Amount
                        </span>
                        <TextBox
                            className="more__content__amount__box"
                            updateValue={this.updateExpense}
                            name="expnese"
                            type="number"
                        />
                    </div>
                    <div className="more__content__description">
                        <span className="more__content__description__title">
                            Description
                        </span>
                        <TextField
                            className="more__content__description__box"
                            name="description"
                            updateValue={this.updateDescription}
                        />
                    </div>
                    <div>
                        <Button
                            onClickHandler={this.addTransaction}
                            value="Add"
                        />
                    </div>
                </div>
            </Layout>
        );
    }
    private renderTransaction() {
        const isTransfer = this.state.transactionTypeTabActive[2];

        return (
            <>
                <div className="more__content__transaction__from">
                    <span className="more__content__transaction__from__title">
                        {isTransfer ? "From" : "Wallet"}
                    </span>
                    <Dropdown
                        className="more__content__transaction__from__dropdown"
                        default={this.state.currentValue.fromWallet?.name}
                        options={this.state.wallets.map(x => x.name)}
                        updateSelectedValue={this.updateSelectedFromWallet}
                    />
                    <span className="more__content__transaction__from__balance">
                        {this.state.currentValue.fromWallet?.balance ?? 0} THB
                    </span>
                </div>
                {isTransfer ? (
                    <div className="more__content__transaction__to">
                        <span className="more__content__transaction__to__title">
                            To
                        </span>
                        <Dropdown
                            className="more__content__transaction__to__dropdown"
                            default={this.state.currentValue.toWallet?.name}
                            options={this.state.wallets.map(x => x.name)}
                            updateSelectedValue={this.updateSelectedToWallet}
                        />
                        <span className="more__content__transaction__to__balance">
                            {this.state.currentValue.toWallet?.balance ?? 0} THB
                        </span>
                    </div>
                ) : null}
            </>
        );
    }

    private renderTransactoinTypeTab() {
        const transactionTypes = ["Expense", "Income", "Transfer"];

        return (
            <ul>
                {transactionTypes.map((t, idx) => (
                    <li
                        className={
                            this.state.transactionTypeTabActive[idx]
                                ? "is-active"
                                : ""
                        }
                        key={t}
                        data-id={idx}
                        onClick={this.transactionTypeTabOnClickHandler}
                    >
                        <a>{t}</a>
                    </li>
                ))}
            </ul>
        );
    }

    private transactionTypeTabOnClickHandler = (e: any) => {
        const currentTabActive = [...this.state.transactionTypeTabActive];
        const currentTarget = e.currentTarget;
        const currentTabIdx = Number.parseInt(currentTarget.dataset.id, 10);
        const tabActive = currentTabActive.map(
            (t, idx) => idx === currentTabIdx
        );

        this.setState(
            {
                transactionTypeTabActive: tabActive
            },
            () => {
                switch (currentTabIdx) {
                    case 0:
                        this.transactionType = "EXPENSE";
                        break;
                    case 1:
                        this.transactionType = "INCOME";
                        break;
                    case 2:
                        this.transactionType = "TRANSFER";
                        break;
                }
            }
        );
    };

    private updateSelectedCategory = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.category = this.state.categories.find(
            x => x.name === value
        );
        this.setState({
            currentValue
        });
    };

    private updateSelectedFromWallet = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.fromWallet = this.state.wallets.find(
            x => x.name === value
        );
        this.setState({
            currentValue
        });
    };

    private updateSelectedToWallet = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.toWallet = this.state.wallets.find(x => x.name === value);
        this.setState({
            currentValue
        });
    };

    private updateSelectedDate = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.date = value;
        this.setState({
            currentValue
        });
    };

    private updateExpense = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.amount = Number.parseFloat(value);
        this.setState({
            currentValue
        });
    };

    private updateDescription = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.description = value;
        this.setState({
            currentValue
        });
    };

    private initializeState(homeState: any): MoreState {
        return {
            wallets: homeState.wallets,
            categories: homeState.categories,
            currentValue: {
                fromWallet: homeState.currentValue.wallet,
                toWallet: homeState.currentValue.wallet,
                category: homeState.currentValue.category,
                amount: homeState.currentValue.amount,
                date: homeState.currentValue.date,
                description: ""
            },
            transactionTypeTabActive: [true, false, false]
        };
    }

    private addTransaction = () => {
        switch (this.transactionType) {
            case "EXPENSE":
                this.addExpense();
                break;
            case "INCOME":
                this.addIncome();
                break;
            case "TRANSFER":
                this.addTransfer();
                break;
        }
    };

    private async addExpense() {
        const {
            fromWallet,
            category,
            amount,
            date,
            description
        } = this.state.currentValue;

        const request: AddExpenseRequest = {
            amount,
            category: category?.name ?? "",
            date,
            description,
            from: fromWallet?.name ?? ""
        };

        const response = await addExpense(request);

        if (response) {
            const wallets = [...this.state.wallets];
            const selectedWalletIdx = wallets.findIndex(
                x => x.name === response.srcWallet.name
            );

            wallets[selectedWalletIdx].balance = response.srcWallet.balance;
            this.setState({
                wallets
            });

            return alert("AddExpense sucess");
        }

        return alert("AddExpense failed");
    }

    private async addIncome() {
        const {
            fromWallet,
            category,
            amount,
            date,
            description
        } = this.state.currentValue;

        const request: AddIncomeRequest = {
            amount,
            category: category?.name ?? "",
            date,
            description,
            to: fromWallet?.name ?? ""
        };

        const response = await addIncome(request);

        if (response) {
            const wallets = [...this.state.wallets];
            const selectedWalletIdx = wallets.findIndex(
                x => x.name === response.dstWallet.name
            );

            wallets[selectedWalletIdx].balance = response.dstWallet.balance;
            this.setState({
                wallets
            });

            return alert("AddIncome sucess");
        }

        return alert("AddIncome failed");
    }

    private async addTransfer() {
        const {
            fromWallet,
            toWallet,
            category,
            amount,
            date,
            description
        } = this.state.currentValue;

        const request: AddTransferRequest = {
            amount,
            category: category?.name ?? "",
            date,
            description,
            to: toWallet?.name ?? "",
            from: fromWallet?.name ?? ""
        };

        const response = await addTransfer(request);

        if (response) {
            const wallets = [...this.state.wallets];
            const fromWalletIdx = wallets.findIndex(
                x => x.name === response.srcWallet.name
            );
            const toWalletIdx = wallets.findIndex(
                x => x.name === response.dstWallet.name
            );

            wallets[fromWalletIdx].balance = response.srcWallet.balance;
            wallets[toWalletIdx].balance = response.dstWallet.balance;

            this.setState({
                wallets
            });

            return alert("AddTransfer sucess");
        }

        return alert("AddTransfer failed");
    }
}

const MoreWithAuthProtection = withAuthProtection()(More);

export default MoreWithAuthProtection;
