import { useAppRouter } from "./router";
import { useAppInitialisation } from "./hooks/use-app-initialisation";
import { Fragment } from "react";
import { useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Footer from "./components/footer/Footer";
import MainNavigation from "./components/navigation/MainNavigation";
import { ScrollToTop } from "./components/ui-components";
import ErrorBoundary from "./error/ErrorBoundary";

const App = () => {
    useAppInitialisation();
    const location = useLocation();
    const appRouter = useAppRouter();

    return (
        <Fragment>
            <ErrorBoundary>
                <MainNavigation />
                <TransitionGroup component={null}>
                    <CSSTransition
                        key={location.pathname.startsWith("/me") ? "" : location.pathname}
                        timeout={400}
                        classNames="fade"
                    >
                        <ScrollToTop>{appRouter}</ScrollToTop>
                    </CSSTransition>
                </TransitionGroup>
                <Footer />
            </ErrorBoundary>
        </Fragment>
    );
};

export default App;
