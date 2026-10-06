import { CreditCard, Crown, Gem, Gift, Heart, Rocket, ShieldCheck, ShoppingBag, Sparkles, Star, Tag, Ticket, Zap, type LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  "credit-card": CreditCard, crown: Crown, gem: Gem, gift: Gift, heart: Heart, rocket: Rocket,
  "shield-check": ShieldCheck, "shopping-bag": ShoppingBag, sparkles: Sparkles, star: Star, tag: Tag, ticket: Ticket, zap: Zap,
};
export const iconNames = Object.keys(iconMap);
export const getIcon = (n: string) => iconMap[n] ?? CreditCard;
