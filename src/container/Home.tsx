import "bulma/css/bulma.css";
import * as React from "react";
import Aux from "../hoc/Aux/Aux";
import Transaction from "../components/Transaction";
import Wallet from "../components/Wallet";
import WalletModel from "../service/Model/Wallet";
import * as CategoryService from "../service/CategoryService";
import * as WalletService from "../service/WalletService";
import Category from "src/service/Model/Category";

interface IHomeState {
  balance: number;
  categories: Category[];
  type: string;
  wallets: WalletModel[];
}

class Home extends React.Component<any, IHomeState> {
  private selectedWalletIdx: number;

  constructor(props: any) {
    super(props);
    this.state = {
      balance: 0,
      categories: [],
      type: "",
      wallets: []
    }
    this.selectedWalletIdx = 0;
  }

  public componentDidMount() {
    this.prepareState();
  }

  public prepareState = async (): Promise<void> => {
    const walletPromise: Promise<WalletModel[]> = WalletService.getAllWallet();
    const categoryPromise: Promise<Category[]> = CategoryService.getAllCategories();

    const [wallets, categories] = await Promise.all([walletPromise, categoryPromise]);

    if(!wallets || wallets.length === 0 || !categories || categories.length === 0) {
      return;
    }

    this.setState({
      balance: wallets[0].balance,
      categories,
      type: wallets[0].type,
      wallets
    })
  }


  public walletOnChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>): void =>
  {
    const wallets: WalletModel[] = this.state.wallets;

    if(!wallets) {
      return; 
    }

    this.selectedWalletIdx = wallets.findIndex(x => x.name === e.target.value); 
    const selectedWallet = wallets[this.selectedWalletIdx];
    const balance: number = selectedWallet ? selectedWallet.balance : 0;
    const type: string = selectedWallet ? selectedWallet.type : "";

    this.setState({
      balance,
      type
    });
  }

  public balanceHandler = (balance: number): void => {
    const wallets = [...this.state.wallets];

    wallets[this.selectedWalletIdx].balance = balance; 

    this.setState({
      balance,
      wallets
    });
  }

  public render() {
    const selectedWallet = this.state.wallets[this.selectedWalletIdx];

    return (
      <Aux>
        <Transaction 
          categories={ this.state.categories } 
          selectedWallet={ selectedWallet }
          balanceHandler={ this.balanceHandler } />
        <Wallet 
          balance={ this.state.balance } 
          type={ this.state.type }
          walletOnChangeHandler={ this.walletOnChangeHandler } 
          wallets={ this.state.wallets } />
      </Aux>
    );
  }
}

export default Home;