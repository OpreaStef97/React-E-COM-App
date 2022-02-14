import { Star } from 'phosphor-react';
import { FC, Fragment, useEffect, useRef, useState } from 'react';
import useIntersect from '../../hooks/use-intersect';
import FillBar from './FillBar';
import './ReviewStats.scss';

const ReviewStats: FC<{ reviews?: any[] }> = props => {
    const { reviews } = props;
    const ref = useRef<HTMLDivElement>(null);
    const intersecting = useIntersect(ref);
    const [scrollKey, setScrollKey] = useState(1);
    useEffect(() => {
        if (intersecting) {
            setScrollKey(Math.random());
        }
    }, [intersecting]);

    const [stats, setStats] = useState<number[]>([]);
    useEffect(() => {
        if (!reviews || reviews.length === 0) return;
        const cntArr = [0, 0, 0, 0, 0];
        Promise.all(
            reviews.map(
                review =>
                    new Promise(resolve => {
                        resolve(++cntArr[review.rating - 1]);
                    })
            )
        ).then(() => {
            const percentages = cntArr.map(
                cnt => Math.round(((cnt * 100) / reviews.length + Number.EPSILON) * 100) / 100
            );
            setStats(percentages.reverse());
        });
    }, [reviews]);

    return (
        <div className="review-stats">
            <div className="review-stats--grid" ref={ref}>
                {stats.map((fill, idx) => {
                    return (
                        <Fragment key={idx}>
                            <div className="review-stats--stars">
                                <span>{5 - idx}</span> <Star weight="fill" />
                            </div>
                            <FillBar fill={fill} id={idx + 1} scrollKey={scrollKey + idx} />
                            <span className="review-stats--percentage">{fill}%</span>
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default ReviewStats;
