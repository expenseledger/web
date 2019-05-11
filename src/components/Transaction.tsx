import * as React from "react";
import { TransactionType } from "../service/Constants";
import AddTransactionDto from "../service/Model/AddTransactionDto";
import Category from "../service/Model/Category";
import {
  AddExpenseRequest,
  AddIncomeRequest,
  AddTransferRequest
} from "../service/Model/Requests";
import Wallet from "../service/Model/Wallet";
import * as TransactionService from "../service/TransactionService";

interface TransactionProps {
  categories: Category[];
  currentWallet: Wallet;
  wallets: Wallet[];
  updateWallet: (wallet: Wallet) => void;
}

interface TransactionState {
  selectedCategoryIdx: number;
  selectedTransactionType: TransactionType;
}

class Transaction extends React.Component<
  TransactionProps,
  TransactionState
  > {
  public addTransactionDto: AddTransactionDto;
  public dstTransferWalletName: string;

  constructor(props: any) {
    super(props);
    this.state = {
      selectedCategoryIdx: 0,
      selectedTransactionType: "EXPENSE"
    };
    this.addTransactionDto = {
      amount: 0,
      date: new Date(),
      note: "",
      wallet: ""
    };

    this.dstTransferWalletName = "";
  }

  public categoryOnClickHander = (categoryIdx: number): void => {
    this.setState({
      selectedCategoryIdx: categoryIdx
    });
  };

  public renderCategory = (): JSX.Element[] => {
    const toReturn: JSX.Element[] = [];
    let tCategories: JSX.Element[] = [];
    let index: number = 1;

    if (this.props.categories.length === 0) {
      return toReturn;
    }

    for (const cat of this.props.categories) {
      tCategories.push(
        <div className="column" key={cat.name}>
          <a
            key={index}
            className={
              "button is-primary" +
              (index - 1 !== this.state.selectedCategoryIdx
                ? " is-outlined"
                : "")
            }
            onClick={this.categoryOnClickHander.bind(this, index - 1)}
          >
            {cat.name}
          </a>
        </div>
      );
      if (index % 2 === 0) {
        toReturn.push(
          <div key={index} className="columns is-mobile">
            {tCategories}
          </div>
        );
        tCategories = [];
      }

      index++;
    }

    if (tCategories.length > 0) {
      toReturn.push(
        <div key={index} className="columns is-mobile">
          {tCategories}
        </div>
      );
    }

    return toReturn;
  };

  public inputHandler = (event: any) => {
    this.addTransactionDto[event.target.name] = event.target.value;
  };

  public transactionTypeSeclectHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    this.setState({
      selectedTransactionType: event.target.value as TransactionType
    });
  };

  public dstTransferWalletHandler = (event: any) => {
    this.dstTransferWalletName = event.target.value;
  };

  public addTransactionHandler = async () => {
    if (this.state.selectedTransactionType === "EXPENSE") {
      const addExpenseRequest: AddExpenseRequest = {
        amount: this.addTransactionDto.amount,
        category: this.props.categories[this.state.selectedCategoryIdx].name,
        from: this.props.currentWallet.name,
        description: this.addTransactionDto.note
      };
      const response = await TransactionService.addExpense(addExpenseRequest);
      if (response) {
        this.props.updateWallet(response.srcWallet);
        alert("Add expense success");
      } else {
        alert("Add expense failed");
      }
    } else if (this.state.selectedTransactionType === "INCOME") {
      const addIncomeRequest: AddIncomeRequest = {
        amount: this.addTransactionDto.amount,
        category: this.props.categories[this.state.selectedCategoryIdx].name,
        to: this.props.currentWallet.name,
        description: this.addTransactionDto.note
      };
      const response = await TransactionService.addIncome(addIncomeRequest);
      if (response) {
        this.props.updateWallet(response.dstWallet);
        alert("Add income success");
      } else {
        alert("Add income failed");
      }
    } else if (this.state.selectedTransactionType === "TRANSFER") {
      const addTransferRequest: AddTransferRequest = {
        amount: this.addTransactionDto.amount,
        category: this.props.categories[this.state.selectedCategoryIdx].name,
        from: this.props.currentWallet.name,
        to: this.dstTransferWalletName,
        description: this.addTransactionDto.note
      };
      const response = await TransactionService.addTransfer(addTransferRequest);
      if (response) {
        this.props.updateWallet(response.dstWallet);
        this.props.updateWallet(response.srcWallet);
        alert("Add transfer success");
      } else {
        alert("Add transfer failed");
      }
    }
  };

  public renderDstTransferWallet = (): JSX.Element => {
    let toReturn: JSX.Element[] = [];
    let wallets = this.props.wallets;

    if (wallets && wallets.length > 0) {
      wallets = wallets.filter(
        wallet => wallet.name !== this.props.currentWallet.name
      );
      toReturn = wallets.map((wallet, idx) => (
        <option key={idx}>{wallet.name}</option>
      ));
      this.dstTransferWalletName = wallets[0].name;
    }

    return <select onChange={this.dstTransferWalletHandler}>{toReturn}</select>;
  };

  public render() {
    return (
      <div className="container is-fluid">
        <h3 className="title is-3" style={{ textAlign: "center" }}>
          Add Transaction
        </h3>
        <h4 className="title is-4" style={{ textAlign: "center" }}>
          Category
        </h4>
        <div className="container has-text-centered">
          {this.renderCategory()}
          <div className="columns">
            <div className="column">
              <div className="field">
                <div className="control select">
                  <select onChange={this.transactionTypeSeclectHandler}>
                    <option>{"EXPENSE"}</option>
                    <option>{"INCOME"}</option>
                    <option>{"TRANSFER"}</option>
                  </select>
                </div>
              </div>
              {this.state.selectedTransactionType === "TRANSFER" ? (
                <div className="field">
                  <span>To </span>
                  <div className="control select">
                    {this.renderDstTransferWallet()}
                  </div>
                </div>
              ) : null}
              <div className="field">
                <div className="control">
                  <input
                    className="input is-rounded"
                    name="amount"
                    type="text"
                    placeholder="Amount"
                    onChange={this.inputHandler}
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    className="input is-rounded"
                    name="date"
                    type="date"
                    value={new Date().toISOString().slice(0, 10)}
                    onChange={this.inputHandler}
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <textarea
                    className="textarea"
                    name="note"
                    placeholder="Note"
                    onChange={this.inputHandler}
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button
                    className="button is-primary"
                    onClick={this.addTransactionHandler}
                  >
                    Add
                  </button>
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
