import http from "node:http";
import QRCode from "qrcode";
import { readFileSync } from "node:fs";

const DOCTOR_DIR = new URL("../../../../assets/people/doctors/", import.meta.url);

const PORT = Number(process.env.MOCK_PORT || 8787);
const COMPANY_ID = "c0a1f7e2-aurora";
const now = new Date();
const iso = (offsetDays, hour = 10, minute = 0) => {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays, hour, minute);
  return d.toISOString();
};
const ymd = (offsetDays) => iso(offsetDays, 12).slice(0, 10);

const PLANS = [
  {
    id: "plan-essencial",
    title: "Viva+ Essencial",
    type: "COMPANY_BASIC",
    audience: "COMPANY",
    is_free: false,
    has_exclusive_price: false,
    price: "29.90",
    annual_price: "322.92",
    features: ["Clínico geral online 24h", "Chat com IA de saúde", "Descontos em farmácias parceiras"],
    consultation_price: "49.90",
    unlimited_consultation: false,
    unlimited_dependents: false,
    benefits: [],
  },
  {
    id: "plan-completo",
    title: "Viva+ Completo",
    type: "COMPANY_PLUS",
    audience: "COMPANY",
    is_free: false,
    has_exclusive_price: false,
    price: "49.90",
    annual_price: "538.92",
    features: [
      "Tudo do Essencial",
      "Especialistas com desconto",
      "Psicologia e nutrição",
      "Dependentes inclusos",
    ],
    consultation_price: "39.90",
    unlimited_consultation: false,
    unlimited_dependents: true,
    benefits: [],
  },
  {
    id: "plan-premium",
    title: "Viva+ Premium",
    type: "COMPANY_PREMIUM",
    audience: "COMPANY",
    is_free: false,
    has_exclusive_price: false,
    price: "79.90",
    annual_price: "862.92",
    features: [
      "Tudo do Completo",
      "Consultas ilimitadas com clínico geral",
      "Pesquisas NR-1 e canal de denúncias",
      "Gestor de conta dedicado",
    ],
    consultation_price: "0.00",
    unlimited_consultation: true,
    unlimited_dependents: true,
    benefits: [],
  },
];

const PEOPLE = [
  ["Marina Azevedo", "marina.azevedo@auroralog.com.br", "38219045716", "1991-03-14", "Analista de RH", "FEMALE", "11988112233"],
  ["Rafael Monteiro", "rafael.monteiro@auroralog.com.br", "27140983625", "1986-11-02", "Motorista", "MALE", "11988223344"],
  ["Camila Duarte", "camila.duarte@auroralog.com.br", "41987230564", "1993-07-21", "Coordenadora de Operações", "FEMALE", "11988334455"],
  ["Lucas Ferraz", "lucas.ferraz@auroralog.com.br", "35098217640", "1989-01-30", "Analista Financeiro", "MALE", "11988445566"],
  ["Beatriz Nogueira", "beatriz.nogueira@auroralog.com.br", "46218093571", "1997-09-08", "Assistente Administrativa", "FEMALE", "11988556677"],
  ["Thiago Barros", "thiago.barros@auroralog.com.br", "29837410265", "1984-05-17", "Supervisor de Frota", "MALE", "11988667788"],
  ["Juliana Prado", "juliana.prado@auroralog.com.br", "40172639858", "1995-12-03", "Analista de Logística", "FEMALE", "11988778899"],
  ["André Villela", "andre.villela@auroralog.com.br", "33904182677", "1990-04-26", "Conferente", "MALE", "11988889900"],
  ["Patrícia Lemos", "patricia.lemos@auroralog.com.br", "42761930584", "1988-08-11", "Compradora", "FEMALE", "11988990011"],
];

