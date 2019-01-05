import * as React from "react";
import * as WalletService from "../service/WalletService";
import WalletModel from '../service/Model/Wallet';

interface IWalletState {
  balance: number
  type: string
  wallets: WalletModel[] | null
}

class Wallet extends React.Component<any, IWalletState> {
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

    this.setState({
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

  public renderWallet = (): JSX.Element => {
    let toReturn: JSX.Element[] = [];
    const wallets = this.state.wallets;

    if(wallets) {
      toReturn = wallets.map((wallet, idx) => <option key={ idx }>{ wallet.name }</option>);
    }

    return (<select onChange={ this.walletOnChangeHandler }>{ toReturn }</select>);
  }

  public render() {
    return (
      <nav className='level is-mobile'>
        <div className='level-left'>
          <div className='level-item'>
            <p>{ this.state.type }</p>
          </div>
          <div className='level-item'>
            <p>{ this.state.balance }</p>
          </div>
          <div className='level-item'>
            { this.renderWallet() }
          </div>
        </div>
        <div className='level-item-right'>
          <div className='level-item'>
            <p>Right icon</p>
          </div>
        </div>
      </nav>
         
    );
  }
}

export default Wallet;