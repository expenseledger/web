import * as React from "react";
import * as CategoryService from "../service/CategoryService";
import * as TransactionService from "../service/TransactionService";
import AddTransactionRequest from "src/service/Model/Request/AddTransactionRequest";
import Category from 'src/service/Model/Category';

interface ITransactionState {
  categories: Category[];
}

class Transaction extends React.Component<any, ITransactionState> {
  public addTransactionRequest: AddTransactionRequest

  constructor(props: any) {
    super(props);

    this.state = {
      categories: [],
    }
    this.addTransactionRequest = new AddTransactionRequest();
  }
 
  public async componentDidMount() {
    const categories = await CategoryService.getAllCategories();

    this.setState({
      categories
    })
  }

  public renderCategory = (): JSX.Element[] => {
    const toReturn: JSX.Element[] = [];
    let tCategories: JSX.Element[] = [];
    let index: number = 1;

    if(this.state.categories.length === 0) {
      return toReturn;
    }

    for(const cat of this.state.categories) {
      tCategories.push(<div className="column">{ cat.name }</div>);

      if(index % 2 === 0) {
        toReturn.push(<div key={ index } className="columns is-mobile">{ tCategories }</div>)
        tCategories = [];
      }

      index++
    }

    if(tCategories.length > 0) {
      toReturn.push(<div key={ index } className="columns is-mobile">{ tCategories }</div>);
    }

    return toReturn;
  }

  public inputHandler = (event: any) => {
    this.addTransactionRequest[event.target.name] = event.target.value;
  }

  public addTransactionHandler = async () => {
    const response = await TransactionService.addTransaction(this.addTransactionRequest);

    if(response) {
      alert('Add transaction success');
    }
    else {
      alert('Add transaction failed');
    }
  }

  public render() {
    return (
      <div className="container is-fluid">
        <p style={{textAlign: "center"}}>Add Transaction</p>
        <p style={{textAlign: "center"}}>Category</p>
        <div className="container has-text-centered">
          { ...this.renderCategory() }
          <div className="columns">
            <div className="column">
              <div className="field">
                <div className="control">
                  <input className="input is-rounded" name="amount" type="text" placeholder="Amount" onChange={ this.inputHandler }/>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input className="input is-rounded" name="date" type="date" onChange={ this.inputHandler }/>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <textarea className="textarea" name="note" placeholder="Note" onChange={ this.inputHandler }/>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button className="button is-primary" onClick={ this.addTransactionHandler }>Add</button>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
    );
  }
}

export default Transaction;