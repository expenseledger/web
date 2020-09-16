import moment from "moment";
import * as R from "ramda";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link, withRouter } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import * as CategoryService from "../service/CategoryService";
import { mapNotificationProps } from "../service/Mapper";
import Category from "../service/model/Category";
import { AddExpenseRequest } from "../service/model/Requests";
import Wallet from "../service/model/Wallet";
import { addExpense } from "../service/TransactionService";
import * as WalletService from "../service/WalletService";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import Loading from "./bases/Loading";
import { NotificationProps } from "./bases/Notification";
import TextBox from "./bases/TextBox";
import TextBoxWithButton from "./bases/TextBoxWithButton";
import Toast from "./bases/Toast";
import { withAuthProtection } from "./hoc/WithAuthProtection";
import "./Home.scss";
import Layout from "./Layout";

interface HomeState {
    wallets: Wallet[];
    categories: Category[];
    currentValue: CurrentValue;
    isLoading: boolean;
    isShowAddCategory: boolean;
    notificationList: NotificationProps[];
}

interface CurrentValue {
    wallet?: Wallet;
    category?: Category;
    amount: number;
    date: string;
}

const walletsState = atom<Wallet[]>({
    key: "wallets",
    default: [],
});
const categoriesState = atom<Category[]>({
    key: "categories",
    default: [],
});

function Home2(props: RouteComponentProps) {
    const [wallets, setWallets] = useRecoilState(walletsState);
    const [categories, setCategories] = useRecoilState(categoriesState);
    const [currentValue, setCurrentValue] = React.useState<CurrentValue>({
        wallet: {
            name: "",
            balance: 0,
            type: "",
        },
        category: {
            name: "",
        },
        amount: 0,
        date: moment().format("YYYY-MM-DD"),
    });
    const [isLoading, setIsLoading] = React.useState(true);
    const [isShowAddCategory, setIsShowAddCategory] = React.useState(true);
    const [notificationList, setNotificationList] = React.useState<
        NotificationProps[]
    >([]);
    const fetchAllWallet = React.useCallback(async () => {
        const tWallets = await WalletService.getAllWallet();
        const tCurrentValue = R.clone(currentValue);

        if (tWallets?.length > 0) {
            tCurrentValue.wallet = tWallets[0];
        }

        setWallets(tWallets ?? []);
        setCurrentValue(tCurrentValue);
    }, [currentValue, setWallets]);
    const fetchAllCategory = React.useCallback(async () => {
        const tCategories = await CategoryService.getAllCategories();
        const tCurrentValue = R.clone(currentValue);

        if (tCategories?.length > 0) {
            tCurrentValue.category = tCategories[0];
        }

        setCategories(tCategories ?? []);
        setCurrentValue(tCurrentValue);
    }, [currentValue, setCategories]);

    React.useEffect(() => {
        Promise.all([fetchAllWallet(), fetchAllCategory()]).then(() => {
            setIsLoading(false);
        });
    }, [fetchAllCategory, fetchAllWallet]);

    const renderAddCategory = () => {
        return isShowAddCategory ? (
            <TextBoxWithButton onClick={addCategory} />
        ) : null;
    };

    const updateSelectedDate = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.date = value;
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedWallet = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.wallet = wallets.find((x) => x.name === value);
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedCategory = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.category = categories.find((x) => x.name === value);
        setCurrentValue(tCurrentValue);
    };

    const updateExpense = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.amount = Number.parseFloat(value);
        setCurrentValue(tCurrentValue);
    };

    const addTransaction = async () => {
        const { wallet, amount, date, category } = currentValue;
        const request: AddExpenseRequest = {
            amount,
            category: category ? category.name : "",
            from: wallet ? wallet.name : "",
            description: "quick add appense",
            date,
        };

        const response = await addExpense(request);

        if (response) {
            const tWallets = R.clone(wallets);
            const selectedWalletIdx = tWallets.findIndex(
                (x) => x.name === response.srcWallet.name
            );

            tWallets[selectedWalletIdx].balance = response.srcWallet.balance;
            setWallets(tWallets);
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(
                    mapNotificationProps("AddExpense sucess", "success")
                )
            );

            return;
        }

        setNotificationList((prevNotiList) =>
            prevNotiList.concat(
                mapNotificationProps("AddExpense is failed", "danger")
            )
        );
    };

    const toMorePage = () => {
        props.history.push("/more");
    };

    const onAddCategoryClickHandler = () => {
        setIsShowAddCategory((prev) => !prev);
    };

    const addCategory = async (name: string) => {
        const response = await CategoryService.addCategory({ name });

        if (!response.isSuccess) {
            setNotificationList((prevNotiList) =>
                prevNotiList.concat(
                    mapNotificationProps("Create category failed", "danger")
                )
            );

            return;
        }

        const newCategories = categories.concat({ name });

        setCategories(newCategories);
        setNotificationList((prevNotiList) =>
            prevNotiList.concat(
                mapNotificationProps("Create category successful", "success")
            )
        );
        setIsShowAddCategory(false);
    };

    const onNotificationRemove = (id: string) => {
        setNotificationList((prevNotiList) =>
            prevNotiList.filter((n) => n.id !== id)
        );
    };

    return isLoading ? (
        <Loading />
    ) : (
        <Layout isShowBackwardIcon={false}>
            <Toast
                toastList={notificationList}
                position="top-right"
                onNotificationRemove={onNotificationRemove}
            />
            <div className="content">
                <div className="content__balance">
                    <span className="content__balance__text">
                        Balance:{" "}
                        {currentValue.wallet ? currentValue.wallet.balance : 0}{" "}
                        THB
                    </span>
                    <Dropdown
                        className="content__balance__dropdown"
                        options={wallets.map((wallet) => wallet.name)}
                        updateSelectedValue={updateSelectedWallet}
                    />
                    <Link
                        className="content__balance__transaction__link"
                        to={{
                            pathname: `/transactionList/${
                                currentValue.wallet
                                    ? currentValue.wallet.name
                                    : ""
                            }`,
                        }}
                    >
                        Transaction
                    </Link>
                </div>
                <div className="content__date">
                    <span className="content__date__text">Date </span>
                    <DateBox
                        className="content__date__box"
                        name="date"
                        updateValue={updateSelectedDate}
                    />
                </div>
                <div className="content__expense">
                    <span className="content__expense__text">Amount(THB) </span>
                    <TextBox
                        className="content__expense__box"
                        updateValue={updateExpense}
                        name="expnese"
                        type="number"
                    />
                </div>
                <div className="content__category">
                    <span className="content__category__text">Category </span>
                    <Dropdown
                        className="content__category__dropdown"
                        options={categories.map((category) => category.name)}
                        updateSelectedValue={updateSelectedCategory}
                    />
                    <Button
                        onClickHandler={onAddCategoryClickHandler}
                        className="is-info is-light category__addBtn"
                        value="Create"
                    />
                </div>
                {renderAddCategory()}
                <div className="content__button">
                    <Button
                        className="content__button__add"
                        onClickHandler={addTransaction}
                        value="Add"
                    />
                    <Button
                        className="content__button__more"
                        onClickHandler={toMorePage}
                        value="More"
                    />
                </div>
            </div>
        </Layout>
    );
}

const HomeWithAuthProtection = withAuthProtection()(Home);

export default withRouter(HomeWithAuthProtection);
