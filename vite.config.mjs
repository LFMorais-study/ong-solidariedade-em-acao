import { defineConfig } from "vite";

export default defineConfig({
    base: "/ong-solidariedade-em-acao/",
    appType: "mpa",

    input: {
        raiz: "./index.html",
        inicio: "./html/index.html",
        projetos: "./html/projetos.html",
        voluntariado: "./html/voluntariado.html",
        contato: "./html/contato.html",
        doacoes: "./html/doacoes.html"
    },

    build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: false
    }
});