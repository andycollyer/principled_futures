"use client";

import { LegalPage, LegalSection, P, UL, LI } from "@/components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="29 July 2026">
      <LegalSection title="Who we are">
        <P>Principled Futures Advisory (&ldquo;Principled Futures&rdquo;, &ldquo;we&rdquo;) is a Salveus Labs product providing board-level AI and ESG governance software: a maturity assessment, an advisory report, continuous telemetry and a research library. For personal data processed through this website, we are the controller. Principled Futures is a product of Salveus Labs Ltd, a company registered in England and Wales (company number 16939567), registered office 3rd Floor, 86–90 Paul Street, London, England, EC2A 4NE.</P>
      </LegalSection>

      <LegalSection title="The short version">
        <P>Before you create an account, everything you enter stays in your own browser, on your own device — we cannot see it. Once you create an account, your assessment data is stored in our secure database so that it follows you between devices and can be shared within your organisation. We operate no advertising or analytics tracking, we never see your card details, and we do not sell data to anyone.</P>
      </LegalSection>

      <LegalSection title="What we process, and where it lives">
        <UL>
          <LI><strong>Before you sign in</strong> — assessment answers, score history and metric owners are held only in your browser&rsquo;s local storage. They never leave your machine, we have no copy, and clearing your browser&rsquo;s site data deletes them permanently.</LI>
          <LI><strong>Your account</strong> — your email address and a securely hashed password, together with the organisation record created for you. Passwords are hashed by our database provider and are never visible to us in readable form.</LI>
          <LI><strong>Once you sign in</strong> — your assessment answers (values 0–4 keyed to criteria), score history, and the names, roles and ring assignments you record for metric owners are stored in our database, held against your organisation and readable only by your own organisation&rsquo;s account holders. Our staff can access it where necessary to provide support, investigate a fault or meet a legal obligation.</LI>
          <LI><strong>Colleagues&rsquo; names you record</strong> — if you enter another person&rsquo;s name as a metric owner, you are the controller of that record and we process it on your behalf. Record only what you are entitled to record.</LI>
          <LI><strong>Payments</strong> — card payments are taken by Stripe on their own hosted checkout. Stripe processes your card details as controller under their own privacy policy; we never see or store your card number. We receive confirmation of payment, your billing email and a customer reference so we can activate your plan.</LI>
          <LI><strong>Enquiries</strong> — if you send us an enquiry we store the details you provide (name, work email, organisation, sector, role, organisation size and your message) so we can respond and keep a record of the conversation.</LI>
          <LI><strong>Document marking</strong> — reports and library documents issued to you are individually marked with your name, organisation and the date of issue. This protects our intellectual property and lets us trace unauthorised redistribution.</LI>
          <LI><strong>Technical delivery data</strong> — our hosting provider (Netlify, Inc.) and our database provider process IP addresses, request logs and similar technical data to deliver and secure the service, retained for a short period for security and diagnostics.</LI>
          <LI><strong>Fonts</strong> — pages load the Inter and JetBrains Mono typefaces from Google Fonts, which means your browser discloses your IP address to Google LLC to fetch the font files. We plan to self-host fonts to remove this disclosure.</LI>
        </UL>
      </LegalSection>

      <LegalSection title="Cookies and local storage">
        <P>We set no advertising, analytics or third-party cookies. The product uses browser local storage and session storage solely to make it function: your sign-in session, your answers, score history, owner assignments, and small display preferences (such as whether an animation has already played). This is strictly necessary storage under the UK&rsquo;s Privacy and Electronic Communications Regulations, so no consent banner is required — and we would rather earn trust than farm it.</P>
      </LegalSection>

      <LegalSection title="Lawful basis">
        <UL>
          <LI><strong>Performance of a contract</strong> — creating and running your account, storing your assessment data, providing the library and reports, and taking payment for a paid plan.</LI>
          <LI><strong>Legitimate interests</strong> — operating, securing and improving the service; responding to enquiries; and protecting our intellectual property, including marking issued documents and preventing bulk extraction of our content. We have balanced these interests against your rights and consider the impact proportionate and expected.</LI>
          <LI><strong>Legal obligation</strong> — retaining records of payments and invoices as tax and company law require.</LI>
        </UL>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <P>Account and assessment data is retained for as long as your account is open, and for 12 months after closure so that a reinstated account is not lost — after which it is deleted. Enquiry records are kept for 24 months. Payment and invoice records are kept for six years, as tax law requires. You can ask us to delete your account and its data at any time.</P>
      </LegalSection>

      <LegalSection title="Your rights">
        <P>Under the UK GDPR (as amended by the Data (Use and Access) Act 2025) and, where it applies, the EU GDPR, you have rights of access, rectification, erasure, restriction, portability and objection. For data still on your device before sign-in, the fastest route is direct: it is under your control, and clearing site data removes it. For account data, contact us at support@principledfutures.com and we will respond within one month.</P>
        <P>You also have the right to complain to the Information Commissioner&rsquo;s Office (ico.org.uk) or, if you are in the EU, to your local supervisory authority. We would appreciate the chance to resolve any concern first.</P>
      </LegalSection>

      <LegalSection title="Who we share it with">
        <P>We do not sell personal data and we do not share it for advertising. We use a small number of providers who process data on our instructions: Supabase (database, authentication and file storage), Netlify (hosting), and Stripe (payments). Each is bound by a data-processing agreement. We will also disclose data where the law requires it.</P>
      </LegalSection>

      <LegalSection title="International transfers">
        <P>Your account and assessment data is stored in the European Union (Ireland). Our hosting, database, payment and font providers are US-headquartered companies, so where personal data is transferred outside the UK we rely on the UK Extension to the EU–US Data Privacy Framework, or standard contractual clauses with the UK International Data Transfer Addendum, as applicable.</P>
      </LegalSection>

      <LegalSection title="Children">
        <P>This service is directed at businesses and is not intended for anyone under 18.</P>
      </LegalSection>

      <LegalSection title="Changes">
        <P>Material changes to this policy will be published on this page with a revised date. The 29 July 2026 update reflects the introduction of customer accounts, cloud storage of assessment data, and card payments through Stripe.</P>
      </LegalSection>
    </LegalPage>
  );
}
