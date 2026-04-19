import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, TranslationKey } from "@/lib/translations";

export type Language = "bn" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  toggle: () => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  /** Format a number as Bengali numerals when lang=bn, else plain digits */
  fmtNum: (n: number | string) => string;
  /** Convert Bengali month names if needed; passes month index */
  monthName: (idx: number, short?: boolean) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const bengaliDigits = "০১২৩৪৫৬৭৮৯";
const toBengaliNum = (s: string) => s.replace(/[0-9]/g, (d) => bengaliDigits[parseInt(d)]);

const monthsBn = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
const monthsBnShort = ["জানু","ফেব্রু","মার্চ","এপ্রি","মে","জুন","জুলাই","আগ","সেপ্টে","অক্টো","নভে","ডিসে"];
const monthsEn = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const monthsEnShort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") return "bn";
    return (localStorage.getItem("app_lang") as Language) || "bn";
  });

  useEffect(() => {
    localStorage.setItem("app_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Language) => setLangState(l);
  const toggle = () => setLangState((p) => (p === "bn" ? "en" : "bn"));

  const t = (key: TranslationKey, vars?: Record<string, string | number>) => {
    let s: string = (translations[lang] as Record<string, string>)[key] ?? (translations.bn as Record<string, string>)[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        s = s.replace(`{${k}}`, String(v));
      });
    }
    return s;
  };

  const fmtNum = (n: number | string) => {
    const str = String(n);
    return lang === "bn" ? toBengaliNum(str) : str;
  };

  const monthName = (idx: number, short = false) => {
    const arr = lang === "bn" ? (short ? monthsBnShort : monthsBn) : (short ? monthsEnShort : monthsEn);
    return arr[idx] ?? "";
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t, fmtNum, monthName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
};