const fmtCpf = (d) => `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;

const makeEmployee = (row, index, overrides = {}) => ({
  id: `emp-${String(index + 1).padStart(2, "0")}`,
  full_name: row[0],
  email: row[1],
  principal_email: row[1],
  document: fmtCpf(row[2]),
  birth_date: row[3],
  job_title: row[4],
  gender: row[5],
  phone: row[6],
  principal_contact: { id: `ct-${index}`, type: "WHATSAPP", value: row[6], principal: true },
  status: "active",
  company: COMPANY_ID,
  assigned_signature: null,
  credit: null,
  first_access: { status: "PENDING", is_used: false, expires_at: iso(7), can_resend: true },
  ...overrides,
});

const state = {
  registered: false,
  subscription: null,
  groups: [],
  employees: [],
  creditConfiguration: null,
  usages: [],
  consumptions: [],
  billingCycles: [],
  signaturePayments: [],
  consultations: [],
  log: [],
};

const PIX_PAYLOAD =
  "00020126580014br.gov.bcb.pix0136a8f1c2d4-7b3e-4f6a-9c21-vivamais520400005303986540549.905802BR5913VIVA MAIS SA6009SAO PAULO62070503***6304A1B2";
let pixImage = "";

const user = () => ({
  id: "user-aurora",
  email: "rh@auroralog.com.br",
  name: "Aurora Logística",
  alternative_email: "rh@auroralog.com.br",
  user_type: "COMPANY",
  available_profiles: [],
  profile: {
    id: COMPANY_ID,
    type: "COMPANY",
    name: "Aurora Logística",
    corporate_name: "Aurora Logística Ltda",
    document: "12345678000190",
    medical_register: "",
    specialties: [],
    avatar_url: null,
    number_employees: state.employees.length,
    number_active_employees: state.employees.filter((e) => e.first_access.status === "COMPLETED").length,
    signature: state.subscription
      ? {
          id: state.subscription.id,
          value: String(state.subscription.value),
          signature_type: { ...PLANS[1], created_at: iso(-1), updated_at: iso(-1), payment_tolerance_days: 5 },
          expiration_date: ymd(30),
          payment_date: ymd(0),
          is_active: true,
          asaas_id: "sub_aurora",
          paid_subscription: true,
          canceled: false,
          reason_cancellation: null,
        }
      : undefined,
  },
});

const creditTotals = () => {
  const cfg = state.creditConfiguration;
  if (!cfg) return null;
  const used = state.usages.reduce((t, u) => t + Number(u.value), 0);
  const total = Number(cfg.prepaid_amount);
  return {
    ...cfg,
    total_value_credit: total.toFixed(2),
    total_available_credit: (total - used).toFixed(2),
    total_used_credit_current_cycle: used.toFixed(2),
  };
};

const company = () => ({
  id: COMPANY_ID,
  name: "Aurora Logística",
  email: "rh@auroralog.com.br",
  cnpj: "12345678000190",
  created_at: iso(-1),
  contacts: [],
  addresses: [],
  employees_count: state.employees.length,
  active_signatures: state.groups.filter((g) => g.is_active).length,
  credit_configuration: creditTotals(),
});

const paginate = (items, url) => {
  const page = Number(url.searchParams.get("page") || 1);
  const size = Number(url.searchParams.get("page_size") || 10);
  const start = (page - 1) * size;
  return {
    links: { next: null, previous: null },
    count: items.length,
    total: items.length,
    page,
    page_size: size,
    total_pages: Math.max(1, Math.ceil(items.length / size)),
    next: null,
    previous: null,
    results: items.slice(start, start + size),
  };
};

const groupView = (g) => {
  const plan = PLANS.find((p) => p.id === g.signature_type);
  const active = state.employees.filter((e) => e.assigned_signature?.group === g.id).length;
  return {
    id: g.id,
    company: { id: COMPANY_ID, name: "Aurora Logística" },
    signature_type: { id: plan.id, title: plan.title, price: Number(plan.price) },
    max_employees: g.max_employees,
    active_employees: active,
    total_value: Number(plan.price) * g.max_employees,
    is_active: g.is_active,
    is_paid: g.is_paid,
  };
};

const readBody = (req) =>
  new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({ __raw: raw.slice(0, 200) });
      }
    });
  });

const assignGroup = (employee, groupId) => {
  const g = state.groups.find((x) => x.id === groupId);
  const plan = PLANS.find((p) => p.id === g.signature_type);
  employee.assigned_signature = {
    id: groupId,
    group: groupId,
    assignment_status: "ACTIVE",
    assignment_start_date: ymd(0),
    assignment_end_date: null,
    signature_type: { id: plan.id, title: plan.title },
  };
};

const SPECIALTIES = [
  ["sp-cardio", "Cardiologia"],
  ["sp-clinico", "Clínico Geral"],
  ["sp-derma", "Dermatologia"],
  ["sp-nutri", "Nutrição"],
  ["sp-orto", "Ortopedia"],
  ["sp-psico", "Psicologia"],
].map(([id, name]) => ({ id, name, description: "", price: 189.9, can_prescribe: true, can_issue_certificate: true }));

const DOCTORS = [
  ["doc-1", "Mariana Costa", "CRM-SP 148220", "d0.png", "189.90"],
  ["doc-2", "Rafael Lima", "CRM-SP 132907", "d1.jpeg", "210.00"],
  ["doc-3", "Júlia Andrade", "CRM-RJ 098431", "d2.png", "175.00"],
].map(([id, name, register, photo, price]) => ({
  id,
  type: "DOCTOR",
  name,
  full_name: name,
  corporate_name: name,
  document: "00000000000",
  medical_register: register,
  profession: "Médico",
  register_label: "CRM",
  avatar_url: `http://127.0.0.1:${PORT}/media/doctors/${photo}`,
  rating: 4.9,
  average_rating: 4.9,
  total_ratings: 32,
  attends_online: true,
  user: { id: `u-${id}`, email: `${id}@vivamais.ai`, name, alternative_email: "", date_joined: iso(-200), status: "online" },
  specialties: [
    {
      id: `ps-${id}`,
      partner: id,
      specialty: { id: "sp-cardio", name: "Cardiologia", can_prescribe: true, can_issue_certificate: true },
      name: "Cardiologia",
      rqe: "45120",
      has_custom_price: false,
      price,
      special_price: price,
      online_price: price,
      special_online_price: price,
      max_duration: "00:30:00",
      created_at: iso(-200),
      updated_at: iso(-200),
    },
  ],
  clinic: null,
  contacts: [],
  addresses: [],
  social_medias: [],
}));

