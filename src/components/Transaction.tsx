import * as React from "react";
import * as TransactionService from "../service/TransactionService";
import { transactionType } from "../service/Constants";
import AddTransactionRequest from "src/service/Model/Request/AddTransactionRequest";
import Category from "src/service/Model/Category";
import Wallet from "../service/Model/Wallet";
import AddExpenseRequest from 'src/service/Model/Request/AddExpenseRequest';
import AddIncomeRequest from 'src/service/Model/Request/AddIncomeRequest';

interface ITransactionProps {
  categories: Category[];
  selectedWallet: Wallet;
  balanceHandler: (balance: number) => void;
}

interface ITransactionState {
  selectedCategoryIdx: number;
  selectedTransactionType: string;
}

class Transaction extends React.Component<ITransactionProps, ITransactionState> {
  public addTransactionDto: AddTransactionRequest;

  constructor(props: any) {
    super(props);
    this.state = {
      selectedCategoryIdx: 0,
      selectedTransactionType: transactionType.expense
    }
    this.addTransactionDto = new AddTransactionRequest();
  }

  public categoryOnClickHander = (categoryIdx: number): void => 
  {
    this.setState({
      selectedCategoryIdx: categoryIdx
    });
  }

  public renderCategory = (): JSX.Element[] => {
    const toReturn: JSX.Element[] = [];
    let tCategories: JSX.Element[] = [];
    let index: number = 1;

    if(this.props.categories.length === 0) {
      return toReturn;
    }

    for(const cat of this.props.categories) {
      tCategories.push((
        <div className="column" key={ cat.name }>
          <a key={ index } className={"button is-primary" + (index - 1 !== this.state.selectedCategoryIdx ? " is-outlined" : "") } onClick={this.categoryOnClickHander.bind(this, index - 1)}>{ cat.name }</a>
        </div>));
      if(index % 2 === 0) {
        toReturn.push(<div key={ index } className="columns is-mobile">{ tCategories }</div>)
        tCategories = [];
      }

      index++;
    }

    if(tCategories.length > 0) {
      toReturn.push(<div key={ index } className="columns is-mobile">{ tCategories }</div>);
    }

    return toReturn;
  }

  public inputHandler = (event: any) => {
    this.addTransactionDto[event.target.name] = event.target.value;
    console.log(this.addTransactionDto);
  }

  public transactionTypeSeclectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      selectedTransactionType: event.target.value
    })
  }

  public addTransactionHandler = async () => {  
    if(this.state.selectedTransactionType === transactionType.expense) {
      const addExpenseRequest: AddExpenseRequest = {
        amount: this.addTransactionDto.amount,
        category: this.props.categories[this.state.selectedCategoryIdx].name,
        from: this.props.selectedWallet.name
      }
      const response = await TransactionService.addExpense(addExpenseRequest);
      if(response) {
        this.props.balanceHandler(response.srcWallet.balance);
        alert("Add expense success");
      }
      else {
        alert("Add expense failed");
      }
    }
    else if(this.state.selectedTransactionType === transactionType.income) {
      const addIncomeRequest: AddIncomeRequest = {
        amount: this.addTransactionDto.amount,
        category: this.props.categories[this.state.selectedCategoryIdx].name,
        to: this.props.selectedWallet.name
      }
      const response = await TransactionService.addIncome(addIncomeRequest);
      if(response) {
        this.props.balanceHandler(response.dstWallet.balance);
        alert("Add income success");
      }
      else {
        alert("Add income failed");
      }
    } 
  }

  public render() {
    return (
      <div className="container is-fluid">
        <h3 className="title is-3" style={{textAlign: "center"}}>Add Transaction</h3>
        <h4 className="title is-4" style={{textAlign: "center"}}>Category</h4>
        <div className="container has-text-centered">
          { this.renderCategory() }
          <div className="columns">
            <div className="column">
              <div className="field">
                <div className="control select">
                  <select onChange={this.transactionTypeSeclectHandler}>
                    <option>{transactionType.expense}</option>
                    <option>{transactionType.income}</option>
                    <option>{transactionType.transfer}</option>
                  </select>
                </div>
              </div>
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