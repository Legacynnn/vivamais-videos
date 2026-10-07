import { open, go, tap, snapshot, shot, sleep, mock } from "./lib.mjs";

const only = process.argv.slice(2);
const want = (name) => only.length === 0 || only.includes(name);

async function session(o) {
  const s = await open(o);
  s.page.on("console", (m) => {
    if (m.type() === "error") process.stderr.write(`console: ${m.text().slice(0, 200)}\n`);
  });
  return s;
}

async function field(page, i, text) {
  const h = await page.evaluateHandle((i) => [...document.querySelectorAll("input,textarea")].filter((e) => e.getBoundingClientRect().width > 0)[i], i);
  const box = await h.boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await sleep(300);
  await page.keyboard.type(text, { delay: 25 });
  await sleep(500);
}

const blur = (page) => page.evaluate(() => document.activeElement && document.activeElement.blur());

if (want("onboard")) {
  await mock("reset");
  const { browser, page } = await session({ auth: false });
  await go(page, "/onboard", { wait: 3500 });
  await snapshot(page, "onb-1");
  for (const n of [2, 3, 4]) {
    await sleep(n === 4 ? 7600 : 9800);
    await snapshot(page, `onb-${n}`);
  }
  await sleep(7600);
  await snapshot(page, "onb-end");
  await browser.close();
}

if (want("signup")) {
  await mock("reset");
  const { browser, page } = await session({ auth: false });
  await go(page, "/account-type", { wait: 2500 });
  await snapshot(page, "type");
  await tap(page, "Paciente", { exact: true, wait: 2500 });
  await snapshot(page, "su1");
  await field(page, 0, "Maria Oliveira");
  await blur(page);
  await tap(page, "Gênero", { exact: true, wait: 1200 });
  await snapshot(page, "su1-sheet");
  await tap(page, "Feminino", { exact: true, wait: 1200 });
  await snapshot(page, "su1-filled");
  await tap(page, "Continuar", { exact: true, wait: 1800 });
  await snapshot(page, "su2");
  await field(page, 0, "52998224725");
  await field(page, 1, "14031961");
  await blur(page);
  await sleep(600);
  await snapshot(page, "su2-filled");
  await tap(page, "Continuar", { exact: true, wait: 1800 });
  await snapshot(page, "su3");
  await field(page, 0, "11987654321");
  await field(page, 1, "maria.oliveira@email.com");
  await blur(page);
  await sleep(600);
  await snapshot(page, "su3-filled");
  await tap(page, "Continuar", { exact: true, wait: 1800 });
  await snapshot(page, "su4");
  await field(page, 0, "Viva2026!");
  await field(page, 1, "Viva2026!");
  await blur(page);
  await sleep(600);
  await snapshot(page, "su4-filled");
  await tap(page, "Criar conta", { exact: true, wait: 4000 });
  await snapshot(page, "confirm");
  await page.keyboard.type("4829137", { delay: 60 });
  await sleep(800);
  await snapshot(page, "confirm-filled");
  await page.keyboard.type("5");
  await sleep(300);
  if (page.url().includes("confirm-email")) await tap(page, "Confirmar", { exact: true, wait: 700 }).catch(() => {});
  await snapshot(page, "setup-1");
  await sleep(2500);
  await snapshot(page, "setup-2");
  await browser.close();
}

if (want("home")) {
  await mock("reset");
  const { browser, page } = await session({ seen: false });
  await go(page, "/", { wait: 9000 });
  await snapshot(page, "home-tut");
  await tap(page, "Entendi", { exact: true, wait: 2500 });
  await snapshot(page, "home");
  await browser.close();
}

if (want("agendar")) {
  await mock("reset");
  const { browser, page } = await session();
  await go(page, "/", { wait: 6000 });
  await tap(page, "Buscar médico ou especialidade", { wait: 3500 });
  await blur(page);
  await snapshot(page, "bk-search");
  await field(page, 0, "Cardiologia");
  await sleep(2500);
  await blur(page);
  await sleep(500);
  await snapshot(page, "bk-results");
  await tap(page, "Rafael Lima", { exact: true, wait: 5000 });
  await snapshot(page, "bk-doctor");
  await tap(page, "8", { exact: true, wait: 2000 });
  await snapshot(page, "bk-day");
  await page.mouse.move(200, 520);
  await page.mouse.wheel({ deltaY: 260 });
  await sleep(1500);
  await snapshot(page, "bk-day-s");
  await tap(page, "09:00", { exact: true, wait: 1200 });
  await snapshot(page, "bk-slot");
  await tap(page, "Agendar", { wait: 3500 });
  await snapshot(page, "bk-checkout");
  await tap(page, "Pix", { exact: true, wait: 3000 });
  await snapshot(page, "bk-pagar");
  await tap(page, "Gerar Pix", { exact: true, wait: 3500 });
  await snapshot(page, "bk-pix");
  await mock("set", { paid: true });
  await sleep(9000);
  await snapshot(page, "bk-ok");
  await browser.close();
}

