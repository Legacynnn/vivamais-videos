import { open, go, snapshot, scenario, apiLog, clickText, type, sleep, login, COMPANY_ID, APP } from "./lib.mjs";
import { fileURLToPath } from "node:url";

const only = process.argv.slice(2);
const want = (ch) => only.length === 0 || only.includes(ch);
const step = async (label, fn) => {
  try {
    await fn();
  } catch (e) {
    process.stdout.write(`FAIL ${label}: ${e.message.split("\n")[0]}\n`);
  }
};
const misses = async () => {
  const m = (await apiLog()).filter((l) => l.miss && !/presence|professions/.test(l.miss)).map((l) => l.miss);
  if (m.length) process.stdout.write(`MISS ${JSON.stringify([...new Set(m)])}\n`);
};
const inDialog = async (page, re) => {
  await page.waitForFunction(
    (src) => {
      const r = new RegExp(src);
      return [...document.querySelectorAll('[role="dialog"] button, [role="dialog"] label')].some((x) => r.test(x.innerText.trim()));
    },
    { timeout: 15000 },
    re
  );
  await page.evaluate((src) => {
    const r = new RegExp(src);
    [...document.querySelectorAll('[role="dialog"] button, [role="dialog"] label')].find((x) => r.test(x.innerText.trim())).click();
  }, re);
};
const P = (path) => `/painel-empresarial/${path}/${COMPANY_ID}`;
const D = { width: 1440, height: 900 };
const T = { width: 1180, height: 820 };

if (want("ch1")) {
  await scenario("reset");
  const { browser, page } = await open({ ...D, auth: false });
  await go(page, "/empresa-cadastro");
  await snapshot(page, "cad-empty");
  await type(page, 'input[name="name"]', "Aurora Logística");
  await type(page, 'input[name="cnpj"]', "12345678000190");
  await type(page, 'input[name="email"]', "rh@auroralog.com.br");
  await type(page, 'input[name="contact_phone"]', "11988001122");
  await type(page, 'input[name="password"]', "Aurora@2026");
  await type(page, 'input[name="password_confirmation"]', "Aurora@2026");
  await page.evaluate(() => document.activeElement.blur());
  await sleep(300);
  await snapshot(page, "cad-filled");
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }).catch(() => {}), clickText(page, "Próxima Etapa")]);
  await sleep(2500);
  await snapshot(page, "planos-0", { scrollY: 0 });
  await snapshot(page, "planos-0s", { scrollY: 330 });
  const plus = () => page.evaluate(() => [...document.querySelectorAll("button")].filter((b) => b.querySelector(".lucide-plus"))[1].click());
  await plus();
  await sleep(300);
  await snapshot(page, "planos-1", { scrollY: 330 });
  for (let i = 0; i < 9; i++) await plus();
  await sleep(300);
  await snapshot(page, "planos-10", { scrollY: 330 });
  await clickText(page, "Ir para pagamento");
  await page.waitForSelector('[role="dialog"]', { timeout: 20000 });
  await sleep(1200);
  await snapshot(page, "pay-card");
  await inDialog(page, "^PIX$");
  await sleep(500);
  await snapshot(page, "pay-pix");
  await inDialog(page, "Gerar QR Code PIX");
  await sleep(2500);
  await snapshot(page, "pay-qr");
  await scenario("payNow");
  await page.waitForFunction(() => location.pathname.includes("/painel-empresarial/home"), { timeout: 30000 });
  await sleep(600);
  await snapshot(page, "dash-new-toast");
  await sleep(5000);
  await snapshot(page, "dash-new");
  await misses();
  await browser.close();
}

