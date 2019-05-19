import * as React from "react";
import { RouteComponentProps } from "react-router";
import Button from "./bases/Button";
import Dropdown from "./bases/Dropdown";
import { HomeState } from "./Home";
import "./More.scss";

class More extends React.Component<RouteComponentProps, HomeState> {
    public constructor(props: any) {
        super(props);

        this.state = { ...this.props.location.state };
    }

    public render() {
        return (
            <div>
                <div className="tabs is-toggle">
                    <ul>
                        <li className="is-active"><a>Expense</a></li>
                        <li><a>Income</a></li>
                        <li><a>Transfer</a></li>
                    </ul>
                </div>
                <div>
                    <span>Category </span>
                    <Dropdown
                        default={this.state.currentValue.category ? this.state.currentValue.category.name : undefined}
                        options={this.state.categories.map(x => x.name)} updateSelectedValue={this.updateSelectedCategory}
                    />
                </div>
                <div>
                    <div>
                        <span>Balance </span>
                        <span>From</span>
                    </div>
                    <div>
                        <span>Balance </span>
                        <span>To</span>
                    </div>
                </div>
                <div>
                    <span>Amount</span>
                </div>
                <div>
                    <span>Description</span>
                </div>
                <div>
                    <Button value="Add" />
                </div>
            </div>
        );
    }

    private updateSelectedCategory = (value: string) => {
        const currentValue = { ...this.state.currentValue };

        currentValue.category = this.state.categories.find(x => x.name === value);
        this.setState({
            currentValue
        });
    }
}

export default More;