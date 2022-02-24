import { CircleWavyCheck } from 'phosphor-react';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/ui-components/Button';
import './Success.scss';

const Success: FC = props => {
    const params = useParams();

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