async function book(page, doctor = "p-rafael", day = "8", time = "09:00") {
  await go(page, `/doctor/${doctor}`, { wait: 6000 });
  await tap(page, day, { exact: true, wait: 2000 });
  await tap(page, time, { exact: true, wait: 1200 });
  await tap(page, "Agendar", { wait: 3500 });
  await tap(page, "Pix", { exact: true, wait: 3000 });
  await tap(page, "Gerar Pix", { exact: true, wait: 3500 });
  await mock("set", { paid: true });
  await sleep(9000);
}

const labels = (page) => page.evaluate(() => [...document.querySelectorAll("div,span")].filter((e) => e.children.length === 0 && e.textContent.trim().length > 1 && e.textContent.trim().length < 40).filter((e) => { const r = e.getBoundingClientRect(); const h = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return r.width && r.top > 0 && r.bottom < innerHeight && h && (e.contains(h) || h.contains(e)); }).map((e) => e.textContent.trim()).join(" | "));

if (want("anamnese")) {
  await mock("reset");
  const { browser, page } = await session();
  await go(page, "/", { wait: 5000 });
  await book(page);
  await tap(page, "Preencher anamnese", { exact: true, wait: 4000 });
  await snapshot(page, "an-hub");
  console.log("HUB", await labels(page));
  await tap(page, "Começar", { exact: true, wait: 4000 });
  await snapshot(page, "an-motivo");
  await page.click("textarea");
  await page.keyboard.type("Quero checar o coração. Sinto falta de ar quando subo escada.", { delay: 4 });
  await sleep(700);
  await snapshot(page, "an-motivo-typed");
  await tap(page, "Salvar e continuar", { exact: true, wait: 3000 });
  await snapshot(page, "an-dor");
  console.log("DOR", await labels(page));
  await tap(page, "Não é dor, é outro sintoma", { exact: true, wait: 2500 });
  await snapshot(page, "an-dor-skip");
  await tap(page, "1 mês", { exact: true, wait: 700 });
  await tap(page, "Igual", { exact: true, wait: 900 });
  await snapshot(page, "an-tempo-set");
  await tap(page, "Salvar e continuar", { exact: true, wait: 3000 });
  await snapshot(page, "an-contexto");
  await tap(page, "Nenhuma alergia conhecida", { exact: true, wait: 800 });
  await snapshot(page, "an-contexto-set");
  await tap(page, "Salvar e continuar", { exact: true, wait: 3000 });
  await snapshot(page, "an-anexos");
  console.log("ANX", await labels(page));
  await tap(page, "Revisar anamnese", { exact: true, wait: 3000 });
  await snapshot(page, "an-revisao");
  const send = await page.evaluate(() => [...document.querySelectorAll("div")].filter((e) => e.children.length === 0 && /^Enviar/.test(e.textContent.trim())).map((e) => e.textContent.trim()));
  await mock("set", { hasAnamnese: true });
  await tap(page, send[send.length - 1], { exact: true, wait: 3500 });
  await snapshot(page, "an-enviada");
  await tap(page, "Voltar para a consulta", { exact: true, wait: 4000 });
  await snapshot(page, "an-pre");
  console.log("PRE", await labels(page));
  await browser.close();
}

if (want("historico")) {
  await mock("reset");
  await mock("set", { history: true });
  const { browser, page } = await session();
  await go(page, "/", { wait: 5000 });
  await tap(page, "Consultas", { exact: true, nth: 0, wait: 4000 });
  await snapshot(page, "hi-list");
  console.log("LIST", await labels(page));
  await tap(page, "Dr(a). Camila Rocha", { exact: true, wait: 5000 });
  await snapshot(page, "hi-pos");
  console.log("POS", await labels(page));
  await go(page, "/arquivos", { wait: 5000 });
  await snapshot(page, "hi-arquivos");
  console.log("ARQ", await labels(page));
  await tap(page, "Receita", { exact: true, nth: 1, wait: 3000 });
  await snapshot(page, "hi-doc");
  console.log("DOC", await labels(page));
  await browser.close();
}

