# Project Scoping Questionnaire - Content Reference

> **Purpose:** This document defines every step, question, hint, help text, and option used in the scoping tool.
> Edit this file to refine wording, add/remove questions, or change options - then sync changes back into `js/App.jsx`.

---

## How the Questionnaire Works

| Phase | Steps | Description |
|-------|-------|-------------|
| Welcome | - | Brief intro explaining the process |
| What's the Problem? | 1 | Define the pain point and who it affects |
| What Happens Today? | 2 | Current process, tools, and time spent |
| What Would Fixed Look Like? | 3 | Desired outcome, priorities, and human touchpoints |
| How Important Is This? | 4 | Urgency, importance, timeline, and approval |
| What Type of Project Is This? | 5 | Automation, Agent, App - or guided "Not Sure" flow |
| Type-Specific Questions | 6 | Tailored follow-up for the chosen type |
| Anything Else? | 7 | Attachments, constraints, context |
| Review & Export | 8 | Compiled brief with copy/download options |

---

## Help Box System

Every question has an optional floating help box (triggered by a `?` icon or "See examples" link next to the input field). The help box sits beside the answer field and contains:

- **Why we're asking** - one sentence explaining the purpose
- **Example answers** - 2-3 real examples relevant to Cliphair
- **Tip** - optional, short guidance on how to answer well

> **Build note:** Help boxes should be dismissible, non-blocking, and styled as a soft tooltip or side panel. They should not obscure the input field. On mobile, they can appear as an expandable section below the question.

---

## Step 1: What's the Problem?

Start with pain. Everything else flows from here.

### `problem_statement`

| Property | Value |
|----------|-------|
| **Label** | What's the problem you're trying to solve? |
| **Hint** | 1-2 sentences in plain English. No jargon needed. |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** A clear problem statement helps us understand what to fix, not just what to build.
>
> **Examples:**
> - "We manually check every order for colour mismatches before dispatch, and it takes ages."
> - "Customers keep emailing asking which extensions suit their hair type, and we answer the same questions over and over."
> - "Our trade team has no way to see which salons haven't reordered in 3 months."
>
> **Tip:** Try finishing this sentence: "The problem is that..."

---

### `who_affected`

| Property | Value |
|----------|-------|
| **Label** | Who does this affect? |
| **Hint** | Tick all that apply, and add anyone else in the text box |
| **Type** | multi-select checkboxes + text input |

**Checkbox options:**
- Customer Service team
- Marketing team
- Warehouse / Fulfilment team
- Trade / B2B team
- Web / Tech team
- Management
- Retail customers (B2C)
- Trade customers (B2B / salons)
- Other (specify below)

**Text input:**
| ID | Label | Type | Conditions |
|----|-------|------|------------|
| `who_affected_other` | Anyone else not listed above? | text | Always visible below checkboxes |

**Help box:**
> **Why we're asking:** Knowing who's affected helps us understand the scale and who to involve.
>
> **Examples:**
> - Customer Service + Retail customers - "CS spend half their day answering colour match queries that customers could self-serve."
> - Warehouse team - "Packers are printing labels manually instead of pulling from Shopify."
> - Trade team + Trade customers - "Salons can't see their order history or reorder easily."

---

### `frequency`

| Property | Value |
|----------|-------|
| **Label** | How often does this come up? |
| **Hint** | Select all that apply |
| **Type** | multi-select checkboxes |

**Checkbox options:**
- Multiple times a day
- Daily
- Weekly
- Monthly
- Per order / transaction
- Seasonal (e.g. peak periods, launches)
- Other

| ID | Label | Type | Conditions |
|----|-------|------|------------|
| `frequency_other` | Tell us more: | text | *Only shows if "Other" is selected* |

**Help box:**
> **Why we're asking:** Frequency tells us how much pain this causes. Something that happens 50 times a day is more urgent than something monthly.
>
> **Examples:**
> - "Multiple times a day" + "Per order" - CS answering the same product question with every enquiry.
> - "Weekly" - Manually compiling a trade sales report every Monday.
> - "Seasonal" - Bridal season creates a spike in colour match requests every spring.

---

### `tried_before`

| Property | Value |
|----------|-------|
| **Label** | Has anyone tried to solve this before? |
| **Type** | select (Yes / No) |

