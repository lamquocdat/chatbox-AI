import { useAuth } from "../hooks/useAuth";
import AuthenLayout from "../layouts/AuthenLayout";
import MainLayout from "../layouts/MainLayout";
import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import ProtectedRouters from "./protected-routers";
import PublicRouters from "./public-routers";
import { routerLinks } from "./router-links";
import { ConversationsProvider } from '../contexts/conversations';
import { RouterWrapper } from './router-wrapper';
const AppRouterWrapper = ({ children }: any) => {
    return <>{children}</>;
};

const Pages = () => {
    const { isAuthenticated } = useAuth();

    return (
        <RouterWrapper>
            <AppRouterWrapper>
                {isAuthenticated ? (
                    <ConversationsProvider>
                        <Routes>
                            <Route element={<MainLayout />}>
                                {ProtectedRouters}

                                <Route
                                    path="*"
                                    element={
                                        <Navigate
                                            to={`${routerLinks("Home")}`}
                                            replace
                                        />
                                    }
                                />
                            </Route>
                        </Routes>
                    </ConversationsProvider>
                ) : (
                    <Routes>
                        <Route element={<AuthenLayout />}>
                            {PublicRouters}
                            <Route
                                path="*"
                                element={
                                    <Navigate
                                        to={`${routerLinks("Login")}`}
                                        replace
                                    />
                                }
                            />
                        </Route>
                    </Routes>
                )}
            </AppRouterWrapper>
        </RouterWrapper>
    );
};

export default Pages;
