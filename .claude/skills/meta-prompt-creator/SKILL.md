---
name: meta-prompt-creator
description: "Creates powerful, production-ready prompts for AI applications using proven techniques from Anthropic, OpenAI, and Google. Use this skill whenever you need to write a prompt — for generating beautiful UI/web components, building autonomous agents and workflows, defining assistant behavior (system prompt), or transforming data. Invoke when the user says 'create a prompt', 'write a prompt for', 'I need a prompt that', 'help me prompt an AI to', 'generate a system prompt', or is building any AI-powered feature. Even if they don't explicitly say 'prompt', if they describe what an AI should do in their app, this skill applies."
---

# Meta-Prompt Creator

A skill for generating production-ready prompts that get consistently excellent results
from any LLM. Synthesizes best practices from Anthropic (XML structure, chain-of-thought),
OpenAI (structured output, meta-prompting), and Google DeepMind (ReAct, Tree-of-Thought,
self-consistency).

---

## Step 1: Gather Context

Ask the user what you don't already know (skip questions already answered):

- **What should the AI do?** — The specific task or behavior in plain language
- **What's the context?** — App type, users, what data the AI receives as input
- **Target model?** — Claude, GPT, Gemini, or "any" (default to Claude if not specified)
- **Constraints?** — Format, length, tone, things to avoid, languages

Then identify the **use case type** and proceed to the matching section below.

---

## Use Case 1: UI & Web Interfaces

For generating React/Vue/Svelte components, full pages, CSS layouts, or design systems.

**Why these techniques work**: Frontend generation fails when the AI has to guess at aesthetics,
stack choices, and behavior. Being explicit about all three removes ambiguity and produces
code you can ship.

**Technique stack**: Persona (senior engineer + designer) · Visual precision · Stack specification · Output constraints · Accessibility by default

**Prompt template**:

```
You are a senior frontend engineer and UI/UX designer specializing in [FRAMEWORK].
You write production-quality code: accessible, responsive, pixel-perfect.

## Task
Build [COMPONENT/PAGE NAME]:
[PRECISE BEHAVIORAL DESCRIPTION]

## Visual Style
Design language: [minimalist / editorial / brutalist / glassmorphism / etc.]
Color palette: [primary, background, text, accent colors with hex or token names]
Typography: [font family, size hierarchy — e.g., heading 32px/700, body 16px/400]
Spacing: [e.g., 8px grid, or "follow Tailwind defaults"]

## Technical Requirements
- Framework: [React / Vue / Svelte / Vanilla HTML+CSS]
- Styling: [Tailwind CSS / CSS Modules / styled-components / plain CSS]
- [Additional libs if needed, e.g., Framer Motion for animations]
- Responsive: mobile-first, tested at 375px, 768px, 1280px
- Accessible: WCAG AA — keyboard navigation, ARIA roles, focus rings
- [Dark mode: yes/no]

## Output
Return a single complete [.tsx / .vue / .html] file.
All interactive elements must have hover, focus, and active states.
No placeholder comments, no TODOs — everything implemented.
```

**Adapt for the user's specifics**: replace every bracket with real values. If they haven't
specified colors, suggest a coherent palette based on their described aesthetic.

---

## Use Case 2: Agents & Workflows

For autonomous agents that reason, use tools, and complete multi-step tasks reliably.

**Why these techniques work**: Agents fail when they don't know when to stop, what to do on
error, or how to break down ambiguous tasks. The ReAct loop (Reason → Act → Observe) from
Google DeepMind forces explicit reasoning before each action, dramatically reducing errors.

**Technique stack**: ReAct loop · Chain-of-Thought · Tool definitions · Stopping conditions · Error recovery

**Prompt template**:

```
You are [ROLE] specialized in [DOMAIN]. You work autonomously to complete tasks using
the tools available to you.

## Mission
[CLEAR, MEASURABLE GOAL — what "done" looks like]

## Available Tools
- **[tool_name]**: [What it does. Input: X. Output: Y. Use when: Z.]
- **[tool_name]**: [What it does. Input: X. Output: Y. Use when: Z.]

## How You Work (ReAct Loop)
For each step:
1. **Think**: What do I know? What do I need? Which tool gets me there?
2. **Act**: Call the tool with precise parameters.
3. **Observe**: Read the result. Did it work? What's next?
Repeat until the task is complete.

## Rules
- Always show your reasoning (Think step) before acting
- If a tool returns an error, try an alternative approach before failing
- If genuinely stuck or ambiguous, ask the user — don't guess on consequential decisions
- Stop when: [STOPPING CONDITION, e.g., "all items processed" or "user confirms result"]

## Output When Done
Provide:
- **Result**: [FORMAT — JSON / markdown table / plain text]
- **Summary**: What you did and why
- **Confidence**: High / Medium / Low — and why if Medium or Low
```

**For complex planning agents**, add a Tree-of-Thought step before acting:
```
Before starting, outline 2-3 possible approaches. Evaluate each briefly.
Choose the most reliable one and proceed.
```

---

## Use Case 3: System Prompts

For defining the identity, behavior, and guardrails of an AI assistant inside an application.

