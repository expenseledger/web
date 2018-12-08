import 'bulma/css/bulma.css';
import * as React from 'react';
import Aux from '../Aux/Aux';

class Layout extends React.Component {
    public render() {
        return (
            <Aux>
                {this.props.children}
                <div>
                    <nav className='level is-mobile'>
                        <div className='level-left'>
                            <div className='level-item'>
                                <p>Icon</p>
                            </div>
                            <div className='level-item'>
                                <p>Wallet balance with currency</p>
                            </div>
                        </div>
                        <div className='level-item-right'>
                            <div className='level-item'>
                                <p>Right icon</p>
                            </div>
                        </div>
                    </nav>
                </div>
            </Aux>
        );
    }
}

export default Layout;