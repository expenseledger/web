import * as React from 'react';
import Home from './Home';
import Transaction from '../components/Transaction';

class App extends React.Component {
  public render() {
    return (
      <Home>
        <Transaction/>
      </Home>
    );
  }
}

export default App;
