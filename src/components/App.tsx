import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loading from "../components/bases/Loading";
import { AuthProtection } from "./hoc/WithAuthProtection";

const TransactionList = React.lazy(() => import("./TransactionList"));
const Home = React.lazy(() => import("../components/Home"));
const More = React.lazy(() => import("../components/More"));
const SignIn = React.lazy(() => import("../components/SignIn"));
const Layout = React.lazy(() => import("../components/Layout"));
const CategorySetting = React.lazy(() => import("../components/CategorySetting"));
const WalletSetting = React.lazy(() => import("../components/WalletSetting"));

const App: React.FC = () => {
    return (
        <Router>
            <React.Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/signIn" element={<SignIn />} />
                    <Route
                        path="/"
                        element={
                            <AuthProtection>
                                <Layout>
                                    <Home />
                                </Layout>
                            </AuthProtection>
                        }
                    />
                    <Route
                        path="/wallet/:accountId/transactionList"
                        element={
                            <AuthProtection>
                                <Layout>
                                    <TransactionList />
                                </Layout>
                            </AuthProtection>
                        }
                    />
                    <Route
                        path="/more"
                        element={
                            <AuthProtection>
                                <Layout>
                                    <More />
                                </Layout>
                            </AuthProtection>
                        }
                    />
                    <Route
                        path="/category/setting"
                        element={
                            <AuthProtection>
                                <Layout>
                                    <CategorySetting />
                                </Layout>
                            </AuthProtection>
                        }
                    />
                    <Route
                        path="/wallet/setting"
                        element={
                            <AuthProtection>
                                <Layout>
                                    <WalletSetting />
                                </Layout>
                            </AuthProtection>
                        }
                    />
                </Routes>
            </React.Suspense>
        </Router>
    );
};

export default App;
