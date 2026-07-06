import {useEffect} from "react";
import {Navbar} from "./components/navigation/Navbar.tsx";
import {Hero} from "./pages/Hero.tsx";
import {AboutIntro} from "./pages/AboutIntro.tsx";
import {ProjectSection} from "./pages/ProjectSection.tsx";

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
        <main className={"bg-white min-h-screen"}>
            <CustomCursor/>
            <Loader/>
            <Navbar/>
            <Hero/>
            <AboutIntro/>
            <ProjectSection/>
        </main>
    );
}

export default App;