**Why these techniques work**: Vague system prompts produce inconsistent assistants. A good
system prompt gives the AI a stable identity (persona), clear scope (what it does/doesn't do),
and graceful fallbacks — so it behaves predictably across thousands of conversations.

**Technique stack**: Persona definition · Positive behavior rules · Capability boundaries · Tone calibration · Graceful fallbacks

**Prompt template**:

```
You are [PERSONA NAME], [ONE-LINE ROLE DESCRIPTION] for [PRODUCT/COMPANY].

## Your personality
[3-5 grounding adjectives — these define how you speak and reason]
Examples: concise, warm, technically precise, direct, never condescending

## What you do
- [PRIMARY CAPABILITY — be specific, not "help users"]
- [SECONDARY CAPABILITY]
- [TERTIARY CAPABILITY if applicable]

## What you don't do
- You don't [OUT-OF-SCOPE THING] — for that, direct users to [RESOURCE]
- You don't invent facts — if you don't know something, say so clearly and offer what you do know
- You don't [ANY BRAND/LEGAL CONSTRAINT]

## How you respond
- Length: match the complexity of the question (one-liner questions get one-liner answers)
- Format: use bullet points for lists, code blocks for code; avoid unnecessary headers
- Language: [primary language; bilingual behavior if applicable]

## Context injected at runtime
[LIST DYNAMIC DATA THE AI WILL RECEIVE — user profile, subscription plan, page context, etc.]
Use this context to personalize responses without being asked to.

## When out of scope
Acknowledge warmly and redirect:
"That's outside what I can help with here. For [TOPIC], [RESOURCE/PERSON] would be ideal."
```

**For Claude specifically**: Wrap in `<system>` tags and inject context with XML:
```xml
<user_context>
  Plan: {{user.plan}}
  Language: {{user.locale}}
</user_context>
```

---

## Use Case 4: Data Transformation

For extracting, cleaning, restructuring, or enriching data from unstructured inputs.

**Why these techniques work**: LLMs hallucinate field names and formats when the schema is
implicit. Making the schema explicit and providing few-shot examples removes this — the model
has no ambiguity to fill with invention.

**Technique stack**: Explicit JSON schema · Few-shot examples (2-3, covering edge cases) · Null handling rules · Strict output (JSON only) · Normalization rules

**Prompt template**:

```
Extract and structure the information below according to the schema provided.

## Output Schema
Return ONLY valid JSON — no preamble, no explanation, no markdown fence.

{
  "[field_name]": "[type] — [description]",
  "[field_name]": "[type | null] — [description; null if not found in source]",
  "[field_name]": "[string (ISO 8601) | null] — [date fields always ISO 8601]"
}

## Rules
- Missing fields → null (never omit, never use empty string)
- [Normalization: e.g., "Phone numbers: E.164 format (+33612345678)"]
- [Deduplication: e.g., "If the same entity appears twice, merge and keep the most complete version"]
- [Confidence: e.g., "If you're unsure about a value, include it with a note in a '__confidence' field"]

## Examples

Input: [EXAMPLE INPUT 1]
Output: {"field": "value", "field2": null}

Input: [EXAMPLE INPUT 2 — with an edge case]
Output: {"field": "value", "field2": "inferred_value"}

## Data to process
[INPUT]
```

**Self-consistency check** (for high-stakes extraction): append at the end:
```
After generating the JSON, verify: does every required field have a value or explicit null?
Are all dates in ISO 8601? If not, correct before outputting.
```

---

## Universal Power-Ups

Add these to any prompt type to improve quality:

| Technique | When to add it | Snippet |
|-----------|---------------|---------|
| **Chain-of-Thought** | Reasoning tasks, debugging | `"Think step by step before answering."` |
| **Negative example** | Model keeps making the same mistake | `"Do NOT format like this: [bad example]"` |
| **Self-review** | High-stakes outputs | `"Before responding, verify: [criteria]. Fix if needed."` |
| **Persona calibration** | Tone is too formal/casual | `"Write as if explaining to a [audience type]."` |
| **Output anchoring** | Format keeps drifting | Start the expected output in the prompt: `"Your response should begin with: # Result\n..."` |
| **Tree-of-Thought** | Complex decisions | `"List 2-3 approaches, evaluate each, then implement the best."` |
| **Few-shot examples** | Pattern needs to be precise | Add 2-3 `Input: X → Output: Y` pairs |

---

## Model-Specific Adaptations

| Model | Key adaptation |
|-------|---------------|
| **Claude** | Use XML tags (`<context>`, `<task>`, `<constraints>`) to structure sections. Role goes in system prompt. |
| **GPT-4 / GPT-4o** | Use JSON Schema mode for structured output. System/user/assistant roles are separate. |
| **Gemini** | Set explicit safety thresholds in API config. Works well with structured output via `response_mime_type`. |
| **Any / Generic** | Use `##` headers as section delimiters. Avoid model-specific syntax. |

---

## Generating the Final Prompt

Once you have the context:

1. **Pick the use case template** (UI / Agent / System Prompt / Data — or combine)
2. **Fill every bracket** with the user's specifics — invent realistic examples for anything missing
3. **Add relevant Power-Ups** from the table above
4. **Output the complete prompt in a code block** — copy-paste ready, no TODOs
5. **Offer one natural follow-up**: adapt for a different model, add few-shot examples, shorten it, or create a variant

The generated prompt must be immediately usable. Never leave `[PLACEHOLDER]` text in the output.
