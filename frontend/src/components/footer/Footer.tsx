import { FC } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../ui-components/Logo';
import './Footer.scss';

const Footer: FC<{ isLoading: boolean }> = props => {

    return (
        <footer className="footer" style={props.isLoading ? { marginTop: '100vh' } : {}}>
            <Logo big light />
            <ul className="footer-list">
                <li className="footer-item">
                    <Link className="footer-item__link" to="/">
                        COMPANY
                    </Link>
                </li>
                <li className="footer-item">
                    <Link className="footer-item__link" to="/">
                        CONTACT US
                    </Link>
                </li>
                <li className="footer-item">
                    <Link className="footer-item__link" to="/">
                        CARRERS
                    </Link>
                </li>
                <li className="footer-item">
                    <Link className="footer-item__link" to="/">
                        PRIVACY POLICY
                    </Link>
                </li>
                <li className="footer-item">
                    <Link className="footer-item__link" to="/">
                        TERMS
                    </Link>
                </li>
            </ul>
            <p className="footer__copyright">
                Built by Oprea Stefan for his personal portfolio. Copyright &copy; by Oprea Stefan.
            </p>
        </footer>
    );
};

export default Footer;
