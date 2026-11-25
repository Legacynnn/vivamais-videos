import { gradients } from "@/brand";
import type { Format } from "./formats";
import { uid, type ChipLayer, type Frame, type Layer } from "./model";

export function blankFrames(format: Format, base: { width: number; height: number }): Frame[] {
  const { width, height } = base;
  const pad = Math.round(Math.min(width, height) * 0.074);
  const size = Math.round(Math.min(width, height) * 0.09);
  return Array.from({ length: format.frames }, (_, i) => ({
    id: uid("f"),
    name: format.frames > 1 ? `Tela ${i + 1}` : "Capa",
    background: gradients.aurora,
    layers: [
      { id: uid(), type: "logo", name: "Logo", variant: "lockupWhite", x: pad, y: pad, h: Math.max(28, Math.round(size * 0.4)), anchor: "top" },
      {
        id: uid(),
        type: "text",
        name: "Título",
        slot: "Título",
        text: "Escreva o título aqui.",
        font: "display",
        size,
        color: "#FFFFFF",
        x: pad,
        y: height - pad - size * 2,
        w: Math.min(width - pad * 2, 900),
        anchor: "bottom",
      },
    ] satisfies Layer[],
  }));
}

type Benefit = { label: string; chip: Omit<ChipLayer, "id" | "x" | "y" | "type" | "name"> };

export const BENEFITS: Benefit[] = [
  { label: "Plantão ao vivo", chip: { variant: "pill", title: "Plantão 24h · ao vivo" } },
  { label: "Sem fila", chip: { variant: "pill", title: "Sem sala de espera" } },
  { label: "CRM verificado", chip: { variant: "pill", title: "CRM e RQE no perfil" } },
  { label: "Receita digital", chip: { variant: "pill", title: "Receita digital assinada" } },
  { label: "Médica entrou", chip: { variant: "person", title: "Dra. Júlia entrou", subtitle: "Sua consulta começou", badge: "assets/posts/photos/avatar-julia.webp" } },
  { label: "Posição na fila", chip: { variant: "stat", badge: "Plantão 24h · ao vivo", title: "Você é o 3º", subtitle: "Espera estimada ~5 min" } },
  { label: "Consulta marcada", chip: { variant: "date", badge: "NOV 14", title: "Sexta, às 09:00", subtitle: "Clínica geral · vídeo" } },
  { label: "Pergunta do paciente", chip: { variant: "bubble", tone: "violet", title: "Posso tomar algo pra dor de cabeça?" } },
  { label: "Resposta da Viva", chip: { variant: "bubble", subtitle: "Viva", title: "Me conta há quanto tempo dói\ne se tem febre." } },
  { label: "Botão baixar", chip: { variant: "cta", tone: "violet", title: "Baixe o app" } },
];

export function benefitLayer(benefit: Benefit, x: number, y: number): ChipLayer {
  return { id: uid(), type: "chip", name: benefit.label, x, y, rotate: -3, anchor: "center", ...benefit.chip };
}
