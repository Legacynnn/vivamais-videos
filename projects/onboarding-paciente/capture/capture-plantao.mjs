import { open, go, tap, snapshot, shot, sleep, mock, mark } from "./lib.mjs";

const only = process.argv.slice(2);
const want = (name) => only.length === 0 || only.includes(name);

async function session(o) {
  const s = await open(o);
  s.page.on("console", (m) => {
    if (m.type() === "error") process.stderr.write(`console: ${m.text().slice(0, 200)}\n`);
  });
  return s;
}

async function toHome(page) {
  await go(page, "/", { wait: 2500 });
}

async function toPlantaoTab(page, { snap = false } = {}) {
  await tap(page, "Plantão", { tag: "div", exact: true, nth: 1, wait: snap ? 250 : 3500 });
  if (snap) {
    await snapshot(page, "plantao-loading");
    await sleep(3200);
  }
}

async function toFree(page, { snap = false } = {}) {
  await tap(page, "Começar", { wait: 2500 });
  if (snap) {
    await snapshot(page, "canal");
    await tap(page, "Chat", { exact: true, wait: 700 });
    await snapshot(page, "canal-chat");
    await tap(page, "Vídeo", { exact: true, wait: 700 });
    await tap(page, "Continuar", { exact: true, wait: 3500 });
    await snapshot(page, "checkout");
    await tap(page, "Crédito da empresa", { wait: 1500 });
    await snapshot(page, "credito");
    await shot(page, "credito");
    await mock("set", { walletDelay: 8000 });
    await tap(page, "Confirmar com crédito da empresa", { exact: true, wait: 900 });
    await snapshot(page, "credito-proc");
    await sleep(10000);
  } else {
    await tap(page, "Continuar", { exact: true, wait: 3000 });
    await tap(page, "Crédito da empresa", { wait: 1500 });
    await tap(page, "Confirmar com crédito da empresa", { exact: true, wait: 3500 });
  }
  await mock("set", { walletDelay: 0, creditUsed: "79.90", queueStatus: "pending_anamnesis", position: 3 });
  if (snap) await snapshot(page, "sucesso");
}

if (want("home")) {
  await mock("reset");
  await mock("set", { delay: { "/consultations/consultations/": 30000, "/partners/": 30000 } });
  const { browser, page } = await session();
  await page.goto("http://localhost:8095/", { waitUntil: "domcontentloaded" });
  await sleep(4500);
  await snapshot(page, "home-skel");
  await mock("set", { delay: {} });
  await sleep(30000);
  await snapshot(page, "home");
  await toPlantaoTab(page, { snap: true });
  await snapshot(page, "plantao");
  await browser.close();
}

if (want("plano")) {
  await mock("reset");
  const { browser, page } = await session();
  await toHome(page);
  await go(page, "/perfil", { wait: 1000 });
  await sleep(3500);
  await snapshot(page, "perfil");
  await shot(page, "perfil");
  await browser.close();
}

if (want("ficha")) {
  await mock("reset");
  const { browser, page } = await session();
  await toHome(page);
  await go(page, "/perfil/ficha", { wait: 1000 });
  await sleep(3500);
  await snapshot(page, "ficha");
  await shot(page, "ficha");
  const slug = await page.evaluate(() => (location.pathname));
  process.stdout.write(`ficha path ${slug}\n`);
  const first = await page.evaluate(() => [...document.querySelectorAll("div")].filter((e) => e.children.length === 0 && /^(Editar|Revisar|Ver|Continuar)$/.test(e.textContent.trim())).map((e) => e.textContent.trim()));
  process.stdout.write(`ficha labels ${JSON.stringify(first)}\n`);
  if (first.length) {
    await tap(page, first[0], { exact: true, wait: 2500 });
    await snapshot(page, "ficha-step");
    await shot(page, "ficha-step");
  }
  await browser.close();
}

if (want("tutorial")) {
  await mock("reset");
  const { browser, page } = await session({ seen: false });
  await toHome(page);
  await sleep(1500);
  await snapshot(page, "tutorial-1");
  for (let i = 2; i <= 5; i++) {
    const next = await page.evaluate(() => [...document.querySelectorAll("div")].some((e) => e.children.length === 0 && /^(Próximo|Continuar|Entendi|Começar)$/.test(e.textContent.trim())));
    if (!next) break;
    const label = await page.evaluate(() => [...document.querySelectorAll("div")].find((e) => e.children.length === 0 && /^(Próximo|Continuar|Entendi|Começar)$/.test(e.textContent.trim())).textContent.trim());
    await tap(page, label, { exact: true, wait: 1200 });
    await snapshot(page, `tutorial-${i}`);
  }
  await browser.close();
}

if (want("pay")) {
  await mock("reset");
  const { browser, page } = await session();
  await toHome(page);
  await toPlantaoTab(page);
  await toFree(page, { snap: true });
  await browser.close();
}

