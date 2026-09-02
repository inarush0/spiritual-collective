# Public spiritual-care resource: US compliance baseline

_Research snapshot: September 2, 2026. This is a planning baseline from primary sources, not legal advice or a 50-state legal opinion. Applicability depends on the eventual operator, its relationships with care organizations, actual data flows, audience presentation, claims, and jurisdictions._

## Scope examined

The proposed first release is a public, English-language US website that offers spiritual-care information and optional practices. It has no accounts, clinical assessment, treatment advice, messaging, advertising, or intended collection of sensitive or user-submitted personal information. It may be shared by pediatric hospice and palliative-care chaplains, and is intended to be usable by adolescents and adult family members; caregivers may adapt material for younger children.

The key conclusion is that this narrow shape avoids the main triggers of several health-privacy regimes, but it is not regulation-free. Accessibility and truthful presentation still matter, and a supposedly anonymous site can cross privacy thresholds through routine infrastructure, analytics, embedded media, or later product changes.

## Requirements that may apply as law

### Children's privacy: COPPA

The current Children's Online Privacy Protection Rule applies to an operator of a commercial website or online service directed to children under 13 that collects personal information online, and to a general-audience operator with actual knowledge that it collects such information from a child under 13. The FTC's rule page states those triggers, and the FTC notes that the Rule was amended on April 22, 2025. [FTC, COPPA Rule](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa); [FTC, COPPA compliance guide](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)

COPPA does not turn only on forms or names. The Rule's definition of personal information includes persistent identifiers used to recognize a user over time and across sites or services, as well as precise geolocation, photos/video/audio containing a child's image or voice, and other listed data. Third-party collection can be attributed to the operator in circumstances specified by the Rule. [16 CFR 312.2](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-312/section-312.2)

For this release, the lowest-risk boundary is to avoid directing the independent experience to children under 13 and avoid personal-information collection altogether. The actual build must verify hosting logs, cookies, analytics, embedded players, fonts/CDNs, error reporting, and similar third parties rather than infer “anonymous” from the absence of a login. If the experience is later designed for independent use by children under 13 or any covered collection is introduced, COPPA review is a release blocker; notice, verifiable parental consent, minimization, security, deletion, and other Rule duties may follow.

### General and state consumer privacy

There is no basis for declaring every state privacy law inapplicable without knowing the operator and data flows. As one important example, California's CCPA applies to for-profit businesses that collect personal information, do business in California, and meet specified thresholds; it generally does not apply to nonprofits. California defines personal information broadly to include browsing history, geolocation, and information linkable to a consumer or household, and treats health and religious or philosophical beliefs as sensitive personal information. [California Privacy Protection Agency, CCPA FAQ](https://cppa.ca.gov/faq/)

The practical constraint is therefore data minimization plus an inventory, not merely a “no sensitive data” promise. Before beta and production releases, document every first- and third-party request, identifier, log, cookie/storage key, retention period, recipient, and purpose. If any personal information is collected, reassess state notice, rights, security, child/teen consent, and breach duties for the operator's jurisdictions. A short, accurate public privacy notice is prudent even if a particular privacy statute does not require one; an inaccurate “we collect nothing” statement can itself create consumer-protection risk.

### HIPAA and health-breach notification

HIPAA applies to covered entities and business associates. HHS states that an entity outside those definitions does not have to comply with the HIPAA Rules. Covered entities include health plans, clearinghouses, and health-care providers that conduct specified electronic transactions; business-associate status arises from performing certain functions or services for a covered entity involving protected health information. [HHS, Covered Entities and Business Associates](https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html)

On the stated facts, a separate public information site that receives no protected health information is not made a HIPAA-regulated service merely because a chaplain shares its URL. That is a scoped inference, not a legal determination. Reassess before accepting patient data, integrating with a care organization, entering a contract to perform functions involving protected health information, or allowing a care organization to operate the site as part of its services.

