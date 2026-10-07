import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { giftConfigSchema, readGiftConfig, type GiftConfig } from "@/lib/gift-config";
import { saveGiftConfig } from "@/lib/catalog.functions";

export function GiftConfigEditor({ itemId, raw, onSaved }: { itemId: string; raw: string | undefined; onSaved: () => void }) {
  const [config, setConfig] = useState(() => readGiftConfig(raw));
  const [busy, setBusy] = useState(false);
  const save = useServerFn(saveGiftConfig);
  const update = (id: string, patch: Partial<GiftConfig["fields"][number]>) => setConfig(c => ({ ...c, fields: c.fields.map(f => f.id === id ? { ...f, ...patch } : f) }));
  return <div className="space-y-3 border-t border-border pt-3">
    <div className="flex items-center justify-between gap-3"><Label htmlFor={`gift-enabled-${itemId}`}>Formulário de vale-presente</Label><Switch id={`gift-enabled-${itemId}`} checked={config.enabled} onCheckedChange={enabled => setConfig(c => ({ ...c, enabled }))} /></div>
    <Label htmlFor={`issuer-${itemId}`}>Loja emissora</Label>
    <Input id={`issuer-${itemId}`} value={config.issuer} maxLength={120} onChange={e => setConfig(c => ({ ...c, issuer: e.target.value }))} />
    {config.fields.map((field, index) => <div key={field.id} className="space-y-2 border-t border-border pt-3">
      <div className="flex items-center justify-between"><Label htmlFor={`field-${field.id}`}>Campo {index + 1}</Label><Button size="icon" variant="ghost" title="Remover campo" aria-label={`Remover campo ${index + 1}`} onClick={() => setConfig(c => ({ ...c, fields: c.fields.filter(f => f.id !== field.id) }))}><Trash2 className="h-4 w-4" /></Button></div>
      <Input id={`field-${field.id}`} aria-label={`Nome do campo ${index + 1}`} placeholder="Nome do campo" value={field.label} maxLength={100} onChange={e => update(field.id, { label: e.target.value })} />
      <Select value={field.type} onValueChange={type => update(field.id, { type: type as "fixed" | "select" })}><SelectTrigger aria-label={`Tipo do campo ${index + 1}`} className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="fixed">Valor fixo</SelectItem><SelectItem value="select">Lista de opções</SelectItem></SelectContent></Select>
      {field.type === "fixed" ? <Input aria-label={`Valor fixo do campo ${index + 1}`} placeholder="Valor fixo" value={field.value} maxLength={200} onChange={e => update(field.id, { value: e.target.value })} /> : <Textarea aria-label={`Opções do campo ${index + 1}`} placeholder="Uma opção por linha" value={field.options.join("\n")} onChange={e => update(field.id, { options: e.target.value.split("\n") })} />}
    </div>)}
    <Button variant="outline" size="sm" disabled={config.fields.length >= 12} onClick={() => setConfig(c => ({ ...c, fields: [...c.fields, { id: crypto.randomUUID(), label: "", type: "fixed", value: "", options: [] }] }))}><Plus className="h-4 w-4" /> Adicionar campo</Button>
    <Button className="w-full" disabled={busy} onClick={async () => {
      const parsed = giftConfigSchema.safeParse({ ...config, fields: config.fields.map(f => ({ ...f, options: f.options.map(o => o.trim()).filter(Boolean) })) });
      if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Revise os campos."); return; }
      setBusy(true);
      try { await save({ data: { itemId, config: parsed.data } }); setConfig(parsed.data); toast.success("Formulário salvo!"); onSaved(); } catch { toast.error("Não foi possível salvar o formulário."); } finally { setBusy(false); }
    }}><Save className="h-4 w-4" /> {busy ? "Salvando..." : "Salvar formulário do vale"}</Button>
  </div>;
}