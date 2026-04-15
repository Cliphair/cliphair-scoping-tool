/**
 * Validates a list of questions against the current answers.
 * Returns an object mapping question IDs to error messages.
 * Only validates visible (showIf-passing) required fields.
 */
export function validateQuestions(questions, answers) {
    const errors = {};

    for (const q of questions) {
        if (q.showIf && !q.showIf(answers)) continue;
        if (!q.required) continue;

        const value = answers[q.id];
        let isInvalid = false;

        if (q.type === 'multi-select') {
            isInvalid = !Array.isArray(value) || value.length === 0;
        } else if (q.type === 'matrix') {
            isInvalid = value === undefined || value === null || value === '';
        } else {
            isInvalid = !value || (typeof value === 'string' && value.trim() === '');
        }

        if (isInvalid) {
            errors[q.id] = 'This field is required';
        }
    }

    return errors;
}

/** Returns true if the errors object has no entries. */
export function isValid(errors) {
    return Object.keys(errors).length === 0;
}
