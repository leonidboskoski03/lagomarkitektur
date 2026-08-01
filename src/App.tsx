import {lazy, Suspense, useEffect, useState} from "react";
import {BrowserRouter, Navigate, Route, Routes, useLocation} from "react-router";
import {Navbar} from "./components/navigation/Navbar.tsx";
import {Hero} from "./pages/Hero.tsx";
import {AboutIntro} from "./pages/AboutIntro.tsx";
import {ProjectSection} from "./pages/ProjectSection.tsx";
import {ServicesSection} from "./pages/ServicesSection.tsx";

import Lenis from "lenis";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {Loader} from "./pages/Loader.tsx";
import {CustomCursor} from "./components/interaction/CustomCursor.tsx";
import {Footer} from "./components/layout/Footer.tsx";
import {ProjectTransitionProvider} from "./components/transition/ProjectTransitionProvider.tsx";
import {WorkTransitionProvider} from "./components/transition/WorkTransitionProvider.tsx";
import {ContactTransitionProvider} from "./components/transition/ContactTransitionProvider.tsx";
import {
    useReloadOnResize,
    useScrollToTopOnLoad,
} from "./hooks/useReloadOnResize";
import {
    SMOOTH_SCROLL_EVENT,
    type SmoothScrollRequest,
} from "./lib/smoothScroll";
import {LanguageProvider} from "./i18n/LanguageProvider.tsx";

const Work = lazy(() => import("./pages/Work.tsx").then((module) => ({default: module.Work})));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.tsx").then((module) => ({default: module.ProjectDetail})));
const About = lazy(() => import("./pages/About.tsx").then((module) => ({default: module.About})));
const Contact = lazy(() => import("./pages/Contact.tsx").then((module) => ({default: module.Contact})));
const Privacy = lazy(() => import("./pages/Privacy.tsx").then((module) => ({default: module.Privacy})));

function HomepageLoader() {
    const {pathname} = useLocation();
    return pathname === "/" ? <Loader/> : null;
}

function AppContent() {
    const {pathname} = useLocation();
    const [isFooterVisible, setIsFooterVisible] = useState(true);
    const isContactPage = pathname === "/contact" || pathname === "/kontakt";

    useReloadOnResize();
    useScrollToTopOnLoad();

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        lenis.on("scroll", ScrollTrigger.update);

        const handleScrollLock = (event: Event) => {
            const {locked} = (event as CustomEvent<{locked: boolean}>).detail;
            if (locked) lenis.stop();
            else lenis.start();
        };
        const handleSmoothScroll = (event: Event) => {
            const {
                target,
                offset = 0,
                immediate = false,
            } = (event as CustomEvent<SmoothScrollRequest>).detail;

            lenis.scrollTo(target, {
                offset,
                immediate,
                duration: immediate ? 0 : 1.15,
            });
        };

        window.addEventListener("lagom:scroll-lock", handleScrollLock);
        window.addEventListener(SMOOTH_SCROLL_EVENT, handleSmoothScroll);
        if (
            document.documentElement.style.overflow === "hidden"
            || document.body.style.overflow === "hidden"
        ) {
            lenis.stop();
        }

        const updateLenis = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(updateLenis);
        gsap.ticker.lagSmoothing(0);

        return () => {
            window.removeEventListener("lagom:scroll-lock", handleScrollLock);
            window.removeEventListener(SMOOTH_SCROLL_EVENT, handleSmoothScroll);
            gsap.ticker.remove(updateLenis);
            lenis.destroy();
        };
    }, []);

    return (
            <div className={"min-h-screen bg-bg"}>
                <CustomCursor/>
                <HomepageLoader/>
                <Navbar/>
                <main id="main-content">
                  <Suspense fallback={<div className="min-h-screen bg-bg" aria-busy="true" />}>
                    <Routes>
                        <Route
                            path="/"
                            element={(
                                <>
                                    <Hero/>
                                    <AboutIntro/>
                                    <ProjectSection/>
                                    <ServicesSection/>
                                </>
                            )}
                        />
                        <Route
                            path="/work"
                            element={<Work onFooterVisibilityChange={setIsFooterVisible}/>}
                        />
                        <Route path="/works" element={<Navigate to="/work" replace/>}/>
                        <Route path="/projects" element={<Navigate to="/work" replace/>}/>
                        <Route path="/projekt" element={<Navigate to="/work" replace/>}/>
                        <Route path="/work/:slug" element={<ProjectDetail/>}/>
                        <Route path="/projects/:slug" element={<ProjectDetail/>}/>
                        <Route path="/projekt/:slug" element={<ProjectDetail/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/studio" element={<Navigate to="/about" replace/>}/>
                        <Route path="/om-oss" element={<Navigate to="/about" replace/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/kontakt" element={<Contact/>}/>
                        <Route path="/privacy" element={<Privacy/>}/>
                        <Route path="/integritet" element={<Privacy/>}/>
                        <Route path="/process" element={<ServicesSection/>}/>
                    </Routes>
                  </Suspense>
                </main>
                {isFooterVisible ? (
                    <Footer
                        showEnquiry={!isContactPage}
                        showStudioInformation={!isContactPage}
                        showCompactNavigation={isContactPage}
                    />
                ) : null}
            </div>
    );
}

function App() {
    return (
        <LanguageProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <ProjectTransitionProvider>
                    <WorkTransitionProvider>
                        <ContactTransitionProvider>
                            <AppContent/>
                        </ContactTransitionProvider>
                    </WorkTransitionProvider>
                </ProjectTransitionProvider>
            </BrowserRouter>
        </LanguageProvider>
    );
}

export default App;
