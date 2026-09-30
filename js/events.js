/* =========================================================
   EVENTOS E INTERACOES DA INTERFACE
   ========================================================= */

import { clearFormState, updateFieldState, validateForm } from "./validation.js";
import {
    clearFormDraft,
    registerSubmission,
    saveFormDraft,
    saveContrastMode,
    getContrastMode
} from "./storage.js";
import { showToast } from "./notifications.js";

let lastFocusedElement = null;
let initialized = false;

function getNavigationElements() {
    return {
        menuToggle: document.querySelector(".menu-toggle"),
        mainNav: document.querySelector(".main-nav"),
        dropdownToggle: document.querySelector(".dropdown-toggle"),
        dropdownMenu: document.querySelector(".dropdown-menu")
    };
}

export function closeNavigation() {
    const {
        menuToggle,
        mainNav,
        dropdownToggle,
        dropdownMenu
    } = getNavigationElements();

    mainNav?.classList.remove("active");
    menuToggle?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu de navegacao");

    dropdownMenu?.classList.remove("active");
    dropdownToggle?.setAttribute("aria-expanded", "false");
}

function openModal(modal) {
    if (!modal) return;

    lastFocusedElement = document.activeElement;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    modal.querySelector("button, a, input, select, textarea")?.focus();
}

function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocusedElement?.focus();
}

function bindStaticNavigationEvents() {
    const {
        menuToggle,
        mainNav,
        dropdownToggle,
        dropdownMenu
    } = getNavigationElements();

    menuToggle?.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.classList.toggle("active");
        mainNav?.classList.toggle("active");
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Abrir menu de navegacao" : "Fechar menu de navegacao"
        );
    });

    dropdownToggle?.addEventListener("click", () => {
        if (window.innerWidth > 768) return;

        const isOpen = dropdownToggle.getAttribute("aria-expanded") === "true";
        dropdownToggle.setAttribute("aria-expanded", String(!isOpen));
        dropdownMenu?.classList.toggle("active");
    });

    const contrastToggle = document.querySelector(
        "[data-contrast-toggle]"
    );

    contrastToggle?.addEventListener("click", () => {
        const enabled =
            document.documentElement.dataset.contrast !== "high";

        applyContrastMode(enabled);
        saveContrastMode(enabled);
    });
}

function bindDelegatedEvents() {
    document.addEventListener("click", (event) => {
        const modalOpenButton = event.target.closest("[data-modal-target]");
        if (modalOpenButton) {
            const target = modalOpenButton.getAttribute("data-modal-target");
            openModal(document.querySelector(target));
            return;
        }

        const modalCloseButton = event.target.closest("[data-modal-close]");
        if (modalCloseButton) {
            closeModal(modalCloseButton.closest(".modal"));
            return;
        }

        const modal = event.target.classList?.contains("modal")
            ? event.target
            : null;

        if (modal) closeModal(modal);
    });

    document.addEventListener("input", (event) => {
        const field = event.target.closest(
            "form[data-feedback-form] input, form[data-feedback-form] textarea"
        );

        if (!field) return;

        updateFieldState(field);
        const form = field.closest("form[data-storage-key]");
        if (form) saveFormDraft(form);
    });

    document.addEventListener("change", (event) => {
        const field = event.target.closest(
            "form[data-feedback-form] select, form[data-feedback-form] input"
        );

        if (!field) return;

        updateFieldState(field);
        const form = field.closest("form[data-storage-key]");
        if (form) saveFormDraft(form);
    });

    document.addEventListener("submit", (event) => {
        const form = event.target.closest("form[data-feedback-form]");
        if (!form) return;

        event.preventDefault();

        if (!validateForm(form)) {
            showToast(
                "Verifique os campos",
                "Corrija os campos destacados antes de enviar o formulario.",
                "danger"
            );
            return;
        }

        const successTitle = form.dataset.successTitle || "Dados enviados!";
        const successMessage = form.dataset.successMessage
            || "Recebemos suas informacoes com sucesso.";

        registerSubmission(form);
        clearFormDraft(form);
        showToast(successTitle, successMessage, "success");
        form.reset();
    });

    document.addEventListener("reset", (event) => {
        const form = event.target.closest("form[data-feedback-form]");
        if (!form) return;

        clearFormDraft(form);
        setTimeout(() => clearFormState(form), 0);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;

        closeNavigation();
        const openModalElement = document.querySelector(".modal.show");
        if (openModalElement) closeModal(openModalElement);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) closeNavigation();
    });
}

function applyContrastMode(enabled) {
    const button = document.querySelector(
        "[data-contrast-toggle]"
    );

    if (enabled) {
        document.documentElement.setAttribute(
            "data-contrast",
            "high"
        );
    } else {
        document.documentElement.removeAttribute(
            "data-contrast"
        );
    }

    if (button) {
        button.setAttribute(
            "aria-pressed",
            String(enabled)
        );

        button.setAttribute(
            "aria-label",
            enabled
                ? "Desativar modo de alto contraste"
                : "Ativar modo de alto contraste"
        );

        button.textContent = enabled
            ? "Contraste padrão"
            : "Alto contraste";
    }
}

export function initInterfaceEvents() {
    if (initialized) return;
    initialized = true;
    applyContrastMode(getContrastMode());
    bindStaticNavigationEvents();
    bindDelegatedEvents();
}
