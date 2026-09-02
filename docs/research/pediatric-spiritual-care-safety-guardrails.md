# Pediatric spiritual-care safety guardrails

**Research question:** What clinical, developmental, trauma-informed, disability-accessibility, and spiritual-care guardrails should constrain a public, self-guided spiritual-practice website for adolescents and adult family members in United States pediatric hospice and palliative-care settings?

## Bottom line

The website should be framed as an optional aid for spiritual exploration, not as spiritual assessment, clinical care, counseling, or crisis support. It should offer clearly labeled choices that a person may try, adapt, skip, or stop. It should never prescribe a belief or practice, interpret symptoms, promise an outcome, or encourage a user to persist through discomfort.

This boundary follows the care model in the American Academy of Pediatrics (AAP) guidance: pediatric palliative care addresses physical, psychological, social, practical, and spiritual distress through an interdisciplinary team, with specialty consultation for needs beyond basic support. The child should participate as fully as their preferences, development, illness, consciousness, culture, and spiritual tradition allow. Spiritual support is part of care, but not a standalone replacement for that care. [AAP pediatric palliative-care policy](https://publications.aap.org/pediatrics/article/132/5/966/31744/Pediatric-Palliative-Care-and-Hospice-Care), [AAP end-of-life clinical report](https://publications.aap.org/pediatrics/article/149/5/e2022057011/186860/Guidance-for-Pediatric-End-of-Life-Care), [WHO pediatric palliative-care guide](https://www.who.int/publications/i/item/integrating-palliative-care-and-symptom-relief-into-paediatrics)

The sources support the constraints below; they do **not** establish that a particular decision tree, spiritual-path taxonomy, or self-guided practice is effective for pediatric hospice patients. Every proposed practice still needs content review before release.

## Required guardrails

### 1. Preserve agency and make refusal easy

- State before every practice that it is optional and can be changed, paused, or stopped for any reason.
- Offer a visible neutral exit such as “Not for me” or “Try something different.” Do not use streaks, completion pressure, scoring, or language implying failure.
- Let adolescents choose independently when practical. Do not assume that a caregiver's beliefs or preferred practice are the adolescent's own.
- Use developmentally appropriate language and give users enough information to know what an activity involves before starting it.
- Do not ask a child to agree to a practice that cannot actually be refused.

These are product applications of AAP guidance to involve pediatric patients in proportion to their development, seek willingness, disclose what to expect, and watch for inappropriate pressure. [AAP informed-consent and assent policy](https://publications.aap.org/pediatrics/article/138/2/e20161484/52512/Informed-Consent-in-Decision-Making-in-Pediatric)

### 2. Protect spiritual freedom

- Make both religious and nonreligious routes first-class options.
- Label a tradition-specific practice before the user opens it. Attribute it accurately and do not present it as universal.
- Never direct a user toward conversion, doctrinal agreement, confession, reconciliation, forgiveness, or a ritual obligation.
- Never claim that illness, suffering, recovery, or death reflects faith, doubt, virtue, wrongdoing, divine favor, or failure to practice correctly.
- Avoid speaking on behalf of a deity or guaranteeing spiritual results.
- Offer contact with the user's own chaplain, spiritual-care provider, or community leader when individualized or tradition-specific guidance is wanted.

The Association of Professional Chaplains' code requires respect, nondiscrimination, spiritual freedom, non-imposition of doctrine or practice, privacy, accurate representation of competence, and referral or consultation when appropriate. [Association of Professional Chaplains Code of Ethics](https://www.apchaplains.org/wp-content/uploads/2022/06/APC-Code-of-Ethics.pdf)

### 3. Apply trauma-informed interaction rules

- Explain what will happen before an activity begins; avoid surprise audio, imagery, motion, touch prompts, or emotionally intense material.
- Never require closing the eyes, focusing inside the body, recalling a memory, disclosing an experience, being touched, or being alone. Always provide a neutral alternative.
- Use invitations rather than commands. Examples: “If it feels comfortable…” and “You can keep your eyes open.”
- Do not force positive meaning, gratitude, calm, hope, or forgiveness. Make room for anger, fear, numbness, uncertainty, and no discernible spiritual feeling.
- Let the user control pacing, repetition, audio, and stopping. Do not autoplay or use timers that cannot be disabled.
- Review content for cultural, historical, gender, religious, and disability-related sources of harm, including prior religious harm.

These rules operationalize SAMHSA's trauma-informed principles of physical and psychological safety, trust and transparency, collaboration, empowerment and choice, and attention to cultural and historical context, with the explicit goal of resisting retraumatization. [SAMHSA trauma-informed approaches](https://www.samhsa.gov/mental-health/trauma-violence/trauma-informed-approaches-programs), [SAMHSA implementation guide](https://library.samhsa.gov/sites/default/files/pep23-06-05-005.pdf)

### 4. Keep bodily practices conservatively low-risk

The reviewed sources do not establish a universally safe physical baseline for medically fragile users. Therefore the following are conservative project-level precautions, to be confirmed by the clinical reviewer:

- Every practice must work from a resting position and offer a no-movement alternative.
- Do not instruct breath holding, rapid or unusually deep breathing, breath restriction, exertion, stretching, balance, posture changes, pressure on the body, or removal/adjustment of medical equipment.
- Do not suggest fasting, ingestion, supplements, aromas, smoke, flame, temperature exposure, or applying substances to the body.
- Do not imply that discomfort is therapeutic. Tell the user to stop if a practice causes pain, shortness of breath, dizziness, nausea, panic, worsening distress, or any other discomfort, and to contact their caregiver or care team when appropriate.
- Any future practice involving breathing cadence, movement, food, scent, touch, heat, flame, or another physical exposure requires explicit clinical review and a safe alternative before beta release.

This conservative boundary is consistent with the AAP's placement of symptom management and complex needs within coordinated pediatric palliative care rather than a public self-help resource. [AAP pediatric palliative-care policy](https://publications.aap.org/pediatrics/article/132/5/966/31744/Pediatric-Palliative-Care-and-Hospice-Care)

### 5. Separate spiritual exploration from clinical and crisis care

Every relevant page should make the boundary understandable without legalistic language:

> This resource offers optional spiritual practices. It does not provide medical or mental-health care. You can stop at any time. If you feel worse or need help, contact your caregiver, chaplain, or care team.

Provide a stable help route, appropriate to the initial US scope:

- For emotional distress or suicidal thoughts, call or text **988** or use the 988 chat.
- For immediate danger or a medical emergency, call **911**.
- Do not implement an in-site crisis questionnaire, triage score, counseling chat, or emergency workflow unless a later effort adds qualified staffing, governance, and clinical/legal review.

The 988 Lifeline describes 988 as immediate counselor support and directs people facing immediate harm or danger to 911. [988 Lifeline help guidance](https://988lifeline.org/contact-us/)

### 6. Treat accessibility as safety, not polish

- Require WCAG 2.2 Level AA conformance for the first release, verified with both automated checks and manual keyboard/screen-reader testing.
- Support zoom/reflow, keyboard-only operation, visible focus, adequate contrast, generous targets, meaningful headings, descriptive controls, text alternatives, captions, and transcripts.
- Add no session time limit. Preserve progress locally only if that can be done without collecting personal data; otherwise make practices short and restartable.
- Avoid flashing, autoplay, parallax, and nonessential animation. Honor `prefers-reduced-motion`; for this audience, adopt the stronger WCAG 2.3.3 behavior of allowing interaction-triggered nonessential animation to be disabled even though it is Level AAA.
- Never make audio, fine motor control, sustained touch, a particular screen orientation, memory, sustained concentration, or color perception the only way to use a practice.
- Use short sections, plain language, predictable navigation, and an immediate exit. These are necessary adaptations for fluctuating fatigue, cognition, vision, hearing, speech, and motor capacity, even where they exceed the minimum testable standard.

WCAG 2.2 addresses blindness and low vision, deafness and hearing loss, limited movement, photosensitivity, and some cognitive and learning needs; W3C also warns that unnecessary motion can cause dizziness, nausea, and headaches. WCAG does not cover every disability need, so conformance is a floor rather than the complete acceptance test. [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [W3C guidance on animation from interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)

### 7. Constrain claims and data collection

- Describe practices as possibilities (“Some people use this to…”) rather than treatments or evidence-backed outcomes unless a claim has direct evidence and clinical approval.
- Prohibit claims to cure disease, relieve a medical symptom, extend life, change prognosis, prevent crisis, guarantee calm, or replace professional support.
- Do not diagnose spiritual distress, assign a spiritual type, or present path recommendations as an assessment result. User selections should be framed as preferences that can change.
- Do not request or store diagnoses, symptoms, medications, treatment details, beliefs, prayers, journal entries, crisis disclosures, age, or contact information in the first release.
- Do not publish testimonials or stories from patients or families as part of the initial content set. Any later use requires separate consent, privacy, safeguarding, and editorial review.

The privacy constraint is consistent with professional chaplaincy duties to protect private communications and identities. [Association of Professional Chaplains Code of Ethics](https://www.apchaplains.org/wp-content/uploads/2022/06/APC-Code-of-Ethics.pdf)

## Practice risk classes

Use these classes during content design and review:

| Class | Treatment | Examples |
| --- | --- | --- |
| A: low-risk candidate | May enter beta after spiritual-care, trauma, accessibility, and editorial review | choosing an image or word; listening to optional user-controlled audio with transcript; reading a brief attributed text; silent reflection with eyes-open option; selecting a person to contact |
| B: heightened review | Requires explicit clinical review plus all Class A reviews and a nonphysical alternative | paced breathing; body awareness; movement; touch; guided memory; sensory stimulus; food/fasting; candles, incense, or ritual substances |
| C: exclude from first release | Do not publish | breath holding or hyperventilation; medication/equipment changes; ingesting or applying substances; unsupervised flame; medical or spiritual diagnosis; crisis assessment; outcome guarantees; coercive, confessional, conversion, or disclosure exercises |

Class A is not an assertion of universal safety. A user must still be able to preview, adapt, skip, and stop every activity.

## Beta-to-production release gate

Each content item should have a review record containing:

- intended audience and plain-language purpose;
- exact activity steps and estimated time;
- faith/tradition label and source, or an explicit nonreligious label;
- physical, sensory, emotional, trauma, and religious-harm risks;
- adaptations and a no-movement/no-audio alternative;
- stop guidance and the standard care/crisis boundary;
- spiritual-care review approval and date;
- clinical review approval when Class B or any health-related claim is present;
- accessibility checks, including keyboard, screen reader, zoom/reflow, captions/transcript, and reduced motion;
- beta feedback disposition and final production approver/date.

Promotion should be blocked if a reviewer identifies unresolved harm, if a practice lacks a viable alternative, if the content implies clinical or spiritual authority it does not have, or if the item has changed materially since approval.

## Questions for the implementation specification

The evidence resolves the general safety boundary but leaves a few project decisions to later tickets:

1. Which exact practices qualify for Class A after reviewing their complete wording and media?
2. Who is authorized to serve as the clinical reviewer for Class B content, if any is included?
3. Where and how often should care-team, 988, and 911 guidance appear without making ordinary spiritual exploration feel like crisis screening?
4. What review record and approval mechanism will enforce the beta-to-production gate?

## Sources and scope

This note synthesizes official guidance from the AAP, WHO, SAMHSA, the Association of Professional Chaplains, W3C, and the 988 Suicide & Crisis Lifeline. It translates their principles into conservative website requirements. It is a product-safety research note, not medical or legal advice, and should be validated by the project's pediatric hospice/palliative-care reviewers before implementation.
