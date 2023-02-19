import * as R from "ramda";
import styled from "styled-components";
import Account from "../../service/model/Account";

export interface SelectableAccount extends Account {
    isSelected: boolean;
}

interface AccountSelectionProps {
    accounts: SelectableAccount[];
    onChangeHanlder: (accounts: SelectableAccount[]) => void;
}

const AccountsText = styled.div`
    text-align: center;
`;

const AccountSelection: React.FC<AccountSelectionProps> = (props) => {
    const onChangeHandler = (accountId: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newAccounts: SelectableAccount[] = props.accounts.map((account) => {
            if (account.id === accountId) {
                return {
                    ...account,
                    isSelected: e.target.checked,
                };
            }
            return account;
        });

        if (!newAccounts.some((a) => a.isSelected)) {
            return;
        }

        props.onChangeHanlder(newAccounts);
    };

    const listOfCheckbox = props.accounts.map((account) => {
        return (
            <label className="checkbox" key={account.id}>
                <input
                    type="checkbox"
                    onChange={(e) => onChangeHandler(account.id, e)}
                    checked={account.isSelected}
                />
                <span className="ml-1">{account.name}</span>
            </label>
        );
    });

    const renderCheckbox = () => {
        return R.splitEvery(2, listOfCheckbox).map((l, idx) => {
            return (
                <div className="columns is-mobile" key={idx}>
                    {l.map((c) => {
                        return (
                            <div className="column" key={c.key}>
                                {c}
                            </div>
                        );
                    })}
                </div>
            );
        });
    };

    return (
        <div className="box">
            <AccountsText className="title is-5">Accounts</AccountsText>
            <div>{renderCheckbox()}</div>
        </div>
    );
};

export default AccountSelection;
