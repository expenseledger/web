import * as React from "react";
import WalletModel from "../service/model/Wallet";

interface IWalletProps {
    currentWalletIdx: number;
    wallets: WalletModel[];
    walletOnChangeHandler: (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => void;
}

class Wallet extends React.Component<IWalletProps, any> {
    public renderWallet = (): JSX.Element => {
        let toReturn: JSX.Element[] = [];
        const wallets = this.props.wallets;

        if (wallets) {
            toReturn = wallets.map((wallet, idx) => (
                <option key={idx}>{wallet.name}</option>
            ));
        }

        return (
            <div className="select is-small">
                <select onChange={this.props.walletOnChangeHandler}>
                    {toReturn}
                </select>
            </div>
        );
    };

    public render() {
        return (
            <nav className="level is-mobile">
                <div className="level-left">
                    <div className="level-item">
                        <p>
                            {this.props.wallets.length > 0
                                ? this.props.wallets[
                                      this.props.currentWalletIdx
                                  ].type
                                : null}
                        </p>
                    </div>
                    <div className="level-item">
                        <p>
                            {this.props.wallets.length > 0
                                ? this.props.wallets[
                                      this.props.currentWalletIdx
                                  ].balance
                                : null}
                        </p>
                    </div>
                    <div className="level-item">{this.renderWallet()}</div>
                </div>
                <div className="level-item-right">
                    <div className="level-item">
                        <p>Right icon</p>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Wallet;
