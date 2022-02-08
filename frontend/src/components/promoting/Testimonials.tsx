import { useEffect, useState } from 'react';
import useFetch from '../../hooks/use-fetch';
import './Testimonials.scss';
import UserCard from './UserCard';

const Testimonials = () => {
    const [userData, setUserData] = useState<any>([]);

    const { sendRequest } = useFetch();

    useEffect(() => {
        sendRequest('http://localhost:5000/api/users?page=2&limit=5')
            .then(data => {
                setUserData(data.users);
            })
            .catch(console.error);
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
                                    imgSrc={`http://localhost:5000/images/users/${user.photo}`}
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
