"use client";

import { LegalPage, LegalSection, P, UL, LI } from "@/components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated="29 July 2026">
      <LegalSection title="Who we are, and what this is">
        <P>Principled Futures Advisory (&ldquo;Principled Futures&rdquo;, &ldquo;we&rdquo;) is a Salveus Labs product. These terms govern your use of this website and the Principled Futures application: the 8×8 governance assessment, advisory report, telemetry dashboard and research library. By using the service you accept these terms. Principled Futures is a product of Salveus Labs Ltd, a company registered in England and Wales (company number 16939567), registered office 3rd Floor, 86–90 Paul Street, London, England, EC2A 4NE.</P>
      </LegalSection>

      <LegalSection title="The service, as it stands">
        <P>You can begin the assessment without an account, in which case your answers stay in your own browser. Creating an account stores your data against your organisation so that it follows you between devices (see the Privacy policy), and is required to see your full score, use the research library and generate reports. Certain displayed values — the telemetry metric readings and peer benchmarks — are clearly labelled demo data. Demo data illustrates how the product works; do not rely on it as information about any organisation.</P>
      </LegalSection>

      <LegalSection title="Not professional advice">
        <P>The assessment, briefings, reports and telemetry describe governance practice and regulatory context in general terms. They are provided for information, and they are not legal, financial, accounting or other professional advice. Regulatory positions are stated as at the date shown on each page. Before acting on anything the service tells you — particularly in relation to the EU AI Act, the UK GDPR, the Data (Use and Access) Act 2025, the Equality Act 2010 or sustainability reporting — obtain advice from a qualified adviser on your specific circumstances.</P>
      </LegalSection>

      <LegalSection title="Your licence, and ours">
        <UL>
          <LI>We grant you a non-exclusive, revocable licence to use the service for your organisation&rsquo;s internal governance purposes.</LI>
          <LI>The 8×8 framework, the criterion briefings, the board papers, the design and all other content are the intellectual property of Salveus Labs. You may quote short extracts with attribution; you may not reproduce, resell or republish the framework or library content without written consent.</LI>
          <LI>Reports and summaries you generate from your own assessment data are yours to use within your organisation, including sharing with your board and advisers.</LI>
        </UL>
      </LegalSection>

      <LegalSection title="Your content">
        <P>Everything you enter — answers, owner names, organisational details — remains yours. Where you use the service without an account it stays on your device; once you sign in it is stored in our secure database so that it follows you between devices, accessible only to your own organisation. You are responsible for its accuracy and for your right to record it, including where it names other people.</P>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <P>You agree not to: use the service unlawfully; attempt to reverse-engineer, scrape at scale or systematically extract the framework or library; use automated means (including crawlers, scripts or AI agents) to access, copy or index the service other than as we expressly permit; share your account credentials, or provide access to people outside your organisation; misrepresent the service&rsquo;s outputs as certification, audit or assurance (an assessment score is a self-assessment, not an external verification); or resell access without an agreement with us.</P>
      </LegalSection>

      <LegalSection title="Text and data mining, and AI training">
        <P>Salveus Labs expressly reserves all rights in the content of this service for the purposes of text and data mining, and prohibits its use for the development, training, fine-tuning, evaluation or grounding of any artificial-intelligence or machine-learning model, whether commercial or otherwise. This reservation is made under Article 4(3) of Directive (EU) 2019/790 and the corresponding provisions of UK copyright law, and is additionally declared in machine-readable form in our robots.txt.</P>
        <P>No licence to mine, ingest or train on this content is granted by access to the service, by any free tier, or by the absence of a technical barrier. Documents issued through the service are individually marked, and unauthorised reproduction is traceable to the account that obtained them.</P>
      </LegalSection>

      <LegalSection title="Availability and change">
        <P>During the evaluation release the service is provided as-is and as-available. We may change, suspend or withdraw features, and will endeavour to give notice of material changes. When paid plans launch, service commitments will be set out in an updated agreement.</P>
      </LegalSection>

      <LegalSection title="Liability">
        <P>Nothing in these terms excludes liability that cannot lawfully be excluded, including for fraud or for death or personal injury caused by negligence. Subject to that, we are not liable for indirect or consequential loss, loss of profit, or loss arising from reliance on demo data or on general regulatory information in place of professional advice; and our total liability in connection with the evaluation release is limited to £100. This is a business-to-business service, and you use it in the course of business.</P>
      </LegalSection>

      <LegalSection title="Governing law">
        <P>These terms are governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction, except that nothing prevents either party seeking injunctive relief elsewhere for intellectual-property infringement.</P>
      </LegalSection>

      <LegalSection title="Contact">
        <P>Questions about these terms: support@principledfutures.com.</P>
      </LegalSection>
    </LegalPage>
  );
}
