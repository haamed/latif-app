import { Injectable, effect, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface AppLanguage {
    code: string;
    label: string;
    dir: 'ltr' | 'rtl';
}

const STORAGE_KEY = 'app_lang';

export const APP_LANGUAGES: AppLanguage[] = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'fa', label: 'فارسی', dir: 'rtl' },
];

const DEFAULT_LANGUAGE = APP_LANGUAGES[0];

/** Reads the persisted language choice, synchronously, before the app bootstraps. */
export function getInitialLanguage(): string {
    if (typeof localStorage === 'undefined') {
        return DEFAULT_LANGUAGE.code;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    return APP_LANGUAGES.some((lang) => lang.code === saved)
        ? (saved as string)
        : DEFAULT_LANGUAGE.code;
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
    private readonly translate = inject(TranslateService);
    readonly languages = APP_LANGUAGES;

    constructor() {
        // Keep <html lang/dir> in sync with the active language, including on first load.
        effect(() => {
            const code = this.translate.currentLang() ?? DEFAULT_LANGUAGE.code;
            this.applyDocumentAttributes(code);
        });
    }

    get current(): AppLanguage {
        const code = this.translate.currentLang() ?? DEFAULT_LANGUAGE.code;
        return this.languages.find((lang) => lang.code === code) ?? DEFAULT_LANGUAGE;
    }

    setLanguage(code: string): void {
        if (!this.languages.some((lang) => lang.code === code)) {
            return;
        }
        this.translate.use(code).subscribe(() => {
            localStorage.setItem(STORAGE_KEY, code);
        });
    }

    private applyDocumentAttributes(code: string): void {
        const lang = this.languages.find((l) => l.code === code) ?? DEFAULT_LANGUAGE;
        document.documentElement.lang = lang.code;
        document.documentElement.dir = lang.dir;
    }
}
