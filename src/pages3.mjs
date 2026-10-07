// Owner review, Oct 2026: pre-registration replaces pricing. Become a Member (header CTA),
// Neurodiversity education partnerships, and Marketplace vendor applications.
import { html, raw, breadcrumb, formSection, previewForm, pad2 } from './lib.mjs';
import { xhero, head, kgrid } from './pages2.mjs';

const PREVIEW = 'Development preview — this form is not connected yet.';

// Numbered process strip: [title, body][]
const steps = (items) => html`
  <ol class="psteps" data-stagger>
    ${items.map(([t, b], i) => html`<li class="psteps__item"><span class="psteps__n">${pad2(i + 1)}</span><h3>${t}</h3><p>${b}</p></li>`)}
  </ol>`;

// "I am interested in" — everything except esports (owner's request).
export const INTERESTS = [
  ['membership', 'AFSV VRC membership'],
  ['business-membership', 'Business membership'],
  ['sports-village', 'Whitby Smart Sports Village'],
  ['programs', 'Programs & athlete development'],
  ['education', 'Education & academic success'],
  ['life-skills', 'Life skills'],
  ['neurodiversity', 'Neurodiversity support & programs'],
  ['education-partnership', 'Education partnership (neurodiversity)'],
  ['ambassador', 'Becoming an ambassador'],
  ['partnership', 'Partnership & sponsorship'],
  ['diaspora', 'Global Diaspora Network'],
  ['gaisb', 'GAISB AI education'],
  ['marketplace', 'Marketplace — shopping'],
  ['vendor', 'Marketplace — selling my products'],
  ['other', 'Something else'],
];

// ════════════════════════ BECOME A MEMBER ════════════════════════
export function becomeMember() {
  return {
    title: 'Become a Member',
    description: 'Become an AFSV VRC member. Membership opens soon — pre-register and we’ll email you the moment it goes live.',
    ogImage: 'assets/img/life/lounge.jpg',
    body: html`
${breadcrumb([{ label: 'Membership', route: '/membership' }, { label: 'Become a Member' }])}
${xhero({ kicker: 'AFSV VRC membership', title: 'Become an AFSV VRC member.', img: 'life/lounge.jpg', alt: 'Concept rendering: a racially diverse group of members, families and athletes relaxing in the village lounge overlooking the fields at dusk.', lead: 'Membership opens soon. Pre-register in under a minute and we’ll email you the moment it goes live — no payment, no commitment.', badge: 'Pre-registration open', ctas: [{ label: 'Keep me up to date', href: '#join' }] })}
<section class="wrap section" data-el="member.steps" data-el-build="elementor">
  ${head('How it works', 'Three simple steps.')}
  ${steps([
    ['Pre-register', 'Tell us your name, your email and what you’re most interested in. It takes less than a minute.'],
    ['We keep you up to date', 'You’ll hear from us as the village, programs and membership take shape — only the news that matters to you.'],
    ['Join when it opens', 'Pre-registered members are the first to know when membership goes live, with early access to join.'],
  ])}
</section>
${formSection({
  id: 'join', el: 'member.form', cls: 'section--flush-top',
  title: 'Keep me up to date.',
  lead: 'Pick what you’re interested in and we’ll make sure you hear about it first.',
  note: raw('Have a question first? <a class="text-link" href="contact.html">Contact us</a>.'),
  form: previewForm({
    fields: [
      { label: 'First name', req: true, auto: 'given-name' },
      { label: 'Last name', req: true, auto: 'family-name' },
      { label: 'Email', type: 'email', req: true, auto: 'email', full: true },
      { label: 'I am interested in', type: 'select', req: true, ph: 'Choose one', options: INTERESTS, full: true },
      { label: 'Country', req: true, auto: 'country-name' },
      { label: 'City', auto: 'address-level2' },
    ],
    consent: 'Keep me up to date by email about AFSV VRC. I can unsubscribe at any time.',
    submit: 'Keep me up to date',
    status: `${PREVIEW} When connected, you’ll be added to the pre-registration list and emailed when membership opens.`,
  }),
})}
<section class="band--cream" data-el="member.benefits" data-el-build="elementor">
  <div class="wrap section">
    ${head('What membership is planned to include', 'More than a membership.')}
    ${kgrid([
      ['Community', 'Community', 'Events, local chapters, volunteering and a global network built around youth development and inclusion.'],
      ['Tag', 'Marketplace perks', 'Member pricing, early access to new drops and member-only sales in the AFSV VRC Marketplace.'],
      ['Inclusive education', 'Learning hub', 'Parent webinars, career readiness, wellness and sport-development resources.'],
      ['Star', 'Impact you can see', 'Part of every membership supports the Neurodivergent Inclusion Fund, reported every year.'],
    ], { cols: 4 })}
  </div>
</section>`,
  };
}

