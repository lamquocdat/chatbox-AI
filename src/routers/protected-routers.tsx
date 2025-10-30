import { Suspense } from "react";
import { Route } from "react-router-dom";
import { routerLinks } from "./router-links";
import React from "react";

const routes = [
    {
        path: `${routerLinks("Home")}`,
        component: React.lazy(() => import("../pages/home")),
    }
];

const ProtectedRoute = ({
    component: Component,
}: {
    path: string;
    component: React.ComponentType;
}) => {
    return (
        <Suspense fallback={null}>
            <Component />
        </Suspense>
    );
};

const ProtectedRouters = routes.map(({ path, component }, index) => (
    <Route
        key={index}
        path={path}
        element={<ProtectedRoute path={path} component={component} />}
    />
));

export default ProtectedRouters;
