import pricing from "../data/pricing.json";
import modelsDevCatalog from "../data/models-dev.json";

export type Locale = "id" | "en";

export interface PricingModel {
  id: string;
  name: string;
  provider: string;
  context: number;
  input_idr: number;
  output_idr: number;
  input_mc: number;
  output_mc: number;
  kind: string;
  premium?: boolean;
  dimensions?: number;
  image_capable?: boolean;
  embedding_capable?: boolean;
  tool_capable?: boolean;
  reasoning_capable?: boolean;
  structured_output_capable?: boolean;
  responses_capable?: boolean;
  cached_input_mc?: number;
  cached_input_idr?: number;
  aliases?: string[];
  video_pricing?: {
    unit: "second" | "token";
    idr_per_sec?: number;
    mc_per_sec?: number;
  };
}

export interface ModelDevDetail {
  id?: string;
  type?: string;
  name?: string;
  description?: string;
  family?: string;
  attachment?: boolean;
  reasoning?: boolean;
  tool_call?: boolean;
  temperature?: boolean;
  structured_output?: boolean;
  knowledge?: string;
  release_date?: string;
  last_updated?: string;
  modalities?: {
    input?: string[];
    output?: string[];
  };
  open_weights?: boolean;
  limit?: {
    context?: number;
    input?: number;
    output?: number;
  };
  license?: string;
}

export const allModels: PricingModel[] = pricing.models as PricingModel[];
export const catalogUpdated: string = pricing.updated;
const modelDetails = modelsDevCatalog as Record<string, ModelDevDetail>;

export function getModelDetail(model: PricingModel): ModelDevDetail | undefined {
  return (
    modelDetails[model.id] ??
    (model.aliases ?? []).map((alias) => modelDetails[alias]).find(Boolean)
  );
}

export function getReleaseDate(model: PricingModel): string {
  return getModelDetail(model)?.release_date ?? "";
}

export function isFreeModel(model: PricingModel): boolean {
  return model.input_idr === 0 && model.output_idr === 0;
}

export function getTopCurrentModels(limit = 8): PricingModel[] {
  return [...allModels]
    .filter((m) => getReleaseDate(m).length > 0)
    .sort((a, b) => {
      const dateDiff = getReleaseDate(b).localeCompare(getReleaseDate(a));
      if (dateDiff !== 0) return dateDiff;
      return a.id.localeCompare(b.id);
    })
    .slice(0, limit);
}

export function getFreeModels(): PricingModel[] {
  return allModels.filter(isFreeModel).sort((a, b) => a.id.localeCompare(b.id));
}

export function formatContext(tokens: number): string {
  if (!tokens || tokens <= 0) return "-";
  return tokens >= 1_000_000
    ? `${(tokens / 1_000_000).toLocaleString()}M`
    : `${Math.round(tokens / 1_000)}K`;
}

export function formatIdr(amount: number, lang: Locale): string {
  const formatter = new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US", {
    maximumFractionDigits: 0,
  });
  return `Rp${formatter.format(amount)}`;
}

export function getProviders(): string[] {
  return [...new Set(allModels.map((m) => m.provider))].sort();
}

export function getKinds(): string[] {
  return [
    ...new Set(
      allModels.flatMap((m) => [m.kind, ...(m.image_capable ? ["image"] : [])]),
    ),
  ].sort();
}

/** URL to a model detail page on the docs site. */
export function modelDetailHref(lang: Locale, model: PricingModel): string {
  return `/${lang}/models/${model.id}/`;
}

