import 'bulma/css/bulma.css';
import * as React from 'react';
import Aux from '../hoc/Aux/Aux';
import Transaction from '../components/Transaction';
import Wallet from '../components/Wallet';
import WalletModel from '../service/Model/Wallet';
import * as CategoryService from "../service/CategoryService";
import * as WalletService from "../service/WalletService";
import Category from 'src/service/Model/Category';

interface IHomeState {
  balance: number
  categories: Category[];
  type: string
  wallets: WalletModel[] | null
  
}

class Home extends React.Component<any, IHomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      balance: 0,
      categories: [],
      type: '',
      wallets: null
    }
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
    const wallets: WalletModel[] | null = this.state.wallets;

    if(!wallets) {
      return; 
    }

    const selectedWallet: WalletModel | undefined = wallets.find(x => x.name === e.target.value);
    const balance: number = selectedWallet ? selectedWallet.balance : 0;
    const type: string = selectedWallet ? selectedWallet.type : '';

    this.setState({
      balance,
      type
    });
  }

  public render() {
    return (
      <Aux>
        <Transaction 
          categories={ this.state.categories } />
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