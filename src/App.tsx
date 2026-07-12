import {useEffect} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Navbar} from "./components/navigation/Navbar.tsx";
import {Hero} from "./pages/Hero.tsx";
import {AboutIntro} from "./pages/AboutIntro.tsx";
import {ProjectSection} from "./pages/ProjectSection.tsx";
import {ServicesSection} from "./pages/ServicesSection.tsx";
import {Work} from "./pages/Work.tsx";
import {ProjectDetail} from "./pages/ProjectDetail.tsx";
import {About} from "./pages/About.tsx";
import {Contact} from "./pages/Contact.tsx";

import Lenis from "lenis";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {Loader} from "./pages/Loader.tsx";
import {CustomCursor} from "./components/interaction/CustomCursor.tsx";

function App() {
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
        window.addEventListener("lagom:scroll-lock", handleScrollLock);

        const raf = (time: number) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);

        return () => {
            window.removeEventListener("lagom:scroll-lock", handleScrollLock);
            lenis.destroy();
        };
    }, []);

    return (
        <BrowserRouter>
            <main className={"min-h-screen bg-bg"}>
                <CustomCursor/>
                <Loader/>
                <Navbar/>
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
                    <Route path="/work" element={<Work/>}/>
                    <Route path="/works" element={<Navigate to="/work" replace/>}/>
                    <Route path="/projects" element={<Navigate to="/work" replace/>}/>
                    <Route path="/projekt" element={<Navigate to="/work" replace/>}/>
                    <Route path="/work/:slug" element={<ProjectDetail/>}/>
                    <Route path="/projects/:slug" element={<ProjectDetail/>}/>
                    <Route path="/projekt/:slug" element={<ProjectDetail/>}/>
                    <Route path="/studio" element={<About/>}/>
                    <Route path="/om-oss" element={<About/>}/>
                    <Route path="/contact" element={<Contact/>}/>
                    <Route path="/kontakt" element={<Contact/>}/>
                    <Route path="/process" element={<ServicesSection/>}/>
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
