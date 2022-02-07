import { Star } from 'phosphor-react';
import { FC, Fragment, useEffect, useRef, useState } from 'react';
import MenuSelect from '../form/MenuSelect';
import UserCard from '../promoting/UserCard';
import Button from '../ui-components/Button';
import FillBar from './FillBar';
import './Reviews.scss';

const Reviews: FC = props => {
    const ref = useRef<HTMLDivElement>(null);
    const [key, setKey] = useState(1);

    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => {
                const ent = entries[0];

                if (ent.isIntersecting === true) {
                    setKey(Math.random());
                }
            },
            {
                root: null,
                threshold: 0,
                rootMargin: '0px',
            }
        );
        obs.observe(ref.current as Element);
    }, []);

    return (
        <div className="reviews">
            <div className="reviews-content">
                <div className="reviews-content-header">
                    <h3>Reviews</h3>
                    <MenuSelect
                        placeholder={'Sort by rating..'}
                        options={{
                            options: ['Top rated', 'Low Rated'],
                            selected: [false, false],
                        }}
                    />
                    <MenuSelect
                        placeholder={'Sort by date..'}
                        options={{
                            options: ['Top rated', 'Low Rated'],
                            selected: [false, false],
                        }}
                    />
                    <Button className='reviews-content-header--button'>Add a review</Button>
                </div>

                <div className="reviews-content-count">
                    <div className="reviews-content-count--grid" ref={ref}>
                        {[60, 20, 10, 7, 3].map((fill, idx) => {
                            return (
                                <Fragment key={idx}>
                                    <div className="reviews-content-count--stars">
                                        <span>{5 - idx}</span>{' '}
                                        <Star weight="fill" />
                                    </div>
                                    <FillBar
                                        fill={fill}
                                        id={idx + 1}
                                        scrollKey={key + idx}
                                    />
                                    <span className="reviews-content-count--percentage">
                                        {fill}%
                                    </span>
                                </Fragment>
                            );
                        })}
                    </div>
                </div>

                <ul className="reviews-content-list">
                    {[
                        1, 2, 3, 4, 5
                    ].map((_, i) => (
                        <li key={i} className="reviews-content-item">
                            <UserCard key={i} idx={1} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Reviews;
