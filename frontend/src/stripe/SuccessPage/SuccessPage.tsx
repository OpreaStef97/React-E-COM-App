import { CircleWavyCheck } from "phosphor-react";
import { FC } from "react";
import { Button } from "../../components/ui-components";
import "./SuccessPage.scss";

const Success: FC = (props) => {
    return (
        <section className="success">
            <div className="success__container">
                <h1>
                    Success
                    <CircleWavyCheck className="success__icon" />
                </h1>
                <p>
                    Thank you for your order!
                    <br />
                    Payment was successfully processed.
                    <br /> Your products will arive in the shortest posible time!
                </p>
                <Button link to="/products" inverse>
                    Back to Store
                </Button>
            </div>
        </section>
    );
};

export default Success;
