import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../components/Home";
import More from "../components/More";
import "./App.scss";
import { TransactionList } from "./TransactionList";

class App extends React.Component {
  public render() {
    return (
      <Router>
        <Route path="/" exact={true} component={Home} />
        <Route path="/transactionList/:walletName" exact={true} component={TransactionList} />
        <Route path="/more" exact={true} component={More} />
      </Router>);
  }
}

export default App;
