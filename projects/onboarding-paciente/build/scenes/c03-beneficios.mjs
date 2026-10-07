import { up, hold } from "../parts/ob.mjs";
import { illSvg, illIn, ILL_CSS } from "../parts/illus.mjs";

export default {
  id: "c03-beneficios",
  device: "iphone",
  title: "Seus benefícios",
  lines: ["Seus", "benefícios"],
  lead: "O que o seu plano da empresa já inclui para você.",
  tail: 0.6,
  states: [["home-tut", 0]],
  lib: [up, hold, illSvg, illIn],
  css: ILL_CSS + ".bn-ill{width:60px!important;height:60px!important;margin:-8px -8px 0 -8px;background:transparent!important;border-radius:0!important;overflow:visible!important}",
  captions: [
    { title: "Na primeira vez", body: "O app mostra **tudo o que seu plano oferece**." },
    { title: "Consulta grátis", body: "**2 consultas** com clínico geral, sem pagar nada." },
    { title: "Desconto em consultas", body: "**25% de desconto** em todas as especialidades." },
    { title: "IA à vontade", body: "Converse com a **assistente de saúde** quando quiser." },
    { title: "Sempre à mão", body: "Seus benefícios ficam em **Meu plano**, no Perfil." },
  ],
  frame: {
    title: "Seus benefícios",
    scene: "Folha real de benefícios que aparece no primeiro acesso, depois a tela Meu plano",
    poster: 9,
    motion: "chapter title cascade, phone rise, row highlights, sheet scroll, slide to Meu plano",
    body: "Passo 3 de 10. A folha “Você tem 5 benefícios ativos”: consulta grátis com clínico geral, 25% de desconto, chat com IA. Toque em Ver detalhes do plano abre Meu plano com a lista de uso.",
  },
  run: function (S) {
    var sheet = S.pick("home-tut", "Você tem 5 benefícios ativos", { sel: "*" });
    while (sheet.parentElement && !/Entendi/.test(sheet.textContent)) sheet = sheet.parentElement;
    function row(title, link) {
      var n = S.pick("home-tut", title, { within: sheet });
      while (n.parentElement && !new RegExp(link).test(n.textContent)) n = n.parentElement;
      return n;
    }
    var ills = [["Clínico Geral", "Agendar consulta", "consulta"], ["Desconto em consultas", "Agendar consulta", "desconto"], ["Chat com IA", "Abrir chat", "ia"], ["Análise de consulta com IA", "Abrir chat", "analise"]].map(function (r) {
      var n = row(r[0], r[1]);
      var nb = n.getBoundingClientRect();
      var host = n;
      var tile = null;
      while (!tile && host.parentElement) {
        host = host.parentElement;
        tile = S.all("div", host).filter(function (d) {
          var b = d.getBoundingClientRect();
          return b.width > 20 && Math.abs(b.width - b.height) < 4 && b.right <= nb.left + 2 && Math.abs(b.top - nb.top) < 30;
        })[0];
      }
      tile.className += " bn-ill";
      tile.innerHTML = illSvg(r[2]);
      return { svg: tile.querySelector("svg"), host: host };
    });
    S.boot("home-tut");
    S.introIn(0.05);
    S.introOut(2.0);
    S.cam(2.1, { x: 201, y: 437, zoom: 1.6 }, 0.01);
    S.add(function (tl) {
      ills.forEach(function (svg, i) {
        illIn(tl, svg.svg, 2.2 + i * 0.2);
      });
    });
    var t = 2.8;
    S.caption(t, 0);
    var rows = [[ills[0], 340, 1], [ills[1], 470, 2], [ills[2], 600, 3]];
    t += 1.6;
    rows.forEach(function (r) {
      S.cam(t, { x: 201, y: r[1], zoom: 1.95 }, 0.8);
      S.caption(t + 0.2, r[2]);
      S.mark(t + 0.5, r[0].host, { hold: 2.2, pad: 4, radius: 18 });
      (function (at, svg) {
        S.add(function (tl) {
          illIn(tl, svg, at, { again: true });
        });
      })(t + 0.6, r[0].svg);
      t += 2.9;
    });
    S.cam(t, { x: 201, y: 560, zoom: 1.7 }, 0.9);
    S.caption(t + 0.1, 4);
    var ok = S.pick("home-tut", "Entendi");
    S.cursorTo(t + 1.8, ok, 0.45);
    S.click(t + 2.3, ok, { press: true });
    hold(S, t + 2.9);
  },
};
