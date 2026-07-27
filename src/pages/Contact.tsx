import { useLayoutEffect } from "react";
import { ContactEnquiry } from "../components/contact/ContactEnquiry";
import { ContactHero } from "../components/contact/ContactHero";
import { contactContent } from "../data/contact";

export function Contact() {
  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);

  return (
    <article
      data-contact-page
      className="min-h-screen overflow-x-hidden bg-white"
    >
      <ContactHero content={contactContent} />
      <ContactEnquiry content={contactContent} />
    </article>
  );
}
