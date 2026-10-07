import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GiftConfig } from "@/lib/gift-config";
import type { SiteTextKey } from "@/content/clube";

export function GiftForm({ config, name, text, onClose, onContinue }: { config: GiftConfig; name: string; text: Record<SiteTextKey, string>; onClose: () => void; onContinue: (values: Record<string, string>) => void }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const complete = config.fields.every(f => f.type === "fixed" || f.options.includes(values[f.id] ?? ""));
  return <section aria-label={text.gift_form_title} className="mt-6 space-y-5 rounded-lg border border-primary/40 bg-card/80 p-5">
    <div className="flex items-center justify-between gap-3"><h2 className="font-mono font-bold">{text.gift_form_title}</h2><Button variant="ghost" size="icon" aria-label={text.gift_close} onClick={onClose}><X className="h-4 w-4" /></Button></div>
    <p className="text-sm text-muted-foreground">{name}</p>
    <div className="space-y-1"><Label>{text.gift_issuer_label}</Label><p className="break-words text-sm">{config.issuer}</p></div>
    {config.fields.map(f => <div key={f.id} className="space-y-2"><Label htmlFor={`choice-${f.id}`}>{f.label}</Label>{f.type === "fixed" ? <p className="break-words rounded-md border border-input bg-background p-3 text-sm">{f.value}</p> : <Select value={values[f.id] ?? ""} onValueChange={value => setValues(v => ({ ...v, [f.id]: value }))}><SelectTrigger id={`choice-${f.id}`} className="w-full"><SelectValue placeholder={text.gift_select_placeholder} /></SelectTrigger><SelectContent>{f.options.map((option, index) => <SelectItem key={`${index}-${option}`} value={option}>{option}</SelectItem>)}</SelectContent></Select>}</div>)}
    <Button className="w-full" disabled={!complete} onClick={() => onContinue(Object.fromEntries(config.fields.map(f => [f.id, f.type === "fixed" ? f.value : values[f.id] ?? ""])))}>{text.gift_continue}</Button>
  </section>;
}