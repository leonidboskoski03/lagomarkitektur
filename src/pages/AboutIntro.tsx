import { Section } from "../components/layout/Section";

export const AboutIntro = () => {
    return (
        <Section
            spacing="large"
            className="relative z-[2] -mt-[100vh] min-h-screen bg-white text-[#171717]"
            containerClassName="flex min-h-[80vh] flex-col justify-between"
        >
                <div>
                    <h2 className="max-w-[1ch] text-[17vw] font-bold leading-[0.82] tracking-[-0.08em] md:text-[12vw] lg:text-[10vw]">
                        Experience{" "}
                        <br />
                        focused design
                    </h2>
                </div>

                <div className="mt-20 grid gap-8 md:grid-cols-12">
                    <p className="text-xl leading-tight text-[#171717] md:col-start-7 md:col-span-5 md:text-3xl">
                        We design spaces shaped by clarity, restraint, material honesty and
                        the way people live.
                    </p>
                </div>
        </Section>
    );
};
