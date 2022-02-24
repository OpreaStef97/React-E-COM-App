import { ShoppingBag } from 'phosphor-react';
import './Logo.scss';

const Logo = (props: { light?: boolean; big?: boolean; className?: string }) => {
    return (
        <div className={`logo ${props.light ? 'logo-light' : ''} ${props.className}`}>
            <h1 style={{ fontSize: props.big ? '4rem' : '3.2rem' }}>ReactECOM</h1>
            <ShoppingBag
                style={{
                    width: props.big ? '5.3rem' : '4rem',
                    height: props.big ? '5.3rem' : '4rem',
                }}
                className="logo__icon"
            />
        </div>
    );
};

export default Logo;
