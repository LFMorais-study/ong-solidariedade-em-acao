/* =========================================================
   PONTO DE ENTRADA DA APLICACAO
   ========================================================= */

import { initInterfaceEvents } from "./events.js";
import { showToast } from "./notifications.js";
import { initRouter } from "./routes.js";
import { restoreStoredForms } from "./storage.js";
import { renderDynamicTemplates } from "./templates.js";

function initApplication() {
    initInterfaceEvents();
    renderDynamicTemplates(document);

    if (document.body.dataset.spa === "true") {
        initRouter();
        return;
    }

    if (restoreStoredForms(document)) {
        showToast(
            "Rascunho recuperado",
            "Os dados que voce estava preenchendo foram restaurados.",
            "info"
        );
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApplication, { once: true });
} else {
    initApplication();
}
