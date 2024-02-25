import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { createI18nStore } from "svelte-i18next";

i18next
	.use(HttpApi)
	.use(LanguageDetector)
	.init({
		debug: true,
		fallbackLng: "en",
		defaultNS: "translation",
		interpolation: {
			escapeValue: false // do not escape interpolation since svelte does the escaping
		},
		backend: {
			loadPath: './locales/{{lng}}/{{ns}}.json',
		},
	});

const i18n = createI18nStore(i18next);
export default i18n;
