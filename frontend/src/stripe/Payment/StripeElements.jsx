import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_KEY =
    "pk_test_51KUDgVGg7aAflOuXCkyFuW66rAxxdfe339dVnAOimJ2JYjr7E7LQkA1omy1edRYzbXoJE342Fv76OKXifDm91yeR00C99LGi7b";

const StripeElements = ({ clientSecret, children }) => {
    return (
        <Elements
            stripe={loadStripe(STRIPE_KEY)}
            options={{
                clientSecret,
                appearance: { theme: "flat" },
            }}
        >
            {children}
        </Elements>
    );
};

export default StripeElements;
