import { createServer } from "node:http";
import { readFileSync, existsSync, appendFileSync } from "node:fs";
import { extname } from "node:path";
import { WebSocketServer } from "ws";

const PORT = Number(process.env.MOCK_PORT || 8788);
const BASE = `http://127.0.0.1:${PORT}`;
const STATIC = new URL("./static/", import.meta.url);
const LOG = new URL("./mock.log", import.meta.url);

const CLOCK_OFF = Date.parse("2026-09-29T14:20:00-03:00") - Date.now();
const now = () => Date.now() + CLOCK_OFF;
const iso = (offsetMin = 0) => new Date(now() + offsetMin * 60000).toISOString();
const page = (results) => ({ links: { next: null, previous: null }, total: results.length, page: 1, page_size: 20, total_pages: 1, results });

const USER_ID = "u-ana";
const CLIENT_ID = "c-ana";
const DOCTOR_ID = "p-camila";
const CONSULTATION_ID = "cons-plantao-1";
const RECORD_ID = "mr-plantao-1";
function crc16(str) {
  let crc = 0xffff;
  for (const ch of Buffer.from(str, "utf8")) {
    crc ^= ch << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
const tlv = (id, v) => id + String(v.length).padStart(2, "0") + v;
const PIX = (() => {
  const body = tlv("00", "01") + tlv("01", "12") + tlv("26", tlv("00", "br.gov.bcb.pix") + tlv("25", "pix.asaas.com/qr/cobv/8c1f6b0e2a4d4c7a9f3e5d1b7e2c9a40")) + tlv("52", "0000") + tlv("53", "986") + tlv("54", "59.90") + tlv("58", "BR") + tlv("59", "VIVA MAIS") + tlv("60", "SAO PAULO") + tlv("62", tlv("05", "***")) + "6304";
  return body + crc16(body);
})();

const benefit = (id, type, extra) => ({ id, type, unlimited: false, free_consultation: false, consultation_price: null, discount_value: null, available_quantity: 0, used_quantity: 0, description: "", can_use: true, ...extra });

const signatureType = {
  id: "st-viva",
  title: "Viva+ Empresarial",
  type: "INDIVIDUAL",
  audience: "COMPANY",
  is_free: false,
  price: "59.90",
  annual_price: "599.00",
  features: null,
  consultation_price: "0.00",
  unlimited_consultation: false,
  unlimited_dependents: false,
  created_at: "2026-01-01T12:00:00Z",
  updated_at: "2026-01-01T12:00:00Z",
  payment_tolerance_days: 5,
  benefits: [
    benefit("b-clinico", "CONSULTATION", { specialty: "sp-clinico", specialty_name: "Clínico Geral", free_consultation: true, available_quantity: 2, used_quantity: 0, description: "Consultas com clínico geral" }),
    benefit("b-desc", "DISCOUNT_ALL_CONSULTATIONS", { discount_value: "25.00", unlimited: true, description: "25% em todas as consultas" }),
    benefit("b-ia", "AI_CHAT_MESSAGING", { unlimited: true, description: "Chat com IA" }),
    benefit("b-ia-an", "ANALYSIS_CONSULTATUION_BY_AI", { unlimited: true, description: "Análise de consulta com IA" }),
    benefit("b-farm", "DISCOUNT_PHARMACIES", { unlimited: true, description: "Descontos em farmácias parceiras" }),
  ],
};

const signature = {
  id: "sig-ana",
  signature_type: signatureType,
  status: "ACTIVE",
  expiration_date: "2026-10-29",
  payment_date: "2026-09-29",
  is_active: true,
  canceled: false,
  cancellation_requested: false,
  has_refund_right: false,
  reason_cancellation: null,
};

const me = () => ({
  id: USER_ID,
  email: "ana.souza@email.com",
  name: "Ana Souza",
  date_joined: "2026-02-10T12:00:00Z",
  profile: {
    id: CLIENT_ID,
    user: { id: USER_ID, email: "ana.souza@email.com", name: "Ana Souza", date_joined: "2026-02-10T12:00:00Z" },
    full_name: "Ana Souza",
    birth_date: "1992-05-14",
    document: "38219045716",
    gender: "FEMALE",
    contacts: [{ id: "ct1", type: "PHONE", value: "11987654321" }],
    signature,
    wallet_balance: S.wallet || "0.00",
    credit: { id: "cc-1", monthly_limit: "300.00", used_amount: S.creditUsed || "0.00", employee_full_name: "Ana Souza", is_active: true },
    avatar_url: `${BASE}/static/ana.jpg`,
    share_ficha_with_doctors: true,
    share_documents_with_doctors: true,
    created_at: "2026-02-10T12:00:00Z",
    updated_at: "2026-09-29T12:00:00Z",
  },
  available_profiles: [{ id: CLIENT_ID, full_name: "Ana Souza", is_primary: true, is_dependent: false, signature }],
});

const spec = (id, name) => ({ id, name, description: null, price: 180, can_prescribe: true, can_issue_certificate: true });
const SPECIALTIES = [spec("sp-clinico", "Médico Clínico"), spec("sp-cardio", "Cardiologia"), spec("sp-derma", "Dermatologia"), spec("sp-pedi", "Pediatria"), spec("sp-psico", "Psicologia"), spec("sp-gineco", "Ginecologia")];

const doctor = (id, name, img, specialty, rating, crm) => ({
  id,
  type: "DOCTOR",
  name,
  document: "00000000000",
  medical_register: crm,
  register_label: "CRM",
  bio: "Atende adultos em clínica geral e pronto atendimento.",
  user: { id: `u-${id}`, name, email: `${id}@vivamais.ai` },
  specialties: [{ id: `ds-${id}`, rqe: "12345", specialty: spec(specialty[0], specialty[1]), online_price: "180.00", created_at: "2026-01-01T12:00:00Z", updated_at: "2026-01-01T12:00:00Z" }],
  contacts: [],
  addresses: [],
  services: "",
  attends_online: true,
  attends_presential: false,
  availabilities: [],
  avatar_url: `${BASE}/static/${img}`,
  updated_at: "2026-09-01T12:00:00Z",
  average_rating: rating,
  rating_count: 214,
  total_consultations: 1280,
  years_of_experience: 11,
  profession: "Médica",
});

const CAMILA = doctor(DOCTOR_ID, "Camila Rocha", "camila.jpg", ["sp-clinico", "Médico Clínico"], 4.9, "CRM-SP 184233");
const TOP = [
  CAMILA,
  doctor("p-rafael", "Rafael Lima", "d0.png", ["sp-clinico", "Médico Clínico"], 4.8, "CRM-SP 120931"),
  doctor("p-julia", "Júlia Andrade", "d2.png", ["sp-clinico", "Médico Clínico"], 4.9, "CRM-RJ 99812"),
  doctor("p-mariana", "Mariana Costa", "d4.jpeg", ["sp-clinico", "Médico Clínico"], 4.7, "CRM-MG 55120"),
];

const PHARMACIES = [
  ["ph-1", "Drogaria Vida", "Até 35% em genéricos"],
  ["ph-2", "Farma Bem", "20% em medicamentos"],
  ["ph-3", "Droga Mais", "15% em toda a loja"],
  ["ph-4", "Pague Saúde", "25% em genéricos"],
].map(([id, name, d]) => ({ id, name, logo_url: null, cover_url: null, benefits_description: d, addresses: [] }));

const S = {
  delay: {},
  paid: false,
  queueStatus: "pending_anamnesis",
  position: 3,
  hasAnamnese: false,
  consultationStatus: "scheduled",
  consultationsListed: false,
};

const consultation = () => ({
  id: CONSULTATION_ID,
  patient: CLIENT_ID,
  patient_name: "Ana Souza",
  doctor: DOCTOR_ID,
  doctor_name: "Camila Rocha",
  specialty_name: "Médico Clínico",
  selected_specialty_name: "Médico Clínico",
  consultation_date: iso(-16),
  consultation_type: "online",
  consultation_channel: "online_room",
  status: S.consultationStatus,
  medical_record: RECORD_ID,
  whereby_room_url: S.consultationStatus === "completed" ? "" : "https://vivamais.whereby.com/plantao-ana",
  created_at: iso(-30),
  updated_at: iso(-1),
  on_call_match: "q-ana",
  started_at: iso(-15),
  ended_at: iso(-1),
  duration_seconds: 842,
  source: "on_call",
  status_payement: true,
  price: "59.90",
  invoice_url: "https://www.asaas.com/i/mock",
  rating: undefined,
  is_reconsulta: false,
  parent_consultation: null,
  can_request_reconsulta: true,
  reconsulta: null,
});

const record = () => ({
  id: RECORD_ID,
  consultation: CONSULTATION_ID,
  consultation_info: {},
  record_number: "PR-2026-004812",
  status: "completed",
  status_display: "Concluído",
  consent_term_accepted: true,
  final_observations: "Cefaleia tensional sem sinais de alarme. Hidratação, pausas de tela e analgésico se necessário.",
  finished_at: iso(-1),
  consultation_time: "00:14:02",
  consultation_time_display: "14 min",
  medication_prescriptions: [
    {
      id: "rx-1",
      document_id: "doc-rx-1",
      document: "doc-rx-1",
      prescription_type_details: { id: "pt1", name: "Receita simples" },
      items: [
        { id: "it-1", medication_details: { id: "m1", title: "Dipirona 500 mg" }, dosage: "1 comprimido a cada 6 horas, se dor", treatment_duration: "3 dias" },
        { id: "it-2", medication_details: { id: "m2", title: "Ciclobenzaprina 5 mg" }, dosage: "1 comprimido à noite", treatment_duration: "5 dias" },
      ],
    },
  ],
  medical_report: null,
  medical_certificate: { id: "cert-1", document_id: "doc-cert-1", document: "doc-cert-1", certificate_days: 1 },
  physical_exams: { id: "ex-1", document_id: "doc-ex-1", document: "doc-ex-1", requested_exams: [{ term: "Hemograma completo" }, { term: "Glicemia de jejum" }], orientation: "Jejum de 8 horas." },
  primary_diagnosis: "G44.2",
  primary_diagnosis_display: { code: "G44.2", name: "Cefaleia tensional" },
  secondary_diagnoses: [],
  secondary_diagnoses_display: [],
  patient_info: null,
  doctor_info: null,
  document_id: "doc-mr-1",
  created_at: iso(-15),
  updated_at: iso(-1),
  therapeutic_plan: { patient_guidelines: "Beba bastante água, faça pausas a cada hora de tela e durma bem. Se a dor piorar ou vier com febre, volte ao plantão.", medical_notes: "" },
});

const healthProfile = {
  id: "hp-ana",
  client: CLIENT_ID,
  client_name: "Ana Souza",
  current_step: 6,
  is_completed: true,
  completed_at: "2026-03-01T12:00:00Z",
  progress_percentage: 100,
  weight: "61",
  height: "166",
  average_blood_pressure: "12/8",
  uses_continuous_medication: false,
  continuous_medication_details: "",
  is_smoker: false,
  smoker_details: "",
  has_high_blood_pressure: false,
  high_blood_pressure_details: "",
  is_diabetic: false,
  diabetic_details: "",
  has_allergic_history: false,
  allergic_history_details: "",
  uses_or_used_drugs: false,
  drugs_details: "",
  health_problems: [],
  documents: [],
  created_at: "2026-03-01T12:00:00Z",
  updated_at: "2026-09-01T12:00:00Z",
};

const anamnese = (consultation) => ({
  id: "an-1",
  consultation,
  consultation_reason: "Dor de cabeça forte desde ontem, piora com tela.",
  medications: [],
  allergies: [],
  pain_assessments: [],
  attachments: [],
  created_at: iso(-20),
  updated_at: iso(-20),
});

const quote = () => ({
  base_amount: "79.90",
  discount_source: "none",
  discount_label: null,
  discount_amount: "0.00",
  subtotal_after_discount: "79.90",
  wallet_amount_applied: "0.00",
  remaining_amount: "79.90",
  applied_coupon: null,
  applied_benefit: null,
  messages: [],
});

function route(method, path, q) {
  if (path === "/users/me/") return me();
  if (path === "/auth/refresh-token/") return { access: "mock-access", refresh: "mock-refresh" };
  if (path === "/consultations/consultations/" && method === "GET") return page(S.consultationsListed ? [consultation()] : []);
  if (path === `/consultations/consultations/${CONSULTATION_ID}/`) return consultation();
  if (path === "/consultations/consultations/checkout/quote/") return quote();
  if (path === "/consultations/consultations/documents-history/") return page([]);
  if (path.startsWith("/signatures/signature-client/") && path.endsWith("/payments/"))
    return [{ id: "sp-1", value: 59.9, status: "RECEIVED", paymentDate: "2026-09-29", dueDate: "2026-09-29", invoiceUrl: "https://www.asaas.com/i/mock" }];
  if (path === "/partners/specialties/") return SPECIALTIES;
  if (path === "/partners/pharmacies/") return page(PHARMACIES);
  if (path === "/partners/" && q.get("name")) return page(TOP.filter((d) => d.name === q.get("name")));
  if (path === "/partners/") return page(TOP);
  const doc = path.match(/^\/partners\/([^/]+)\/$/);
  if (doc) return TOP.find((d) => d.id === doc[1]) || CAMILA;
  if (path === "/clients/dependents/") return [];
  if (path === "/patient-profile/health-profiles/") return page([healthProfile]);
  if (path === "/patient-profile/access-requests/") return page([]);
  if (path === "/consultations/anamneses/" && method === "POST") {
    S.hasAnamnese = true;
    return { id: "an-1" };
  }
  if (path === "/consultations/anamneses/") return page(S.hasAnamnese ? [anamnese(q.get("consultation") ? CONSULTATION_ID : null)] : []);
  if (path.startsWith("/consultations/anamneses/")) return anamnese(CONSULTATION_ID);
  if (path === `/consultations/medical-records/${RECORD_ID}/`) return record();
  if (path === "/consultations/doctor-ratings/") return { id: "r1", rating: 5, comment: "", created_at: iso() };
  return null;
}

const clients = new Set();
const log = (line) => appendFileSync(LOG, `${new Date().toISOString()} ${line}\n`);

function push(event) {
  const data = JSON.stringify(event);
  clients.forEach((c) => c.readyState === 1 && c.send(data));
  log(`push ${data.slice(0, 160)}`);
}

function control(path, body) {
  const [, , name] = path.split("/");
  if (name === "reset") {
    Object.assign(S, { delay: {}, wallet: "0.00", creditUsed: "0.00", walletDelay: 0, paid: false, queueStatus: "pending_anamnesis", position: 3, hasAnamnese: false, consultationStatus: "scheduled", consultationsListed: false });
    return S;
  }
  if (name === "set") {
    Object.assign(S, body || {});
    return S;
  }
  if (name === "push") {
    push(body);
    return { ok: true, clients: clients.size };
  }
  if (name === "state") return S;
  return null;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, BASE);
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString();
  const body = raw ? (() => { try { return JSON.parse(raw); } catch { return raw; } })() : null;
  const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "*" };
  if (req.method === "OPTIONS") {
    res.writeHead(204, cors);
    res.end();
    return;
  }
  if (url.pathname.startsWith("/static/")) {
    const file = new URL(url.pathname.slice(8), STATIC);
    if (!existsSync(file)) {
      res.writeHead(404, cors);
      res.end();
      return;
    }
    const type = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" }[extname(file.pathname)] || "application/octet-stream";
    res.writeHead(200, { ...cors, "Content-Type": type });
    res.end(readFileSync(file));
    return;
  }
  if (url.pathname.startsWith("/__")) {
    const out = control(url.pathname.replace(/^\/__/, "/x/"), body);
    res.writeHead(out ? 200 : 404, { ...cors, "Content-Type": "application/json" });
    res.end(JSON.stringify(out));
    return;
  }
  const out = route(req.method, url.pathname, url.searchParams);
  const wait = Object.entries(S.delay).find(([k]) => url.pathname.startsWith(k));
  if (wait) await new Promise((r) => setTimeout(r, wait[1]));
  log(`${req.method} ${url.pathname}${url.search} ${out ? 200 : 404}${raw ? " " + raw.slice(0, 120) : ""}`);
  res.writeHead(out ? 200 : 404, { ...cors, "Content-Type": "application/json" });
  res.end(JSON.stringify(out || { detail: "Not found" }));
});

