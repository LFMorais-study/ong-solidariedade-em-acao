/* =========================================================
   ROTEAMENTO DA SINGLE PAGE APPLICATION (SPA)
   ========================================================= */

import { renderDynamicTemplates } from "./templates.js";
import {
    getLastRoute,
    restoreStoredForms,
    saveLastRoute
} from "./storage.js";
import { showToast } from "./notifications.js";
import { closeNavigation } from "./events.js";

const routes = {
    inicio: {
        source: null,
        title: "ONG Solidariedade em Acao | Inicio"
    },
    projetos: {
        source: "projetos.html",
        title: "ONG Solidariedade em Acao | Projetos"
    },
    voluntariado: {
        source: "voluntariado.html",
        title: "ONG Solidariedade em Acao | Voluntariado"
    },
    contato: {
        source: "contato.html",
        title: "ONG Solidariedade em Acao | Contato"
    },
    doacoes: {
        source: "doacoes.html",
        title: "ONG Solidariedade em Acao | Quero ajudar"
    }
};

let initialized = false;
let renderRequest = 0;
let homeContent = "";
let contentContainer = null;

function getCurrentRoute() {
    const rawHash = window.location.hash.replace(/^#/, "");
    const [page = "inicio", section = ""] = rawHash.split("/");

    if (!routes[page]) {
        return { page: "inicio", section: "" };
    }

    return { page, section };
}

function routeFromStaticHref(href) {
    if (!href) return null;

    const normalized = href.replace(/^\.\//, "");
    const routeMap = {
        "index.html": "#inicio",
        "projetos.html": "#projetos",
        "projetos.html#educacao": "#projetos/educacao",
        "projetos.html#alimentacao": "#projetos/alimentacao",
        "projetos.html#meio-ambiente": "#projetos/meio-ambiente",
        "voluntariado.html": "#voluntariado",
        "contato.html": "#contato",
        "doacoes.html": "#doacoes"
    };

    return routeMap[normalized] || null;
}

async function getPageContent(route) {
    if (route.source === null) return homeContent;

    const response = await fetch(route.source, { cache: "no-cache" });
    if (!response.ok) {
        throw new Error(`Nao foi possivel carregar ${route.source}.`);
    }

    const html = await response.text();
    const parsedDocument = new DOMParser().parseFromString(html, "text/html");
    const sourceMain = parsedDocument.querySelector("#conteudo");

    if (!sourceMain) {
        throw new Error(`A pagina ${route.source} nao possui #conteudo.`);
    }

    return sourceMain.innerHTML;
}

function updateActiveNavigation(page) {
    document.querySelectorAll(".main-nav a[aria-current='page']").forEach((link) => {
        link.removeAttribute("aria-current");
    });

    const activeSelectors = {
        inicio: 'a[href="#inicio"]',
        voluntariado: 'a[href="#voluntariado"]',
        contato: 'a[href="#contato"]',
        doacoes: 'a[href="#doacoes"]'
    };

    const selector = activeSelectors[page];
    if (selector) {
        document.querySelector(`.main-nav ${selector}`)?.setAttribute(
            "aria-current",
            "page"
        );
    }
}

function focusRenderedContent(section) {
    requestAnimationFrame(() => {
        if (section) {
            const target = document.getElementById(section);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
        contentContainer?.focus({ preventScroll: true });
    });
}

async function renderRoute() {
    const requestId = ++renderRequest;
    const { page, section } = getCurrentRoute();
    const route = routes[page];

    contentContainer.setAttribute("aria-busy", "true");
    contentContainer.innerHTML = `
        <section class="page-section">
            <div class="container">
                <p role="status">Carregando conteudo...</p>
            </div>
        </section>
    `;

    try {
        const html = await getPageContent(route);
        if (requestId !== renderRequest) return;

        contentContainer.innerHTML = html;
        renderDynamicTemplates(contentContainer);

        if (restoreStoredForms(contentContainer)) {
            showToast(
                "Rascunho recuperado",
                "Os dados que voce estava preenchendo foram restaurados.",
                "info"
            );
        }

        saveLastRoute(window.location.hash);
        document.title = route.title;
        updateActiveNavigation(page);
        closeNavigation();
        focusRenderedContent(section);
    } catch (error) {
        console.error(error);
        contentContainer.innerHTML = `
            <section class="page-section">
                <div class="container">
                    <div class="alert alert-warning" role="alert">
                        <div class="alert-content">
                            <strong class="alert-title">Conteudo indisponivel</strong>
                            <p>Ocorreu um erro ao carregar esta area. Tente novamente.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    } finally {
        if (requestId === renderRequest) {
            contentContainer.setAttribute("aria-busy", "false");
        }
    }
}

function handleSpaLink(event) {
    if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
    ) {
        return;
    }

    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const spaHash = routeFromStaticHref(link.getAttribute("href"));
    if (!spaHash) return;

    event.preventDefault();

    if (window.location.hash === spaHash) {
        renderRoute();
    } else {
        window.location.hash = spaHash;
    }
}

export function initRouter() {
    if (initialized) return;

    contentContainer = document.querySelector("#conteudo");
    if (!contentContainer) return;

    initialized = true;
    homeContent = contentContainer.innerHTML;

    document.addEventListener("click", handleSpaLink);
    window.addEventListener("hashchange", renderRoute);

    if (!window.location.hash) {
        window.history.replaceState(null, "", getLastRoute());
    }

    renderRoute();
}
