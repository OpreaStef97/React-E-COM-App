import { FC } from 'react';
import './Select.scss';

const Select: FC<{
    id?: string;
    values?: string[];
    label?: string;
}> = props => {
    return (
        <div className="custom-select">
            <label className={'custom-select__label'} htmlFor={props.id}>
                {props.label}
            </label>
            <select id={props.id} className="custom-select__select">
                <option disabled>None</option>
                {props.values &&
                    props.values.map(value => {
                        return (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        );
                    })}
            </select>
            <span className="custom-select__arrow"></span>
        </div>
    );
};

export default Select;
