import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loading from "../components/bases/Loading";
import { AuthProtection } from "./hoc/WithAuthProtection";

const TransactionList = React.lazy(() => import("./TransactionList"));
const Home = React.lazy(() => import("./Home"));
const More = React.lazy(() => import("../components/More"));
const SignIn = React.lazy(() => import("../components/SignIn"));
const Layout = React.lazy(() => import("../components/Layout"));
const CategorySetting = React.lazy(() => import("../components/CategorySetting"));
const AccountSetting = React.lazy(() => import("./AccountSetting"));

const App: React.FC = () => {
    return (
        <Router>
            <React.Suspense fallback={<Loading />}>
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
            </React.Suspense>
        </Router>
    );
};

export default App;
