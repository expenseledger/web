import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProtection } from "./hoc/WithAuthProtection";
import Layout from "./Layout";
import SignIn from "./SignIn";

const TransactionList = React.lazy(() => import("./TransactionList"));
const Home = React.lazy(() => import("./Home"));
const More = React.lazy(() => import("./More"));
const CategorySetting = React.lazy(() => import("./CategorySetting"));
const AccountSetting = React.lazy(() => import("./AccountSetting"));

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/signIn" element={<SignIn />} />
                <Route
                    element={
                        <AuthProtection>
                            <Layout />
                        </AuthProtection>
                    }>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/account/:accountId/transactionList"
                        element={<TransactionList />}
                    />
                    <Route path="/more" element={<More />} />
                    <Route path="/category/setting" element={<CategorySetting />} />
                    <Route path="/account/setting" element={<AccountSetting />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
