import { 
  User, 
  CreditCard, 
  Scale, 
  Stethoscope, 
  ShieldCheck, 
  Wrench, 
  Calculator, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Plane, 
  Car, 
  Archive,
  LucideIcon
} from "lucide-react";
import { DocumentCategory } from "../types";

export const categoryIcons: Record<DocumentCategory, LucideIcon> = {
  personal: User,
  financial: CreditCard,
  legal: Scale,
  medical: Stethoscope,
  insurance: ShieldCheck,
  warranty: Wrench,
  tax: Calculator,
  property: Home,
  education: GraduationCap,
  employment: Briefcase,
  travel: Plane,
  automotive: Car,
  other: Archive
};

export const categoryColors: Record<DocumentCategory, string> = {
  personal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  financial: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  legal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  medical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  insurance: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
  warranty: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  tax: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  property: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  education: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  employment: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  travel: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  automotive: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
};

export const getCategoryIcon = (category: DocumentCategory): LucideIcon => {
  return categoryIcons[category];
};

export const getCategoryColor = (category: DocumentCategory): string => {
  return categoryColors[category];
};