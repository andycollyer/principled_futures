// src/lib/briefing-content.ts
// Localised AI Act timeline lead magnets (EN / FR / DE). FR & DE copy is
// VERBATIM from the handoff, including guillemets, „quotes", accents and
// umlauts — do not normalise punctuation. The three routes share one design.

export type BadgeTone = "success" | "warning" | "info" | "danger";

export interface TimelineItem { date: string; title: string; body: string; badge: string; tone: BadgeTone; }
export interface Move { n: string; title: string; body: string; }

export interface Briefing {
  lang: "en" | "fr" | "de";
  path: string;
  h1: string;
  sub: string;
  meta: string;
  timeline: TimelineItem[];
  calloutTitle: string;
  calloutBody: string;
  movesLabel: string;
  moves: Move[];
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  captureLabel: string;
  capturePlaceholder: string;
  captureButton: string;
  captureThanks: string;
  footer: string;
  switcherLabel: string;
}

const EN: Briefing = {
  lang: "en",
  path: "/briefing/ai-act-timeline",
  h1: "The AI Act deadlines have been delayed. Your obligations have not.",
  sub: "The Digital Omnibus pushed the heaviest requirements to 2027 and 2028 — while leaving two obligations in force that most boards still believe are yet to come. A briefing for the leaders of European SMEs.",
  meta: "Governance briefing · Position as at 22 July 2026",
  timeline: [
    { date: "2 Feb 2025", title: "Prohibited practices and AI literacy", body: "The Article 5 prohibitions (social scoring, manipulation, untargeted facial scraping) and the Article 4 duty to support staff AI literacy. Applies to deployers — including SMEs using off-the-shelf tools.", badge: "In force", tone: "success" },
    { date: "2 Aug 2025", title: "GPAI rules and the penalty regime", body: "Obligations for providers of general-purpose AI models; the fines regime applies.", badge: "In force", tone: "success" },
    { date: "2 Aug 2026", title: "Transparency duties — and AI-literacy oversight", body: "Informing chatbot users, labelling deepfakes, notification for emotion recognition or biometric categorisation. Supervision of the AI-literacy duty begins the same day.", badge: "Imminent", tone: "warning" },
    { date: "2 Dec 2026", title: "New prohibitions and marking of existing systems", body: "A ban on “nudifier” tools and AI-generated child sexual abuse material. Generative systems placed on the market before August 2026 must complete their machine-readable marking.", badge: "This year", tone: "warning" },
    { date: "2 Dec 2027", title: "Stand-alone high-risk systems", body: "Recruitment, credit scoring, education, essential services: full risk management, data governance, documentation and human oversight.", badge: "Delayed", tone: "info" },
    { date: "2 Aug 2028", title: "AI embedded in regulated products", body: "Safety components in medical devices, machinery and vehicles.", badge: "Delayed", tone: "info" },
  ],
  calloutTitle: "The obligation most boards still believe is yet to come",
  calloutBody: "The AI-literacy duty has applied since February 2025 to any organisation whose staff use AI — and its oversight begins in August. If your board cannot demonstrate the training it has provided, that gap is already on the record.",
  movesLabel: "Three moves",
  moves: [
    { n: "1", title: "Inventory every AI system", body: "Including bought tools and AI embedded in existing software. Classify each system against the risk tiers." },
    { n: "2", title: "Document AI literacy", body: "An obligation of effort, not result — but demonstrable effort: who was trained, on what, when." },
    { n: "3", title: "Use the delay well", body: "The deferral of the high-risk rules is preparation time, not a reprieve. Organisations that build their maturity now will meet 2027 as a formality." },
  ],
  ctaTitle: "Where does your organisation stand?",
  ctaBody: "Principled Futures' 8×8 assessment measures your governance maturity across 64 criteria and produces a board-ready report.",
  ctaButton: "Begin the assessment",
  captureLabel: "Get the full briefing as a PDF",
  capturePlaceholder: "you@organisation.com",
  captureButton: "Send it to me",
  captureThanks: "Thank you — we'll be in touch.",
  footer: "Principled Futures · A Salveus Labs product · General information, not legal advice. Regulatory position as at 22 July 2026.",
  switcherLabel: "EN",
};