if (want("ch3")) {
  await scenario("subscribed");
  const { browser, page } = await open(D);
  await go(page, P("funcionarios"));
  await snapshot(page, "vidas-empty");
  await clickText(page, "Cadastrar Novo");
  await sleep(800);
  await snapshot(page, "vida-dialog-empty");
  await type(page, '[role="dialog"] input[name="full_name"]', "Marina Azevedo");
  await type(page, '[role="dialog"] input[name="document"]', "382.190.457-16");
  await type(page, '[role="dialog"] input[name="principal_email"]', "marina.azevedo@auroralog.com.br");
  await type(page, '[role="dialog"] input[name="birth_date"]', "14031991");
  await type(page, '[role="dialog"] input[name="phone"]', "11988112233");
  await type(page, '[role="dialog"] input[name="job_title"]', "Analista de RH");
  await step("gender", async () => {
    const combos = await page.$$('[role="dialog"] button[role="combobox"]');
    await combos[0].click();
    await sleep(500);
    await snapshot(page, "vida-dialog-gender");
    await page.evaluate(() => [...document.querySelectorAll('[role="option"]')].find((o) => o.innerText.trim() === "Feminino").click());
    await sleep(500);
  });
  await page.evaluate(() => document.activeElement.blur());
  await snapshot(page, "vida-dialog-filled");
  await inDialog(page, "^Cadastrar$");
  await sleep(1200);
  await snapshot(page, "vidas-one-toast");
  await sleep(5000);
  await snapshot(page, "vidas-one");

  await clickText(page, "Importar Planilha de Vidas");
  await sleep(800);
  await snapshot(page, "import-empty");
  await step("file", async () => {
    const input = await page.$('[role="dialog"] input[type="file"]');
    await input.uploadFile(fileURLToPath(new URL("./vidas-aurora.csv", import.meta.url)));
    await sleep(500);
  });
  await snapshot(page, "import-file");
  await inDialog(page, "^Importar$");
  await sleep(900);
  await snapshot(page, "import-success");
  await sleep(2600);
  await snapshot(page, "vidas-nine-toast");
  await sleep(5000);
  await snapshot(page, "vidas-nine");
  await scenario("activated");
  await go(page, P("funcionarios"));
  await snapshot(page, "vidas-activated");
  await go(page, P("home"));
  await snapshot(page, "dash-vidas");
  await misses();
  await browser.close();
}

if (want("ch5")) {
  const { browser, page } = await open({ ...T, auth: false });
  await go(page, "/primeiro-acesso/9f2c7a41d0b84e6f?channel=whatsapp");
  await snapshot(page, "acesso-empty");
  await step("pw", async () => {
    const inputs = await page.$$('main input');
    process.stdout.write(`acesso inputs ${inputs.length}\n`);
    await inputs[0].type("Marina@2026");
    await inputs[1].type("Marina@2026");
    await page.evaluate(() => document.activeElement.blur());
    await snapshot(page, "acesso-filled");
    await page.evaluate(() => [...document.querySelectorAll("main button")].filter((b) => b.type === "submit" || /Criar|Concluir|Confirmar|Salvar|Ativar/.test(b.innerText)).pop().click());
    await sleep(1500);
  });
  await snapshot(page, "acesso-done");
  await misses();
  await browser.close();
}

