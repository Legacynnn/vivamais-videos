(() => {
  const P = window.PROPOSTA;
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: Number.isInteger(v) ? 0 : 2 });
  const num = (n) => n.toLocaleString("pt-BR");
  const pad = (n) => String(n).padStart(2, "0");

  const D = P.demo;
  const modelo = !P.vidas && new URLSearchParams(location.search).has("modelo");
  const ate = P.enviada && new Date(`${P.enviada}T12:00:00Z`);
  if (ate) ate.setUTCDate(ate.getUTCDate() + P.validade);

  const values = {
    empresa: P.empresa,
    vidas: P.vidas ? num(P.vidas) : "[000]",
    validade: ate ? ate.toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "[dd/mm/aaaa]",
    dias: String(P.validade),
    demoEmpresa: D.empresa,
    demoVidas: num(D.vidas),
    sigla: D.sigla,
  };
  document.querySelectorAll("[data-p]").forEach((el) => {
    el.textContent = values[el.dataset.p];
  });
  let shared = 0;
  const grupos = P.grupos.map((g, i) => {
    const n = i < P.grupos.length - 1 ? Math.round(D.vidas * g.parte) : D.vidas - shared;
    shared += n;
    return { ...g, n, preco: P.planos.find((p) => p.nome === g.plano).preco };
  });
  const mensal = grupos.reduce((t, g) => t + g.n * g.preco, 0);
  document.querySelector("#dash").innerHTML = `
    <div class="row"><span>Plano empresarial</span><em><i data-icon="check" data-sw="3"></i>Ativo</em></div>
    <p class="big"><b>${num(D.vidas)}</b> vidas</p>
    <p class="sum">${grupos.length} grupos · ${brl(mensal)}/mês</p>
    <div class="mix">${grupos.map((g, i) => `<i class="m${i + 1}" style="flex: ${g.n}"></i>`).join("")}</div>`;
  document.querySelector("#grupos").innerHTML = grupos
    .map((g, i) => `<li><span class="pi m${i + 1}"><img src="${g.icone}" alt="" /></span><div><b>${g.plano}</b><small>${g.setor}</small></div><p><b>${num(g.n)} vidas</b><small>${brl(g.preco)}/vida</small></p></li>`)
    .join("");
  document.querySelectorAll("[data-more]").forEach((el) => {
    el.textContent = num(D.vidas - 4);
  });
  document.querySelectorAll("[data-href]").forEach((el) => {
    el.href = P[el.dataset.href];
  });

  const check = '<i data-icon="check" data-sw="3"></i>';
  const badge = (s, v) => {
    if (v === true) return `<em class="ok">${check}</em>`;
    if (v === "ilimitado") return '<em class="inf">∞</em>';
    if (s.tipo === "desc") return `<em>${v.pct}%</em>`;
    if (s.tipo === "dia") return `<em>${v}/dia</em>`;
    return `<em>${v}×</em>`;
  };
  const cell = (s, v) => {
    if (!v) return '<span class="off">—</span>';
    if (v === true) return `<span class="ok">${check}</span>`;
    if (v === "ilimitado") return "Ilimitado";
    if (s.tipo === "desc") return `${v.n}× ${v.pct}%`;
    if (s.tipo === "dia") return `${v}/dia`;
    return `${v}×`;
  };

  document.querySelector("#planos").innerHTML = P.planos
    .map((p) => {
      const got = P.servicos.filter((s) => p.inclui[s.id]);
      const rows = got
        .map((s) => `<li><span class="ic"><img src="${s.icone}" alt="" /></span><div><b>${s.curto || s.nome}</b>${s.sub ? `<span>${s.sub}</span>` : ""}</div>${badge(s, p.inclui[s.id])}</li>`)
        .join("");
      return `<div class="pcard${p.destaque ? " best" : ""}">
        ${p.destaque ? `<span class="badge">${p.destaque}</span>` : ""}
        <p class="kicker">${p.tag}</p>
        <h3>${p.nome}</h3>
        <div class="price">
          <p><b>${brl(p.preco)}</b><span>/vida/mês</span></p>
          ${P.vidas ? `<small>${brl(p.preco * P.vidas)}/mês <i>·</i> ${num(P.vidas)} vidas</small>` : modelo ? "<small>R$ [0.000]/mês <i>·</i> [000] vidas</small>" : ""}
        </div>
        <ul>${rows}</ul>
      </div>`;
    })
    .join("");

  const best = (p) => (p.destaque ? ' class="b"' : "");
  const cells = (fn) => P.planos.map((p) => `<td${best(p)}>${fn(p)}</td>`).join("");
  document.querySelector("#comparativo").innerHTML = `
    <thead><tr>
      <th></th>
      ${P.planos.map((p) => `<th${best(p)}>${p.destaque ? `<span class="tag">${p.destaque}</span>` : ""}<small>${p.tag}</small>${p.nome}</th>`).join("")}
    </tr></thead>
    <tbody>
      ${P.servicos
        .map((s) => `<tr><td class="lbl"><img src="${s.icone}" alt="" />${s.nome}</td>${cells((p) => cell(s, p.inclui[s.id]))}</tr>`)
        .join("")}
      ${P.gratis
        .map((g) => `<tr class="free"><td class="lbl"><img src="${g.icone}" alt="" />${g.texto}<span class="gt">Grátis</span></td>${cells(() => `<span class="ok">${check}</span>`)}</tr>`)
        .join("")}
      <tr class="vida"><td class="lbl">Valor por vida/mês</td>${cells((p) => brl(p.preco))}</tr>
      ${P.vidas ? `<tr class="mrr"><td class="lbl">Total mensal · ${num(P.vidas)} vidas</td>${cells((p) => brl(p.preco * P.vidas))}</tr>` : modelo ? `<tr class="mrr"><td class="lbl">Total mensal · [000] vidas</td>${cells(() => "R$ [0.000]")}</tr>` : ""}
    </tbody>`;

  document.querySelector("#meta").innerHTML = P.vidas ? `<b>${num(P.vidas)}</b> vidas · quantidades e valores por vida` : "Quantidades e valores por vida/mês";

  document.querySelector("#gratis").innerHTML =
    '<span class="lbl"><i data-icon="gift"></i>Grátis em todos os planos</span>' +
    P.gratis.map((g) => `<span><img src="${g.icone}" alt="" />${g.texto}</span>`).join("");
})();
