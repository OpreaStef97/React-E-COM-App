import { CaretCircleDown } from 'phosphor-react';
import { useEffect, useRef, useState } from 'react';
import useClickOutside from '../../hooks/use-clicks-outside';
import Dropdown from '../home/Dropdown';
import './MeSidebar.scss';
import MeSidebarLinks from './MeSidebarLinks';

const MeSidebar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const { clicked, clearClick } = useClickOutside(ref);

    useEffect(() => {
        if (clicked) {
            setShowDropdown(false);
        }
        clearClick();
    }, [clicked, clearClick]);

    return (
        <div className="me-sidebar">
            <p>What do you want to see?</p>
            <MeSidebarLinks />
            <div className="me-sidebar-dropdown" ref={ref}>
                <button
                    onClick={() => setShowDropdown(prev => !prev)}
                    className={`me-sidebar-btn ${showDropdown || 'active'}`}
                >
                    Menu
                    <CaretCircleDown className="me-sidebar-btn--icon" />
                </button>
                <Dropdown
                    show={showDropdown}
                    className="me-sidebar-dropdown__component"
                    transitionMs={300}
                >
                    <MeSidebarLinks onClick={() => setShowDropdown(false)} />
                </Dropdown>
            </div>
        </div>
    );
};

export default MeSidebar;