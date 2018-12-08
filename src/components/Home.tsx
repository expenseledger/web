import 'bulma/css/bulma.css';
import * as React from 'react';

class Home extends React.Component {
  public render() {
    return (
      <div className='container is-fluid'>
        <p style={{textAlign: 'center'}}>Add Transaction</p>
        <p style={{textAlign: 'center'}}>Category</p>
        <div className='container has-text-centered'>
          <div className='columns is-mobile'>
            <div className='column'>1</div>
            <div className='column'>2</div>
          </div>
          <div className='columns is-mobile'>
            <div className='column'>3</div>
            <div className='column'>4</div>
          </div>
          <div className='columns is-mobile'>
            <div className='column'>5</div>
            <div className='column'>6</div>
          </div>
          <div className='columns'>
            <div className='column'>
              <div className="field">
                <div className="control">
                  <input className="input is-rounded" type="text" placeholder="Amount"/>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input className="input is-rounded" type="date"/>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <textarea className="textarea" placeholder="Note"/>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
    );
  }
}

export default Home;