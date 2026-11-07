window.PROPOSTA = {
  empresa: "[Nome da empresa]",
  vidas: null,
  enviada: null,
  demo: { empresa: "Sua empresa", sigla: "SE", vidas: 150 },
  validade: 7,
  site: "https://vivamais.ai",
  termos: "https://vivamais.ai/termos",
  servicos: [
    { id: "cg", nome: "Clínico geral", tipo: "mes", un: ["consulta", "consultas"], icone: "assets/icons/medico.png" },
    { id: "psico", nome: "Psicologia", tipo: "mes", un: ["sessão", "sessões"], icone: "assets/icons/psicologia.png" },
    { id: "nutri", nome: "Nutrição", tipo: "mes", un: ["consulta", "consultas"], icone: "assets/icons/nutrologista.png" },
    { id: "esp", nome: "Especialidade médica", curto: "Especialista", tipo: "mes", un: ["consulta", "consultas"], icone: "assets/icons/cardio.png" },
  ],
  gratis: [
    { icone: "assets/icons/ia.png", texto: "Ferramentas de IA" },
    { icone: "assets/icons/estetoscopio.png", texto: "Qualquer consulta por R$99 ou menos" },
    { icone: "assets/icons/farmacia.png", texto: "Farmácias com até 40% OFF" },
  ],
  grupos: [
    { plano: "Mente e Corpo", setor: "Operação e fábrica", parte: 0.5, icone: "assets/icons/nutrologista.png" },
    { plano: "Saúde Mental", setor: "Administrativo", parte: 0.3, icone: "assets/icons/psicologia.png" },
    { plano: "Médico", setor: "Lojas e vendas", icone: "assets/icons/medico.png" },
  ],
  planos: [
    { nome: "Médico", tag: "Cuidado essencial", inclui: { cg: "ilimitado" }, preco: 25 },
    { nome: "Saúde Mental", tag: "Saúde emocional", inclui: { psico: 2 }, preco: 35.9 },
    { nome: "Saúde Integral", tag: "Cuidado integral", inclui: { cg: "ilimitado", psico: 2 }, preco: 49 },
    { nome: "Mente e Corpo", tag: "Corpo e mente", inclui: { cg: "ilimitado", psico: 4, nutri: 1 }, preco: 59 },
    { nome: "Completo", tag: "Cuidado total", inclui: { cg: "ilimitado", psico: 4, nutri: 1, esp: 1 }, preco: 70, destaque: "Recomendado" },
  ],
};