The FTC Health Breach Notification Rule covers vendors of personal health records, PHR-related entities, and certain service providers, including nonprofits outside HIPAA. A personal health record is an electronic record of identifiable health information with the technical capacity to draw from multiple sources and managed, shared, and controlled by or primarily for the individual. A static resource that holds no identifiable health information does not fit that described product shape; collecting health responses or syncing another health source would require reevaluation. [FTC, Complying with the Health Breach Notification Rule](https://www.ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0)

### Truthful presentation and health claims

Section 5 of the FTC Act empowers the FTC to prevent unfair or deceptive acts or practices in or affecting commerce. [FTC, Federal Trade Commission Act](https://www.ftc.gov/legal-library/browse/statutes/federal-trade-commission-act) The site's exact organizational form and activity determine FTC jurisdiction, while state consumer-protection laws may independently apply.

FTC staff guidance explains that health-related marketing claims must be truthful, not misleading, and adequately substantiated; express and implied claims both count, and a material omission can mislead. The guidance itself is nonbinding, but it interprets the FTC Act and identifies competent and reliable scientific evidence as the general substantiation expected for health-benefit or safety claims. [FTC, Health Products Compliance Guidance](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance)

Accordingly, describe the resource as optional spiritual-care information, not as diagnosing spiritual distress or treating, mitigating, curing, preventing, or improving a medical or mental-health condition. A “not medical advice” disclaimer cannot cure an otherwise misleading express or implied claim. Claims about safety, effectiveness, evidence, endorsements, institutional approval, or expected outcomes need review and support before publication.

FDA oversight is function- and intended-use-specific. FDA distinguishes general wellness/information functions from device software and focuses oversight on higher-risk software functions, including certain diagnostic and treatment functions. The current general-wellness guidance is explicitly nonbinding. The present informational scope is far from the examples FDA identifies as regulated device software, but clinical assessment, patient-specific treatment recommendations, physiological measurement, or diagnostic functionality would require a fresh FDA analysis. [FDA, Device Software Functions Including Mobile Medical Applications](https://www.fda.gov/medical-devices/digital-health-center-excellence/device-software-functions-including-mobile-medical-applications); [FDA, General Wellness: Policy for Low Risk Devices](https://www.fda.gov/media/90652/download)

### Accessibility

DOJ states that ADA Title III requires businesses open to the public to provide full and equal enjoyment and effective communication, and that its longstanding position is that those duties include goods, services, privileges, and activities offered on the web. DOJ also says Title III has no regulation prescribing a detailed web technical standard, so covered businesses retain flexibility in how they meet the legal duty. Whether this independent operator and site qualify as a Title III public accommodation is fact- and jurisdiction-dependent; do not treat the lack of a specific Title III web standard as permission to ship inaccessible content. [DOJ, Guidance on Web Accessibility and the ADA](https://www.ada.gov/resources/web-guidance/)

Distribution arrangements can independently impose concrete standards:

- State and local governments must make web content they provide or make available, including through contractual or licensing arrangements, conform to WCAG 2.1 Level A and AA under the Title II rule, subject to the rule's exceptions and defenses. DOJ's 2026 interim rule moved compliance dates to April 26, 2027 for entities serving 50,000 or more people and April 26, 2028 for smaller entities and special districts. [DOJ, Title II web and mobile accessibility compliance guide](https://www.ada.gov/resources/small-entity-compliance-guide/)
- HHS-funded recipients such as many hospitals and community health centers must make web content and mobile apps they provide or make available conform to WCAG 2.1 AA under the revised Section 504 rule, subject to its exceptions and defenses. HHS's 2026 interim rule moved compliance dates to May 11, 2027 for recipients with 15 or more employees and May 10, 2028 for recipients with fewer than 15 employees. Existing nondiscrimination and effective-communication duties remain during the transition. [HHS, 2026 Section 504 deadline extension](https://www.hhs.gov/press-room/hhs-extends-mobile-and-web-accessibility-deadline.html)
- Section 508 governs federal agencies when they develop, procure, maintain, or use information and communication technology; it does not automatically govern an independent public resource. Federal procurement or adoption would change that analysis. [US Access Board, Information and Communication Technology](https://www.access-board.gov/ict.html)

Because the resource is intended to be shared into health-care contexts, conformance to WCAG 2.2 Level AA should be a first-release acceptance criterion. This is a voluntary product baseline unless a law or agreement incorporates it. W3C recommends WCAG 2.2, and states that 2.2 conformance also conforms to 2.0 and 2.1, making it a practical way to satisfy the older technical baselines while covering additional needs. [W3C, WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## Authoritative voluntary practices

These items are not asserted here as generally binding law:

- **WCAG 2.2 AA plus human testing.** Meet the full-page and complete-process conformance requirements, and test with keyboard-only navigation, screen readers, zoom/reflow, reduced motion, high contrast, captions/transcripts, and users with relevant access needs. Automated testing alone cannot establish conformance.
- **Data minimization by architecture.** Prefer no accounts, user text, uploads, ad technology, cross-site tracking, session replay, or user-level analytics. Configure short log retention and least-privilege access. Maintain a data-flow inventory and reassess it on every dependency or hosting change.
- **Plain, culturally responsive content.** The National CLAS Standards are 15 action steps offered by HHS as a blueprint for culturally and linguistically appropriate health services; they are not presented as a generally binding rule. Their respect-and-responsiveness posture is useful for multi-faith and nonreligious spiritual-care content. [HHS Office of Minority Health, National CLAS Standards](https://thinkculturalhealth.hhs.gov/clas)
- **Transparent scope and escalation.** State prominently that practices are optional, adaptable, and not clinical or emergency care; avoid asking a distressed user to disclose their situation. Link to appropriate immediate-help resources without representing the site itself as crisis intervention.

## Release gates for beta and production

Use the same substantive gates for beta as production; an unindexed or link-only beta is still delivered to real users and third parties may still collect data.

1. **Data-flow verification:** inspect network traffic and vendor configuration; record logs, identifiers, cookies/storage, recipients, purposes, and retention. Confirm no advertising, behavioral tracking, session replay, user-submitted content, or sensitive-data collection.
2. **Audience/COPPA check:** confirm content, visual treatment, metadata, outreach, and actual usage strategy do not make the independent experience directed to children under 13. If that changes, stop release for COPPA review.
3. **Claims review:** inventory express and reasonably implied health, safety, evidence, endorsement, and outcome claims. Remove them or document appropriate support and reviewer approval.
4. **Accessibility acceptance:** demonstrate WCAG 2.2 AA through automated checks, manual expert checks, keyboard and assistive-technology testing, and accessible alternatives for all media and diagrams. Preserve an accessible text representation of any decision tree rather than relying on an image or PDF.
5. **Content governance:** obtain the designated chaplain review before promotion; record approval without publishing reviewer identity. Re-review changed practices, safety language, linked resources, and claims.
6. **Operational truthfulness:** publish an accurate privacy notice and scope/safety statement. Verify that production behavior matches both.

## Changes that require renewed legal/compliance review

- designing directly for children under 13 or learning that under-13 users submit data;
- accounts, saved preferences, personalization, quizzes/assessments, free text, uploads, messaging, donations, or email collection;
- analytics, advertising, social widgets, embedded media, telemetry, or vendors that introduce identifiers or disclosures;
- collecting health, religious-belief, geolocation, device, or other linkable information;
- integrations, referrals, contracts, branding, or operation by a hospital, hospice, government, school, insurer, or other care organization;
- medical/mental-health outcome claims, patient-specific recommendations, diagnosis, triage, crisis response, or treatment functionality;
- translation/localization or launch outside the United States; or
- material changes in federal or state law, regulations, enforcement guidance, or technical standards.

## Planning answer

For the proposed first release, the implementation-ready specification should require: no intentional user-level or sensitive-data collection; a verified third-party/data-flow inventory; no independent under-13 targeting; no clinical assessment or health-outcome claims; WCAG 2.2 AA as a release criterion; plain, culturally responsive content; accurate privacy and scope statements; and chaplain approval recorded privately before beta-to-production promotion. These constraints keep the resource within the researched low-data, informational posture. They do not guarantee exemption from every law, and any trigger above should reopen compliance review.
