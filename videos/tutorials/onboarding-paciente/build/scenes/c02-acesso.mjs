import { up, inputs, hold, typeIn } from "../../../../kit/parts/ob.mjs";
import { WIN_HTML, WIN_CSS, winCode, winParty } from "../../../../kit/parts/win.mjs";
import { illSvg, illIn, ILL_CSS } from "../../../../kit/parts/illus.mjs";
import { FX_HTML, FX_CSS, fichaFlow } from "../../../../kit/parts/fx.mjs";

export default {
  id: "c02-acesso",
  device: "iphone",
  title: "Criar sua conta",
  lines: ["Criar sua", "conta"],
  lead: "Cadastro e ficha de saúde em poucos minutos. Tenha seu CPF em mãos.",
  tail: 0.6,
  states: [["type", 0], ["su1-filled", 0], ["su2-filled", 0], ["su3-filled", 0], ["su4-filled", 0]],
  layers: { win: WIN_HTML, fx: FX_HTML },
  css: WIN_CSS + ILL_CSS + FX_CSS,
  lib: [up, inputs, hold, typeIn, winCode, winParty, illSvg, illIn, fichaFlow],
  captions: [
    { title: "Escolha “Paciente”", body: "É a opção para quem vai **se consultar**." },
    { title: "Seus dados", body: "Nome, CPF, celular, e-mail e senha. **Uma coisa por tela.**" },
    { title: "Confirme seu e-mail", body: "Digite o **código de 8 números** que chegou no e-mail." },
    { title: "Conta criada!", body: "Seu plano da empresa **já está ativo**." },
    { title: "Sua ficha de saúde", body: "Logo depois do cadastro, o app pede **4 respostas rápidas**." },
    { title: "Sem pressa", body: "Pode tocar em **Preencher depois**. A ficha fica guardada no seu Perfil." },
    { title: "Seu peso", body: "Arraste a régua até o **seu peso**." },
    { title: "Sua altura", body: "Agora a altura. O app **calcula o IMC** sozinho." },
    { title: "Remédios", body: "Toma remédio **todo dia**? Toque em **Sim** e escreva qual." },
    { title: "Condições", body: "Toque em tudo o que **você tem**. Pode marcar várias." },
    { title: "Exames", body: "Tem exames? Anexe. **Se não tiver, pode seguir.**" },
    { title: "Ficha pronta!", body: "O médico vê sua ficha **antes da consulta**." },
  ],
  frame: {
    title: "Criar sua conta",
    scene: "Cadastro real do paciente: tipo de conta, quatro etapas, código no e-mail e conta ativa",
    poster: 20,
    motion: "chapter title cascade, phone rise, slide navigation between real signup steps, live typing, bottom sheet, confetti",
    body: "Passo 2 de 10. Quem é você → Paciente. Boas-vindas: nome digitado, gênero no seletor. Seus dados: CPF e nascimento. Contato: celular e e-mail. Acesso: senha. Confirme seu e-mail com o código de 8 números. Tudo pronto com confete.",
  },
  run: function (S) {
    S.boot("type");
    S.introIn(0.05);
    S.introOut(1.9);
    S.cam(2.0, { x: 201, y: 437, zoom: 1.6 }, 0.01);
    var t = 2.5;
    var pac = up(S.pick("type", "Paciente"), 70, function (n) { return n.getBoundingClientRect().width > 300; });
    S.caption(t, 0);
    S.mark(t + 0.3, pac, { hold: 1.1, pad: 4, radius: 22 });
    S.cursorTo(t + 1.2, pac, 0.4);
    S.click(t + 1.65, pac, { press: true });
    t = S.nav(t + 1.8, "su1-filled", { dur: 0.45 });
    S.caption(t - 0.2, 1);
    var seq = [["su1-filled", "Continuar", "su2-filled"], ["su2-filled", "Continuar", "su3-filled"], ["su3-filled", "Continuar", "su4-filled"]];
    seq.forEach(function (x) {
      var b = S.pick(x[0], x[1]);
      S.cursorTo(t + 0.5, b, 0.35);
      S.click(t + 0.9, b, { press: true });
      t = S.nav(t + 1.05, x[2], { dur: 0.45 });
    });
    var c4 = S.pick("su4-filled", "Criar conta");
    S.cursorTo(t + 0.6, c4, 0.35);
    S.click(t + 1.0, c4, { press: true });
    t = t - 0.3;
    var code = winCode(S, t + 1.4);
    S.cam(t + 1.4, { x: 201, y: 400, zoom: 1.9 }, 0.8);
    S.caption(t + 1.4, 2);
    S.mark(code.done - 1.4, code.boxes, { hold: 1.4, pad: 6, radius: 16 });
    t = code.done + 1.5;
    var party = winParty(S, t);
    S.cam(t, { x: 201, y: 437, zoom: 1.6 }, 0.8);
    S.confetti(t + 0.8, S.rect(party.badge), { count: 90, seed: 3, power: 1.0 });
    S.confetti(t + 1.1, S.rect(party.badge), { count: 50, seed: 8, power: 0.8 });
    S.caption(t + 0.3, 3);
    t = party.end + 0.2;
    S.cursorTo(t, party.cta, 0.45);
    S.click(t + 0.5, party.cta, { press: true });
    t = fichaFlow(S, t + 0.55, 4);
    hold(S, t + 0.6);
  },
};
