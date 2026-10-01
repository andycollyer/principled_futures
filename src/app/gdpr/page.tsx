"use client";

import { LegalPage, LegalSection, P, UL, LI } from "@/components/LegalPage";

export default function GdprPage() {
  return (
    <LegalPage title="GDPR statement" updated="29 July 2026">
      <LegalSection title="Our position">
        <P>Principled Futures is built by people who write about data-protection governance for a living, and the product is designed to practise what its own briefings preach. This page sets out how we meet the UK GDPR (as amended by the Data (Use and Access) Act 2025) and, where it applies, the EU GDPR — in the architecture, not just the paperwork.</P>
      </LegalSection>

      <LegalSection title="Data minimisation by design">
        <P>Until you create an account, the strongest privacy control is structural: your assessment answers, scores, history and owner assignments stay in your browser and are never transmitted to us. Once you sign in, that content is stored against your organisation in our database, encrypted in transit and at rest, and isolated at row level so that one organisation&rsquo;s records cannot be read by another. We still collect no advertising or analytics data, and we never see your card details.</P>
      </LegalSection>

      <LegalSection title="Controller and processor roles">
        <UL>
          <LI><strong>Website technical data</strong> — we are controller.</LI>
          <LI><strong>Your account details</strong> — we are controller for the email address and organisation record used to operate your account.</LI>
          <LI><strong>Content you enter about your organisation and colleagues</strong> — you are controller; once you sign in we act as processor, storing and returning that content on your instructions under the terms of this policy.</LI>
          <LI><strong>Payments</strong> — Stripe is an independent controller for card data taken on its hosted checkout; we are controller for the payment confirmation and billing email we receive back.</LI>
        </UL>
        <P>A data processing agreement is available to business customers on request.</P>
      </LegalSection>

      <LegalSection title="Sub-processors">
        <P>Current sub-processors: Supabase, Inc. (database, authentication and file storage), Netlify, Inc. (hosting and content delivery), Stripe, Inc. (payment processing) and Google LLC (font file delivery). Planned for a future release, with notice before use: Anthropic (report narrative generation, with a redact-before-send control). We maintain and publish this list and will give customers notice of changes.</P>
      </LegalSection>

      <LegalSection title="Security">
        <UL>
          <LI>All traffic served over TLS; no mixed content.</LI>
          <LI>No third-party trackers, advertising scripts or analytics on any page.</LI>
          <LI>Static front end with a minimal server surface: server-side code is limited to narrow, single-purpose functions for payment confirmation and document issue.</LI>
          <LI>Encryption in transit and at rest, row-level isolation between organisations, and least-privilege administrative access. Server-side keys are held as managed secrets and are never present in the browser.</LI>
        </UL>
      </LegalSection>

      <LegalSection title="Data subject requests">
        <P>Requests will be answered within one month: support@principledfutures.com. Before you sign in, product data is yours alone — access is immediate and erasure is a browser setting. For account data we support access, rectification, erasure, portability, restriction and objection; ask us and we will action it, including full deletion of your account and its assessment records.</P>
      </LegalSection>

      <LegalSection title="Breach notification">
        <P>Should a personal-data breach occur involving data we hold, we will notify the ICO without undue delay and within 72 hours where required, and affected individuals without undue delay where the breach is likely to result in high risk — with a plain-English account of what happened, what it affects and what we are doing.</P>
      </LegalSection>

      <LegalSection title="International transfers">
        <P>Your assessment data is held in our database in the United Kingdom (London) and is not stored outside the UK. Where personal data nonetheless reaches a US-headquartered sub-processor — for example payment confirmation via Stripe, or technical delivery data — we rely on the UK Extension to the EU–US Data Privacy Framework or standard contractual clauses with the UK International Data Transfer Addendum.</P>
      </LegalSection>

      <LegalSection title="Supervisory authorities">
        <P>UK: the Information Commissioner&rsquo;s Office, ico.org.uk. EU residents may also contact their national supervisory authority. We ask for the chance to put things right first: support@principledfutures.com.</P>
      </LegalSection>
    </LegalPage>
  );
}
