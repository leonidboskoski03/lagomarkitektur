export const AboutIntro = () => {
    return (
        <section className="relative z-[2] -mt-[100vh] min-h-screen bg-[#f4f1ea] px-6 py-24 text-[#171717] md:px-12 md:py-36 lg:px-16 lg:py-44">
            <div className="mx-auto flex min-h-[80vh] max-w-[1600px] flex-col justify-between">
                <div>
                    <p className="mb-8 text-sm font-medium uppercase tracking-wide text-[#6f6a60]">
                        Our Studio
                    </p>

                    <h2 className="max-w-[10ch] text-[17vw] font-bold leading-[0.82] tracking-[-0.08em] md:text-[12vw] lg:text-[10vw]">
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
            </div>
        </section>
    );
};
