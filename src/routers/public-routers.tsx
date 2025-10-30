import { Suspense } from "react";
import { Route } from "react-router-dom";
import { routerLinks } from "./router-links";
import React from "react";

const Loading = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

const routes = [
    {
        path: `${routerLinks("Login")}`,
        component: React.lazy(() => import("../pages/login")),
    },
    {
        path: `${routerLinks("Register")}`,
        component: React.lazy(() => import("../pages/register")),
    },
    {
        path: `${routerLinks("ForgotPassword")}`,
        component: React.lazy(() => import("../pages/forget")),
    },
];

const PublicRouters = routes.map(({ path, component: Component }, index) => (
    <Route
        key={index}
        path={path}
        element={
            <Suspense fallback={<Loading />}>
                <Component />
            </Suspense>
        }
    />
));

export default PublicRouters;
