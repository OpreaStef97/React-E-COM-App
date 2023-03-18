import { useEffect, useState } from "react";
import { SelectState } from "./use-select";

export const useRequestFilter = (selectState: SelectState) => {
    const [filter, setFilter] = useState("");

    useEffect(() => {
        if (!selectState) {
            return;
        }
        let filterString = "";
        let selectObj: SelectState = { ...selectState };
        delete selectObj["sort"];
        delete selectObj["show"];
        Object.keys(selectObj).forEach((key) => {
            const { selected, options } = selectObj[key];
            selected.forEach((val, i) => {
                if (val === true) {
                    filterString += `&${
                        key === "RAM" || key === "storage" ? `default[${key}]` : `${key}`
                    }=${options[i]}`;
                }
            });
        });
        setFilter(filterString);
    }, [selectState]);

    return filter;
};
