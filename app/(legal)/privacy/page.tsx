import type { Metadata } from "next";
import { LegalDocument, type LegalSection } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy — HUSTLERS",
  description:
    "How HUSTLERS collects, uses, and protects your personal information across our gym membership and online supplement store.",
};

const LAST_UPDATED = "June 7, 2026";

const sections: LegalSection[] = [
  {
    title: "Introduction",
    body: (
      <p>
        This Privacy Policy explains how HUSTLERS (&ldquo;HUSTLERS&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) collects, uses,
        and safeguards your information when you visit our website, create an
        account, purchase supplements from our online store, or sign up for a
        gym membership. By using our services, you agree to the practices
        described here.
      </p>
    ),
  },
  {
    title: "Information We Collect",
    body: (
      <>
        <p>We collect the following categories of information:</p>
        <ul>
          <li>
            <strong>Account &amp; profile data</strong> — your name, email
            address, phone number, and password when you register.
          </li>
          <li>
            <strong>Order &amp; delivery data</strong> — shipping address, items
            ordered, order history, and payment method (e.g. Cash on Delivery).
            We do not store full card details.
          </li>
          <li>
            <strong>Membership data</strong> — the branch you train at, your
            chosen plan, and enquiries you submit through our contact forms.
          </li>
          <li>
            <strong>Usage data</strong> — device, browser, IP address, and pages
            visited, collected automatically to keep the site secure and improve
            it.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "How We Use Your Information",
    body: (
      <ul>
        <li>To create and manage your account and gym membership.</li>
        <li>To process, fulfil, and deliver your supplement orders.</li>
        <li>
          To send order confirmations, service updates, and respond to your
          enquiries.
        </li>
        <li>
          To improve our website, products, and member experience, and to keep
          our services safe and prevent fraud.
        </li>
        <li>To comply with legal and regulatory obligations.</li>
      </ul>
    ),
  },
  {
    title: "Cookies & Tracking",
    body: (
      <p>
        We use cookies and similar technologies to keep you signed in, remember
        your cart, and understand how the site is used. You can control cookies
        through your browser settings, though disabling them may affect parts of
        the site such as checkout.
      </p>
    ),
  },
  {
    title: "How We Share Information",
    body: (
      <>
        <p>We do not sell your personal information. We share it only with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> who help us operate — hosting,
            database, email delivery, and courier/logistics partners — strictly
            to perform services on our behalf.
          </li>
          <li>
            <strong>Authorities</strong> where required by law, court order, or
            to protect our rights and the safety of others.
          </li>
          <li>
            <strong>Successors</strong> in the event of a merger, acquisition, or
            sale of assets, subject to this Policy.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Data Retention",
    body: (
      <p>
        We keep your information for as long as your account is active or as
        needed to provide our services, comply with legal obligations, resolve
        disputes, and enforce our agreements. You may request deletion as
        described below.
      </p>
    ),
  },
  {
    title: "Security",
    body: (
      <p>
        We use reasonable technical and organisational measures to protect your
        information. However, no method of transmission or storage is completely
        secure, and we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    title: "Your Rights & Choices",
    body: (
      <p>
        You may access, update, or delete your account information at any time
        from your account settings, and you can unsubscribe from marketing
        messages using the link in those emails. To exercise any other rights,
        contact us using the details below.
      </p>
    ),
  },
  {
    title: "Children's Privacy",
    body: (
      <p>
        Our services are intended for individuals aged 16 and over. We do not
        knowingly collect information from children. If you believe a child has
        provided us information, please contact us so we can remove it.
      </p>
    ),
  },
  {
    title: "Changes to This Policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. Material changes
        will be posted on this page with a revised &ldquo;Last updated&rdquo;
        date. Your continued use of our services after changes take effect
        constitutes acceptance.
      </p>
    ),
  },
  {
    title: "Contact Us",
    body: (
      <p>
        Questions about this Policy or your data? Email us at{" "}
        <a href="mailto:support@hustlers.pk">support@hustlers.pk</a> or call{" "}
        <a href="tel:+924211148785">+92 42 111 487 853</a>. HUSTLERS, Lahore,
        Pakistan.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      titleLead="Privacy"
      titleAccent="Policy"
      intro="Your privacy matters. Here's exactly what we collect, why, and how we protect it."
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  );
}