if (want("anamnese")) {
  await mock("reset");
  const { browser, page } = await session();
  await toHome(page);
  await toPlantaoTab(page);
  await toFree(page);
  await mock("set", { delay: { "/patient-profile/health-profiles/": 30000 } });
  await tap(page, "Continuar para a anamnese", { exact: true, wait: 1500 });
  await snapshot(page, "hub-skel");
  await mock("set", { delay: {} });
  await sleep(31000);
  await snapshot(page, "hub");
  await tap(page, "Começar", { exact: true, wait: 4000 });
  await snapshot(page, "motivo");
  await page.click("textarea");
  await page.keyboard.type("Dor de cabeça forte desde ontem, piora quando fico no computador.", { delay: 4 });
  await sleep(700);
  await snapshot(page, "motivo-typed");
  await tap(page, "Salvar e continuar", { exact: true, wait: 3000 });
  await snapshot(page, "dor");
  await page.touchscreen.tap(201, 352);
  await sleep(2500);
  await snapshot(page, "dor-sheet");
  await tap(page, "Latejante", { exact: true, wait: 800 });
  await snapshot(page, "dor-sheet-set");
  await tap(page, "Confirmar", { exact: true, wait: 2000 });
  await snapshot(page, "dor-marked");
  await tap(page, "Salvar e continuar", { exact: true, wait: 3000 });
  await snapshot(page, "tempo");
  await tap(page, "Ontem", { exact: true, wait: 700 });
  await tap(page, "Piorando", { exact: true, wait: 900 });
  await snapshot(page, "tempo-set");
  await tap(page, "Salvar e continuar", { exact: true, wait: 3000 });
  await snapshot(page, "contexto");
  await tap(page, "Nenhuma alergia conhecida", { exact: true, wait: 800 });
  await snapshot(page, "contexto-set");
  await tap(page, "Salvar e continuar", { exact: true, wait: 3000 });
  await snapshot(page, "anexos");
  await tap(page, "Revisar anamnese", { exact: true, wait: 3000 });
  await snapshot(page, "revisao");
  await mock("set", { queueStatus: "waiting", position: 3, hasAnamnese: true });
  const send = await page.evaluate(() => [...document.querySelectorAll("div")].filter((e) => e.children.length === 0 && /^Enviar/.test(e.textContent.trim())).map((e) => e.textContent.trim()));
  process.stdout.write(`send labels ${JSON.stringify(send)}\n`);
  await tap(page, send[send.length - 1], { exact: true, wait: 3000 });
  await snapshot(page, "enviada");
  await tap(page, "Ir para a fila", { exact: true, wait: 4000 });
  await snapshot(page, "fila-3");
  const q = async (position, status = "waiting") => mock("push", { type: "queue.status", queueId: "q-ana", status, paymentId: "pay-ana-1", position, hasAnamnese: true, waitingStartedAt: await page.evaluate(() => new Date(Date.now() - 95000).toISOString()), consultationChannel: "online_room" });
  await mock("set", { position: 2 });
  await q(2);
  await sleep(2500);
  await snapshot(page, "fila-2");
  await mock("set", { position: 1 });
  await q(1);
  await sleep(2500);
  await snapshot(page, "fila-1");
  await mock("set", { queueStatus: "matched", consultationsListed: true });
  await mock("push", { type: "consultation.created", consultationId: "cons-plantao-1", doctor: { id: "p-camila", name: "Camila Rocha" }, whereby_room_url: "https://vivamais.whereby.com/plantao-ana", whereby_meeting_id: "m1", consultationChannel: "online_room" });
  await sleep(3000);
  await snapshot(page, "fila-paired");
  await mock("set", { queueStatus: "in_progress", consultationStatus: "in_progress" });
  await mock("push", { type: "consultation.status", consultationId: "cons-plantao-1", status: "in_progress" });
  await sleep(3000);
  await snapshot(page, "fila-ready");
  await tap(page, "Entrar na chamada", { exact: true, wait: 5000 });
  await snapshot(page, "call");
  await browser.close();
}

if (want("pos")) {
  await mock("reset");
  await mock("set", { paid: true, consultationStatus: "completed", consultationsListed: true, hasAnamnese: true, delay: { "/consultations/consultations/cons-plantao-1/": 30000 } });
  const { browser, page } = await session();
  await toHome(page);
  await page.goto("http://localhost:8095/pos-consulta?consultationId=cons-plantao-1", { waitUntil: "domcontentloaded" });
  await sleep(4000);
  await snapshot(page, "pos-skel");
  await mock("set", { delay: {} });
  await sleep(30000);
  await snapshot(page, "pos");
  await page.evaluate(() => {
    const s = [...document.querySelectorAll("div")].filter((e) => e.scrollHeight - e.clientHeight > 300 && e.clientWidth > 300 && /auto|scroll/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.clientHeight - a.clientHeight)[0];
    s.scrollTop = 400;
  });
  await sleep(900);
  await snapshot(page, "pos-scrolled");
  await browser.close();
}
