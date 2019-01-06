import 'bulma/css/bulma.css';
import * as React from 'react';
import Aux from '../hoc/Aux/Aux';
import Wallet from '../components/Wallet';
import WalletModel from '../service/Model/Wallet';
import * as WalletService from "../service/WalletService";

interface IHomeState {
  balance: number
  type: string
  wallets: WalletModel[] | null
}

class Home extends React.Component<any, IHomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      balance: 0,
      type: '',
      wallets: null
    }
  }


  public async componentDidMount() {
    await this.loadAllWallet();
  }

  /**
   * loadAllWallet
   */
  public loadAllWallet = async (): Promise<void> => {
    const wallets: WalletModel[] = await WalletService.getAllWallet();

    if(!wallets || wallets.length === 0) {
      return;
    }

    this.setState({
      balance: wallets[0].balance,
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
        {this.props.children}
        <div>
          <Wallet 
            balance={ this.state.balance } 
            type={ this.state.type }
            walletOnChangeHandler={ this.walletOnChangeHandler } 
            wallets={ this.state.wallets } />
        </div>
      </Aux>
    );
  }
}

export default Home;