type UiKey =
  | "models.h2"
  | "models.sub"
  | "models.seeAll"
  | "models.freeOnly"
  | "models.th.model"
  | "models.th.provider"
  | "models.th.type"
  | "models.th.release"
  | "models.th.context"
  | "models.th.input"
  | "models.th.output"
  | "models.search"
  | "models.provider.all"
  | "models.type.all"
  | "models.empty"
  | "models.sort.aria"
  | "models.detail.back"
  | "models.detail.home"
  | "models.detail.copyId"
  | "models.detail.copiedId"
  | "models.detail.useInCode"
  | "models.detail.noTraining"
  | "models.detail.freeNoTrainingWarning"
  | "models.detail.cachedInput"
  | "models.detail.inputModality"
  | "models.detail.outputModality"
  | "models.detail.open"
  | "models.detail.closed"
  | "models.detail.toolCall"
  | "models.detail.reasoning"
  | "models.detail.structured"
  | "models.detail.temperature"
  | "models.detail.attachment"
  | "models.detail.provider"
  | "models.detail.context"
  | "models.detail.maxOutput"
  | "models.detail.release"
  | "models.detail.family"
  | "models.detail.license"
  | "models.detail.capabilities"
  | "models.detail.about"
  | "models.detail.installNode"
  | "models.detail.installGo"
  | "models.detail.priceNote"
  | "models.detail.pricing"
  | "models.detail.specs"
  | "models.detail.modalities"
  | "models.detail.responses"
  | "models.preview.freeBadge"
  | "models.preview.freeTooltip"
  | "models.type.chat"
  | "models.type.embedding"
  | "models.type.image"
  | "models.type.decision";

