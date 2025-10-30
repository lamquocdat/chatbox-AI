export const routerLinks = (name: string) => {
    const array: {
        [selector: string]: string;
    } = {
        Login: "/login",
        Register: "/register",
        ForgotPassword: "/forgot-password",

        Home: "/",
    }; // 💬 generate link to here

    return array[name];
};