import * as React from "react";
import * as CategoryService from "../service/CategoryService";
import Category from "../service/Model/Category";
import Wallet from "../service/Model/Wallet";
import * as WalletService from "../service/WalletService";
import Button from "./bases/Button";
import Dropdown from "./bases/Dropdown";
import TextBox from "./bases/TextBox";

interface IHomeState {
    wallets: Wallet[];
    categories: Category[];
}

class Home extends React.Component<any, IHomeState> {
    private selectedValue: object;

    constructor(props: any) {
        super(props);
        this.state = {
            wallets: [],
            categories: []
        };
        this.selectedValue = {};
    }

    public componentDidMount() {
        this.fetchAllWallet();
        this.fetchAllCategory();
    }

    public render() {
        return (
            <React.Fragment>
                <div>
                    Balance:
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

    private updateSelectedWallet(value: string) {
        this.selectedValue = {
            wallet: value
        };
    }

    private updateSelectedCategory(value: string) {
        this.selectedValue = {
            category: value
        };
    }

    private updateExpense(value: string) {
        this.selectedValue = {
            expense: value
        };
    }

    private async fetchAllWallet() {
        const wallets = await WalletService.getAllWallet();
        this.setState({
            wallets
        });
    }

    private async fetchAllCategory() {
        const categories = await CategoryService.getAllCategories();
        this.setState({
            categories
        })
    }
}

export default Home;