import moment from "moment";
import * as R from "ramda";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
    categoriesState,
    toastState,
    walletsState,
} from "../common/shareState";
import * as CategoryService from "../service/CategoryService";
import { mapNotificationProps } from "../service/Mapper";
import { AddExpenseRequest } from "../service/model/Requests";
import { addExpense } from "../service/TransactionService";
import * as WalletService from "../service/WalletService";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import Loading from "./bases/Loading";
import TextBox from "./bases/TextBox";
import TextBoxWithButton from "./bases/TextBoxWithButton";
import { withAuthProtection } from "./hoc/WithAuthProtection";
import "./Home.scss";
import Layout from "./Layout";

interface CurrentValue {
    walletIdx: number;
    categoryIdx: number;
    amount: number;
    date: string;
}

const Home: React.FC<RouteComponentProps> = (props) => {
    const [wallets, setWallets] = useRecoilState(walletsState);
    const [categories, setCategories] = useRecoilState(categoriesState);
    const [, setNotificationList] = useRecoilState(toastState);
    const [currentValue, setCurrentValue] = React.useState<CurrentValue>({
        walletIdx: 0,
        categoryIdx: 0,
        amount: 0,
        date: moment().format("YYYY-MM-DD"),
    });
    const [isLoading, setIsLoading] = React.useState(true);
    const [isShowAddCategory, setIsShowAddCategory] = React.useState(false);

    React.useEffect(() => {
        Promise.all([
            WalletService.getAllWallet(),
            CategoryService.getAllCategories(),
        ]).then((responses) => {
            const [tWallets, tCategories] = responses;
            const sortByNameCaseInsensitive = R.sortBy<any>(
                R.compose(R.toLower, R.prop("name"))
            );

            setCategories(sortByNameCaseInsensitive(tCategories ?? []));
            setWallets(sortByNameCaseInsensitive(tWallets ?? []));
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateSelectedDate = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.date = value;
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedWallet = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.walletIdx = wallets.findIndex((x) => x.name === value);
        setCurrentValue(tCurrentValue);
    };

    const updateSelectedCategory = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.categoryIdx = categories.findIndex(
            (x) => x.name === value
        );
        setCurrentValue(tCurrentValue);
    };

    const updateExpense = (value: string) => {
        const tCurrentValue = R.clone(currentValue);

        tCurrentValue.amount = Number.parseFloat(value);
        setCurrentValue(tCurrentValue);
    };

    const addTransaction = async () => {
        const { walletIdx, amount, date, categoryIdx } = currentValue;
        const request: AddExpenseRequest = {
            amount,
            category: categories[categoryIdx]?.name ?? "",
            from: wallets[walletIdx]?.name ?? "",
            description: "quick add appense",
            date,
        };
        console.log(request);

        const response = await addExpense(request);

        if (response) {
            const tWallets = R.clone(wallets);
            const selectedWalletIdx = wallets.findIndex(
                (x) => x.name === response.srcWallet.name
            );

            tWallets[selectedWalletIdx].balance = response.srcWallet.balance;
            setWallets(tWallets);
            setNotificationList((prev) =>
                prev.concat(
                    mapNotificationProps("AddExpense sucess", "success")
                )
            );

            return;
        }

        setNotificationList((prev) =>
            prev.concat(mapNotificationProps("AddExpense is failed", "danger"))
        );
    };

    const toMorePage = () => {
        props.history.push("/more", { ...currentValue });
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

    const renderAddCategory = () => {
        return isShowAddCategory ? (
            <TextBoxWithButton onClick={addCategory} />
        ) : null;
    };

    return isLoading ? (
        <Loading />
    ) : (
        <Layout isShowBackwardIcon={false}>
            <div className="content">
                <div className="content__balance">
                    <span className="content__balance__text">
                        Balance: {wallets[currentValue.walletIdx]?.balance ?? 0}{" "}
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
                                wallets[currentValue.walletIdx]?.name ?? ""
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
                        outlined
                        type="primary"
                    />
                    <Button
                        className="content__button__more is-dark"
                        onClickHandler={toMorePage}
                        value="More"
                        outlined
                    />
                </div>
            </div>
        </Layout>
    );
};

const HomeWithAuthProtection = withAuthProtection()(Home);

export default withRouter(HomeWithAuthProtection);
