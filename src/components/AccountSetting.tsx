import dayjs from "dayjs";
import * as R from "ramda";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { accountsState, categoriesState, currencyState } from "../common/shareState";
import { createAccount, deleteAccount, updateAccount } from "../service/accountService";
import { createCategory } from "../service/categoryService";
import { AccountType } from "../service/constants";
import {
    allAccountTypesString,
    mapAccountTypeToString,
    mapStringToAccountType,
} from "../service/helper/accountHelper";
import { useNotification } from "../service/helper/notificationHelper";
import { addExpense, addIncome } from "../service/transactionService";
import Dropdown from "./bases/Dropdown";
import Modal from "./bases/Modal";
import SettingBox from "./bases/SettingBox";
import TextBox from "./bases/TextBox";

interface ModifyModalProps {
    id: number;
    onCancel: () => void;
}

const ModifyModal: React.FC<ModifyModalProps> = (props) => {
    const [categories] = useRecoilState(categoriesState);
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const { addNotification } = useNotification();
    const [name, setName] = React.useState("");
    const [balance, setBalance] = React.useState(0);
    const [type, setType] = React.useState<AccountType>("CASH");
    const currency = useRecoilValue(currencyState);
    const getOtherCategory = async () => {
        const other = categories.find((x) => x.name.toLowerCase() === "other");

        if (!other) {
            const response = await createCategory({
                name: "Other",
                type: "ANY",
            });

            if (!response.addedCategory) {
                addNotification("Create Other category failed", "danger");
                return;
            }

            return response.addedCategory;
        }

        return other;
    };
    const modifyAccount = async () => {
        const account = accounts.find((x) => x.id === props.id);
        const otherCategory = await getOtherCategory();

        const response = await updateAccount({
            id: props.id,
            name,
            type,
        });

        if (!response.account) {
            addNotification("Update account failed", "danger");

            return;
        }

        if (balance < account.balance) {
            const response = await addExpense({
                amount: account.balance - balance,
                categoryId: otherCategory.id,
                fromAccountId: account.id,
                description: "Adjust balance",
                date: dayjs().format("YYYY-MM-DD"),
            });

            if (response.transaction) {
                const tAccounts = R.clone(accounts);
                const idx = tAccounts.findIndex((x) => x.id === props.id);

                tAccounts[idx].balance = balance;
                tAccounts[idx].name = name;
                tAccounts[idx].type = type;

                setAccounts(tAccounts);
                addNotification("Update account success", "success");
            } else {
                addNotification("Update account failed", "danger");
            }
        } else if (balance > account.balance) {
            const response = await addIncome({
                amount: balance - account.balance,
                categoryId: otherCategory.id,
                toAccountId: account.id,
                description: "Adjust balance",
                date: dayjs().format("YYYY-MM-DD"),
            });

            if (response.transaction) {
                const tAccounts = R.clone(accounts);
                const idx = tAccounts.findIndex((x) => x.id === props.id);

                tAccounts[idx].balance = balance;
                tAccounts[idx].name = name;
                tAccounts[idx].type = type;

                setAccounts(tAccounts);
                addNotification("Update account success", "success");
            } else {
                addNotification("Update account failed", "danger");
            }
        } else {
            addNotification("Update account success", "success");
        }

        props.onCancel();
    };
    const accountNameHandler = (value: string) => {
        setName(value);
    };
    const accountTypeHandler = (value: string) => {
        setType(mapStringToAccountType(value));
    };
    const accountBalanceHandler = (value: string) => {
        setBalance(Number.parseFloat(value));
    };

    React.useEffect(() => {
        const account = accounts.find((x) => x.id === props.id);

        setName(account.name);
        setType(account.type);
        setBalance(account.balance);
    }, [accounts, props.id]);

    return (
        <Modal
            title="Modify Account"
            onCancelHandler={props.onCancel}
            onConfirmHandler={modifyAccount}
            cancelBtnTxt="Cancel"
            cancelBtnType="default"
            confirmBtnTxt="Confirm"
            confirmBtnType="primary">
            <div className="columns is-mobile is-vcentered">
                <div className="column is-2">
                    <span>Name</span>
                </div>
                <TextBox
                    className="column"
                    name="category-modify"
                    updateValue={accountNameHandler}
                    value={name}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <div className="column is-2">
                    <span>Type</span>
                </div>
                <Dropdown
                    className="column"
                    value={mapAccountTypeToString(type)}
                    options={allAccountTypesString}
                    updateSelectedValue={accountTypeHandler}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <div className="column is-2">
                    <span>Balance</span>
                </div>
                <TextBox
                    addOn={{ position: "front", text: currency }}
                    className="column"
                    name="category-modify"
                    updateValue={accountBalanceHandler}
                    type="number"
                    value={balance.toString()}
                />
            </div>
        </Modal>
    );
};

const AccountSetting: React.FC = () => {
    const [accounts, setAccounts] = useRecoilState(accountsState);
    const { addNotification } = useNotification();
    const createAccountHandler = async (accountName: string, accountType: string) => {
        console.log(accountType);
        const response = await createAccount({
            name: accountName,
            type: mapStringToAccountType(accountType),
        });

        if (!response.account) {
            addNotification("Create account failed", "danger");
            return;
        }

        setAccounts(
            accounts.concat({
                id: response.account.id,
                name: response.account.name,
                type: response.account.type,
                balance: response.account.balance,
            })
        );
        addNotification("Create account success", "success");
    };

    const deleteAccountHandler = async (id: string | number) => {
        const isSuccess = await deleteAccount({
            id: +id,
        });

        if (!isSuccess) {
            addNotification("Delete account failed", "danger");
            return;
        }

        setAccounts(accounts.filter((x) => x.id !== id));
        addNotification("Delete account success", "success");
    };

    return (
        <>
            <SettingBox
                createFuncHandler={createAccountHandler}
                deleteFuncHandler={deleteAccountHandler}
                items={accounts.map((x) => {
                    return { id: x.id, name: x.name };
                })}
                dropdowns={allAccountTypesString}
                modifyModal={(id, onCancel) => <ModifyModal id={id} onCancel={onCancel} />}
            />
        </>
    );
};

export default AccountSetting;
