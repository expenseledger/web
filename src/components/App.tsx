import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loading from "../components/bases/Loading";

const TransactionList = React.lazy(() => import("./TransactionList"));
const Home = React.lazy(() => import("../components/Home"));
const More = React.lazy(() => import("../components/More"));
const SignIn = React.lazy(() => import("../components/SignIn"));
const Layout = React.lazy(() => import("../components/Layout"));
const CategorySetting = React.lazy(
    () => import("../components/CategorySetting")
);
const WalletSetting = React.lazy(() => import("../components/WalletSetting"));

const App: React.FC = () => {
    return (
        <Router>
            <React.Suspense fallback={<Loading />}>
                <Switch>
                    <Route path="/signIn" exact={true} component={SignIn} />
                    <Layout>
                        <Route path="/" exact={true} component={Home} />
                        <Route
                            path="/wallet/:accountId/transactionList"
                            exact={true}
                            component={TransactionList}
                        />
                        <Route path="/more" exact={true} component={More} />
                        <Route
                            path="/category/setting"
                            exact={true}
                            component={CategorySetting}
                        />
                        <Route
                            path="/wallet/setting"
                            exact={true}
                            component={WalletSetting}
                        />
                    </Layout>
                </Switch>
            </React.Suspense>
        </Router>
    );
};

export default App;