if (want("ch6")) {
  await scenario("withEmployees+activated");
  const { browser, page } = await open(D);
  await go(page, P("grupos-assinatura"));
  await snapshot(page, "grupos-1");
  await clickText(page, "Novo Grupo");
  await sleep(1000);
  await snapshot(page, "grupo-novo-empty");
  await step("novo", async () => {
    await page.click('[role="dialog"] button[role="combobox"]');
    await sleep(500);
    await snapshot(page, "grupo-novo-select");
    await page.evaluate(() => [...document.querySelectorAll('[role="option"]')].find((o) => /Premium/.test(o.innerText)).click());
    await sleep(400);
    await type(page, '[role="dialog"] input[type="number"]', "3");
    await page.evaluate(() => document.activeElement.blur());
    await snapshot(page, "grupo-novo-filled");
    await inDialog(page, "Criar Grupo");
    await sleep(1500);
  });
  await snapshot(page, "grupos-2-toast");
  await sleep(5000);
  await snapshot(page, "grupos-2");
  await page.evaluate(() => [...document.querySelectorAll("main table button")].find((b) => /Gerenciar Vidas/.test(b.innerText)).click());
  await sleep(1500);
  await snapshot(page, "manage-open");
  await step("select", async () => {
    await page.evaluate(() => {
      const label = [...document.querySelectorAll('[role="dialog"] *')].find((e) => /^Selecionar até/.test(e.textContent.trim()) && e.children.length === 0);
      const box = label.closest("label, div").parentElement.querySelector('button[role="checkbox"], input[type="checkbox"]') || label.closest("div").querySelector('button[role="checkbox"], input[type="checkbox"]');
      box.click();
    });
    await sleep(500);
  });
  await snapshot(page, "manage-selected");
  await step("add", async () => {
    await inDialog(page, "Adicionar Selecionados");
    await sleep(1800);
  });
  await snapshot(page, "grupos-3-toast");
  await sleep(5200);
  await snapshot(page, "grupos-3");
  await go(page, P("funcionarios"));
  await snapshot(page, "vidas-grouped");
  await misses();
  await browser.close();
}

if (want("ch7")) {
  const { browser, page } = await open(D);
  await go(page, P("creditos"));
  await snapshot(page, "cred-empty");
  await type(page, "#billing-day", "10");
  await type(page, "#prepaid-amount", "1500");
  await page.evaluate(() => document.activeElement.blur());
  await snapshot(page, "cred-typed");
  await clickText(page, "Salvar configuração");
  await sleep(1200);
  await snapshot(page, "cred-saved-toast");
  await sleep(5000);
  await snapshot(page, "cred-saved");
  await clickText(page, "Adicionar vidas");
  await sleep(600);
  await snapshot(page, "cred-adding", { scrollY: 380 });
  await clickText(page, "Selecionar todas as vidas elegíveis", { tag: "label" });
  await sleep(400);
  await snapshot(page, "cred-adding-selected", { scrollY: 380 });
  await clickText(page, "Adicionar selecionadas");
  await sleep(1200);
  await snapshot(page, "cred-added-toast", { scrollY: 380 });
  await sleep(5000);
  await snapshot(page, "cred-added", { scrollY: 380 });
  await step("edit", async () => {
    await page.evaluate(() => document.querySelector("main table tbody tr:nth-child(2) button").click());
    await sleep(500);
    await snapshot(page, "cred-edit-empty", { scrollY: 380 });
    await type(page, "main table tbody tr:nth-child(2) input", "200");
    await page.evaluate(() => document.activeElement.blur());
    await snapshot(page, "cred-edit-typed", { scrollY: 380 });
    await page.evaluate(() => document.querySelector("main table tbody tr:nth-child(2) td:last-child button").click());
    await sleep(1200);
  });
  await snapshot(page, "cred-edited-toast", { scrollY: 380 });
  await sleep(5000);
  await snapshot(page, "cred-edited", { scrollY: 380 });
  await snapshot(page, "cred-final", { scrollY: 0 });
  await misses();
  await browser.close();
}

if (want("ch8")) {
  const { browser, page } = await open(D);
  await scenario("billPending");
  await go(page, P("financeiro"));
  await snapshot(page, "fin-top", { scrollY: 0 });
  await snapshot(page, "fin-pending", { scrollY: 470 });
  await step("copy", async () => {
    const ctx = browser.defaultBrowserContext();
    await ctx.overridePermissions(APP, ["clipboard-read", "clipboard-write", "clipboard-sanitized-write"]);
    await clickText(page, "Copiar código PIX");
    await sleep(500);
  });
  await snapshot(page, "fin-copied", { scrollY: 470 });
  await scenario("billPaid");
  await go(page, P("financeiro"));
  await snapshot(page, "fin-paid", { scrollY: 470 });
  await snapshot(page, "fin-paid-top", { scrollY: 0 });
  await misses();
  await browser.close();
}

