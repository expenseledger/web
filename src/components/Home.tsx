import moment from "moment";
import * as R from "ramda";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { useRecoilState } from "recoil";
import { gql, useMutation } from "@apollo/client";

import {
    categoriesState,
    toastState,
    walletsState,
} from "../common/shareState";
import { mapNotificationProps } from "../service/Mapper";
import { formatNumber } from "../service/Utils";
import Button from "./bases/Button";
import DateBox from "./bases/DateBox";
import Dropdown from "./bases/Dropdown";
import Loading from "./bases/Loading";
import TextBox from "./bases/TextBox";
// import TextBoxWithButton from "./bases/TextBoxWithButton";
import { withAuthProtection } from "./hoc/WithAuthProtection";
import "./Home.scss";
import Layout from "./Layout";

interface CurrentValue {
    walletIdx: number;
    categoryIdx: number;
    amount: number;
    date: string;
}

const CURRENT_USER = gql`
    mutation CurrentUser {
        currentUser(input: {}) {
            owner {
                accounts(orderBy: [NAME_ASC]) {
                    nodes {
                        id
                        name
                        type
                        balance
                    }
                }
                categories(orderBy: [NAME_ASC]) {
                    nodes {
                        id
                        name
                    }
                }
            }
        }
    }
`;

// const ADD_CATEGORY = gql`
//     mutation AddCategory($name: String!) {
//         createCategory(input: { name: $name }) {
//             category {
//                 id
//                 name
//             }
//         }
//     }
// `;

const ADD_EXPENSE = gql`
    mutation AddExpense(
        $amount: Float!
        $description: String!
        $categoryId: Int!
        $fromAccountId: Int!
    ) {
        spend(
            input: {
                amount: $amount
                description: $description
                categoryId: $categoryId
                fromAccountId: $fromAccountId
            }
        ) {
            transaction {
                id
                amount
                description
                type
                date
                categoryId
                fromAccountId
                toAccountId
                fromAccount {
                    id
                    name
                    type
                    balance
                }
            }
        }
    }
`;

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
    // const [isShowAddCategory, setIsShowAddCategory] = React.useState(false);

    const [currentUser] = useMutation(CURRENT_USER);
    // const [addCategory] = useMutation(ADD_CATEGORY);
    const [addExpense] = useMutation(ADD_EXPENSE);

    React.useEffect(() => {
        const main = async () => {
            const { data, errors } = await currentUser();

            if (errors) {
                console.log("Kohpai-error", errors);
                return;
            }

            setCategories(data.currentUser.owner.categories.nodes);
            setWallets(data.currentUser.owner.accounts.nodes);
            setIsLoading(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        main();
    }, [currentUser, setCategories, setWallets, setIsLoading]);

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
        const { walletIdx, amount, categoryIdx } = currentValue;

        if (amount === 0) {
            setNotificationList((prev) =>
                prev.concat(
                    mapNotificationProps(
                        "AddExpense failed: Please add amount",
                        "danger"
                    )
                )
            );
            return;
        }

        const { data, errors } = await addExpense({
            variables: {
                amount,
                description: "quick add appense",
                categoryId: categories[categoryIdx]?.id ?? 0,
                fromAccountId: wallets[walletIdx]?.id ?? 0,
            },
        });

        if (!errors) {
            const tWallets = R.clone(wallets);
            const fromAccount = data.spend.transaction.fromAccount;
            const selectedWalletIdx = wallets.findIndex(
                (x) => x.id === fromAccount.id
            );

            tWallets[selectedWalletIdx].balance = fromAccount.balance;
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

    // const onAddCategoryClickHandler = () => {
    //     setIsShowAddCategory((prev) => !prev);
    // };

    // const onAddCategory = async (name: string) => {
    //     const { data, errors } = await addCategory({
    //         variables: { name },
    //     });
    //     if (errors) {
    //         setNotificationList((prevNotiList) =>
    //             prevNotiList.concat(
    //                 mapNotificationProps("Create category failed", "danger")
    //             )
    //         );
    //         return;
    //     }
    //
    //     setCategories(categories.concat(data.createCategory.category));
    //     setNotificationList((prevNotiList) =>
    //         prevNotiList.concat(
    //             mapNotificationProps("Create category successful", "success")
    //         )
    //     );
    //     setIsShowAddCategory(false);
    // };

    // const renderAddCategory = () => {
    //     return isShowAddCategory ? (
    //         <TextBoxWithButton onClick={onAddCategory} />
    //     ) : null;
    // };

    return isLoading ? (
        <Loading />
    ) : (
        <Layout isShowBackwardIcon={false}>
            <section className="hero content__hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title inline">Balance:</h1>
                        <h1 className="subtitle inline has-text-weight-bold ml-3">
                            {formatNumber(
                                wallets[currentValue.walletIdx]?.balance ?? 0
                            )}
                        </h1>
                        <h1 className="subtitle inline has-text-weight-bold ml-3">
                            THB
                        </h1>
                    </div>
                </div>
            </section>
            <div className="columns is-mobile is-vcentered">
                <div className="column is-5">
                    <Dropdown
                        className="content__balance__dropdown"
                        options={wallets.map((wallet) => wallet.name)}
                        updateSelectedValue={updateSelectedWallet}
                    />
                </div>
                <div className="column is-7">
                    <Link
                        className="has-text-weight-bold"
                        to={{
                            pathname: `/transactionList/${
                                wallets[currentValue.walletIdx]?.name ?? ""
                            }`,
                        }}
                    >
                        Transaction
                    </Link>
                </div>
            </div>
            <div className="columns is-mobile is-vcentered">
                <span className="column is-5 has-text-weight-bold">Date</span>
                <DateBox
                    className="column is-7"
                    name="date"
                    updateValue={updateSelectedDate}
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <span className="column is-5 has-text-weight-bold">
                    Amount(THB)
                </span>
                <TextBox
                    className="column is-7"
                    updateValue={updateExpense}
                    name="expnese"
                    type="number"
                />
            </div>
            <div className="columns is-mobile is-vcentered">
                <span className="column is-5 has-text-weight-bold">
                    Category
                </span>
                <Dropdown
                    className="column is-7"
                    options={categories.map((category) => category.name)}
                    updateSelectedValue={updateSelectedCategory}
                />
                {/* <Button
                    onClickHandler={onAddCategoryClickHandler}
                    className="is-info is-light category__addBtn"
                    value="Create"
                /> */}
            </div>
            {/* {renderAddCategory()} */}
            <div className="columns is-mobile">
                <div className="column is-narrow">
                    <Button
                        className="content__button--add"
                        onClickHandler={addTransaction}
                        value="Add"
                        outlined
                        type="primary"
                    />
                </div>
                <div className="column">
                    <Button
                        className="content__button--more is-dark is-narrow"
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