| ID | Label | Hint | Type | Conditions |
|----|-------|------|------|------------|
| `tried_before_detail` | What was tried and what happened? | What worked, what didn't, and why it was abandoned | textarea | *Only shows if `tried_before` = "Yes"* |

**Help box:**
> **Why we're asking:** Knowing what's been tried stops us repeating the same mistakes.
>
> **Examples:**
> - "Yes - we built a Google Sheet to track it but nobody kept it updated."
> - "Yes - we tried a Shopify app but it couldn't handle our colour range."
> - "No - we've just always done it manually."

---

## Step 2: What Happens Today?

Ground it in reality before jumping to solutions.

### `current_process`

| Property | Value |
|----------|-------|
| **Label** | Walk us through what happens today, step by step. |
| **Hint** | Describe the process as if showing a new starter what to do. |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** Understanding the current process - even if it's messy - helps us work out what to automate and what needs human judgement.
>
> **Examples:**
> - "1. Customer emails asking for a colour match. 2. CS opens the email and looks at the attached photo. 3. CS compares it against the swatch chart on screen. 4. CS types a recommendation and sends it back. Takes about 10 mins each time."
> - "1. Abbey downloads the Shopify orders CSV. 2. Filters it by trade customers. 3. Copies the data into a separate spreadsheet. 4. Manually adds margin calculations. 5. Emails it to the trade manager."
>
> **Tip:** Numbered steps work best. Don't worry about being too detailed - more is better here.

---

### `time_spent`

| Property | Value |
|----------|-------|
| **Label** | How much time does this take per week? |
| **Hint** | Your best guess is fine. Pick the closest size. |
| **Type** | select |

**Options (T-shirt scale):**

| Size | Label | Description |
|------|-------|-------------|
| XS | XS - About 15 minutes | Quick but annoying |
| S | S - About 30 minutes to 1 hour | Noticeable time drain |
| M | M - 1 to 3 hours | A solid chunk of someone's week |
| L | L - 3 to 5 hours | Half a day, every week |
| XL | XL - 5 hours to a full day | Basically a whole day's work |
| XXL | XXL - More than a full day | Multiple people or multiple days |
| ? | Not sure | I genuinely don't know |

**Help box:**
> **Why we're asking:** This is our single best signal for prioritisation. A task eating 5+ hours a week is a much stronger case than one taking 15 minutes.
>
> **Examples:**
> - XS - "Copying a tracking number into ClickUp once a day."
> - M - "Answering colour match emails, about 15-20 per week at 10 mins each."
> - XL - "Compiling the weekly trade report from scratch every Monday."
>
> **Tip:** If multiple people do this task, estimate the combined total across everyone.

---

### `tools_used`

| Property | Value |
|----------|-------|
| **Label** | Which tools or systems are involved? |
| **Hint** | Tick all that apply |
| **Type** | multi-select checkboxes |

**Checkbox options:**
- Shopify
- Klaviyo
- ClickUp
- n8n
- Google Sheets
- Google Docs
- Google Drive
- Email (Gmail / Outlook)
- Cliphair website (front-end)
- Phone / manual process
- Other

| ID | Label | Type | Conditions |
|----|-------|------|------------|
| `tools_other` | Any other tools not listed? | text | *Only shows if "Other" is selected* |

**Help box:**
> **Why we're asking:** Knowing which systems are involved tells us what needs to connect to what - and whether we already have the building blocks.
>
> **Tip:** If you're not sure what tool something lives in, just describe where you go to do the task. "I open a spreadsheet Abbey shared" is perfectly fine.

---

### `show_us`

| Property | Value |
|----------|-------|
| **Label** | Can you show us? |
| **Hint** | Screenshots, screen recordings, or links. A 30-second video is worth a thousand words. |
| **Type** | compound field (see below) |

**Sub-fields:**

| ID | Label | Type | Notes |
|----|-------|------|-------|
| `show_us_files` | Upload files | file (multiple) | Accept images, video, PDF, docs |
| `show_us_links` | Paste links to screenshots, videos, or docs | repeatable text input | "Add another link" button to add more rows |

**Help box:**
> **Why we're asking:** Seeing the actual screen, spreadsheet, or email thread helps us understand faster than any written description.
>
> **Examples:**
> - A screenshot of the spreadsheet you manually update
> - A Loom recording of you walking through the process
> - A link to the Google Sheet or ClickUp board involved
>
> **Tip:** You can use free tools like Loom (loom.com) or your phone's screen recording to capture a quick walkthrough. Don't worry about production quality - rough is fine.