if (want("ch9")) {
  const { browser, page } = await open(D);
  await go(page, P("agendamentos"));
  await snapshot(page, "agenda-empty");
  await step("employee", async () => {
    await page.evaluate(() => [...document.querySelectorAll("main button")].find((b) => /Marina Azevedo/.test(b.innerText)).click());
    await sleep(500);
  });
  await snapshot(page, "agenda-employee");
  await step("specialty", async () => {
    await page.evaluate(() => window.scrollTo(0, 420));
    const combo = await page.evaluateHandle(() => [...document.querySelectorAll('main button[role="combobox"]')].find((b) => /Selecione/.test(b.innerText)));
    await combo.click();
    await sleep(600);
    await snapshot(page, "agenda-specialty-open", { scrollY: 420 });
    await page.evaluate(() => [...document.querySelectorAll('[role="option"]')].find((o) => /Cardiologia/.test(o.innerText)).click());
    await sleep(1500);
  });
  await snapshot(page, "agenda-doctors", { scrollY: 420 });
  process.stdout.write(`agenda buttons: ${JSON.stringify(await page.evaluate(() => [...document.querySelectorAll("main button")].map((b) => b.innerText.trim().replace(/\s+/g, " ").slice(0, 50)).filter(Boolean).slice(-16)))}\n`);
  await step("doctor", async () => {
    await page.evaluate(() => [...document.querySelectorAll("main button")].find((b) => /Mariana Costa/.test(b.innerText)).click());
    await sleep(1500);
  });
  await snapshot(page, "agenda-doctor", { scrollY: 520 });
  process.stdout.write(`agenda buttons2: ${JSON.stringify(await page.evaluate(() => [...document.querySelectorAll("main button")].map((b) => b.innerText.trim().replace(/\s+/g, " ").slice(0, 50)).filter(Boolean).slice(-16)))}\n`);
  await step("slot", async () => {
    await page.evaluate(() => [...document.querySelectorAll("main button")].find((b) => /^16:00/.test(b.innerText.trim())).click());
    await sleep(800);
  });
  await snapshot(page, "agenda-slot", { scrollY: 520 });
  await snapshot(page, "agenda-slot-top", { scrollY: 0 });
  await step("confirm", async () => {
    await clickText(page, "Confirmar agendamento");
    await sleep(1200);
  });
  await snapshot(page, "agenda-done-toast", { scrollY: 0 });
  await step("history", async () => {
    await clickText(page, "Histórico de consultas");
    await sleep(1200);
  });
  await snapshot(page, "agenda-history", { scrollY: 0 });
  await misses();
  await browser.close();
}

if (want("ch11")) {
  const { browser, page } = await open(D);
  await scenario("consume");
  await go(page, P("credit-usage"));
  await snapshot(page, "uso");
  await go(page, P("home"));
  await snapshot(page, "dash-final");
  await go(page, P("creditos"));
  await snapshot(page, "cred-consumed", { scrollY: 0 });
  await misses();
  await browser.close();
}

if (want("ch10")) {
  await scenario("asEmployee");
  const { browser, page } = await open({ ...T, auth: false });
  const domain = new URL(APP).hostname;
  await page.setCookie(
    { name: "token_vivamais", value: "mock-access", domain, path: "/" },
    { name: "refresh_vivamais", value: "mock-refresh", domain, path: "/" },
    { name: "user_type_vivamais", value: "CLIENT", domain, path: "/" }
  );
  const id = await (await fetch("http://127.0.0.1:8787/consultations/consultations/?page_size=5")).json();
  const cid = id.results[0]?.id || "cons-live";
  await go(page, `/consulta/${cid}`, { wait: 2500 });
  await snapshot(page, "consulta", { scrollY: 0 });
  await page.screenshot({ path: "capture/shots/consulta-full.png", fullPage: true });
  await misses();
  await scenario("asCompany");
  await browser.close();
}
