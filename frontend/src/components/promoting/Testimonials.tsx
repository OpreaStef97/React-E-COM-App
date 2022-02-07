import { useEffect, useState } from 'react';
import useFetch from '../../hooks/use-fetch';
import './Testimonials.scss';
import UserCard from './UserCard';

type UserData = {
    results: any;
};

type UserArray = any[];

const isUserData = (object: unknown): object is UserData => {
    return Object.prototype.hasOwnProperty.call(object, 'results');
};

const Testimonials = () => {
    const [userData, setUserData] = useState<UserArray>();

    const { isLoading, error, sendRequest } = useFetch();

    useEffect(() => {
        sendRequest('https://randomuser.me/api/?results=5')
            .then(data => {
                if (isUserData(data)) {
                    setUserData(data.results);
                }
            })
            .catch(err => console.log(err));
    }, [sendRequest]);

    return (
        <section className="testimonials">
            <div className="testimonials-container">
                <div className="testimonials-grid">
                    {userData &&
                        userData.map((user, idx) => {
                            return (
                                <UserCard
                                    key={idx}
                                    idx={idx}
                                    className={`testimonials__card--${idx + 1}`}
                                    imgSrc={user.picture.large}
                                    userName={`${user.name.first} ${user.name.last}`}
                                />
                            );
                        })!}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
