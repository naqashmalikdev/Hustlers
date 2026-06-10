import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Service — HUSTLERS",
  description:
    "The terms governing your use of HUSTLERS — gym membership, facility rules, supplement purchases, delivery, and refunds.",
};

const LAST_UPDATED = "June 7, 2026";

const sections: LegalSection[] = [
  {
    title: "Acceptance of Terms",
    body: (
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of the HUSTLERS website, gym facilities, memberships, and online
        supplement store. By creating an account, purchasing, or using our
        services, you agree to these Terms. If you do not agree, please do not
        use our services.
      </p>
    ),
  },
  {
    title: "Eligibility",
    body: (
      <p>
        You must be at least 16 years old to create an account or purchase from
        us, and at least 18 to enter into a membership agreement (or have
        consent from a parent or guardian). By using our services you confirm
        the information you provide is accurate and complete.
      </p>
    ),
  },
  {
    title: "Accounts & Registration",
    body: (
      <p>
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activity under your account. Notify us
        immediately of any unauthorised use. We may suspend or terminate
        accounts that violate these Terms.
      </p>
    ),
  },
  {
    title: "Gym Membership & Facility Rules",
    body: (
      <ul>
        <li>
          Membership grants access to the branch and plan you select, subject to
          opening hours and facility availability.
        </li>
        <li>
          Members must follow staff instructions, gym etiquette, hygiene rules,
          and proper use of equipment at all times.
        </li>
        <li>
          Fees, billing cycles, and freeze/cancellation terms are those
          presented at the time of sign-up. Fees are non-refundable except where
          required by law.
        </li>
        <li>
          We may refuse entry or terminate membership for conduct that endangers
          staff, members, or property.
        </li>
      </ul>
    ),
  },
  {
    title: "Health & Safety Disclaimer",
    body: (
      <p>
        Exercise and the use of supplements carry inherent risks. You should
        consult a qualified physician before beginning any training programme or
        taking any supplement, especially if you have a medical condition, are
        pregnant, or are taking medication. You train and use our facilities at
        your own risk and assume responsibility for your own health and safety.
      </p>
    ),
  },
  {
    title: "Products, Orders & Pricing",
    body: (
      <ul>
        <li>
          All prices are listed in Pakistani Rupees (PKR) and include applicable
          taxes unless stated otherwise.
        </li>
        <li>
          We strive for accuracy, but product descriptions, images, pricing, and
          availability may contain errors and are subject to change without
          notice.
        </li>
        <li>
          An order is an offer to buy. We may accept or decline it, and we may
          cancel and refund orders affected by pricing or stock errors.
        </li>
        <li>
          Supplements are intended as dietary supplements and are not a
          substitute for a balanced diet or medical advice.
        </li>
      </ul>
    ),
  },
  {
    title: "Shipping & Delivery",
    body: (
      <p>
        We deliver across Pakistan through third-party courier partners.
        Delivery timelines are estimates and may vary. Risk of loss passes to
        you on delivery to the address you provide. Please ensure your shipping
        details are correct, as we are not liable for delays caused by incorrect
        information.
      </p>
    ),
  },
  {
    title: "Returns & Refunds",
    body: (
      <p>
        For health and safety reasons, opened or used supplements cannot be
        returned. Items that arrive damaged, defective, or incorrect may be
        returned for a replacement or refund if you contact us within 7 days of
        delivery with proof of purchase. Refunds are issued to the original
        payment method or as store credit.
      </p>
    ),
  },
  {
    title: "Intellectual Property",
    body: (
      <p>
        All content on this site — including the HUSTLERS name, logo, text,
        graphics, and design — is owned by or licensed to HUSTLERS and protected
        by intellectual-property laws. You may not copy, reproduce, or use it
        without our prior written permission.
      </p>
    ),
  },
  {
    title: "Acceptable Use",
    body: (
      <p>
        You agree not to misuse our services — including attempting to gain
        unauthorised access, disrupting the site, scraping data, infringing
        others&rsquo; rights, or using the services for any unlawful purpose. We
        may restrict or terminate access for any breach.
      </p>
    ),
  },
  {
    title: "Disclaimers & Limitation of Liability",
    body: (
      <p>
        Our services are provided &ldquo;as is&rdquo; without warranties of any
        kind. To the fullest extent permitted by law, HUSTLERS shall not be
        liable for any indirect, incidental, or consequential damages arising
        from your use of our services, facilities, or products.
      </p>
    ),
  },
  {
    title: "Indemnification",
    body: (
      <p>
        You agree to indemnify and hold harmless HUSTLERS and its staff from any
        claims, losses, or expenses arising out of your breach of these Terms or
        your misuse of our services, facilities, or products.
      </p>
    ),
  },
  {
    title: "Governing Law",
    body: (
      <p>
        These Terms are governed by the laws of the Islamic Republic of
        Pakistan, and any disputes shall be subject to the exclusive
        jurisdiction of the courts of Lahore.
      </p>
    ),
  },
  {
    title: "Changes to These Terms",
    body: (
      <p>
        We may update these Terms from time to time. The latest version will
        always be posted on this page with a revised &ldquo;Last updated&rdquo;
        date. Continued use of our services after changes take effect means you
        accept the updated Terms.
      </p>
    ),
  },
  {
    title: "Contact Us",
    body: (
      <p>
        Questions about these Terms? Email us at{" "}
        <a href="mailto:support@hustlers.pk">support@hustlers.pk</a> or call{" "}
        <a href="tel:+924211148785">+92 42 111 487 853</a>. HUSTLERS, Lahore,
        Pakistan.
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      titleLead="Terms of"
      titleAccent="Service"
      intro="The ground rules for training with us and shopping our store — straight and clear."
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  );
}
