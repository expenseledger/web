import Account from "../../service/model/Account";

interface AccountSelectionProps {
    accounts: Account[];
}

const AccountSelection: React.FC<AccountSelectionProps> = (props) => {
    const listOfCheckbox = props.accounts.map((account) => {
        return (
            <label className="checkbox" key={account.id}>
                <input type="checkbox" />
                {account.name}
            </label>
        );
    });

    return <div className="box">{listOfCheckbox}</div>;
};

export default AccountSelection;
