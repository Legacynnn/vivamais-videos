import io, pathlib, uuid
import django, segno
from django.conf import settings
from django.template.loader import render_to_string

BASE = pathlib.Path("/tmp/vmpdf")
settings.configure(TEMPLATES=[{"BACKEND": "django.template.backends.django.DjangoTemplates", "DIRS": [BASE / "templates"], "OPTIONS": {}}], USE_TZ=True)
django.setup()

VALIDATION_URL = "https://validar.iti.gov.br/"

def logo():
    wordmark = ("<span style=\"font-family: 'Liberation Sans', Arial, Helvetica, sans-serif; font-size: 15pt;"
        ' color: #111111; line-height: 1; letter-spacing: -0.2pt;">'
        '<span style="font-weight: 400;">Viva</span><span style="font-weight: 700;">mais</span></span>')
    mark = (BASE / "static/images/logo-mono.svg").read_text().strip().replace("<svg", '<svg width="45" height="45" style="display: block;"', 1)
    return ('<table border="0" cellpadding="0" cellspacing="0"><tr>'
        f'<td style="vertical-align: middle; padding-right: 7pt;">{mark}</td>'
        f'<td style="vertical-align: middle;">{wordmark}</td></tr></table>')

def qr(url, size_pt=46):
    b = io.BytesIO()
    segno.make(url, error="m").save(b, kind="svg", border=0, dark="#111111", omitsize=True, xmldecl=False, svgns=True, nl=False)
    m = b.getvalue().decode().replace('stroke="#111"', 'stroke="#111111"')
    return m.replace("<svg", f'<svg width="{size_pt}pt" height="{size_pt}pt"', 1)

ISSUED = "23/09/2026 às 15:16"
def base(label, uid):
    return {
        "doc_label": label, "doc_short_id": uid[:8].upper(), "doc_uuid": uid, "issued_at": ISSUED,
        "logo_svg": logo(), "validation_url": VALIDATION_URL,
        "parties": {
            "patient": {"name": "Maria Oliveira", "cpf": "529.982.247-25", "meta": "CPF 529.982.247-25 · Nasc. 14/03/1961 (65 anos) · Feminino", "email": "maria.oliveira@email.com"},
            "doctor": {"name": "Dra. Camila Rocha", "meta": "CRM 184233 / SP · Clínica Geral", "email": "camila.rocha@vivamais.ai"},
        },
        "context_cells": [{"label": "Consulta", "value": "23/09/2026 às 15:00 · Online · 15 min"}, {"label": "Nº do prontuário", "value": "PR-2026-004812", "mono": True}],
        "signature": {"qr_svg": qr(VALIDATION_URL), "document_line": f"Documento {uid} · gerado por Viva Mais em {ISSUED}"},
    }

docs = {
    "receita": ("pdf/prescription.html", "RECEITA MÉDICA", "7c1e4b52-9d3a-4f6e-b8a1-2f0c5d9e3a71", {
        "doc_subtitle": "Receita simples",
        "medications_table": {"columns": [{"label": "Medicamento", "width": "46%"}, {"label": "Posologia", "width": "30%"}, {"label": "Duração", "width": "24%"}],
            "rows": [
                {"cells": [{"title": "Dipirona 500 mg", "sub": "Comprimido · Genérico"}, {"text": "1 comprimido a cada 6 horas, se dor"}, {"text": "3 dias"}]},
                {"cells": [{"title": "Ciclobenzaprina 5 mg", "sub": "Comprimido revestido · Genérico"}, {"text": "1 comprimido à noite"}, {"text": "5 dias"}]},
            ]},
    }),
    "exames": ("pdf/medical_test_request.html", "SOLICITAÇÃO DE EXAMES", "b03f8a16-4e7d-4c29-9a55-6d1e8f2b7c40", {
        "extra_cell": {"label": "Indicação clínica", "value": "R50.9 — Febre não especificada"},
        "exams_table": {"columns": [{"label": "Exame", "width": "76%"}, {"label": "Código TUSS", "width": "24%", "align": "right"}],
            "rows": [
                {"cells": [{"title": "Hemograma completo"}, {"text": "40304361", "mono": True, "align": "right"}]},
                {"cells": [{"title": "Glicemia de jejum"}, {"text": "40302040", "mono": True, "align": "right"}]},
            ]},
        "orientation": "Jejum de 8 horas.",
    }),
    "atestado": ("pdf/medical_certificate.html", "ATESTADO MÉDICO", "e94d2c07-1b6f-4a83-8c3e-5a7f0d4b9e12", {
        "days": 1, "days_in_words": "um", "start_date": "23/09/2026", "end_date": "23/09/2026", "observations": "",
    }),
}
for name, (tpl, label, uid, body) in docs.items():
    ctx = base(label, uid)
    extra = body.pop("extra_cell", None)
    ctx.update(body)
    if extra: ctx["context_cells"].append(extra)
    (BASE / "out" / f"{name}.html").write_text(render_to_string(tpl, ctx), encoding="utf-8")
    print(name)
