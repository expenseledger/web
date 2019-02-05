import "bulma/css/bulma.css";
import * as React from "react";
import Category from "src/service/Model/Category";
import Transaction from "../components/Transaction";
import Wallet from "../components/Wallet";
import Aux from "../hoc/Aux/Aux";
import * as CategoryService from "../service/CategoryService";
import WalletModel from "../service/Model/Wallet";
import * as WalletService from "../service/WalletService";

interface IHomeState {
  categories: Category[];
  wallets: WalletModel[];
  currentWalletIdx: number;
}

class Home extends React.Component<any, IHomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      categories: [],
      currentWalletIdx: 0,
      wallets: []
    };
  }

  public componentDidMount() {
    this.prepareState();
  }

  public prepareState = async (): Promise<void> => {
    const walletPromise: Promise<WalletModel[]> = WalletService.getAllWallet();
    const categoryPromise: Promise<
      Category[]
    > = CategoryService.getAllCategories();

    const [wallets, categories] = await Promise.all([
      walletPromise,
      categoryPromise
    ]);

    if (
      !wallets ||
      wallets.length === 0 ||
      !categories ||
      categories.length === 0
    ) {
      return;
    }

    this.setState({
      categories,
      wallets
    });
  };

  public selectWalletHandler = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const wallets: WalletModel[] = this.state.wallets;

    if (!wallets) {
      return;
    }

    this.setState({
      currentWalletIdx: wallets.findIndex(x => x.name === e.target.value)
    });
  };

  public updateWallet = (wallet: WalletModel): void => {
    const wallets = [...this.state.wallets];
    const walletChangedIdx = wallets.findIndex(x => x.name === wallet.name);

    wallets[walletChangedIdx] = wallet;
    this.setState({
      wallets
    })
  }

  public render() {
    const currentWallet = this.state.wallets[this.state.currentWalletIdx];

    return (
      <Aux>
        <Transaction
          categories={this.state.categories}
          currentWallet={currentWallet}
          updateWallet={this.updateWallet}
        />
        <Wallet
          currentWalletIdx={this.state.currentWalletIdx}
          walletOnChangeHandler={this.selectWalletHandler}
          wallets={this.state.wallets}
        />
      </Aux>
    );
  }
}

export default Home;