// ════════════════════════ NEURODIVERSITY · EDUCATION PARTNERSHIPS ════════════════════════
export function eduPartners() {
  return {
    title: 'Education Partnerships',
    description: 'Partner with AFSV VRC in education — schools, school boards, colleges, universities and learning organisations supporting neurodivergent students.',
    ogImage: 'assets/img/life/academy.jpg',
    body: html`
${breadcrumb([{ label: 'Neurodiversity', route: '/neurodiversity' }, { label: 'Education Partnerships' }])}
${xhero({ kicker: 'Neurodiversity · Education partnerships', title: 'Partner with us in education.', img: 'life/academy.jpg', alt: 'Concept rendering: a racially diverse group of students and a teacher working together in a bright village classroom overlooking the fields.', lead: 'For schools, school boards, colleges, universities and learning organisations who want to help neurodivergent students thrive — in the classroom, on the field and beyond.', badge: '', ctas: [{ label: 'Become an education partner', href: '#edu-form' }] })}
<section class="wrap section" data-el="edu.who" data-el-build="elementor">
  ${head('Who this is for', 'Education partners only.', 'This page is for education partnerships. For sponsorship, corporate or community partnerships, visit Partners & Sponsors.')}
  ${kgrid([
    ['Building', 'Schools & school boards', 'Elementary and secondary schools, boards and district programs.'],
    ['Inclusive education', 'Colleges & universities', 'Faculties of education, kinesiology, psychology and student services.'],
    ['Mentorship', 'Tutoring & learning centres', 'Academic support providers working with neurodivergent learners.'],
    ['Hand', 'Specialists', 'Educational psychologists, learning strategists and occupational therapists.'],
    ['Community', 'Education non-profits', 'Organisations focused on inclusion, literacy and student success.'],
    ['Phone', 'Learning technology', 'Assistive and ed-tech providers that support different ways of learning.'],
  ])}
</section>
<section class="band--cream" data-el="edu.together" data-el-build="elementor">
  <div class="wrap section">
    ${head('How we could work together', 'Sport, learning and support — joined up.')}
    ${kgrid([
      ['Soccer', 'Inclusive sport & PE', 'Structured, sensory-aware sport sessions that build confidence and social skills.'],
      ['Doc', 'Tutoring & academic support', 'Homework help, literacy and numeracy support alongside training.'],
      ['Cert', 'Teacher & coach training', 'Shared training on neurodiversity-affirming practice for staff and coaches.'],
      ['Handshake', 'Placements & internships', 'Student placements and work experience inside the village.'],
      ['Chart', 'Research & outcomes', 'Measuring what works and sharing results with families and schools.'],
      ['Globe', 'Family resources', 'Parent workshops and resources in Canada and the Caribbean.'],
    ])}
  </div>
</section>
<section class="wrap section" data-el="edu.process" data-el-build="elementor">
  ${head('The process', 'From first message to first program.')}
  ${steps([
    ['Tell us about you', 'Share your organisation, the students you serve and what you’d like to explore.'],
    ['Intro call', 'Our education team will reach out within five business days to talk it through.'],
    ['Shape a pilot', 'Together we design a small pilot that fits your students, timetable and goals.'],
    ['Agree & launch', 'We put a simple agreement in place and launch as programs open.'],
  ])}
</section>
${formSection({
  id: 'edu-form', el: 'edu.form', cls: 'section--flush-top',
  title: 'Become an education partner.',
  lead: 'Tell us about your organisation and we’ll be in touch within five business days.',
  note: raw('Education partnerships only. Other partnerships: <a class="text-link" href="partners.html">Partners &amp; Sponsors</a>.'),
  form: previewForm({
    fields: [
      { label: 'Name', req: true, auto: 'name' },
      { label: 'Role or title', req: true, auto: 'organization-title' },
      { label: 'Organisation', req: true, auto: 'organization' },
      { label: 'Organisation type', type: 'select', req: true, ph: 'Choose one', options: ['School', 'School board or district', 'College', 'University', 'Tutoring or learning centre', 'Education non-profit', 'Specialist practice', 'Learning technology provider', 'Other education organisation'] },
      { label: 'Email', type: 'email', req: true, auto: 'email' },
      { label: 'Phone', type: 'tel', auto: 'tel' },
      { label: 'Province / state & country', req: true },
      { label: 'Students served', type: 'select', ph: 'Choose a range', options: ['Under 100', '100–500', '500–2,000', 'Over 2,000'] },
      { label: 'Most interested in', type: 'select', req: true, ph: 'Choose one', options: ['Inclusive sport & PE', 'Tutoring & academic support', 'Teacher & coach training', 'Placements & internships', 'Research & outcomes', 'Family resources', 'Not sure yet'], full: true },
      { label: 'Tell us more', type: 'textarea', full: true },
    ],
    consent: 'I agree to be contacted about an education partnership with AFSV VRC.',
    submit: 'Send partnership enquiry',
    status: `${PREVIEW} When connected, enquiries go to the education team at info@afsvhcl.com.`,
  }),
})}`,
  };
}

