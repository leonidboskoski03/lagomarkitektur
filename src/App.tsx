import {useEffect} from "react";
import {Navbar} from "./components/navigation/Navbar.tsx";
import {Hero} from "./pages/Hero.tsx";
import {AboutIntro} from "./pages/AboutIntro.tsx";

import Lenis from "lenis";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {Loader} from "./pages/Loader.tsx";

function App() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        lenis.on("scroll", ScrollTrigger.update);

        const raf = (time: number) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <main className={"bg-white min-h-screen"}>
            <Loader/>
            <Navbar/>
            <Hero/>
            <AboutIntro/>
        </main>
    );
}

export default App;
