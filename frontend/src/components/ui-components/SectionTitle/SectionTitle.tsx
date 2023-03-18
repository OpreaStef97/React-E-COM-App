import { FC, ReactNode } from "react";

import "./SectionTitle.scss";

const SectionTitle: FC<{
    children: ReactNode;
}> = (props) => {
    return (
        <div className="section-title">
            <h1 className="section-title__content">{props.children}</h1>
        </div>
    );
};

export default SectionTitle;
