import { useSelector } from "react-redux";
import { Navigate, useRoutes } from "react-router-dom";
import Cart from "../components/cart/Cart";
import { AuthForm } from "../pages/authentication";
import { HomePage } from "../pages/home";
import { MePage } from "../pages/me-page";
import { ProductPage, Products } from "../pages/products";
import { AuthType } from "../store/auth";
import { CartType } from "../store/cart";
import Payment from "../stripe/Payment";
import SuccessPage from "../stripe/SuccessPage";

const getRoutes = ({ isLoggedIn, totalAmount }: { isLoggedIn: boolean; totalAmount: number }) => [
    {
        path: "/",
        children: [
            { index: true, element: <HomePage /> },
            {
                path: "cart",
                element: <Cart />,
            },
            {
                path: "payment/success",
                element: <SuccessPage />,
            },
            {
                path: "products",
                element: <Products category="All" />,
            },
            {
                path: "products/phones",
                element: <Products category="Phone" />,
            },
            {
                path: "products/tablets",
                element: <Products category="Tablet" />,
            },
            {
                path: "products/laptops",
                element: <Products category="Laptop" />,
            },
            {
                path: "product/:slug/:id",
                element: <ProductPage />,
            },
            totalAmount
                ? { path: "/payment", element: <Payment /> }
                : { element: <Navigate to="/" /> },
            isLoggedIn
                ? { path: "/me/*", element: <MePage /> }
                : { path: "/auth", element: <AuthForm /> },
            {
                path: "*",
                element: <Navigate to={"/"} />,
            },
        ],
    },
];

const useAppRouter = () => {
    const {
        auth: { isLoggedIn },
        cart: { totalAmount },
    } = useSelector((state: { auth: AuthType; cart: CartType }) => state);

    return useRoutes(getRoutes({ isLoggedIn, totalAmount }));
};

export default useAppRouter;
