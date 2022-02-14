import React from 'react';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import MeSidebar from '../../components/me/MeSidebar';
import Modal from '../../components/ui-components/Modal';
import useImageLoad from '../../hooks/use-image-load';
import './MePage.scss';

const MePage: FC = props => {
    const { user } = useSelector((state: any) => state.auth);
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();

    const srcLoaded = useImageLoad(
        user.photo ? `${process.env.REACT_APP_RESOURCES_URL}/images/users/${user?.photo}` : ''
    );
    const showModalHandler = () => {
        setShowModal(prev => !prev);
    };

    return (
        <>
            <Modal
                show={showModal}
                onCancel={showModalHandler}
                header={'Change your avatar'}
            ></Modal>
            <section className="me">
                <div className="me-container">
                    <div className="me-header">
                        <h2>
                            Hi {`${user && user.name && user.name.split(' ')[0]}`}, here you can
                            manage your account.
                        </h2>
                        {srcLoaded && (
                            <img
                                onClick={showModalHandler}
                                className="me-header__image"
                                src={srcLoaded}
                                alt={`${user.name}' pic`}
                            />
                        )}
                    </div>
                    <MeSidebar />
                    <div className="me-content">
                        <TransitionGroup>
                            <CSSTransition
                                key={location.key}
                                classNames={'fade'}
                                timeout={400}
                                unmountOnExit
                            >
                                <div>
                                    <Routes>
                                        <Route
                                            path="/"
                                            element={<div className="me-info">My Info</div>}
                                        />
                                        <Route
                                            path="/favorites"
                                            element={
                                                <div className="me-favorites">My Favorites</div>
                                            }
                                        />
                                        <Route
                                            path="/cart"
                                            element={<div className="me-cart">My Cart</div>}
                                        />
                                        <Route
                                            path="/reviews"
                                            element={<div className="me-reviews">My Reviews</div>}
                                        />
                                        <Route
                                            path="/purchases"
                                            element={
                                                <div className="me-purchases">My Purchases</div>
                                            }
                                        />
                                    </Routes>
                                </div>
                            </CSSTransition>
                        </TransitionGroup>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MePage;
