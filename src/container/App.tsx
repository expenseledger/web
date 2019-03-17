import * as React from "react";
import { TransactionList } from "./TransactionList";

class App extends React.Component {
  public render() {
    return <TransactionList wallet="Cash" />;
  }
}

export default App;