// Call to action shown on every neurodiversity page.
export const eduPartnerCta = () => html`
<section class="wrap section section--flush-top" data-el="nd.edu-cta" data-el-build="elementor">
  <a class="educta reveal" href="education-partnerships.html">
    <span class="educta__k">For schools, colleges &amp; learning organisations</span>
    <span class="educta__t">Partner with us in education.</span>
    <span class="educta__go">Become an education partner <span aria-hidden="true">→</span></span>
  </a>
</section>`;

// Partner logos (partners page).
export const partnerLogos = () => html`
<section class="wrap section" data-el="partners.logos" data-el-build="elementor">
  ${head('Our partners', 'Building it together.')}
  <ul class="plogos" data-stagger>
    <li class="plogo"><img src="assets/img/partners/charrans-bookstores.jpg" alt="Charran’s Bookstores — Building the Nation, Book by Book." width="900" height="284" loading="lazy"></li>
    <li class="plogo plogo--dark"><img src="assets/img/partners/gaisb-ai-world-summit-2027.svg" alt="GAISB AI World Summit 2027" loading="lazy"></li>
  </ul>
</section>`;

// ════════════════════════ MARKETPLACE · BECOME A VENDOR ════════════════════════
export function becomeVendor() {
  return {
    title: 'Become a Vendor',
    description: 'Sell with AFSV VRC. Apply to become a Marketplace vendor — tell us about your company and products, and our team will review your application.',
    ogImage: 'assets/img/merch/campaign-poster.jpg',
    body: html`
${breadcrumb([{ label: 'Marketplace', route: '/marketplace' }, { label: 'Become a Vendor' }])}
${xhero({ kicker: 'Marketplace · Become a vendor', title: 'Sell with AFSV VRC.', img: 'merch/campaign-poster.jpg', alt: 'Concept campaign image: four racially diverse friends wearing AFSV VRC jackets, a hoodie and a polo, laughing in a bright studio.', lead: 'We’re inviting brands, makers and community businesses to sell alongside the AFSV VRC collection. Tell us about your products and our team will review your application.', badge: '', ctas: [{ label: 'Apply to sell', href: '#vendor-apply' }] })}
<section class="wrap section" data-el="vendor.process" data-el-build="elementor">
  ${head('The process', 'How becoming a vendor works.')}
  ${steps([
    ['Apply', 'Fill in the form below with your company details, how many products you’d like to sell and their value.'],
    ['Evaluation', 'Your application is emailed to our marketplace team for review. We look at product fit, quality, values and pricing — usually within ten business days.'],
    ['Samples & terms', 'Shortlisted vendors share samples and we agree simple, clear terms together.'],
    ['Go live', 'We set up your listings, fulfilment and payments, ready for when the marketplace opens.'],
  ])}
</section>
<section class="band--cream" data-el="vendor.criteria" data-el-build="elementor">
  <div class="wrap section">
    ${head('What we look for', 'Products our community will love.')}
    ${kgrid([
      ['Star', 'Quality', 'Well-made products that last and that you’re proud of.'],
      ['Community', 'Shared values', 'Brands that support youth, sport, education and inclusion.'],
      ['Truck', 'Reliable fulfilment', 'Stock you can deliver on time, every time.'],
      ['Globe', 'Local & diaspora makers', 'Canadian, Caribbean and diaspora-owned businesses are very welcome.'],
    ], { cols: 4 })}
  </div>
</section>
${formSection({
  id: 'vendor-apply', el: 'vendor.form',
  title: 'Apply to become a vendor.',
  lead: 'The more you tell us, the faster we can evaluate your application.',
  note: 'Submitting an application is not an approval and does not create a vendor account.',
  form: previewForm({
    fields: [
      { label: 'Company name', req: true, auto: 'organization' },
      { label: 'Brand name (if different)' },
      { label: 'Contact name', req: true, auto: 'name' },
      { label: 'Role or title', auto: 'organization-title' },
      { label: 'Email', type: 'email', req: true, auto: 'email' },
      { label: 'Phone', type: 'tel', auto: 'tel' },
      { label: 'Website or social link', type: 'url', req: true, ph: 'https://' },
      { label: 'Country', req: true, auto: 'country-name' },
      { label: 'Business type', type: 'select', req: true, ph: 'Choose one', options: ['Brand or manufacturer', 'Artisan or maker', 'Distributor or wholesaler', 'Retailer', 'Athlete-owned business', 'Non-profit or social enterprise', 'Other'] },
      { label: 'Product category', type: 'select', req: true, ph: 'Choose one', options: ['Apparel & fanwear', 'Training & performance gear', 'Accessories', 'Books & education resources', 'Health & wellness', 'Food & beverage', 'Art, crafts & gifts', 'Other'] },
      { label: 'Number of products', type: 'select', req: true, ph: 'How many products?', options: ['1–5', '6–20', '21–50', '51–100', 'Over 100'] },
      { label: 'Estimated total value of products', type: 'select', req: true, ph: 'Choose a range', options: ['Under $5,000', '$5,000–$25,000', '$25,000–$100,000', '$100,000–$500,000', 'Over $500,000'] },
      { label: 'Typical retail price per item', type: 'select', ph: 'Choose a range', options: ['Under $25', '$25–$75', '$75–$150', 'Over $150'] },
      { label: 'Where are your products made?' },
      { label: 'Describe your products', type: 'textarea', req: true, full: true },
      { label: 'Certifications or sustainability practices', type: 'textarea', rows: 2, full: true },
    ],
    consent: 'I confirm these details are accurate and agree to be contacted about my application.',
    submit: 'Submit for evaluation',
    status: `${PREVIEW} When connected, your application is emailed to info@afsvhcl.com for evaluation.`,
  }),
})}`,
  };
}
