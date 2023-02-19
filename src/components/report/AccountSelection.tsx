import Account from "../../service/model/Account";

export interface SelectableAccount extends Account {
    isSelected: boolean;
}

interface AccountSelectionProps {
    accounts: SelectableAccount[];
    onChangeHanlder: (accounts: SelectableAccount[]) => void;
}

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
                {account.name}
            </label>
        );
    });

    return <div className="box">{listOfCheckbox}</div>;
};

export default AccountSelection;
