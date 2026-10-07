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
    { id: "pa", nome: "PA 24/7", tipo: "mes", icone: "assets/icons/tempo-rapido.png" },
    { id: "esp", nome: "Especialidade médica", tipo: "mes", icone: "assets/icons/cardio.png" },
  ],
  gratis: [
    { icone: "assets/icons/ia.png", texto: "Ferramentas de IA" },
    { icone: "assets/icons/estetoscopio.png", texto: "Qualquer consulta por R$99 ou menos" },
    { icone: "assets/icons/farmacia.png", texto: "Farmácias com até 40% OFF" },
  ],
  grupos: [
    { plano: "Mente e Corpo", setor: "Operação e fábrica", parte: 0.5, icone: "assets/icons/nutrologista.png" },
    { plano: "Telepsicologia", setor: "Administrativo", parte: 0.3, icone: "assets/icons/psicologia.png" },
    { plano: "Médico 24/7", setor: "Lojas e vendas", icone: "assets/icons/medico.png" },
  ],
  planos: [
    { nome: "Médico 24/7", tag: "Cuidado essencial", inclui: { cg: 2 }, preco: 25 },
    { nome: "Completo", tag: "Cuidado corporativo", inclui: { psico: 1, pa: true, esp: 1, nutri: 1 }, preco: 35.9 },
    { nome: "Telepsicologia", tag: "Saúde emocional", inclui: { psico: 2, cg: 2 }, preco: 49 },
    { nome: "Mente e Corpo", tag: "Cuidado completo", inclui: { nutri: 2, psico: 2, cg: 2 }, preco: 59, destaque: "Recomendado" },
    { nome: "Saúde Integral", tag: "Cuidado corporativo", inclui: { cg: 1, nutri: 2, psico: 1 }, preco: 70 },
  ],
};
