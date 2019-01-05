import 'bulma/css/bulma.css';
import * as React from 'react';
import Aux from '../Aux/Aux';
import Wallet from '../../components/Wallet';

class Layout extends React.Component {
    public render() {
        return (
            <Aux>
                {this.props.children}
                <div>
                    <Wallet />
                </div>
            </Aux>
        );
    }
}

export default Layout;