---

## Step 3: What Would "Fixed" Look Like?

### `desired_outcome`

| Property | Value |
|----------|-------|
| **Label** | What does the ideal end result look like? |
| **Hint** | What changes? What gets easier? Be specific if you can. |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** This helps us understand your vision so we can build towards it - even if v1 only gets partway there.
>
> **Examples:**
> - "Colour match recommendations happen automatically based on the customer's uploaded photo, and CS only steps in for tricky cases."
> - "Trade order reports generate themselves every Monday morning and land in the trade manager's inbox."
> - "Customers can check which extension type suits them without needing to contact us."
>
> **Tip:** Describe the dream state. We'll figure out what's realistic for v1.

---

### `must_do`

| Property | Value |
|----------|-------|
| **Label** | What's the single most important thing this must do? |
| **Hint** | If it only did one thing, what would it be? |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** This keeps us focused. Feature lists grow quickly - this anchors us to what actually matters.
>
> **Examples:**
> - "It must correctly recommend the right colour at least 90% of the time."
> - "It must pull live order data from Shopify - not a stale export."
> - "It must notify the trade team when a salon hasn't ordered in 90 days."

---

### `human_touchpoints`

| Property | Value |
|----------|-------|
| **Label** | Where does a human still need to be involved? |
| **Hint** | AI and automation can handle a lot, but some steps might need a person's judgement. Think about where that line is. |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** Most projects don't fully replace humans - they handle the repetitive parts so your team can focus on the bits that need real judgement. Thinking about this now saves us building something that tries to do too much.
>
> **Examples:**
> - "The system can suggest a colour match, but a human should review anything where the customer's photo is poor quality."
> - "Auto-generate the report, but a manager needs to check the numbers before it goes to the client."
> - "The chatbot can answer product questions, but anything about refunds or complaints should go to a real person."
> - "Honestly not sure - maybe it can all be automated?"
>
> **Tip:** It's fine to say "I'm not sure." We can work this out together during scoping. The point is to start thinking about it.

---

### `who_benefits`

| Property | Value |
|----------|-------|
| **Label** | Who benefits from this being fixed? |
| **Hint** | Tick all that apply |
| **Type** | multi-select checkboxes + text input |

**Checkbox options:**
- Customer Service team
- Marketing team
- Warehouse / Fulfilment team
- Trade / B2B team
- Web / Tech team
- Management
- Retail customers (B2C)
- Trade customers (B2B / salons)
- The business overall (revenue, efficiency)
- Other

| ID | Label | Hint | Type | Conditions |
|----|-------|------|------|------------|
| `who_benefits_other` | Anyone else? | Separate names or groups with commas | text | *Only shows if "Other" is selected* |

**Help box:**
> **Why we're asking:** Understanding who gains helps us measure success and get the right people behind the project.
>
> **Examples:**
> - Customer Service team + Retail customers - "CS gets time back, customers get faster answers."
> - The business overall - "Less manual work means we can handle more orders without hiring."

---

## Step 4: How Important Is This?

### Urgency / Importance Matrix

> **Build note:** Display this as a simple 2x2 visual matrix that the user clicks to place their project. Label the quadrants as below. The selected quadrant populates the `priority` field.

```
                    URGENT
                      |
     ┌────────────────┼────────────────┐
     |                |                |
     |   DO NEXT      |   DO NOW       |
     |   Important    |   Important    |
     |   Not urgent   |   Urgent       |
     |                |                |
  ───┼────────────────┼────────────────┼───
     |                |                |  IMPORTANT
     |   PARK IT      |   QUICK WIN    |
     |   Not important|   Not important|
     |   Not urgent   |   Urgent       |
     |                |                |
     └────────────────┼────────────────┘
                      |
```

### `priority`

| Property | Value |
|----------|-------|
| **Label** | Where does this sit? |
| **Hint** | Click the quadrant that best describes this project. |
| **Type** | matrix-select (maps to one of four values) |

**Options (mapped from matrix click):**

| Quadrant | Value | Description |
|----------|-------|-------------|
| Top-right | Do Now | Important and urgent - we're losing money, customers, or significant time |
| Top-left | Do Next | Important but not urgent - big impact, but can be planned in properly |
| Bottom-right | Quick Win | Not critical, but urgent or easy to fix - low effort, clear payoff |
| Bottom-left | Park It | Nice to have - worth recording but not a priority right now |

