import { FC, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { MeMenu, MeInfo, MeFavorites, MeReviews, MePurchases } from "../../../components/me";
import { Modal, Button } from "../../../components/ui-components";
import { useFetch, useTitle, useImageLoad, usePrevious } from "../../../hooks";
import { AuthType } from "../../../store/auth";
import { delayedNotification, uiActions } from "../../../store/ui";
import "./MePage.scss";

const routes = ["/me", "/me/favorites", "/me/reviews", "/me/purchases"];

const routeMap = new Map<string, number>();

routeMap.set("/me", 0);
routeMap.set("/me/favorites", 1);
routeMap.set("/me/reviews", 2);
routeMap.set("/me/purchases", 3);

const MePage: FC = (props) => {
    const { user, csrfToken } = useSelector((state: { auth: AuthType }) => state.auth);
    const [showModal, setShowModal] = useState(false);
    const { pathname } = useLocation();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const { sendRequest } = useFetch();
    const dispatch = useDispatch();
    const [index, setIndex] = useState<number>(routeMap.get(pathname)!);

    useTitle(`ReactECOM | Account`);

    const srcLoaded = useImageLoad(
        user?.photo ? `${process.env.REACT_APP_RESOURCES_URL}/users/${user?.photo}` : ""
    );
    const showModalHandler = () => {
        setShowModal((prev) => !prev);
    };

    const changeAvatarHandler = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedImage) {
            return;
        }

        const formData = new FormData();
        formData.append("photo", selectedImage);
        sendRequest({
            url: `${process.env.REACT_APP_API_URL}/users/update-me`,
            formData,
            method: "PATCH",
            headers: {
                "x-csrf-token": csrfToken,
            },
            credentials: "include",
        })
            .then(() => {
                dispatch(
                    delayedNotification({
                        delay: 500,
                        message: "Photo changed successfully",
                        status: "success",
                    })
                );
            })
            .catch((err) => {
                dispatch(
                    uiActions.showNotification({
                        status: "error",
                        message: err instanceof Error ? err.message : "Something went wrong",
                    })
                );
            })
            .finally(() => setShowModal(false));
    };

    const navigate = useNavigate();

    const prevIdx = usePrevious(index);
    const prevPathName = usePrevious(pathname);

    useEffect(() => {
        if (prevPathName === pathname) return;
        if (routeMap.has(pathname)) setIndex(routeMap.get(pathname)!);
    }, [pathname, prevPathName]);

    useEffect(() => {
        if (prevIdx !== index) navigate(routes[index], { replace: true });
    }, [index, navigate, prevIdx]);

    const handlers = useSwipeable({
        preventDefaultTouchmoveEvent: true,
        onSwipedLeft: () => setIndex((prevIdx) => (prevIdx + 1) % routes.length),
        onSwipedRight: () => setIndex((prevIdx) => (prevIdx || routes.length) - 1),
    });

    return (
        <>
            <Modal
                contentClass="upload-modal"
                show={showModal}
                onCancel={showModalHandler}
                headerClass={"image-upload__header"}
                header={"Change your avatar"}
                footerClass={"image-upload__footer"}
                footer={
                    <>
                        <Button
                            onClick={changeAvatarHandler}
                            role={"button"}
                            className="change-btn"
                            disabled={selectedImage ? false : true}
                        >
                            Submit
                        </Button>
                        <Button
                            role={"button"}
                            disabled={selectedImage ? false : true}
                            onClick={() => setSelectedImage(null)}
                        >
                            Remove
                        </Button>
                    </>
                }
            >
                <div className="image-upload">
                    <div className="image-upload__preview">
                        <img
                            alt="not found"
                            width={"250px"}
                            src={
                                selectedImage
                                    ? URL.createObjectURL(selectedImage)
                                    : `${process.env.REACT_APP_RESOURCES_URL}/users/${user?.photo}`
                            }
                        />
                        <div className="image-upload__box">
                            <label htmlFor="image-upload" className="image-upload__input">
                                Choose Image
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                hidden
                                onChange={(event) => {
                                    setSelectedImage(event.target.files![0]);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
            <section className="me">
                <div className="me-container">
                    <header className="me-header">
                        {srcLoaded && (
                            <img
                                onClick={showModalHandler}
                                className="me-header__image"
                                src={srcLoaded}
                                alt={`${user?.name}' pic`}
                            />
                        )}
                        <h1>Manage Account</h1>
                    </header>
                    <MeMenu pathname={pathname} />
                    <div className="me-content" {...handlers}>
                        <Routes>
                            <Route path="/" element={<MeInfo />} />
                            <Route path="/favorites" element={<MeFavorites />} />
                            <Route path="/reviews" element={<MeReviews />} />
                            <Route path="/purchases" element={<MePurchases />} />
                        </Routes>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MePage;
