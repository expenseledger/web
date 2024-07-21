import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./Layout";
import SignIn from "./signIn/SignIn";
import Home from "./Home";

const TransactionList = React.lazy(() => import("./transactionList/TransactionList"));
const More = React.lazy(() => import("./More"));
const CategorySetting = React.lazy(() => import("./setting/CategorySetting"));
const AccountSetting = React.lazy(() => import("./setting/AccountSetting"));
const PageSetting = React.lazy(() => import("./setting/PageSetting"));
const Report = React.lazy(() => import("./report/Report"));

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
                    <Route path="/page/setting" element={<PageSetting />} />
                    <Route path="/report" element={<Report />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
