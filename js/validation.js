/* =========================================================
   VALIDACAO E FEEDBACK DE FORMULARIOS
   ========================================================= */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function applyCustomRules(field) {
    field.setCustomValidity("");

    const value = String(field.value || "").trim();
    if (!value) return;

    if (field.type === "email" && !EMAIL_PATTERN.test(value)) {
        field.setCustomValidity("Informe um e-mail valido.");
        return;
    }

    if (field.type === "tel") {
        const digits = value.replace(/\D/g, "");
        if (digits.length < 10 || digits.length > 11) {
            field.setCustomValidity("Informe um telefone com 10 ou 11 digitos.");
        }
    }
}

function getValidationMessage(field) {
    const label = field.closest(".form-group")?.querySelector("label")?.textContent?.trim()
        || "Este campo";

    if (field.validity.valueMissing) {
        return `${label} e obrigatorio.`;
    }

    if (field.validity.tooShort) {
        return `${label} deve possuir pelo menos ${field.minLength} caracteres.`;
    }

    if (field.validity.typeMismatch || (field.type === "email" && !field.checkValidity())) {
        return "Informe um e-mail em formato valido.";
    }

    if (field.validity.patternMismatch) {
        return "O valor informado nao esta no formato esperado.";
    }

    if (field.validity.customError) {
        return field.validationMessage;
    }

    return "Campo preenchido corretamente.";
}

function getFeedbackElement(field) {
    const group = field.closest(".form-group");
    if (!group) return null;

    let feedback = group.querySelector(".field-feedback");

    if (!feedback) {
        feedback = document.createElement("span");
        feedback.className = "field-feedback";
        feedback.setAttribute("aria-live", "polite");
        group.appendChild(feedback);
    }

    if (!feedback.id && field.id) {
        feedback.id = `${field.id}-feedback`;
    }

    if (feedback.id) {
        const describedBy = new Set(
            (field.getAttribute("aria-describedby") || "")
                .split(/\s+/)
                .filter(Boolean)
        );

        describedBy.add(feedback.id);
        field.setAttribute("aria-describedby", [...describedBy].join(" "));
    }

    return feedback;
}

export function updateFieldState(field, force = false) {
    const group = field.closest(".form-group");
    if (!group) return true;

    applyCustomRules(field);

    const hasValue = field.type === "checkbox"
        ? field.checked
        : String(field.value).trim() !== "";

    group.classList.toggle("is-filled", hasValue);
    group.classList.remove("is-valid", "is-invalid");

    const feedback = getFeedbackElement(field);

    if (!force && !hasValue) {
        field.removeAttribute("aria-invalid");
        if (feedback) feedback.textContent = "";
        return field.checkValidity();
    }

    const isValid = field.checkValidity();
    group.classList.add(isValid ? "is-valid" : "is-invalid");
    field.setAttribute("aria-invalid", String(!isValid));

    if (feedback) {
        feedback.textContent = getValidationMessage(field);
    }

    return isValid;
}

export function validateForm(form) {
    const fields = [...form.querySelectorAll("input, select, textarea")];
    const invalidFields = fields.filter((field) => !updateFieldState(field, true));

    if (invalidFields.length > 0) {
        invalidFields[0].focus();
        return false;
    }

    return true;
}

export function clearFormState(form) {
    form.querySelectorAll("input, select, textarea").forEach((field) => {
        const group = field.closest(".form-group");
        group?.classList.remove("is-filled", "is-valid", "is-invalid");
        group?.querySelector(".field-feedback")?.replaceChildren();
        field.removeAttribute("aria-invalid");
        field.setCustomValidity("");
    });
}
