import { Star } from 'phosphor-react';
import React from 'react';
import { FC, Fragment, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/use-fetch';
import useIntersect from '../../hooks/use-intersect';
import FillBar from './FillBar';
import './ReviewStats.scss';

const ReviewStats: FC<{ reviews?: any[]; rating?: number }> = props => {
    const { reviews } = props;
    const ref = useRef<HTMLDivElement>(null);
    const intersecting = useIntersect(ref);
    const [scrollKey, setScrollKey] = useState(1);
    const { sendRequest } = useFetch();
    const params = useParams();
    const [stats, setStats] = useState<number[]>([0, 0, 0, 0, 0]);

    useEffect(() => {
        if (intersecting) {
            setScrollKey(Math.random());
        }
    }, [intersecting]);

    useEffect(() => {
        if (!reviews || reviews.length === 0) return;
        const cntArr = [0, 0, 0, 0, 0];
        sendRequest(`${process.env.REACT_APP_API_URL}/products/${params.id}/reviews/stats`)
            .then(data => {
                data.stats.forEach((s: any) => {
                    cntArr[s._id - 1] = s.count;
                });
                const percentages = cntArr.map(
                    cnt => Math.round(((cnt * 100) / reviews.length + Number.EPSILON) * 100) / 100
                );
                setStats(percentages.reverse());
            })
            .catch(console.error);
        return () => setStats([0, 0, 0, 0, 0]);
    }, [params.id, reviews, sendRequest]);

    return (
        <div className="review-stats">
            <p>Total Rating: {props.rating?.toFixed(1)}</p>
            <div className='separator'></div>
            <div className="review-stats--grid" ref={ref}>
                {stats.map((fill, idx) => {
                    return (
                        <Fragment key={idx}>
                            <div className="review-stats--stars">
                                <span>{5 - idx}</span> <Star weight="fill" />
                            </div>
                            <FillBar fill={fill} id={idx + 1} scrollKey={scrollKey + idx} />
                            <span className="review-stats--percentage">{fill.toFixed(2)}%</span>
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default ReviewStats;
