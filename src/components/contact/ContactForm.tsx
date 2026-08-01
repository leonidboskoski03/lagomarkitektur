import type {ContactPageContent} from "../../data/contact";
import {ProjectEnquiryForm} from "./ProjectEnquiryForm";

interface ContactFormProps {
  content: ContactPageContent["form"];
  recipient: string;
}

export function ContactForm({content, recipient}: ContactFormProps) {
  return (
    <ProjectEnquiryForm
      recipient={recipient}
      variant="light"
      quickContent={{
        formLabel: content.formLabel,
        detailsLabel: content.detailsLabel,
        requiredLabel: content.requiredLabel,
        fields: content.fields,
        submitLabel: content.submitLabel,
        submitNote: content.submitNote,
        mailSubject: content.mailSubject,
        openingStatus: content.openingStatus,
      }}
    />
  );
}