const FR: Briefing = {
  lang: "fr",
  path: "/fr/briefing/calendrier-ai-act",
  h1: "« Les échéances de l’AI Act ont été reportées. Pas vos obligations. »",
  sub: "« L’Omnibus numérique a reporté les exigences les plus lourdes à 2027 et 2028 — tout en laissant en vigueur deux obligations que la plupart des conseils d’administration croient encore à venir. Une note à l’attention des dirigeants de PME européennes. »",
  meta: "« Note de gouvernance · Situation au 22 juillet 2026 »",
  timeline: [
    { date: "2 fév 2025", title: "« Pratiques interdites et maîtrise de l’IA »", body: "« Les interdictions de l’article 5 (notation sociale, manipulation, moissonnage facial non ciblé) et l’obligation de l’article 4 de favoriser la maîtrise de l’IA du personnel. Applicables aux déployeurs — y compris les PME utilisant des outils du commerce. »", badge: "En vigueur", tone: "success" },
    { date: "2 août 2025", title: "« Règles GPAI et régime de sanctions »", body: "« Obligations pour les fournisseurs de modèles d’IA à usage général ; le régime d’amendes s’applique. »", badge: "En vigueur", tone: "success" },
    { date: "2 août 2026", title: "« Obligations de transparence — et contrôle de la maîtrise de l’IA »", body: "« Information des utilisateurs de chatbots, étiquetage des hypertrucages, notification en cas de reconnaissance des émotions ou de catégorisation biométrique. La surveillance de l’obligation de maîtrise de l’IA débute le même jour. »", badge: "Imminent", tone: "warning" },
    { date: "2 déc 2026", title: "« Nouvelles interdictions et marquage des systèmes existants »", body: "« Interdiction des outils de « nudification » et des contenus pédocriminels générés par IA. Les systèmes génératifs mis sur le marché avant août 2026 doivent achever leur marquage lisible par machine. »", badge: "Cette année", tone: "warning" },
    { date: "2 déc 2027", title: "« Systèmes à haut risque autonomes »", body: "« Recrutement, notation de crédit, éducation, services essentiels : gestion des risques, gouvernance des données, documentation et contrôle humain au complet. »", badge: "Reporté", tone: "info" },
    { date: "2 août 2028", title: "« IA intégrée aux produits réglementés »", body: "« Composants de sécurité des dispositifs médicaux, machines et véhicules. »", badge: "Reporté", tone: "info" },
  ],
  calloutTitle: "« L’obligation que la plupart des conseils croient encore à venir »",
  calloutBody: "« L’obligation de maîtrise de l’IA s’applique depuis février 2025 à toute organisation dont le personnel utilise l’IA — et son contrôle commence en août. Si votre conseil ne peut pas démontrer les formations dispensées, cette lacune figure déjà au dossier. »",
  movesLabel: "Trois actions",
  moves: [
    { n: "1", title: "« Inventoriez chaque système d’IA »", body: "« Y compris les outils achetés et l’IA intégrée aux logiciels existants. Classez chaque système selon les niveaux de risque. »" },
    { n: "2", title: "« Documentez la maîtrise de l’IA »", body: "« Une obligation de moyens, non de résultat — mais des moyens démontrables : qui a été formé, sur quoi, quand. »" },
    { n: "3", title: "« Utilisez le délai à bon escient »", body: "« Le report des règles à haut risque est un temps de préparation, pas un sursis. Les organisations qui bâtissent leur maturité dès maintenant aborderont 2027 comme une formalité. »" },
  ],
  ctaTitle: "« Où en est votre organisation ? »",
  ctaBody: "« L’évaluation 8×8 de Principled Futures mesure votre maturité de gouvernance sur 64 critères et produit un rapport prêt pour le conseil. »",
  ctaButton: "« Lancer l’évaluation »",
  captureLabel: "« Recevez la note complète en PDF »",
  capturePlaceholder: "vous@organisation.com",
  captureButton: "Envoyer",
  captureThanks: "Merci — nous vous recontacterons.",
  footer: "« Principled Futures · Un produit Salveus Labs · Information générale, ne constituant pas un conseil juridique. Situation réglementaire au 22 juillet 2026. »",
  switcherLabel: "FR",
};

