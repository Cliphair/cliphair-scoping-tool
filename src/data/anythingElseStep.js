export const anythingElseStep = {
    id: "anything_else_step",
    title: "Anything Else?",
    description: "Catch-all for context that doesn't fit elsewhere.",
    questions: [
        {
            id: "constraints", label: "Are there any constraints we should know about?",
            hint: "Budget limits, security requirements, things that can't change, legal or compliance needs",
            type: "textarea",
            help: {
                examples: [
                    "It must work within Shopify's API rate limits.",
                    "Customer data can't leave the EU.",
                    "We only have budget for a quick fix right now — a full build can wait.",
                    "None that I know of."
                ]
            }
        },
        {
            id: "brand_guidelines", label: "Does this need to follow Cliphair brand guidelines?",
            type: "select", options: ["Yes", "No", "Not sure"],
            help: { tip: 'If customers or trade clients will see it, the answer is probably "Yes." Internal-only tools usually don\'t need full brand styling.' }
        },
        {
            id: "anything_else", label: "Anything else that would help us understand this?",
            hint: "Background context, things you've tried, links to similar tools, gut feelings",
            type: "textarea",
            help: { tip: "There's no wrong answer here. If something feels relevant but you're not sure where it fits, put it here." }
        }
    ]
};
