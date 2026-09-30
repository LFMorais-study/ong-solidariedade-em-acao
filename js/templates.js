/* =========================================================
   TEMPLATES DINAMICOS DA APLICACAO
   ========================================================= */

const projects = [
    {
        id: "educacao",
        image: new URL(
            "../images/educacao.svg",
            import.meta.url
        ).href,
        imageAlt: "Ilustracao representando educacao",
        category: "Educacao",
        categoryClass: "badge-primary",
        status: "Ativo",
        statusClass: "badge-success",
        title: "Educacao para Todos",
        homeDescription:
            "Apoio escolar, oficinas e atividades educativas para criancas e adolescentes.",
        fullDescription:
            "Reforco escolar, oficinas de leitura e inclusao digital para criancas e adolescentes."
    },
    {
        id: "alimentacao",
        image: new URL(
            "../images/alimentacao.svg",
            import.meta.url
        ).href,
        imageAlt: "Ilustracao representando apoio alimentar",
        category: "Alimentacao",
        categoryClass: "badge-secondary",
        status: "Vagas limitadas",
        statusClass: "badge-warning",
        title: "Mesa Solidaria",
        homeDescription:
            "Arrecadacao e distribuicao de alimentos para familias em situacao de vulnerabilidade.",
        fullDescription:
            "Campanhas de arrecadacao, montagem de cestas e acoes de conscientizacao sobre desperdicio de alimentos."
    },
    {
        id: "meio-ambiente",
        image: new URL(
            "../images/meio-ambiente.svg",
            import.meta.url
        ).href,
        imageAlt: "Ilustracao representando meio ambiente",
        category: "Meio ambiente",
        categoryClass: "badge-primary",
        status: "Ativo",
        statusClass: "badge-success",
        title: "Verde no Bairro",
        homeDescription:
            "Mutiroes, educacao ambiental e plantio de arvores em areas comunitarias.",
        fullDescription:
            "Mutiroes de limpeza, plantio de arvores e educacao ambiental em espacos publicos."
    }
];

const impactStats = [
    { value: "1.280+", label: "Pessoas atendidas" },
    { value: "18", label: "Projetos realizados" },
    { value: "240+", label: "Voluntarios cadastrados" },
    { value: "12", label: "Parceiros locais" }
];

function projectCardTemplate(project, variant) {
    const isHome = variant === "home";
    const description = isHome
        ? project.homeDescription
        : project.fullDescription;
    const href = isHome
        ? `#projetos/${project.id}`
        : "#voluntariado";
    const actionLabel = isHome ? "Conhecer projeto" : "Participar";

    return `
        <article class="project-card card-item" id="${project.id}">
            <img
                src="${project.image}"
                alt="${project.imageAlt}"
                width="800"
                height="520"
                loading="lazy"
                decoding="async"
            >
            <div class="card-body">
                <div class="badge-row">
                    <span class="badge ${project.categoryClass}">${project.category}</span>
                    <span class="badge ${project.statusClass}">${project.status}</span>
                </div>
                <h3>${project.title}</h3>
                <p>${description}</p>
                <a href="${href}" class="btn btn-primary">${actionLabel}</a>
            </div>
        </article>
    `;
}

function statTemplate(stat) {
    return `
        <div class="stat-item">
            <span class="stat-value">${stat.value}</span>
            <span>${stat.label}</span>
        </div>
    `;
}

function renderProjectLists(root) {
    root.querySelectorAll('[data-template="project-list"]').forEach((container) => {
        const variant = container.dataset.variant || "full";

        container.innerHTML = projects
            .map((project) => projectCardTemplate(project, variant))
            .join("");
    });
}

function renderStats(root) {
    root.querySelectorAll('[data-template="stats-list"]').forEach((container) => {
        container.innerHTML = impactStats
            .map((stat) => statTemplate(stat))
            .join("");
    });
}

export function renderDynamicTemplates(root = document) {
    renderProjectLists(root);
    renderStats(root);
}
