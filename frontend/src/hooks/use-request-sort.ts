import { useEffect, useState } from "react";
import { SelectState } from "./use-select";

export const useRequestSort = (selectState: SelectState) => {
    const [sorting, setSorting] = useState<string>();
    useEffect(() => {
        if (!selectState || !selectState["sort"]) {
            return;
        }
        const { selected, options } = selectState["sort"];
        const idx = selected.findIndex((val: boolean) => val === true);
        if (idx !== -1) {
            switch (options[idx]) {
                case "Price: Low":
                    setSorting("price");
                    break;
                case "Price: High":
                    setSorting("-price");
                    break;
                case "No. of Reviews":
                    setSorting("-ratingsQuantity");
                    break;
                case "Best Rating":
                    setSorting("-ratingsAverage");
                    break;
            }
        } else setSorting("");
    }, [selectState]);

    return sorting;
};
