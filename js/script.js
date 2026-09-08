const cpf = document.querySelector("#cpf");
const telefone = document.querySelector("#telefone");
const cep = document.querySelector("#cep");
const formulario = document.querySelector("#cadastro-form");
const mensagemSucesso = document.querySelector("#mensagem-sucesso");

function somenteNumeros(valor) {
  return valor.replace(/\D/g, "");
}

if (cpf) {
  cpf.addEventListener("input", () => {
    let valor = somenteNumeros(cpf.value).slice(0, 11);

    valor = valor
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    cpf.value = valor;
  });
}

if (telefone) {
  telefone.addEventListener("input", () => {
    let valor = somenteNumeros(telefone.value).slice(0, 11);

    if (valor.length <= 10) {
      valor = valor
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      valor = valor
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }

    telefone.value = valor;
  });
}

if (cep) {
  cep.addEventListener("input", () => {
    let valor = somenteNumeros(cep.value).slice(0, 8);
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    cep.value = valor;
  });
}

if (formulario) {
  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    mensagemSucesso.hidden = false;
    formulario.reset();
  });
}
