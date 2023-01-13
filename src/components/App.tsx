import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Report from "./report/Report";
import SignIn from "./signIn/SignIn";

const TransactionList = React.lazy(() => import("./transactionList/TransactionList"));
const Home = React.lazy(() => import("./Home"));
const More = React.lazy(() => import("./More"));
const CategorySetting = React.lazy(() => import("./setting/CategorySetting"));
const AccountSetting = React.lazy(() => import("./setting/AccountSetting"));

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signIn" element={<SignIn />} />
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/account/:accountId/transactionList"
                        element={<TransactionList />}
                    />
                    <Route path="/more" element={<More />} />
                    <Route path="/category/setting" element={<CategorySetting />} />
                    <Route path="/account/setting" element={<AccountSetting />} />
                    <Route path="/report" element={<Report />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