const SLOT_TIMES = ["09:00", "09:30", "10:00", "14:00", "14:30", "15:00", "16:00", "16:30"];

const consultationView = (c) => ({
  id: c.id,
  patient: c.patient,
  patient_name: state.employees.find((e) => e.id === c.patient)?.full_name || "Marina Azevedo",
  doctor: c.doctor,
  doctor_name: DOCTORS.find((d) => d.id === c.doctor).name,
  selected_specialty: "ps-" + c.doctor,
  specialty_name: "Cardiologia",
  consultation_date: c.consultation_date,
  scheduled_end: null,
  consultation_type: "online",
  doctor_crm: DOCTORS.find((d) => d.id === c.doctor).medical_register,
  doctor_register_label: "CRM",
  doctor_avatar_url: DOCTORS.find((d) => d.id === c.doctor).avatar_url,
  status: c.status || "scheduled",
  notes: c.notes || "",
  medical_record: null,
  is_historical: false,
  whereby_host_room_url: null,
  whereby_room_url: "https://vivamais.whereby.com/aurora",
  whereby_meeting_id: "123",
  created_at: iso(0),
  updated_at: iso(0),
  on_call_match: null,
  started_at: null,
  ended_at: null,
  duration_seconds: null,
  consultation_channel: "online_room",
  source: "scheduled",
  scheduled_by_type: "company",
  status_payement: true,
  billing_type: "COMPANY_INVOICE",
  invoice_url: "",
  price: 189.9,
  asaas_charge_id: null,
  rating: null,
  can_view_ficha: false,
  can_view_documents: false,
});