if (want("dependentes")) {
  await mock("reset");
  const { browser, page } = await session();
  await go(page, "/", { wait: 5000 });
  await go(page, "/perfil", { wait: 4000 });
  await snapshot(page, "de-perfil");
  console.log("PERFIL", await labels(page));
  await tap(page, "Adicione quem você cuida", { exact: true, wait: 3500 });
  await snapshot(page, "de-empty");
  console.log("EMPTY", await labels(page));
  await tap(page, "Novo dependente", { exact: true, wait: 3500 });
  await snapshot(page, "de-form");
  await field(page, 0, "José Oliveira");
  await field(page, 1, "11144477735");
  await field(page, 2, "02081958");
  await blur(page);
  await tap(page, "Selecionar", { exact: true, wait: 1500 });
  await snapshot(page, "de-sheet");
  await tap(page, "Masculino", { exact: true, wait: 1200 });
  await field(page, 3, "jose.oliveira@email.com");
  await blur(page);
  await sleep(600);
  await snapshot(page, "de-filled");
  console.log("FILLED", await labels(page));
  await tap(page, "Salvar", { exact: true, wait: 1200 });
  await snapshot(page, "de-toast");
  await sleep(3500);
  await snapshot(page, "de-choose");
  console.log("CHOOSE", await labels(page));
  await tap(page, "Assinar", { exact: true, nth: 1, wait: 3500 });
  await snapshot(page, "de-checkout");
  console.log("CHK", await labels(page));
  await tap(page, "Pix", { exact: true, wait: 3000 });
  await snapshot(page, "de-pagar");
  console.log("PAG", await labels(page));
  await tap(page, "Gerar Pix", { exact: true, wait: 3500 });
  await snapshot(page, "de-pix");
  await mock("set", { depPaid: true });
  await sleep(9000);
  await snapshot(page, "de-ok");
  console.log("OK", await labels(page));
  await go(page, "/perfil/dependentes", { wait: 4000 });
  await snapshot(page, "de-list");
  console.log("LIST", await labels(page));
  await browser.close();
}

async function ask(page, text, prefix) {
  await field(page, 0, text);
  await snapshot(page, `${prefix}-typed`);
  const btn = await page.$('[aria-label="Enviar pergunta"], [aria-label="Enviar mensagem"]');
  const bb = await btn.boundingBox();
  await page.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await sleep(1200);
  await snapshot(page, `${prefix}-thinking`);
  await sleep(1400);
  await snapshot(page, `${prefix}-mid`);
  await sleep(14000);
  await blur(page);
  await snapshot(page, `${prefix}-done`);
  console.log(prefix.toUpperCase(), await labels(page));
}

if (want("ia")) {
  await mock("reset");
  await mock("set", { aiDelay: 1600, aiStep: 70 });
  const { browser, page } = await session();
  await go(page, "/", { wait: 5000 });
  await tap(page, "IA", { exact: true, wait: 3500 });
  await snapshot(page, "ia-home");
  await ask(page, "Posso tomar dipirona junto com o remédio de pressão?", "ia-med");
  await go(page, "/", { wait: 4000 });
  await tap(page, "IA", { exact: true, wait: 3500 });
  await ask(page, "Quero um dermatologista para esta semana", "ia-book");
  await browser.close();
}

if (want("iajulia")) {
  await mock("reset");
  const { browser, page } = await session();
  await go(page, "/", { wait: 4000 });
  await go(page, "/doctor/p-julia", { wait: 6000 });
  await snapshot(page, "ij-doctor");
  await tap(page, "7", { exact: true, wait: 2000 });
  await snapshot(page, "ij-day");
  await page.mouse.move(200, 520);
  await page.mouse.wheel({ deltaY: 260 });
  await sleep(1500);
  await snapshot(page, "ij-day-s");
  await tap(page, "09:30", { exact: true, wait: 1200 });
  await snapshot(page, "ij-slot");
  await tap(page, "Agendar", { wait: 3500 });
  await snapshot(page, "ij-checkout");
  await tap(page, "Pix", { exact: true, wait: 3000 });
  await tap(page, "Gerar Pix", { exact: true, wait: 3500 });
  await snapshot(page, "ij-pix");
  await mock("set", { paid: true });
  await sleep(9000);
  await snapshot(page, "ij-ok");
  await tap(page, "Preencher anamnese", { exact: true, wait: 4000 });
  await snapshot(page, "ij-hub");
  await tap(page, "Começar", { exact: true, wait: 4000 });
  await page.click("textarea");
  await page.keyboard.type("Uma mancha no braço mudou de cor e coça há 2 semanas.", { delay: 4 });
  await sleep(700);
  await snapshot(page, "ij-motivo");
  await tap(page, "Salvar e continuar", { exact: true, wait: 3000 });
  await tap(page, "Não é dor, é outro sintoma", { exact: true, wait: 2500 });
  await tap(page, "1 semana", { exact: true, wait: 700 });
  await tap(page, "Piorando", { exact: true, wait: 900 });
  await snapshot(page, "ij-tempo");
  await tap(page, "Salvar e continuar", { exact: true, wait: 3000 });
  await tap(page, "Nenhuma alergia conhecida", { exact: true, wait: 800 });
  await tap(page, "Salvar e continuar", { exact: true, wait: 3000 });
  await tap(page, "Revisar anamnese", { exact: true, wait: 3000 });
  await snapshot(page, "ij-revisao");
  const send = await page.evaluate(() => [...document.querySelectorAll("div")].filter((e) => e.children.length === 0 && /^Enviar/.test(e.textContent.trim())).map((e) => e.textContent.trim()));
  await mock("set", { hasAnamnese: true });
  await tap(page, send[send.length - 1], { exact: true, wait: 3500 });
  await snapshot(page, "ij-enviada");
  await browser.close();
}