**Help box:**
> **Why we're asking:** Not everything that feels urgent is actually important, and some important things don't feel urgent. This helps us prioritise honestly.
>
> **How to decide:**
> - **Important** = Has a real impact on revenue, customer experience, or team capacity
> - **Urgent** = Needs to happen soon because of a deadline, a growing problem, or lost revenue right now
>
> **Examples:**
> - "Do Now" - "We're manually processing 200 trade orders a week and making errors that cost us returns."
> - "Do Next" - "We want a customer self-service tool for colour matching, but current CS process works, just slowly."
> - "Quick Win" - "Auto-tagging ClickUp tasks from Shopify orders would save 20 mins a day."
> - "Park It" - "It'd be cool to have a dashboard showing extension trends by region."

---

### `deadline`

| Property | Value |
|----------|-------|
| **Label** | When does this need to be done by? |
| **Type** | select |

**Options:**

| Value | Label |
|-------|-------|
| `asap` | As soon as possible |
| `1_month` | Within 1 month |
| `1_3_months` | 1-3 months |
| `3_6_months` | 3-6 months |
| `no_deadline` | No hard deadline |
| `other` | Other |

| ID | Label | Hint | Type | Conditions |
|----|-------|------|------|------------|
| `deadline_other` | Tell us more: | What's the date and why? | text | *Only shows if `deadline` = "Other"* |

**Help box:**
> **Why we're asking:** Deadlines help us plan realistically. If there's a hard date (e.g. a product launch or peak season), we need to know early.
>
> **Examples:**
> - "Within 1 month" - "Bridal season starts in May and we need the colour match tool ready."
> - "1-3 months" - "We want this before the next trade show in September."
> - "No hard deadline" - "Whenever it can be done properly."

---

### `approver`

| Property | Value |
|----------|-------|
| **Label** | Who needs to sign off on this? |
| **Type** | select |

**Options:**
- Manager
- Director
- Both (Manager recommends, Director approves)

**Help box:**
> **Why we're asking:** So we know who to loop in for approval and who has final say.

---

### `anyone_else`

| Property | Value |
|----------|-------|
| **Label** | Anyone else who should be involved or kept in the loop? |
| **Hint** | Names or roles |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** Other people often have context that changes the approach. Better to know now than find out halfway through.
>
> **Examples:**
> - "Abbey in marketing - she manages the brand guidelines."
> - "The trade team lead - they'll be the main users."
> - "Nobody else, just me and my manager."

---

## Step 5: What Type of Project Is This?

### Project Type Selection

| Key | Label | Icon | Tagline |
|-----|-------|------|---------|
| `automation` | Automation | ⚙️ | Replacing repetitive manual tasks with automated workflows |
| `agent` | Agent / AI Assistant | 🤖 | An AI that answers questions, handles requests, or guides users |
| `app` | App / Dashboard | 🖥️ | A custom tool with a screen people interact with |
| `not_sure` | I'm not sure | 🤷 | Help me work out the best approach |

---

### "Not Sure" Guided Flow

> **Build note:** When the user selects "I'm not sure", show the following diagnostic questions one at a time. Based on their answers, suggest the most appropriate project type (or a combination). Display the recommendation with a short explanation, then let them confirm or override.

#### Question 1: `guide_nature`

| Property | Value |
|----------|-------|
| **Label** | Which of these best describes what you need? |
| **Type** | single-select |

**Options:**

| Value | Label | Maps towards |
|-------|-------|-------------|
| `replace_steps` | Replace manual steps that follow the same pattern every time | Automation |
| `answer_questions` | Something that can answer questions or have conversations | Agent |
| `screen_tool` | A screen or dashboard where people can look things up, enter data, or manage something | App |
| `still_unsure` | I'm still not sure | Continue to Q2 |

*If user selects `replace_steps`, `answer_questions`, or `screen_tool` - skip to recommendation.*

---

#### Question 2: `guide_interaction`

| Property | Value |
|----------|-------|
| **Label** | How do people interact with this today? |
| **Type** | single-select |

**Options:**

| Value | Label | Maps towards |
|-------|-------|-------------|
| `no_interaction` | Nobody interacts with it - it just needs to happen in the background | Automation |
| `ask_and_answer` | Someone asks a question and gets an answer back | Agent |
| `click_and_browse` | Someone opens a screen, clicks around, looks at data, or fills in fields | App |
| `mix` | It's a mix of these | Continue to Q3 |