const employeeUser = () => ({
  id: "user-marina",
  email: "marina.azevedo@auroralog.com.br",
  name: "Marina Azevedo",
  alternative_email: "marina.azevedo@auroralog.com.br",
  user_type: "CLIENT",
  available_profiles: [],
  profile: {
    id: "emp-01",
    type: "CLIENT",
    name: "Marina Azevedo",
    full_name: "Marina Azevedo",
    corporate_name: null,
    document: "38219045716",
    medical_register: "",
    birth_date: "1991-03-14",
    gender: "FEMALE",
    specialties: [],
    avatar_url: null,
    credit: { id: "cr-emp-01", monthly_limit: null, used_amount: "0.00", available_credit: 1500, is_active: true, employee_full_name: "Marina Azevedo" },
    signature: {
      id: "sig-marina",
      signature_type: { ...PLANS[2], created_at: iso(-1), updated_at: iso(-1), payment_tolerance_days: 5 },
      expiration_date: ymd(30),
      payment_date: ymd(0),
      is_active: true,
      asaas_id: null,
      paid_subscription: true,
      canceled: false,
      reason_cancellation: null,
    },
  },
});

const routes = [
  ["GET", /^\/users\/me\/?$/, () => [200, state.persona === "employee" ? employeeUser() : user()]],
  ["POST", /^\/companies\/employees\/first-access\/confirm\/?$/, () => [200, { detail: "ok", email: "marina.azevedo@auroralog.com.br" }]],
  ["GET", /^\/partners\/specialties\/?$/, (_, url) => [200, paginate(SPECIALTIES, url)]],
  ["GET", /^\/partners\/?$/, (_, url) => [200, paginate(DOCTORS, url)]],
  ["GET", /^\/partners\/([^/]+)\/?$/, (_b, _u, m) => [200, DOCTORS.find((d) => d.id === m[1]) || DOCTORS[0]]],
  [
    "POST",
    /^\/partners\/slots\/?$/,
    (body) => [
      200,
      {
        date: body.date,
        partner_id: body.partner_id,
        data: [
          {
            availability_id: "av-1",
            start_time: "09:00",
            end_time: "18:00",
            slots: SLOT_TIMES.map((time) => ({ time: `${time}:00`, status: "free", type: "online", max_duration: "00:30:00", specialty: "Cardiologia" })),
          },
        ],
      },
    ],
  ],
  [
    "POST",
    /^\/consultations\/consultations\/checkout\/quote\/?$/,
    () => [
      200,
      {
        base_amount: "189.90",
        discount_source: "none",
        discount_label: null,
        discount_amount: "0.00",
        subtotal_after_discount: "189.90",
        wallet_amount_applied: "0.00",
        remaining_amount: "189.90",
        messages: [],
      },
    ],
  ],
  [
    "POST",
    /^\/consultations\/consultations\/?$/,
    (body) => {
      const c = { id: `cons-new-${state.consultations.length + 1}`, patient: body.patient, doctor: body.doctor, consultation_date: body.consultation_date, notes: body.notes, status: "scheduled" };
      state.consultations.unshift(c);
      return [201, { id: c.id, status_payement: true }];
    },
  ],
  ["GET", /^\/consultations\/consultations\/([^/]+)\/?$/, (_b, _u, m) => {
    const c = state.consultations.find((x) => x.id === m[1]) || state.consultations[0];
    return [200, consultationView(c)];
  }],

  ["POST", /^\/auth\/token\/?$/, () => [200, { access: "mock-access", refresh: "mock-refresh", user: user() }]],
  ["POST", /^\/auth\/refresh-token\/?$/, () => [200, { access: "mock-access", refresh: "mock-refresh" }]],
  ["POST", /^\/users\/logout\/?$/, () => [200, {}]],
  [
    "POST",
    /^\/companies\/?$/,
    () => {
      state.registered = true;
      return [201, { id: COMPANY_ID, name: "Aurora Logística" }];
    },
  ],
  ["GET", /^\/signatures\/?$/, (_, url) => [200, paginate(PLANS, url)]],
  ["GET", /^\/companies\/signature\/compnay\/?$/, () => [200, { results: state.subscription ? [state.subscription] : [] }]],
  [
    "POST",
    /^\/companies\/signature\/compnay\/?$/,
    (body) => {
      const value = state.groups.reduce((t, g) => t + Number(PLANS.find((p) => p.id === g.signature_type).price) * g.max_employees, 0);
      state.pendingSubscription = {
        id: "sig-aurora",
        company: { id: COMPANY_ID, name: "Aurora Logística" },
        value: value.toFixed(2),
        expiration_date: ymd(30),
        payment_date: ymd(0),
        is_active: true,
        paid_subscription: true,
        canceled: false,
        reason_cancellation: null,
        created_at: iso(0),
      };
      return [
        201,
        {
          id: "sig-aurora",
          payment_id: "pay_aurora_1",
          payment_methods: { pix: { encodedImage: pixImage, payload: PIX_PAYLOAD, expirationDate: iso(1) } },
        },
      ];
    },
  ],
  [
    "POST",
    /^\/companies\/signature\/compnay\/check-payment-status\/?$/,
    () => {
      if (state.payNow) {
        state.subscription = state.pendingSubscription;
        state.groups.forEach((g) => (g.is_paid = true));
        return [200, { status: "confirmed" }];
      }
      return [200, { status: "pending" }];
    },
  ],
  [
    "GET",
    /^\/companies\/signature\/compnay\/[^/]+\/payments\/?$/,
    () => [200, { results: state.signaturePayments }],
  ],
  [
    "GET",
    /^\/companies\/signature-employees-company\/?$/,
    (_, url) => [200, paginate(state.groups.map(groupView), url)],
  ],
  [
    "POST",
    /^\/companies\/signature-employees-company\/?$/,
    (body) => {
      const g = {
        id: `grp-${state.groups.length + 1}`,
        signature_type: body.signature_type,
        max_employees: Number(body.max_employees || 0),
        is_active: true,
        is_paid: Boolean(state.subscription),
      };
      state.groups.push(g);
      return [201, groupView(g)];
    },
  ],
  [
    "POST",
    /^\/companies\/signature-employees-company\/([^/]+)\/many\/?$/,
    (body, _u, m) => {
      const list = Array.isArray(body) ? body : body.employees || body.employee_ids || [];
      list.forEach((item) => {
        const id = typeof item === "string" ? item : item.employee || item.id;
        const e = state.employees.find((x) => x.id === id);
        if (e) assignGroup(e, m[1]);
      });
      return [200, { detail: "ok" }];
    },
  ],
  [
    "PATCH",
    /^\/companies\/signature-employees-company\/([^/]+)\/?$/,
    (body, _u, m) => {
      const g = state.groups.find((x) => x.id === m[1]);
      Object.assign(g, body);
      return [200, groupView(g)];
    },
  ],
  [
    "DELETE",
    /^\/companies\/signature-employees-company\/([^/]+)\/?$/,
    (_b, _u, m) => {
      state.groups = state.groups.filter((x) => x.id !== m[1]);
      return [204, null];
    },
  ],
  ["GET", /^\/companies\/employees\/?$/, (_, url) => [200, paginate(state.employees, url)]],
  [
    "POST",
    /^\/companies\/employees\/?$/,
    (body) => {
      const row = PEOPLE[0];
      const e = makeEmployee(row, state.employees.length, {
        full_name: body.full_name || row[0],
        email: body.email || row[1],
        principal_email: body.email || row[1],
        job_title: body.job_title || row[4],
      });
      state.employees.push(e);
      return [201, e];
    },
  ],
  [
    "POST",
    /^\/companies\/employees\/add\/spreadsheet\/[^/]+\/?$/,
    () => {
      const start = state.employees.length;
      PEOPLE.slice(1).forEach((row, i) => state.employees.push(makeEmployee(row, start + i)));
      return [201, { count: PEOPLE.length - 1 }];
    },
  ],
  ["POST", /^\/companies\/employees\/[^/]+\/first-access\/resend\/?$/, () => [200, {}]],
  ["GET", /^\/companies\/credit-usage\/?$/, (_, url) => [200, paginate(state.usages, url)]],
  [
    "POST",
    /^\/companies\/credit-configuration\/?$/,
    (body) => {
      state.creditConfiguration = {
        id: "cfg-aurora",
        company: COMPANY_ID,
        company_detail: { name: "Aurora Logística" },
        billing_day: Number(body.billing_day),
        current_cycle_start: ymd(0),
        next_billing_date: ymd(30),
        pending_billing_day: null,
        credit_mode: "PREPAID",
        prepaid_amount: Number(body.prepaid_amount).toFixed(2),
        migration_scheduled_for: null,
        balance_update_message: "",
      };
      return [201, creditTotals()];
    },
  ],
  [
    "PATCH",
    /^\/companies\/credit-configuration\/[^/]+\/?$/,
    (body) => {
      Object.assign(state.creditConfiguration, {
        billing_day: Number(body.billing_day),
        prepaid_amount: Number(body.prepaid_amount).toFixed(2),
      });
      return [200, creditTotals()];
    },
  ],
  ["GET", /^\/companies\/credit-configuration\/?$/, () => [200, { results: state.creditConfiguration ? [creditTotals()] : [] }]],
  [
    "POST",
    /^\/companies\/employee-credit\/?$/,
    (body) => {
      (Array.isArray(body) ? body : [body]).forEach((item) => {
        const e = state.employees.find((x) => x.id === item.employee);
        if (!e) return;
        e.credit = {
          id: `cr-${e.id}`,
          monthly_limit: item.monthly_limit,
          used_amount: "0.00",
          available_credit: state.creditConfiguration?.prepaid_amount || "0.00",
          is_active: true,
          is_authorized: item.is_authorized !== false,
        };
      });
      return [201, {}];
    },
  ],
  [
    "PATCH",
    /^\/companies\/employee-credit\/([^/]+)\/?$/,
    (body, _u, m) => {
      const e = state.employees.find((x) => x.credit?.id === m[1]);
      e.credit.monthly_limit = body.monthly_limit == null ? null : Number(body.monthly_limit).toFixed(2);
      e.credit.is_authorized = body.is_authorized;
      return [200, { ...e.credit, employee_detail: { id: e.id, full_name: e.full_name, company_name: "" } }];
    },
  ],
  ["GET", /^\/companies\/employee-credit\/?$/, () => [200, { results: state.employees.filter((e) => e.credit).map((e) => e.credit) }]],
  ["GET", /^\/companies\/billing-cycle\/?$/, () => [200, { results: state.billingCycles }]],
  [
    "POST",
    /^\/companies\/billing-cycle\/([^/]+)\/refresh-payment-info\/?$/,
    (_b, _u, m) => [200, state.billingCycles.find((c) => c.id === m[1])],
  ],
  ["GET", /^\/companies\/employee-consumptions\/filter-options\/?$/, () => [
    200,
    {
      employees: state.employees.map((e) => ({ id: e.id, full_name: e.full_name, document: e.document })),
      signature_groups: state.groups.map((g) => ({ id: g.id, title: PLANS.find((p) => p.id === g.signature_type).title })),
    },
  ]],
  ["GET", /^\/companies\/employee-consumptions\/?$/, (_, url) => [200, paginate(state.consumptions, url)]],
  ["GET", /^\/consultations\/consultations\/?$/, (_, url) => [200, paginate(state.consultations.map(consultationView), url)]],
  ["GET", /^\/companies\/([^/]+)\/?$/, () => [200, company()]],
];

