import moment from "moment";
import * as React from "react";
import { Link } from "react-router-dom";
import * as CategoryService from "../service/CategoryService";
import Category from "../service/Model/Category";
import { AddExpenseRequest } from "../service/Model/Requests";
import Wallet from "../service/Model/Wallet";
import { addExpense } from "../service/TransactionService";
import * as WalletService from "../service/WalletService";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";
import "./Home.scss";

interface IHomeState {
    wallets: Wallet[];
    categories: Category[];
    currentValue: ICurrentValue;
}

interface ICurrentValue {
    wallet?: Wallet;
    category?: Category;
    amount: number;
    date: string;
}

class Home extends React.Component<any, IHomeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            wallets: [],
            categories: [],
            currentValue: {
                wallet: {
                    name: "",
                    balance: 0,
                    type: ""
                },
                category: {
                    name: "",
                },
                amount: 0,
                date: moment().format("YYYY-MM-DD"),
            },
        };

        this.addTransaction = this.addTransaction.bind(this);
    }

    public componentDidMount() {
        this.fetchAllWallet();
        this.fetchAllCategory();
    }

    public render() {
        return (
            <div className="content">
                <div className="content__balance">
                    <span className="content__balance__text">Balance: {!!this.state.currentValue.wallet ? this.state.currentValue.wallet.balance : 0} THB</span>
                </div>
                <div className="content__transaction">
                    <Dropdown options={this.state.wallets.map(wallet => wallet.name)} updateSelectedValue={this.updateSelectedWallet} />
                    <Link to={{
                        pathname: "/transactionList",
                        state: {
                            wallet: this.state.currentValue.wallet
                        }
                    }}>Transaction</Link>
                </div>
                <div className="content__date">
                    <span className="content__date__text">Date </span>
                    <DateBox className="content__date__box" name="date" updateValue={this.updateSelectedDate} />
                </div>
                <div className="content__expense">
                    <span className="content__expense__text">Amount(THB) </span>
                    <TextBox className="content__expense__box" updateValue={this.updateExpense} name="expnese" />
                </div>
                <div className="content__category">
                    <span className="content__category__text">Category </span>
                    <Dropdown className="content__category__dropdown" options={this.state.categories.map(category => category.name)} updateSelectedValue={this.updateSelectedCategory} />
                </div>
                <div className="content__button">
                    <Button className="content__button__add" onClickHandler={this.addTransaction} value="Add" />
                    <Button className="content__button__more" value="More" />
                </div>
            </div>
        );
    }

    private updateSelectedDate = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.date = value;
        this.setState({
            currentValue
        });
    }

    private updateSelectedWallet = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.wallet = this.state.wallets.find(x => x.name === value);
        this.setState({
            currentValue
        });
    }

    private updateSelectedCategory = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.category = this.state.categories.find(x => x.name === value);
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

    private async fetchAllWallet() {
        const wallets = await WalletService.getAllWallet();
        const currentValue = { ...this.state.currentValue };

        if (wallets.length > 0) {
            currentValue.wallet = wallets[0];
        }

        this.setState({
            wallets,
            currentValue
        });
    }

    private async fetchAllCategory() {
        const categories = await CategoryService.getAllCategories();
        const currentValue = { ...this.state.currentValue };

        if (categories.length > 0) {
            currentValue.category = categories[0];
        }

        this.setState({
            categories,
            currentValue
        });
    }

    private async addTransaction() {
        const { wallet, amount, date, category } = this.state.currentValue;
        const request: AddExpenseRequest = {
            amount,
            category: !!category ? category.name : "",
            from: !!wallet ? wallet.name : "",
            description: "quick add appense",
            date,
        };

        console.log(request);

        const response = await addExpense(request);

        if (!!response) {
            const wallets = [...this.state.wallets];
            const selectedWalletIdx = wallets.findIndex(x => x.name === response.srcWallet.name);

            wallets[selectedWalletIdx].balance = response.srcWallet.balance;
            this.setState({
                wallets
            });

            return alert("AddExpense sucess");
        }

        return alert("AddExpense is failed");
    }
}

export default Home;