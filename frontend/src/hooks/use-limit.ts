import { useEffect, useState } from "react";
import { SelectState } from "./use-select";

export const useLimit = (selectState: SelectState) => {
    const [limit, setLimit] = useState("");

    useEffect(() => {
        if (!selectState || !selectState["show"]) {
            return;
        }
        const { selected, options } = selectState["show"];
        const idx = selected.findIndex((val: boolean) => val === true);
        if (idx !== -1) {
            setLimit(`${options[idx].split("/")[0]}`);
        }

        return () => setLimit("");
    }, [selectState]);

    return limit;
};