const scenarios = {
  reset() {
    Object.assign(state, {
      persona: "company",
      registered: false,
      subscription: null,
      pendingSubscription: null,
      payNow: false,
      groups: [],
      employees: [],
      creditConfiguration: null,
      usages: [],
      consumptions: [],
      billingCycles: [],
      signaturePayments: [],
      consultations: [],
    });
  },
  asEmployee() {
    state.persona = "employee";
  },
  asCompany() {
    state.persona = "company";
  },
  booked() {
    state.consultations = [
      { id: "cons-live", patient: "emp-01", doctor: "doc-1", consultation_date: iso(0, now.getHours(), now.getMinutes() + 20), status: "scheduled", notes: "" },
    ];
  },
  payNow() {
    state.payNow = true;
  },
  subscribed() {
    scenarios.reset();
    state.registered = true;
    state.groups = [
      { id: "grp-1", signature_type: "plan-completo", max_employees: 10, is_active: true, is_paid: true },
    ];
    state.subscription = {
      id: "sig-aurora",
      company: { id: COMPANY_ID, name: "Aurora Logística" },
      value: "499.00",
      expiration_date: ymd(30),
      payment_date: ymd(0),
      is_active: true,
      paid_subscription: true,
      canceled: false,
      reason_cancellation: null,
      created_at: iso(0),
    };
    state.signaturePayments = [
      {
        id: "pay-1",
        value: 499,
        status: "RECEIVED",
        description: "Assinatura empresarial Viva+ Completo (10 vidas)",
        paymentDate: ymd(0),
        invoiceUrl: "https://vivamais.ai/fatura/pay-1",
        dueDate: ymd(0),
      },
    ];
  },
  withEmployees() {
    scenarios.subscribed();
    PEOPLE.forEach((row, i) => state.employees.push(makeEmployee(row, i)));
  },
  activated() {
    state.employees.forEach((e, i) => {
      if (i < 7) e.first_access = { status: "COMPLETED", is_used: true, expires_at: null, can_resend: false };
    });
  },
  grouped() {
    scenarios.withEmployees();
    scenarios.activated();
    state.groups.push({ id: "grp-2", signature_type: "plan-premium", max_employees: 3, is_active: true, is_paid: true });
    state.employees.forEach((e, i) => assignGroup(e, i < 3 ? "grp-2" : "grp-1"));
  },
  credited() {
    scenarios.grouped();
    state.creditConfiguration = {
      id: "cfg-aurora",
      company: COMPANY_ID,
      company_detail: { name: "Aurora Logística" },
      billing_day: 10,
      current_cycle_start: ymd(0),
      next_billing_date: ymd(11),
      pending_billing_day: null,
      credit_mode: "PREPAID",
      prepaid_amount: "1500.00",
      migration_scheduled_for: null,
      balance_update_message: "",
    };
    state.employees.forEach((e, i) => {
      if (i < 6)
        e.credit = {
          id: `cr-${e.id}`,
          monthly_limit: i === 1 ? "200.00" : null,
          used_amount: "0.00",
          available_credit: "1500.00",
          is_active: true,
          is_authorized: true,
        };
    });
  },
  invoiced(paid = false) {
    scenarios.credited();
    scenarios.consumed();
    state.billingCycles = [
      {
        id: "cycle-1",
        start_date: ymd(-19),
        end_date: ymd(11),
        total_billed_amount: "1500.00",
        status: paid ? "RECEIVED" : "PENDING",
        payment_asaas_id: "pay_cycle_1",
        invoiceUrl: "https://vivamais.ai/fatura/cycle-1",
        payment_date: paid ? ymd(0) : null,
        payload_pix: paid ? null : PIX_PAYLOAD,
        encodedImage: paid ? null : pixImage,
        usage_items: state.usages.map((u) => ({
          id: u.id,
          value: u.value,
          description: u.description,
          employee_full_name: u.employee_credit.employee_full_name,
          consultation: u.id,
          is_reversed: false,
          created_at: u.created_at,
        })),
        consultation_usage_items: [],
        migration_items: [],
      },
    ];
  },
  paid() {
    scenarios.invoiced(true);
  },
  billPending() {
    state.billingCycles = [
      {
        id: "cycle-1",
        start_date: ymd(0),
        end_date: ymd(30),
        total_billed_amount: "1500.00",
        status: "PENDING",
        payment_asaas_id: "pay_cycle_1",
        invoiceUrl: "https://vivamais.ai/fatura/cycle-1",
        payment_date: null,
        payload_pix: PIX_PAYLOAD,
        encodedImage: pixImage,
        usage_items: [],
        consultation_usage_items: [],
        migration_items: [],
      },
    ];
    state.signaturePayments = [
      {
        id: "pay-1",
        value: 499,
        status: "RECEIVED",
        description: "Assinatura empresarial Viva+ Completo (10 vidas)",
        paymentDate: ymd(0),
        invoiceUrl: "https://vivamais.ai/fatura/pay-1",
        dueDate: ymd(0),
      },
    ];
  },
  billPaid() {
    Object.assign(state.billingCycles[0], { status: "RECEIVED", payment_date: ymd(0), payload_pix: null, encodedImage: null });
  },
  consume() {
    scenarios.consumed();
  },
  consumed() {
    const rows = [
      [0, "Cardiologia", "189.90", -1, 14, 30],
      [2, "Psicologia", "120.00", -2, 9, 0],
      [1, "Clínico Geral", "89.90", -3, 16, 15],
      [4, "Dermatologia", "159.90", -4, 11, 45],
      [3, "Nutrição", "99.90", -6, 10, 30],
      [5, "Ortopedia", "179.90", -8, 15, 0],
    ];
    state.usages = rows.map(([i, specialty, value, d, h, m], n) => ({
      id: `use-${n + 1}`,
      value,
      description: `Consulta de ${specialty}`,
      created_at: iso(d, h, m),
      is_invoiced: false,
      employee_credit: { employee_full_name: state.employees[i].full_name },
    }));
    state.consumptions = rows.map(([i, specialty, value, d, h, m], n) => {
      const e = state.employees[i];
      const g = state.groups.find((x) => x.id === e.assigned_signature.group);
      const plan = PLANS.find((p) => p.id === g.signature_type);
      return {
        id: `con-${n + 1}`,
        company: COMPANY_ID,
        employee: e.id,
        employee_detail: { id: e.id, full_name: e.full_name, status: "active", company: COMPANY_ID, company_name: "Aurora Logística" },
        signature_group: plan.title,
        signature_group_id: g.id,
        name: e.full_name,
        plan_type: plan.title,
        consumption_type: "CONSULTATION",
        consumption_type_display: "Consulta",
        specialty_name: specialty,
        cost: value,
        occurred_at: iso(d, h, m),
        used_credit: true,
        credit_source: "COMPANY",
        credit_source_display: "Crédito da empresa",
        credit_returned: false,
        used_benefit: n % 2 === 0,
        catalog_benefit: null,
        catalog_benefit_detail: null,
        had_payment: false,
        is_online: true,
        consultation: `cons-${n + 1}`,
        purchase_of_service: null,
        created_at: iso(d, h, m),
        updated_at: iso(d, h, m),
      };
    });
    state.employees.forEach((e) => {
      if (!e.credit) return;
      const used = state.usages.filter((u) => u.employee_credit.employee_full_name === e.full_name).reduce((t, u) => t + Number(u.value), 0);
      e.credit.used_amount = used.toFixed(2);
    });
  },
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  const body = await readBody(req);
  if (url.pathname.startsWith("/__scenario/")) {
    const names = url.pathname.replace("/__scenario/", "").split("+");
    names.forEach((n) => scenarios[n]());
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: names }));
    return;
  }
  if (url.pathname.startsWith("/media/doctors/")) {
    const file = url.pathname.split("/").pop();
    res.writeHead(200, { "Content-Type": file.endsWith("png") ? "image/png" : "image/jpeg" });
    res.end(readFileSync(new URL(file, DOCTOR_DIR)));
    return;
  }
  if (url.pathname === "/__log") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(state.log));
    state.log = [];
    return;
  }
  const route = routes.find(([method, re]) => method === req.method && re.test(url.pathname));
  if (!route) {
    state.log.push({ miss: `${req.method} ${url.pathname}${url.search}`, body });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ results: [], count: 0 }));
    return;
  }
  state.log.push({ hit: `${req.method} ${url.pathname}${url.search}`, body: req.method === "GET" ? undefined : body });
  const [status, payload] = route[2](body, url, url.pathname.match(route[1]));
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(payload == null ? "" : JSON.stringify(payload));
});

pixImage = (await QRCode.toDataURL(PIX_PAYLOAD, { margin: 1, width: 360 })).replace(/^data:image\/png;base64,/, "");
server.listen(PORT, "127.0.0.1", () => process.stdout.write(`mock api on ${PORT}\n`));