if (want("plano")) {
  await mock("reset");
  const { browser, page } = await session();
  await go(page, "/", { wait: 4000 });
  await go(page, "/plans", { wait: 5000 });
  await snapshot(page, "pl-plan");
  console.log("PLAN", await labels(page));
  await browser.close();
}

async function toggle(page, label) {
  const h = await page.evaluateHandle((label) => {
    const t = [...document.querySelectorAll("div")].find((e) => e.children.length === 0 && e.textContent.trim() === label && e.getBoundingClientRect().width > 0);
    let n = t;
    while (n && !n.querySelector("input[role=switch]")) n = n.parentElement;
    return n.querySelector("input[role=switch]");
  }, label);
  const box = await h.boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await sleep(1000);
}

async function tfield(page, i, text) {
  const h = await page.evaluateHandle((i) => [...document.querySelectorAll("input:not([type=checkbox]),textarea")].filter((e) => e.getBoundingClientRect().width > 0)[i], i);
  const box = await h.boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await sleep(300);
  await page.keyboard.type(text, { delay: 25 });
  await sleep(500);
}

if (want("ficha")) {
  await mock("reset");
  await mock("set", { hpEmpty: true });
  const { browser, page } = await session();
  await go(page, "/", { wait: 5000 });
  await go(page, "/perfil", { wait: 4000 });
  await snapshot(page, "fi-perfil");
  console.log("PERFIL", await labels(page));
  await tap(page, "Ficha de saúde", { wait: 3500 });
  await snapshot(page, "fi-hub");
  console.log("HUB", await labels(page));
  await tap(page, "Começar", { exact: true, wait: 3500 });
  await snapshot(page, "fi-basic");
  console.log("BASIC", await labels(page));
  await tfield(page, 0, "68");
  await tfield(page, 1, "162");
  await tfield(page, 2, "13/8");
  await blur(page);
  await sleep(800);
  await snapshot(page, "fi-basic-filled");
  await tap(page, "Continuar", { exact: true, wait: 3500 });
  await snapshot(page, "fi-habitos");
  console.log("HAB", await labels(page));
  await toggle(page, "Usa remédio contínuo?");
  await snapshot(page, "fi-habitos-on");
  await tfield(page, 0, "Losartana 50mg, 1x ao dia");
  await blur(page);
  await sleep(600);
  await snapshot(page, "fi-habitos-filled");
  await tap(page, "Continuar", { exact: true, wait: 3500 });
  await snapshot(page, "fi-cond");
  console.log("COND", await labels(page));
  await toggle(page, "Pressão alta?");
  await tfield(page, 0, "Desde 2015, controlada");
  await blur(page);
  await tap(page, "Colesterol alto", { exact: true, wait: 900 });
  await sleep(600);
  await snapshot(page, "fi-cond-filled");
  await tap(page, "Continuar", { exact: true, wait: 3500 });
  await snapshot(page, "fi-docs");
  console.log("DOCS", await labels(page));
  await tap(page, "Concluir ficha", { exact: true, wait: 3500 });
  await snapshot(page, "fi-hub-done");
  console.log("HUBDONE", await labels(page));
  await tap(page, "Concluir", { exact: true, wait: 3500 });
  await snapshot(page, "fi-hub-complete");
  console.log("COMPLETE", await labels(page));
  await go(page, "/perfil", { wait: 4000 });
  await page.evaluate(() => { const t = [...document.querySelectorAll("div")].find((e) => e.children.length === 0 && e.textContent.trim() === "Compartilhar ficha"); t && t.scrollIntoView({ block: "center" }); });
  await sleep(1500);
  await snapshot(page, "fi-privacy");
  console.log("PRIV", await labels(page));
  await browser.close();
}

if (want("iasint")) {
  await mock("reset");
  await mock("set", { aiDelay: 1600, aiStep: 70 });
  const { browser, page } = await session();
  await go(page, "/", { wait: 5000 });
  await tap(page, "IA", { exact: true, wait: 3500 });
  await ask(page, "Tenho manchas vermelhas no braço que coçam. Com quem eu marco?", "ia-book");
  await browser.close();
}
