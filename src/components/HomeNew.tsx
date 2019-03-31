import * as React from 'react';
import Wallet from '../service/Model/Wallet';
import * as WalletService from "../service/WalletService";
import Dropdown from './bases/Dropdown';
import TextBox from './bases/TextBox';

interface IHomeState {
    wallets: Wallet[];
}

class Home extends React.Component<any, IHomeState> {
    private selectedValue: object;

    constructor(props: any) {
        super(props);
        this.state = {
            wallets: []
        };
        this.selectedValue = {};
    }

    public componentDidMount() {
        this.fetchAllWallet();
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
                    Category
                </div>
                <div>
                    <button>Add</button>
                    <button>More</button>
                </div>
            </React.Fragment>
        );
    }

    private updateSelectedWallet(value: string) {
        this.selectedValue = {
            wallet: value
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
}

export default Home;