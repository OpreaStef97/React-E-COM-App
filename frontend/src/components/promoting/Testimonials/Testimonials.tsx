import { useState, useEffect } from "react";
import { useFetch } from "../../../hooks";
import UserCard from "../UserCard";
import "./Testimonials.scss";

const Testimonials = () => {
    const [userData, setUserData] = useState([]);

    const { sendRequest } = useFetch();

    useEffect(() => {
        sendRequest({ url: `${process.env.REACT_APP_API_URL}/users?page=2&limit=5` })
            .then((data) => {
                setUserData(data.docs);
            })
            .catch(console.error);
        return () => setUserData([]);
    }, [sendRequest]);

    return (
        <section className="testimonials">
            <div className="testimonials-container">
                <div className="testimonials-grid">
                    {userData &&
                        userData.map((user: any, idx: number) => {
                            return (
                                <UserCard
                                    key={idx}
                                    idx={idx}
                                    className={`testimonials__card--${idx + 1}`}
                                    imgSrc={`${process.env.REACT_APP_RESOURCES_URL}/users/${user.photo}`}
                                    userName={`${user.name}`}
                                />
                            );
                        })!}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