const wss = new WebSocketServer({ noServer: true });
server.on("upgrade", (req, sock, head) => {
  if (!req.url.startsWith("/ws/on-call/")) {
    sock.destroy();
    return;
  }
  wss.handleUpgrade(req, sock, head, (ws) => wss.emit("connection", ws, req));
});

const reply = (ws, msg, data, message = "ok") =>
  ws.send(JSON.stringify({ type: "success", action: msg.action, requestId: msg.requestId, message, data, protocolVersion: 1, timestamp: iso() }));

wss.on("connection", (ws) => {
  clients.add(ws);
  log("ws connect");
  ws.on("close", () => clients.delete(ws));
  ws.on("message", (buf) => {
    let msg;
    try {
      msg = JSON.parse(buf.toString());
    } catch {
      return;
    }
    log(`ws <- ${buf.toString().slice(0, 200)}`);
    if (msg.action === "create_payment") {
      if (!/billingType/.test(JSON.stringify(msg))) {
        S.paid = true;
        setTimeout(() => reply(ws, msg, { payment_id: "pay-ana-1", status: "confirmed", queue_entry_id: "q-ana", queue_status: S.queueStatus, position: S.position }), S.walletDelay || 0);
        return;
      }
      if (/WALLET|OWN_CREDIT/.test(JSON.stringify(msg))) {
        S.paid = true;
        setTimeout(() => reply(ws, msg, { payment_id: "pay-ana-1", status: "confirmed", queue_entry_id: "q-ana", queue_status: S.queueStatus, position: S.position }), S.walletDelay || 0);
        return;
      }
      reply(ws, msg, {
        payment_id: "pay-ana-1",
        status: "PENDING",
        payment_methods: { pix: { payload: PIX, expirationDate: new Date(now() + 30 * 60000).toISOString().replace("T", " ").slice(0, 19) } },
      });
      return;
    }
    if (msg.action === "check_payment_status") {
      if (!S.paid) {
        reply(ws, msg, { status: "PENDING" });
        return;
      }
      reply(ws, msg, {
        status: "confirmed",
        queue_id: "q-ana",
        queue_status: S.queueStatus,
        position: S.position,
        has_anamnese: S.hasAnamnese,
        waiting_started_at: iso(-1.5),
        waitingStartedAt: iso(-1.5),
        ...(["matched", "in_progress"].includes(S.queueStatus) ? { consultation_id: CONSULTATION_ID } : {}),
        consultation_channel: "online_room",
      });
      return;
    }
    reply(ws, msg, {});
  });
});

server.listen(PORT, "127.0.0.1", () => process.stdout.write(`mock api ${BASE}\n`));
