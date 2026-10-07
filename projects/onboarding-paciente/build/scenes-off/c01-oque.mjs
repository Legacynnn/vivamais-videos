const T = [2.4, 3.6, 4.8, 6.0];
const DUR = 1.2;
const CLIPS = ["consulta", "medicos", "docs", "familia"];

function withVideo(html, n) {
  let i = 0;
  return html.replace(/<img\b[^>]*data-vm-video[^>]*>/g, (tag) => {
    i += 1;
    if (i !== n) return tag;
    return `<video id="onb-v${n}" src="assets/onboard/${CLIPS[n - 1]}.mp4" muted playsinline data-start="${T[n - 1]}" data-duration="${DUR + 0.6}" data-track-index="2" style="flex:1 1 0%;width:100%;height:100%;object-fit:cover;display:block" data-layout-allow-overlap></video>`;
  });
}

export default {
  id: "c01-oque",
  device: "iphone",
  title: "O que é o Viva Mais",
  lines: ["O que é o", "Viva Mais"],
  lead: "Um app de saúde que sua empresa oferece para você.",
  tail: 0.4,
  hold: 0,
  states: [["onb-1", 0], ["onb-2", 0], ["onb-3", 0], ["onb-4", 0]],
  patch: (name, html) => (/^onb-\d$/.test(name) ? withVideo(html, Number(name.slice(4))) : html),
  captions: [
    { title: "Tudo num app só", body: "Consulta por vídeo, **médicos de verdade**, receitas válidas e sua família." },
  ],
  frame: {
    title: "O que é o Viva Mais",
    scene: "As quatro telas reais de apresentação do app, com os vídeos animados de cada uma",
    poster: 8,
    motion: "chapter title cascade, phone rise, pager slides between the four real onboarding scenes, looping app videos",
    body: "Passo 1 de 10. Título “O que é o Viva Mais”. O celular sobe com a apresentação real do app: médico no bolso, médicos reais, receitas e atestados válidos, família e empresa. Cada tela tem um balão grande explicando em uma frase.",
  },
  run: function (S) {
    S.boot("onb-1");
    S.introIn(0.05);
    S.introOut(1.6);
    S.cam(1.8, { x: 201, y: 437, zoom: 1.6 }, 0.01);
    var T = [2.4, 3.6, 4.8, 6.0];
    S.caption(T[0], 0);
    S.nav(T[1], "onb-2", { dur: 0.4 });
    S.nav(T[2], "onb-3", { dur: 0.4 });
    S.nav(T[3], "onb-4", { dur: 0.4 });
    var go = S.pick("onb-4", "Começar");
    S.cursorTo(T[3] + 0.7, go, 0.4);
    S.click(T[3] + 1.2, go, { press: true });
    S.add(function (tl) {
      tl.set({}, {}, T[3] + 1.7);
    });
  },
};