export const ui: Record<Locale, Record<UiKey, string>> = {
  id: {
    "models.h2": "Katalog Model",
    "models.sub": "Semua {count} model AI dalam satu API key. Harga per 1 juta token dalam Rupiah.",
    "models.seeAll": "Referensi teknis API →",
    "models.freeOnly": "Hanya model gratis (Rp0)",
    "models.th.model": "Model",
    "models.th.provider": "Provider",
    "models.th.type": "Tipe",
    "models.th.release": "Rilis",
    "models.th.context": "Context",
    "models.th.input": "Input / 1jt token",
    "models.th.output": "Output / 1jt token",
    "models.search": "Cari model atau provider…",
    "models.provider.all": "Semua provider",
    "models.type.all": "Semua tipe",
    "models.empty": "Tidak ada model yang cocok dengan filter.",
    "models.sort.aria": "Urutkan berdasarkan",
    "models.detail.back": "Semua Model",
    "models.detail.home": "Beranda",
    "models.detail.copyId": "Salin ID",
    "models.detail.copiedId": "Tersalin",
    "models.detail.useInCode": "Gunakan model ini di kode",
    "models.detail.noTraining": "Jaminan tidak dipakai training",
    "models.detail.freeNoTrainingWarning": "Model gratis tidak dijamin bebas-training; lihat catatan harga.",
    "models.detail.cachedInput": "Cache Input / 1jt",
    "models.detail.inputModality": "Masukan",
    "models.detail.outputModality": "Keluaran",
    "models.detail.open": "Terbuka",
    "models.detail.closed": "Tertutup",
    "models.detail.toolCall": "Pemanggilan alat",
    "models.detail.reasoning": "Penalaran",
    "models.detail.structured": "Output terstruktur",
    "models.detail.temperature": "Temperature",
    "models.detail.attachment": "Lampiran",
    "models.detail.provider": "Provider",
    "models.detail.context": "Context window",
    "models.detail.maxOutput": "Output maks.",
    "models.detail.release": "Rilis",
    "models.detail.family": "Keluarga",
    "models.detail.license": "Lisensi",
    "models.detail.capabilities": "Kemampuan",
    "models.detail.about": "Tentang model",
    "models.detail.installNode": "Node.js SDK",
    "models.detail.installGo": "Go SDK",
    "models.detail.priceNote": "Harga per 1 juta token dalam Rupiah, sudah termasuk markup.",
    "models.detail.pricing": "Harga",
    "models.detail.specs": "Spesifikasi",
    "models.detail.modalities": "Modalitas",
    "models.detail.responses": "Responses API",
    "models.preview.freeBadge": "Gratis · Rp0",
    "models.preview.freeTooltip": "Model gratis tidak dikenai biaya, tetapi data prompt mungkin dipakai untuk melatih model dasar upstream.",
    "models.type.chat": "Chat",
    "models.type.embedding": "Embedding",
    "models.type.image": "Image",
    "models.type.decision": "Decision",
  },
  en: {
    "models.h2": "Model catalog",
    "models.sub": "All {count} AI models behind one API key. Prices per 1 million tokens in Rupiah.",
    "models.seeAll": "Technical API reference →",
    "models.freeOnly": "Free models only (Rp0)",
    "models.th.model": "Model",
    "models.th.provider": "Provider",
    "models.th.type": "Type",
    "models.th.release": "Release",
    "models.th.context": "Context",
    "models.th.input": "Input / 1M tokens",
    "models.th.output": "Output / 1M tokens",
    "models.search": "Search models or providers…",
    "models.provider.all": "All providers",
    "models.type.all": "All types",
    "models.empty": "No models match the filter.",
    "models.sort.aria": "Sort by",
    "models.detail.back": "All models",
    "models.detail.home": "Home",
    "models.detail.copyId": "Copy ID",
    "models.detail.copiedId": "Copied",
    "models.detail.useInCode": "Use this model in code",
    "models.detail.noTraining": "No-training guarantee",
    "models.detail.freeNoTrainingWarning": "Free models are not guaranteed no-training; see the pricing note.",
    "models.detail.cachedInput": "Cache input / 1M",
    "models.detail.inputModality": "Input",
    "models.detail.outputModality": "Output",
    "models.detail.open": "Open",
    "models.detail.closed": "Closed",
    "models.detail.toolCall": "Tool calling",
    "models.detail.reasoning": "Reasoning",
    "models.detail.structured": "Structured output",
    "models.detail.temperature": "Temperature",
    "models.detail.attachment": "Attachment",
    "models.detail.provider": "Provider",
    "models.detail.context": "Context window",
    "models.detail.maxOutput": "Max output",
    "models.detail.release": "Release",
    "models.detail.family": "Family",
    "models.detail.license": "License",
    "models.detail.capabilities": "Capabilities",
    "models.detail.about": "About this model",
    "models.detail.installNode": "Node.js SDK",
    "models.detail.installGo": "Go SDK",
    "models.detail.priceNote": "Prices per 1 million tokens in Rupiah, markup included.",
    "models.detail.pricing": "Pricing",
    "models.detail.specs": "Specifications",
    "models.detail.modalities": "Modalities",
    "models.detail.responses": "Responses API",
    "models.preview.freeBadge": "Free · Rp0",
    "models.preview.freeTooltip": "Free models cost nothing, but prompt data may train upstream base models.",
    "models.type.chat": "Chat",
    "models.type.embedding": "Embedding",
    "models.type.image": "Image",
    "models.type.decision": "Decision",
  },
};

export function t(lang: Locale, key: UiKey): string {
  return ui[lang][key];
}

export function isVideoPerSecond(model: PricingModel): boolean {
  return (
    model.kind === "video" &&
    (model.video_pricing?.unit === "second" ||
      (!model.video_pricing && model.output_mc >= 20_000_000))
  );
}

export function formatInputPrice(model: PricingModel, lang: Locale): string {
  if (model.kind === "video" && model.input_idr === 0) return "—";
  if (isFreeModel(model)) return "Rp0";
  return formatIdr(model.input_idr, lang);
}

export function formatOutputPrice(model: PricingModel, lang: Locale): string {
  if (isFreeModel(model)) return "Rp0";
  if (isVideoPerSecond(model)) {
    const perSec = model.video_pricing?.idr_per_sec ?? Math.round(model.output_idr / 1000);
    return `${formatIdr(perSec, lang)} / ${lang === "id" ? "dtk" : "s"}`;
  }
  return formatIdr(model.output_idr, lang);
}
