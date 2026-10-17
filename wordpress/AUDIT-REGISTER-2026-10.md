# AFSV Website Developer Audit — finding register

Audit: *AFSV Website Developer Audit*, prepared for Martin Lashley, 8 October 2026.
Implemented in theme and plugin **1.2.4** (commit aea4ddf), 17 October 2026.
Staging: https://afsv.198-105-177-163.sslip.io/

- **Done**: changed on the site.
- **Partly done**: the developer part is done, but an owner still has to approve.
- **Waiting on owner**: needs information or approval before anything changes.
- **Note**: the audit has this item partly mixed up.

## Martin's email: B04 neurodiversity statistics (P0)

| Page | Where | Change |
|---|---|---|
| `/` Home | "Different Minds. Equal Opportunity." section: the navy tile in the row of cards, plus a new navy panel directly below the cards | Tile now reads "Every child deserves opportunities to learn, participate and belong." The panel holds Martin's three paragraphs, 8.4% ADHD (ages 1–17), 3.0% autism (ages 1–17) and 6.8% learning disabilities or disorders (ages 5–17), all marked 2023 data. Below them: a ten-provinces / parent-reported / overlapping-diagnoses note (figures not added together), then the source and methodology links. |
| `/education/` | Navy "Why inclusion matters." section | The "1 in 5", "Millions" and "Thousands" cards are replaced by the same block, word for word. |
| `/marketplace/`, `/membership/` | — | The "1 in 5" figure never appeared on these pages, here or on the live site. I scanned all pages. Their other B04 claims are fixed below. |

Source links point to the real Canada.ca addresses (health-infobase.canada.ca/chronic-conditions/childhood/prevalence.html and /technical-notes.html), not the Outlook safelinks.

## Status of every finding

