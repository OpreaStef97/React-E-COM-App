import { MagnifyingGlass } from 'phosphor-react';

import './Search.scss';

const Search = (props: { className?: string }) => {
    return (
        <div className={`search-container ${props.className}`}>
            <form action="#" className="search">
                <input type="text" className="search__input" placeholder="Search" />
                <button className="search__button" aria-label="search-glass">
                    <MagnifyingGlass className="search__icon" />
                </button>
            </form>
        </div>
    );
};

export default Search;
