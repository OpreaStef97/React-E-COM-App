import { useEffect } from 'react';

export default function useNoHover() {
    function hasTouch() {
        return (
            'ontouchstart' in document.documentElement ||
            navigator.maxTouchPoints > 0 ||
            navigator.maxTouchPoints > 0
        );
    }

    useEffect(() => {
        if (hasTouch()) {
            // remove all the :hover stylesheets
            try {
                // prevent exception on browsers not supporting DOM styleSheets properly
                for (var si in document.styleSheets) {
                    var styleSheet = document.styleSheets[si];
                    if (!styleSheet.cssRules) continue;

                    for (var ri = styleSheet.cssRules.length - 1; ri >= 0; ri--) {
                        if (!styleSheet.cssRules[ri].cssText) continue;

                        if (styleSheet.cssRules[ri].cssText.match(':hover')) {
                            styleSheet.deleteRule(ri);
                        }
                    }
                }
            } catch (ex) {
                console.log(ex);
            }
        }
    }, []);
}