| ID | Status | Page and where |
|---|---|---|
| L01 | **Waiting on owner** | The full counsel documents aren't available. The Sintra site, Gmail and Drive have only the summary text that is published now. Martin or Tulu needs to send *Website Terms and Conditions of Use-Draft-2026-06-10.docx* and *Website Privacy Policy-Draft-2026-06-10.docx*; they will be published word for word. |
| L02 | **Waiting on owner**, **Note** | The legal pages show www.afsvhcl.com and info@afsvhcl.com, as the owner asked earlier. The brief says afsvvrc.com and info@afsvvrc.com. One domain and one email need confirming. |
| L03 | Done (already in place) | Nothing can be bought: no prices, no Add to cart, no payments. Booking links point to interest forms. |
| L04, L05 | **Waiting on owner** | Privacy workflow, minors' consent, story consent and audience scope are for counsel and the privacy owner. |
| B01 | Done | `/whitby-smart-sports-village/`, partners list: "AFSV VRC Development Group Ltd." becomes "AFSV VRC **Global** Development Group Ltd." The footer already used the full name. |
| B02 | **Waiting on owner** | Leadership titles (Interim CEO, Chairman & CEO, Vinai's role) need a dated, approved roster. |
| B03 | **Waiting on owner** | Renaming pillars, divisions, focus areas and benefit areas needs executive sign-off on the terms. |
| B04 | Done | **Home**, membership tier cards: "10–15% marketplace pricing" becomes "Proposed member benefits (details to be confirmed)". The fund line becomes "Help expand access through membership, subject to approved fund arrangements". The membership teaser copy is also qualified. **Marketplace**, member-pricing panel: "Unlock 10–15% off every purchase" becomes "Proposed member benefits / Member benefits are coming… details to be confirmed". **Membership**: the Marketplace benefits list is now "Proposed member pricing (details to be confirmed)"; the fund heading "Every membership changes a life." becomes "Help expand access through membership."; the fund FAQ is qualified. **Impact**: same fund heading and lead. |
| B05 | Done (needs 1.2.4) | Browser titles across the site: the homepage is "AFSV VRC \| Sport, Education and Inclusion", corporate pages are "Page \| AFSV VRC", and shop and product pages are "… \| AFSV VRC Marketplace". The shop gets a meta description. |
| B06 | **Waiting on owner** | Trademark: the ™ marks on AFSVHCL™ and FanZone™ are still used. The IP owner should confirm (™ is a claim, not registration; no ® is used anywhere). |
| H01 | Done | **Home**, digital section heading, and **Technology & Media** hero: "Where sport meets digital." |
| H02 | Done | **Home** hero headline: "A proposed year-round sports village for Whitby". **Home** intro facts: "Book a session" (external) becomes "Explore future booking", linking to the Facilities interest form. |
| H03 | Done | **Home**, "Get launch updates" button now goes to `/technology-media/#efn-connect`. |
| H04 | Partly done | **Home** hero tag now reads "Whitby, Ontario · Concept renderings". Matching each slide to the site plan needs the design owner. |
| H05 | Partly done | **Home**, focus-area cards: the Neurodiversity card now shows the adapted soccer session, and the Life Skills card shows the cooking and budgeting session. Alt texts no longer describe anyone as "neurodivergent" from their appearance (also fixed on `/neurodiversity/` and `/business-for-inclusion/`). Final rights-cleared photography is with the design owner. |
| H06 | **Waiting on owner** | Real portraits, image rights and vector logos. |
| V01 | **Waiting on owner** | The site doesn't publish 12–15 acres; acreage and phases need the project owner. |
| V02 | Done | **Whitby** roadmap: lead and 2029–2031 step now say "aspirational … subject to sites, financing, approvals and partners". **Impact**: "Aspirational goals, not commitments." |
| V03 | Partly done | Proposed/planned language is kept everywhere. A single status label on every card needs an approved status list. |
| V04 | Done | **Technology & Media**, EFN card: "Visit EFN" becomes "Register interest in EFN". |
| V05 | Partly done | **GAISB AI** internal note removed (see P01). Dates, venue and tickets need the event owner. |
| P01 | Done | The "Pending inputs" box is removed from Programs, Education, Life Skills, GAISB AI, Neurodiversity, Business for Inclusion, Service Provider Network and Neurodiversity Access Fund. |
| P02 | Done | **Business for Inclusion** ("Configurable contribution", now "Tailored contribution"), **Access Fund** ("Configurable outcomes", now "Tailored outcomes"; the payment line reworded), **Partners**, **Programs**, **Facilities**, **Whitby**: admin, hardcoded and switched-off wording is replaced with visitor wording. **News & Impact**: "Content types", now "What we will share" ("Draft" tags become "Coming soon"); "Impact dashboard / Future architecture", now "Impact reporting"; partner directory text rewritten. The hidden form messages "Development preview — this form is not connected yet…" are replaced on every form. |
| P03 | Done | **Education Partnerships** hero: new image (students and a mentor in a learning lounge), with alt text that matches it. |
| P04 | Partly done | **Education**, ADHD card: "channelling energy into achievement" becomes "…shaped around each athlete's individual strengths and needs, with support from qualified independent providers." Provider scope and credentials are for the program owner and attorney. |
| P05 | **Waiting on owner** | Both names are used: "Neurodivergent Inclusion Fund" (membership, impact, home) and "Neurodiversity Access Fund" (its own page). Executive and finance must say whether this is one fund or two. Wording is now "proposed … subject to approved fund arrangements". |
| P06 | Done (wording to be reviewed) | **FanZone**, "Every culture. One FanZone™" cards: new first card "Indigenous Peoples — First Nations, Inuit and Métis…", taken out of the North America / diaspora card. The community owner should approve the wording. |
| F01 | Done (wording to be reviewed) | Every inquiry form now has its own consent box plus a separate, **unticked, optional** box for email updates. Update-list sign-ups keep a single box, because updates are what the visitor is asking for. Counsel should approve the exact wording. |
| F02 | Done | **Membership**: choosing Phone or Text makes Mobile required, with an explanatory hint. **Neurodiversity** and **Business for Inclusion**: Preferred contact = Phone makes Phone required. |
| F03 | Done | **Programs** form: "Coach education" added. **Life Skills** form: "Personal responsibility" added. Both lists now come from the page's own category list. |
| F04 | Done | **Education** form: new first question "I am…". Learner age is only required for a parent/guardian or learner. |
| F05 | Done | Every form now says not to include diagnoses, medical records or financial documents. **Membership** age field: under-18s are asked to have a parent or guardian fill it in. The approved guardian process is for the attorney. |
| F06 | Done (targets to be confirmed) | **Contact**: "All discussions are confidential" becomes "We handle inquiries in accordance with our Privacy Policy"; reply times now say "aim". **Education Partnerships** and **Become a Vendor** reply times also say "aim". Amounts are labelled **CAD** (vendor form, Access Fund form). Operations should confirm the response targets. |
| M01 | Done | Every product page, Marketplace and Shop: "Concept preview. Final design, materials, colours, sizes and pricing are subject to approval." Updated live in WooCommerce too. |
| M02 | Partly done | Descriptions no longer claim a material: **Aviator** "warm textured collar", **Leather Jacket** "Material to be confirmed", **Parka** "trimmed hood". Live now. The product title "Executive Leather Jacket" stays until the merchandise owner confirms the material. |
| M03 | Done | **Executive Beanie**: "pom" becomes "pom-pom" (live now). Product spec "Crest" now reads "Gold AFSV VRC crest" or "Colour AFSV VRC crest"; the marketplace text no longer says "designer's colour crest". |
| M04 | **Waiting on owner** | Front, back and detail images, sizing and materials need the merchandise owner. |
| M05 | Done | Every product page: a "View on model" button on the main image (works by touch and keyboard, and plays the clip), with correct alt text for the model photo. |
| M06 | **Note**, done | The shop already filtered by the #fragment (e.g. `/shop/#everyday-accessories` shows 2 pieces), so the audit's check missed it. Real anchor IDs are added on the filter buttons, for browsers without scripts. |
| A01 | Done (redirects to approve) | `/legal/` now goes to `/compliance/`, `/accessibility-privacy/` to `/accessibility/` and `/vendors/` to `/become-a-vendor/`. These are temporary (302) until approved. The full policy list is with counsel. |
| A02 | **Waiting on owner** | Refund and shipping policy wording is the attorney's. |
| A03 | Done | **Accessibility** page header: "Target standard: WCAG 2.2 Level AA". There's no claim of certified conformance. |
| A04 | Open | Manual accessibility testing is still to be done and documented. |
| A05 | Open | A real test submission is needed once SMTP is set up. |
| A06 | **Waiting on owner** | Production domain, redirects and book.afsvvrc.com. |
| I01–I09 | **Waiting on owner** | 360Player: needs the module list, joining method, exact URLs and support routes from 360Player and AFSV before any pages are built. |

## Still flagged, no change made

- Founder quote on `/about/` ("…change the trajectory of thousands of young lives…"): it's a quote attributed to a named person, so their approval is needed before editing it.
