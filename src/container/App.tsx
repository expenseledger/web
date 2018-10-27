import * as React from 'react';
import Home from '../components/Home';
import Layout from '../hoc/Layout/Layout';

class App extends React.Component {
  public render() {
    return (
      <Layout>
        <Home/>
      </Layout>
    );
  }
}

export default App;