*If user selects a single option - skip to recommendation.*

---

#### Question 3: `guide_trigger`

| Property | Value |
|----------|-------|
| **Label** | What kicks this off? |
| **Type** | single-select |

**Options:**

| Value | Label | Maps towards |
|-------|-------|-------------|
| `event` | Something happens automatically (a new order, a form submission, a timer) | Automation |
| `person_asks` | A person asks a question or makes a request | Agent |
| `person_opens` | A person opens a tool or screen to do something | App |
| `all_of_above` | All of the above, honestly | Combination |

---

#### Recommendation Logic

Based on the answers, display one of these recommendations:

**Single type recommended:**
> Based on your answers, this sounds like it's best suited as an **[Automation / Agent / App]**.
>
> [One sentence explaining why.]
>
> **Does that sound right?**
> [ Yes, continue ] [ No, let me pick manually ]

**Combination recommended:**
> This sounds like it might need **more than one piece** - for example, an automation that feeds data into a dashboard, or an AI agent backed by an automated workflow.
>
> **Don't worry about getting it exactly right.** Pick the one that feels closest to the core of what you need, and we'll figure out the rest during scoping.
>
> [ Automation ] [ Agent ] [ App ]

**Example recommendation mappings:**

| Answers | Recommendation |
|---------|---------------|
| `replace_steps` | Automation - "This sounds like a repeatable process that can run on its own once set up." |
| `answer_questions` | Agent - "This sounds like it needs an AI that can understand questions and give relevant answers." |
| `screen_tool` | App - "This sounds like you need a dedicated tool with a visual interface." |
| `no_interaction` | Automation - "If nobody needs to interact with it, an automation running in the background is the way to go." |
| `ask_and_answer` | Agent - "If people need to ask questions and get answers, an AI agent is the right fit." |
| `click_and_browse` | App - "If people need to see, search, or interact with data on screen, that's an app." |
| `mix` + `all_of_above` | Combination - show the combination message above |
| `mix` + `event` | Automation (primary) - "The core of this is an automation, though it might feed into something people can see." |
| `mix` + `person_asks` | Agent (primary) - "The core of this is an AI assistant, though it might pull from automated data." |
| `mix` + `person_opens` | App (primary) - "The core of this is a tool people use, though some parts might run automatically behind the scenes." |

---

## Step 6: Type-Specific Questions

### ⚙️ Automation

#### `auto_trigger`

| Property | Value |
|----------|-------|
| **Label** | What kicks this off? |
| **Type** | select |

**Options:**
- Something happens (new order, form submitted, email received)
- A schedule (daily, weekly, monthly)
- Someone clicks a button or makes a request
- Other

| ID | Label | Type | Conditions |
|----|-------|------|------------|
| `auto_trigger_detail` | Tell us more about the trigger: | textarea | Always visible |

**Help box:**
> **Examples:**
> - "Every time a new Shopify order comes in with a trade customer tag."
> - "Every Monday at 7am, before the team arrives."
> - "When someone clicks 'Generate Report' in ClickUp."

---

#### `auto_steps`

| Property | Value |
|----------|-------|
| **Label** | What should happen automatically, in order? |
| **Hint** | Step 1 does X, then step 2 does Y, etc. |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** This is the recipe. The more detail you give, the more accurately we can build it.
>
> **Example:**
> - "1. Pull all new orders from Shopify tagged 'trade'. 2. Match each order to the salon's account in our trade spreadsheet. 3. Calculate the margin for each product. 4. Add a row to the weekly trade report. 5. If any order is over £500, send a Slack message to the trade manager."

---

#### `auto_output`

| Property | Value |
|----------|-------|
| **Label** | What's the end result? |
| **Hint** | An email sent, a spreadsheet updated, a notification, a record created, etc. |
| **Type** | textarea |

**Help box:**
> **Examples:**
> - "An updated Google Sheet with this week's trade orders and margins."
> - "An automatic email to the customer with their colour match recommendation."
> - "A ClickUp task created for the warehouse team with packing instructions."

---

#### `auto_failure`

| Property | Value |
|----------|-------|
| **Label** | What should happen if something goes wrong? |
| **Hint** | Who gets told? Should it retry? Should it stop? |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** Things will go wrong eventually - a system goes down, data is missing, an API changes. Deciding this now means failures get caught instead of silently breaking.
>
> **Examples:**
> - "Email me if it fails. Don't retry - I'll check manually."
> - "Post a message in the #errors Slack channel and retry once after 5 minutes."
> - "Not sure - what would you recommend?"