const DE: Briefing = {
  lang: "de",
  path: "/de/briefing/ki-verordnung-zeitplan",
  h1: "„Die Fristen der KI-Verordnung wurden verschoben. Ihre Pflichten nicht.“",
  sub: "„Der Digital-Omnibus hat die strengsten Anforderungen auf 2027 und 2028 verschoben — zwei Pflichten gelten jedoch bereits heute, obwohl die meisten Geschäftsleitungen sie für Zukunftsmusik halten. Ein Briefing für Führungskräfte europäischer KMU.“",
  meta: "„Governance-Briefing · Stand: 22. Juli 2026“",
  timeline: [
    { date: "2. Feb 2025", title: "„Verbotene Praktiken und KI-Kompetenz“", body: "„Die Verbote nach Artikel 5 (Social Scoring, Manipulation, ungezieltes Gesichts-Scraping) und die Pflicht nach Artikel 4, die KI-Kompetenz der Mitarbeitenden zu fördern. Gilt für Betreiber — auch für KMU mit Standardtools.“", badge: "In Kraft", tone: "success" },
    { date: "2. Aug 2025", title: "„GPAI-Regeln und Sanktionsregime“", body: "„Pflichten für Anbieter von KI-Modellen mit allgemeinem Verwendungszweck; das Bußgeldregime gilt.“", badge: "In Kraft", tone: "success" },
    { date: "2. Aug 2026", title: "„Transparenzpflichten — und Aufsicht über die KI-Kompetenz“", body: "„Kennzeichnung von Chatbots, Deepfake-Kennzeichnung, Information bei Emotionserkennung und biometrischer Kategorisierung. Die Aufsicht über die KI-Kompetenz-Pflicht beginnt am selben Tag.“", badge: "Unmittelbar", tone: "warning" },
    { date: "2. Dez 2026", title: "„Neue Verbote und Kennzeichnung von Bestandssystemen“", body: "„Verbot von „Nudifier“-Tools und KI-generiertem Missbrauchsmaterial. Generative Systeme, die vor August 2026 auf dem Markt waren, müssen die maschinenlesbare Kennzeichnung abschließen.“", badge: "Dieses Jahr", tone: "warning" },
    { date: "2. Dez 2027", title: "„Eigenständige Hochrisiko-KI“", body: "„Personalauswahl, Kreditwürdigkeitsprüfung, Bildung, wesentliche Dienste: vollständige Pflichten zu Risikomanagement, Daten-Governance, Dokumentation und menschlicher Aufsicht.“", badge: "Verschoben", tone: "info" },
    { date: "2. Aug 2028", title: "„KI in regulierten Produkten“", body: "„Sicherheitskomponenten in Medizinprodukten, Maschinen und Fahrzeugen.“", badge: "Verschoben", tone: "info" },
  ],
  calloutTitle: "„Die Pflicht, die die meisten Gremien für Zukunftsmusik halten“",
  calloutBody: "„Die KI-Kompetenz-Pflicht gilt seit Februar 2025 für jede Organisation, deren Mitarbeitende KI nutzen — die Aufsicht beginnt im August. Kann Ihre Geschäftsleitung durchgeführte Schulungen nicht nachweisen, steht diese Lücke bereits in der Akte.“",
  movesLabel: "Drei Schritte",
  moves: [
    { n: "1", title: "„Inventarisieren Sie jedes KI-System“", body: "„Einschließlich zugekaufter Tools und in Software eingebetteter KI. Ordnen Sie jedes System den Risikostufen zu.“" },
    { n: "2", title: "„Weisen Sie KI-Kompetenz nach“", body: "„Eine Bemühens-, keine Erfolgspflicht — aber belegbar: wer wurde wozu und wann geschult.“" },
    { n: "3", title: "„Nutzen Sie die Frist bewusst“", body: "„Der Aufschub der Hochrisiko-Regeln ist Vorbereitungszeit, kein Gnadenaufschub. Wer seine Reife jetzt aufbaut, erlebt 2027 als Formalität.“" },
  ],
  ctaTitle: "„Wo steht Ihre Organisation?“",
  ctaBody: "„Das 8×8-Assessment von Principled Futures bewertet Ihre Governance-Reife anhand von 64 Kriterien und liefert einen vorstandsfähigen Bericht.“",
  ctaButton: "„Assessment starten“",
  captureLabel: "„Das vollständige Briefing als PDF erhalten“",
  capturePlaceholder: "sie@organisation.com",
  captureButton: "Zusenden",
  captureThanks: "Vielen Dank — wir melden uns.",
  footer: "„Principled Futures · Ein Produkt von Salveus Labs · Allgemeine Information, keine Rechtsberatung. Regulatorischer Stand: 22. Juli 2026.“",
  switcherLabel: "DE",
};

export const BRIEFINGS: Briefing[] = [EN, FR, DE];
export const BRIEFING_BY_LANG: Record<string, Briefing> = { en: EN, fr: FR, de: DE };
