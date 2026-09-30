/* =========================================================
   NOTIFICACOES DA APLICACAO
   ========================================================= */

export function showToast(title, message, type = "success") {
    const swalIconMap = {
        success: "success",
        danger: "error",
        info: "info",
        warning: "warning"
    };

    if (window.Swal?.fire) {
        window.Swal.fire({
            toast: true,
            position: "top-end",
            icon: swalIconMap[type] || "info",
            title,
            text: message,
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true
        });
        return;
    }

    const container = document.querySelector("#toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icons = {
        success: "✓",
        danger: "✕",
        info: "ℹ",
        warning: "⚠"
    };

    toast.innerHTML = `
        <span class="toast-icon" aria-hidden="true">${icons[type] || "ℹ"}</span>
        <div class="toast-content">
            <strong class="toast-title">${title}</strong>
            <p class="toast-message">${message}</p>
        </div>
        <button type="button" class="toast-close" aria-label="Fechar notificacao">×</button>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));

    let removed = false;

    const closeToast = () => {
        if (removed) return;
        removed = true;
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector(".toast-close")?.addEventListener("click", closeToast);
    setTimeout(closeToast, 5000);
}