---

#### `auto_sensitive`

| Property | Value |
|----------|-------|
| **Label** | Does this involve sensitive data? |
| **Type** | select |

**Options:**
- Yes - customer data (names, emails, addresses)
- Yes - payment or financial data
- Yes - login credentials or passwords
- Yes - multiple types of sensitive data
- No sensitive data
- Not sure

**Help box:**
> **Why we're asking:** Sensitive data needs extra security measures. If it touches customer details, payment info, or credentials, we need to handle it carefully.

---

### 🤖 Agent / AI Assistant

#### `agent_job`

| Property | Value |
|----------|-------|
| **Label** | What's this agent's core job? |
| **Hint** | Answer customer questions, triage support tickets, recommend products, etc. |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** An agent that tries to do everything does nothing well. What's the one thing it must be great at?
>
> **Examples:**
> - "Help customers find the right extension type and colour for their hair."
> - "Answer trade customer questions about bulk pricing and stock availability."
> - "Triage incoming customer service emails and draft suggested responses for the team to review."

---

#### `agent_knowledge`

| Property | Value |
|----------|-------|
| **Label** | What information does it need access to? |
| **Hint** | Product guides, FAQs, order data, policies, etc. |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** An agent is only as good as the information it can draw from. The more specific you are, the better it'll perform.
>
> **Examples:**
> - "Our product guide, colour chart, hair type suitability charts, and care instructions."
> - "The Cliphair FAQ page, returns policy, and shipping information."
> - "Live Shopify order data so it can look up order status."

---

#### `agent_channel`

| Property | Value |
|----------|-------|
| **Label** | Where will people use it? |
| **Type** | select |

**Options:**
- Website chat widget
- Slack
- Email
- Inside another tool (ClickUp, Shopify, etc.)
- Multiple places
- Other

**Help box:**
> **Examples:**
> - "Website chat widget" - for customer-facing product advice.
> - "Slack" - for internal team questions about processes or policies.
> - "Email" - to draft responses to incoming customer emails.

---

#### `agent_boundaries`

| Property | Value |
|----------|-------|
| **Label** | What should it never do or say? |
| **Hint** | Topics to avoid, actions it shouldn't take, limits on its authority |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** Guardrails prevent the agent from going off-script. Think about what could go wrong if it answered incorrectly.
>
> **Examples:**
> - "Never recommend self-application of permanent extensions - always direct to a professional."
> - "Don't give specific refund amounts - direct to CS."
> - "Never badmouth competitor brands."
> - "Don't make claims about hair lasting longer than our stated lifespans."

---

#### `agent_escalation`

| Property | Value |
|----------|-------|
| **Label** | When should it hand off to a real person? |
| **Hint** | What triggers the handoff, and who does it go to? |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** Even the best AI needs to know when to step aside. Clear escalation rules prevent frustrated customers.
>
> **Examples:**
> - "If the customer asks about a refund or complaint, hand off to CS immediately."
> - "If it's not confident in the colour match, escalate to a human with the photo attached."
> - "If the customer asks the same question three times, assume it's not helping and offer a human."

---

### 🖥️ App / Dashboard

#### `app_who`

| Property | Value |
|----------|-------|
| **Label** | Who is this for? |
| **Type** | select |

**Options:**
- Internal team only
- Customers (public-facing)
- Trade customers (salons / professionals)
- Both internal and external

**Help box:**
> **Why we're asking:** Internal tools can be rougher and simpler. Customer-facing tools need to look polished and follow brand guidelines.

---

#### `app_screens`

| Property | Value |
|----------|-------|
| **Label** | Describe the key screens or pages - even roughly. |
| **Hint** | What does someone see and do on each screen? |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** Even a rough description helps us estimate the size of the build and start thinking about layout.
>
> **Examples:**
> - "A dashboard showing this week's trade orders, with filters by salon and product type. A detail page for each order. An export button."
> - "A page where the customer uploads a photo, a results page showing recommended colours, and an 'add to basket' link for each one."
> - "A simple internal form where CS can log a complaint, with a list view of all open complaints."
>
> **Tip:** Bullet points are fine. You don't need wireframes at this stage - just describe what you'd want to see on screen.

