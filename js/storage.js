/* =========================================================
   PERSISTENCIA LOCAL COM localStorage
   ========================================================= */

const STORAGE_KEYS = {
    drafts: "ong-solidariedade:drafts",
    submissions: "ong-solidariedade:submissions",
    lastRoute: "ong-solidariedade:last-route"
};

function readJSON(key, fallback) {
    try {
        const rawValue = localStorage.getItem(key);
        return rawValue ? JSON.parse(rawValue) : fallback;
    } catch (error) {
        console.warn(`Nao foi possivel ler ${key} do localStorage.`, error);
        return fallback;
    }
}

function writeJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`Nao foi possivel gravar ${key} no localStorage.`, error);
        return false;
    }
}

function getFormKey(form) {
    return form?.dataset.storageKey || form?.id || null;
}

function serializeForm(form) {
    const data = {};

    new FormData(form).forEach((value, key) => {
        data[key] = String(value);
    });

    return data;
}

export function saveFormDraft(form) {
    const formKey = getFormKey(form);
    if (!formKey) return;

    const drafts = readJSON(STORAGE_KEYS.drafts, {});
    drafts[formKey] = {
        updatedAt: new Date().toISOString(),
        data: serializeForm(form)
    };

    writeJSON(STORAGE_KEYS.drafts, drafts);
}

function restoreFormDraft(form) {
    const formKey = getFormKey(form);
    if (!formKey) return false;

    const drafts = readJSON(STORAGE_KEYS.drafts, {});
    const draft = drafts[formKey];
    if (!draft?.data) return false;

    Object.entries(draft.data).forEach(([name, value]) => {
        const field = form.elements.namedItem(name);
        if (!field || field.type === "file") return;

        if (field.type === "checkbox" || field.type === "radio") {
            field.checked = field.value === value;
        } else {
            field.value = value;
        }
    });

    return true;
}

export function restoreStoredForms(root = document) {
    let restored = false;

    root.querySelectorAll("form[data-storage-key]").forEach((form) => {
        restored = restoreFormDraft(form) || restored;
    });

    return restored;
}

export function clearFormDraft(form) {
    const formKey = getFormKey(form);
    if (!formKey) return;

    const drafts = readJSON(STORAGE_KEYS.drafts, {});
    delete drafts[formKey];
    writeJSON(STORAGE_KEYS.drafts, drafts);
}

export function registerSubmission(form) {
    const formKey = getFormKey(form);
    if (!formKey) return;

    const history = readJSON(STORAGE_KEYS.submissions, []);
    history.unshift({
        form: formKey,
        submittedAt: new Date().toISOString()
    });

    writeJSON(STORAGE_KEYS.submissions, history.slice(0, 10));
}

export function saveLastRoute(hash) {
    try {
        localStorage.setItem(STORAGE_KEYS.lastRoute, hash || "#inicio");
    } catch (error) {
        console.warn("Nao foi possivel salvar a ultima rota.", error);
    }
}

export function getLastRoute() {
    try {
        return localStorage.getItem(STORAGE_KEYS.lastRoute) || "#inicio";
    } catch (error) {
        console.warn("Nao foi possivel recuperar a ultima rota.", error);
        return "#inicio";
    }
}
