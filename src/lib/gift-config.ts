import { z } from "zod";

export const giftConfigKey = (id: string) => `gift_config_${id}`;
export const giftConfigSchema = z.object({
  enabled: z.boolean(),
  issuer: z.string().trim().max(120),
  fields: z.array(z.object({
    id: z.string().min(1).max(60),
    label: z.string().trim().min(1, "Informe o nome do campo.").max(100),
    type: z.enum(["fixed", "select"]),
    value: z.string().trim().max(200),
    options: z.array(z.string().trim().min(1).max(100)).max(20),
  })).max(12),
}).superRefine((config, ctx) => {
  if (config.enabled && !config.issuer) ctx.addIssue({ code: "custom", path: ["issuer"], message: "Informe a loja emissora." });
  config.fields.forEach((field, index) => {
    if (field.type === "select" && !field.options.length) ctx.addIssue({ code: "custom", path: ["fields", index, "options"], message: "Adicione uma opção à lista." });
    if (field.type === "fixed" && !field.value) ctx.addIssue({ code: "custom", path: ["fields", index, "value"], message: "Informe o valor fixo." });
  });
});
export type GiftConfig = z.infer<typeof giftConfigSchema>;
export const emptyGiftConfig: GiftConfig = { enabled: false, issuer: "", fields: [] };
export function readGiftConfig(raw?: string): GiftConfig {
  try {
    const parsed = giftConfigSchema.safeParse(JSON.parse(raw ?? ""));
    return parsed.success ? parsed.data : { ...emptyGiftConfig, fields: [] };
  } catch { return { ...emptyGiftConfig, fields: [] }; }
}