---

#### `app_login`

| Property | Value |
|----------|-------|
| **Label** | Do people need to log in? |
| **Type** | select |

**Options:**
- Yes - different users see different things
- Yes - but everyone sees the same content
- No - open access
- Not sure

**Help box:**
> **Examples:**
> - "Yes, different views" - trade customers see their own orders only.
> - "Yes, same content" - internal team all see the same dashboard but need a login for security.
> - "No" - a public tool on the website anyone can use.

---

#### `app_mobile`

| Property | Value |
|----------|-------|
| **Label** | Does it need to work on mobile? |
| **Type** | select |

**Options:**
- Yes - mobile first
- Yes - should work on both mobile and desktop
- Desktop only
- Not sure

**Help box:**
> **Tip:** If customers or trade clients will use this, it probably needs to work on mobile. Internal tools used at a desk can often be desktop only.

---

#### `app_reference`

| Property | Value |
|----------|-------|
| **Label** | Is there an existing tool or website that looks roughly like what you're after? |
| **Hint** | A link, a screenshot, or just describe it |
| **Type** | textarea |

**Help box:**
> **Why we're asking:** "Something like this, but for our trade team" saves hours of explanation.
>
> **Examples:**
> - "Like the Shopify orders page, but filtered to show only trade customers with margin data."
> - "Something like Notion's table view where we can filter and sort."
> - "I've seen a tool called [X] that does something similar - here's the link."

---

## Step 7: Anything Else?

Catch-all for context that doesn't fit elsewhere.

### `constraints`

| Property | Value |
|----------|-------|
| **Label** | Are there any constraints we should know about? |
| **Hint** | Budget limits, security requirements, things that can't change, legal or compliance needs |
| **Type** | textarea |

**Help box:**
> **Examples:**
> - "It must work within Shopify's API rate limits."
> - "Customer data can't leave the EU."
> - "We only have budget for a quick fix right now - a full build can wait."
> - "None that I know of."

---

### `brand_guidelines`

| Property | Value |
|----------|-------|
| **Label** | Does this need to follow Cliphair brand guidelines? |
| **Type** | select |

**Options:**
- Yes
- No
- Not sure

**Help box:**
> **Tip:** If customers or trade clients will see it, the answer is probably "Yes." Internal-only tools usually don't need full brand styling.

---

### `attachments`

| Property | Value |
|----------|-------|
| **Label** | Attach any supporting files |
| **Hint** | Screenshots, spreadsheets, mockups, process docs, screen recordings |
| **Type** | file (multiple) |

---

### `anything_else`

| Property | Value |
|----------|-------|
| **Label** | Anything else that would help us understand this? |
| **Hint** | Background context, things you've tried, links to similar tools, gut feelings |
| **Type** | textarea |

**Help box:**
> **Tip:** There's no wrong answer here. If something feels relevant but you're not sure where it fits, put it here.

---

## Review & Export (Step 8)

Compiled summary of all answers, grouped by section. Options to:

- Copy to clipboard
- Download as PDF
- Submit directly (to ClickUp or email, if connected)

---

## What Happens Next

```
1. Requester fills in the form (10-15 minutes)
2. Brief lands with the build team
3. Builder reviews and books a short scoping call if needed
4. Builder produces a scope estimate and recommended approach
5. Approver signs off
6. Work begins
```

> **Important:** The form captures the problem and context. Technical details like data mapping, system architecture, and acceptance criteria come out during the scoping call - not from the requester.

---

## Tips for Requesters

- **Plain English is perfect.** Write it how you'd explain it to a colleague over coffee.
- **"I don't know" is a valid answer.** Flag unknowns early so the builder can research them.
- **Show, don't tell.** A screenshot or screen recording beats a paragraph every time.
- **Think small for v1.** What's the simplest version that actually helps? We can always build on it later.
- **Don't worry about picking the "right" project type.** The "Not sure" flow is there to help, and we can always reclassify during scoping.

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2 April 2026 | Initial version created | - |
| 2 April 2026 | Rebuilt: reordered flow, simplified language, trimmed type-specific sections, added Cliphair tool checklist, removed enterprise-style questions | - |
| 2 April 2026 | v3: Added help boxes with examples for every question, guided "Not sure" flow for project type, urgency/importance matrix, t-shirt sizing for time, human touchpoint question, multi-selects with other fields, repeatable link inputs for show_us | - |