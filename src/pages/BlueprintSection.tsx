import {useRef} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import "./BlueprintSection.css";

export const BlueprintSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({paused: true});
    const q = gsap.utils.selector(sectionRef.current!);

    // Scene 1 initial state
    gsap.set(q("#panelLeft"), {rotationY: 68});
    gsap.set(q("#panelRight"), {rotationY: -68});
    gsap.set(q("#foldShadowLeft"), {opacity: 0.8});
    gsap.set(q("#foldShadowRight"), {opacity: 0.8});
    gsap.set(q("#titleBlock"), {opacity: 0, y: -8});
    gsap.set(q("#drawingOverlay"), {opacity: 0});
    gsap.set(q(".door-swing"), {opacity: 0, rotationY: 0});

    // Scene 1: paper unfold
    tl.to(q("#panelLeft"), {rotationY: 0, duration: 1.4, ease: "power3.inOut"}, 0.5)
      .to(q("#panelRight"), {rotationY: 0, duration: 1.4, ease: "power3.inOut"}, 0.5)
      .to(q("#foldShadowLeft"), {opacity: 0, duration: 1.2, ease: "power2.out"}, 0.5)
      .to(q("#foldShadowRight"), {opacity: 0, duration: 1.2, ease: "power2.out"}, 0.5)
      .to(q("#titleBlock"), {opacity: 1, y: 0, duration: 0.6, ease: "power2.out"}, 1.6);

    // Scene 2: SVG drawing animation
    tl.to(q("#drawingOverlay"), {opacity: 1, duration: 0.4, ease: "power2.out"}, 3.0);

    tl.fromTo(q(".svg-walls path"),
      {strokeDashoffset: 1},
      {strokeDashoffset: 0, duration: 0.8, ease: "power2.out", stagger: 0.06},
      3.2
    );

    tl.fromTo(q(".svg-doors path"),
      {strokeDashoffset: 1},
      {strokeDashoffset: 0, duration: 0.5, ease: "power2.out", stagger: 0.15},
      4.2
    );

    tl.fromTo(q(".svg-windows line"),
      {strokeDashoffset: 1},
      {strokeDashoffset: 0, duration: 0.3, ease: "power1.out", stagger: 0.06},
      4.7
    );

    tl.fromTo(q(".svg-measurements line"),
      {strokeDashoffset: 1},
      {strokeDashoffset: 0, duration: 0.5, ease: "power2.out", stagger: 0.04},
      5.2
    );

    tl.fromTo(q(".svg-labels"),
      {opacity: 0},
      {opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.12},
      6.0
    );

    tl.fromTo(q(".svg-dimtext"),
      {opacity: 0},
      {opacity: 1, duration: 0.4, ease: "power2.out"},
      6.8
    );

    // Scene 3: isometric camera transition
    tl.to(q(".blueprint"), {
      rotationX: 28,
      rotationZ: 14,
      scale: 0.78,
      y: -40,
      duration: 2.2,
      ease: "power3.inOut"
    }, 8.0);

    // Scene 5: door reveal
    tl.fromTo(q(".door-swing"),
      {opacity: 0},
      {opacity: 1, duration: 0.6, ease: "power2.out"},
      11.0
    );

    tl.fromTo(q('[data-door="glow"]'),
      {opacity: 0, attr: {rx: 15, ry: 13}},
      {opacity: 0.8, attr: {rx: 110, ry: 90}, duration: 1.8, ease: "power3.out"},
      11.3
    );

    tl.to(q(".door-swing"), {
      rotationY: -75,
      duration: 1.0,
      ease: "power2.inOut"
    }, 11.5);

    tl.fromTo(q('[data-door="beam"]'),
      {opacity: 0, attr: {points: "660,290 660,290 660,290 660,290"}},
      {opacity: 1, attr: {points: "660,260 660,320 1020,400 1020,180"}, duration: 1.8, ease: "power2.out"},
      12.0
    );

    tl.fromTo(q('[data-door="pulse"]'),
      {opacity: 0, attr: {rx: 20, ry: 18}},
      {opacity: 0.55, attr: {rx: 70, ry: 60}, duration: 1.4, ease: "power2.out"},
      12.6
    ).to(q('[data-door="pulse"]'), {
      opacity: 0.3,
      attr: {rx: 60, ry: 50},
      duration: 2.5,
      ease: "sine.inOut"
    }, 14.0);

    // Scene 6: camera push
    tl.to(q(".blueprint"), {
      scale: 2.6,
      x: -320,
      y: -160,
      duration: 4.5,
      ease: "power3.inOut"
    }, 15.0);

    tl.to(q("#scene"), {
      perspective: 500,
      duration: 3.5,
      ease: "power2.out"
    }, 15.0);

    tl.to(q('[data-door="glow"]'), {
      attr: {rx: 700, ry: 600},
      opacity: 1,
      duration: 4.0,
      ease: "power3.out"
    }, 15.0);

    tl.to(q('[data-door="pulse"]'), {
      attr: {rx: 600, ry: 500},
      opacity: 0.65,
      duration: 4.0,
      ease: "power3.out"
    }, 15.2);

    tl.to(q('[data-door="beam"]'), {
      attr: {points: "660,0 660,750 1200,750 1200,0"},
      opacity: 0.35,
      duration: 3.5,
      ease: "power2.out"
    }, 15.5);

    tl.to(q(".svg-walls path, .svg-doors path, .svg-windows line, .svg-measurements line"),
      {opacity: 0, duration: 2.5, ease: "power2.out"}, 15.5);

    tl.to(q(".svg-labels, .svg-dimtext"),
      {opacity: 0, duration: 2.0, ease: "power2.out"}, 16.0);

    tl.to(q(".ambient-bg"), {opacity: 0, duration: 2.5, ease: "power2.out"}, 15.5);

    tl.to(q(".panel"), {opacity: 0.03, duration: 3.0, ease: "power2.out"}, 16.0);

    tl.to(q(".crease, .corner-mark, .title-block, .scale-bar, .compass, .room-label, .section-cut"),
      {opacity: 0, duration: 1.5, ease: "power2.out"}, 16.5);

    tl.to(q(".door-swing"), {opacity: 0.15, duration: 2.5, ease: "power2.out"}, 17.0);

    tl.to(q("#scene6Warm"), {opacity: 1, duration: 3.0, ease: "power2.out"}, 18.0);

    // Ambient breathing (runs full length)
    const ambientEl = q(".ambient-breathing");
    if (ambientEl.length) {
      tl.to(ambientEl[0], {y: -4, opacity: 0.6, duration: 3.5, ease: "sine.inOut"}, 0)
        .to(ambientEl[0], {y: 0, opacity: 0.8, duration: 3.5, ease: "sine.inOut"}, 3.5);
    }

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=5000",
      scrub: true,
      pin: true,
      animation: tl,
    });
  }, {scope: sectionRef});

  return (
    <section ref={sectionRef} className="blueprint-section h-screen w-full overflow-hidden bg-[#f4f1ea]">
      <div className="clip">
        <div className="ambient-bg ambient-breathing">
          <div className="ambient-line" />
          <div className="ambient-line" />
          <div className="ambient-line" />
          <div className="ambient-line" />
          <div className="ambient-vert" />
          <div className="ambient-vert" />
          <div className="ambient-vert" />
        </div>

        <div className="scene" id="scene">
          <div className="blueprint" id="blueprint">
            <div className="fold-shadow fold-shadow-left" id="foldShadowLeft" />
            <div className="fold-shadow fold-shadow-right" id="foldShadowRight" />

            <div className="crease crease-left" id="creaseLeft">
              <div className="crease-line" />
            </div>
            <div className="crease crease-right" id="creaseRight">
              <div className="crease-line" />
            </div>

            <div className="corner-mark corner-mark-tl" />
            <div className="corner-mark corner-mark-tr" />
            <div className="corner-mark corner-mark-bl" />
            <div className="corner-mark corner-mark-br" />

            <div className="title-block" id="titleBlock">
              <div className="title-studio">Lagom Arkitektur</div>
              <div className="title-project">Bostad · Plan 01</div>
            </div>

            <div className="drawing-overlay" id="drawingOverlay">
              <svg viewBox="0 0 1200 750" fill="none">
                <defs>
                  <radialGradient id="warmGlowGrad" cx="0.35" cy="0.5" r="0.65">
                    <stop offset="0%" stopColor="rgba(255,205,120,0.55)" />
                    <stop offset="25%" stopColor="rgba(255,180,80,0.3)" />
                    <stop offset="50%" stopColor="rgba(240,150,60,0.12)" />
                    <stop offset="100%" stopColor="rgba(240,150,60,0)" />
                  </radialGradient>
                  <linearGradient id="lightBeamGrad" x1="0" y1="0" x2="1" y2="0.15">
                    <stop offset="0%" stopColor="rgba(255,210,130,0.35)" />
                    <stop offset="35%" stopColor="rgba(255,180,80,0.12)" />
                    <stop offset="70%" stopColor="rgba(240,160,60,0.04)" />
                    <stop offset="100%" stopColor="rgba(240,160,60,0)" />
                  </linearGradient>
                  <radialGradient id="doorPulseGrad" cx="0.3" cy="0.5" r="0.6">
                    <stop offset="0%" stopColor="rgba(255,210,130,0.7)" />
                    <stop offset="35%" stopColor="rgba(255,180,80,0.35)" />
                    <stop offset="70%" stopColor="rgba(240,150,50,0.1)" />
                    <stop offset="100%" stopColor="rgba(240,150,50,0)" />
                  </radialGradient>
                </defs>

                <g className="svg-walls" stroke="rgba(43,42,39,0.55)" strokeWidth="2" strokeLinecap="round">
                  <path pathLength={1} d="M 180,120 L 1020,120" />
                  <path pathLength={1} d="M 1020,120 L 1020,660" />
                  <path pathLength={1} d="M 1020,660 L 180,660" />
                  <path pathLength={1} d="M 180,660 L 180,120" />
                  <path pathLength={1} d="M 660,120 L 660,260" />
                  <path pathLength={1} d="M 660,320 L 660,660" />
                  <path pathLength={1} d="M 660,440 L 740,440" />
                  <path pathLength={1} d="M 800,440 L 1020,440" />
                </g>

                <g className="svg-doors" stroke="rgba(43,42,39,0.25)" strokeWidth="1.2" fill="none" strokeLinecap="round">
                  <path pathLength={1} d="M 660,305 A 45,45 0 0,1 705,260" />
                  <path pathLength={1} d="M 780,440 A 40,40 0 0,1 740,480" />
                </g>

                <g className="svg-windows" stroke="rgba(43,42,39,0.35)" strokeWidth="1.2" fill="none">
                  <line pathLength={1} x1="180" y1="300" x2="195" y2="300" />
                  <line pathLength={1} x1="180" y1="350" x2="195" y2="350" />
                  <line pathLength={1} x1="780" y1="120" x2="780" y2="135" />
                  <line pathLength={1} x1="870" y1="120" x2="870" y2="135" />
                  <line pathLength={1} x1="180" y1="500" x2="195" y2="500" />
                  <line pathLength={1} x1="180" y1="550" x2="195" y2="550" />
                </g>

                <g className="svg-measurements" stroke="rgba(43,42,39,0.15)" strokeWidth="0.75" fill="none">
                  <line pathLength={1} x1="180" y1="88" x2="1020" y2="88" />
                  <line pathLength={1} x1="180" y1="82" x2="180" y2="94" />
                  <line pathLength={1} x1="1020" y1="82" x2="1020" y2="94" />
                  <line pathLength={1} x1="140" y1="120" x2="140" y2="660" />
                  <line pathLength={1} x1="134" y1="120" x2="146" y2="120" />
                  <line pathLength={1} x1="134" y1="660" x2="146" y2="660" />
                </g>

                <g className="svg-labels" fill="rgba(43,42,39,0.25)" fontFamily="Geist, Helvetica Neue, Arial, sans-serif" fontSize="12" letterSpacing="0.1em" opacity="0">
                  <text x="350" y="440">Vardagsrum</text>
                  <text x="780" y="300">Sovrum</text>
                  <text x="830" y="560">Badrum</text>
                </g>

                <g className="svg-dimtext" fill="rgba(43,42,39,0.2)" fontFamily="Geist, Helvetica Neue, Arial, sans-serif" fontSize="9" letterSpacing="0.08em" opacity="0">
                  <text x="600" y="82" textAnchor="middle">8400</text>
                  <text x="132" y="400" textAnchor="middle" transform="rotate(-90, 132, 400)">5400</text>
                </g>

                <g className="door-glow-elements">
                  <ellipse data-door="glow" cx="680" cy="290" rx="80" ry="70" fill="url(#warmGlowGrad)" opacity="0" />
                  <polygon data-door="beam" points="660,290 660,290 660,290 660,290" fill="url(#lightBeamGrad)" opacity="0" />
                  <ellipse data-door="pulse" cx="680" cy="290" rx="50" ry="45" fill="url(#doorPulseGrad)" opacity="0" />
                </g>
              </svg>
            </div>

            <div className="door-wrapper">
              <div className="door-align">
                <div className="door-swing">
                  <div className="door-panel" />
                </div>
              </div>
            </div>

            <div className="panels-3d">
              <div className="panel panel-left" id="panelLeft">
                <div className="drawing drawing-left">
                  <div className="wall-outer wall-top" style={{right: 0}} />
                  <div className="wall-outer wall-bottom" style={{right: 0}} />
                  <div className="wall-outer wall-left" style={{bottom: "25%"}} />
                  <div className="window-mark window-mark-1" />
                  <div className="dim dim-horiz dim-left-ext">
                    <span className="dim-label">4800</span>
                    <div className="dim-line" />
                  </div>
                </div>
              </div>

              <div className="panel panel-center" id="panelCenter">
                <div className="drawing drawing-center">
                  <div className="wall-outer wall-top" style={{left: 0, right: 0}} />
                  <div className="wall-outer wall-bottom" style={{left: 0, right: 0}} />
                  <div className="wall-inner" />
                  <div className="door-gap-fill" />
                  <div className="door-arc" />
                  <div className="window-mark window-mark-2" />
                  <div className="dim dim-horiz dim-top">
                    <div className="dim-line" />
                    <span className="dim-label">7200</span>
                    <div className="dim-line" />
                  </div>
                  <span className="room-label room-label-living">Vardagsrum</span>
                  <span className="room-label room-label-bedroom">Sovrum</span>
                  <div className="section-cut">
                    <span className="section-arrow">A</span>
                    <div style={{width: 40, height: 0, borderTop: "1px solid rgba(43,42,39,0.2)"}} />
                    <span className="section-arrow">A</span>
                    <span className="section-label">Sektion</span>
                  </div>
                </div>
              </div>

              <div className="panel panel-right" id="panelRight">
                <div className="drawing drawing-right">
                  <div className="wall-outer wall-top" style={{left: 0}} />
                  <div className="wall-outer wall-bottom" style={{left: 0}} />
                  <div className="wall-outer wall-right" style={{top: "18%", bottom: "25%"}} />
                  <div className="dim dim-horiz dim-bottom">
                    <div className="dim-line" />
                    <span className="dim-label">3600</span>
                  </div>
                  <div className="compass">
                    <svg className="compass-svg" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="18" stroke="rgba(43,42,39,0.2)" strokeWidth="0.5" />
                      <circle cx="20" cy="20" r="14" stroke="rgba(43,42,39,0.12)" strokeWidth="0.4" />
                      <line x1="20" y1="4" x2="20" y2="36" stroke="rgba(43,42,39,0.3)" strokeWidth="0.6" />
                      <line x1="4" y1="20" x2="36" y2="20" stroke="rgba(43,42,39,0.15)" strokeWidth="0.4" />
                      <polygon points="20,4 18,14 22,14" fill="rgba(43,42,39,0.4)" />
                      <polygon points="20,36 18,26 22,26" fill="rgba(43,42,39,0.15)" />
                      <text x="20" y="3" textAnchor="middle" fill="rgba(43,42,39,0.35)" fontSize="5" fontFamily="inherit">
                        N
                      </text>
                    </svg>
                  </div>
                  <div className="scale-bar">
                    <div className="scale-segment" />
                    <div className="scale-segment" />
                    <div className="scale-segment" />
                    <div className="scale-segment" />
                    <span className="scale-label">0 1 2 5m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="scene6-warm" id="scene6Warm" />
      </div>
    </section>
  );
};
