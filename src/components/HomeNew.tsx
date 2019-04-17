import * as React from "react";
import * as CategoryService from "../service/CategoryService";
import ICategory from "../service/Model/Category";
import IWallet from "../service/Model/Wallet";
import * as WalletService from "../service/WalletService";
import Button from "./bases/Button";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";

interface IHomeState {
    wallets: IWallet[];
    categories: ICategory[];
    currentValue: ICurrentValue;
}

interface ICurrentValue {
    wallet?: IWallet;
    category?: ICategory;
    expense: number
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
                expense: 0
            },
        };
    }

    public componentDidMount() {
        this.fetchAllWallet();
        this.fetchAllCategory();
    }

    public render() {
        return (
            <React.Fragment>
                <div>
                    Balance: {!!this.state.currentValue.wallet ? this.state.currentValue.wallet.balance : 0}
                </div>
                <div>
                    <Dropdown options={this.state.wallets.map(wallet => wallet.name)} updateSelectedValue={this.updateSelectedWallet} />
                    <a>Transaction</a>
                </div>
                <div>
                    Date
                </div>
                <div>
                    <span>Expense: </span>
                    <TextBox updateValue={this.updateExpense} name="expnese" />
                </div>
                <div>
                    <Dropdown options={this.state.categories.map(category => category.name)} updateSelectedValue={this.updateSelectedCategory} />
                </div>
                <div>
                    <Button value="Add" />
                    <Button value="More" />
                </div>
            </React.Fragment>
        );
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

        currentValue.expense = Number.parseFloat(value);
        this.setState({
            currentValue
        });
    }

    private async fetchAllWallet() {
        const wallets = await WalletService.getAllWallet();
        const currentValue = { ...this.state.currentValue };

        if (wallets.length > 0) {
            currentValue.wallet = wallets[0]
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
        })
    }
}

export default Home;