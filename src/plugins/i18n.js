import Vue from "vue";
import VueI18n from "vue-i18n";
import { en, tr } from "../languages/index";

Vue.use(VueI18n);

const messages = {
  tr,
  en,
};

if (!localStorage.getItem("lang")) {
  let browserLang = Object.keys(messages).find((lang) => {
    return lang == navigator.language.substring(0, 2);
  });
  browserLang
    ? localStorage.setItem("lang", browserLang)
    : localStorage.setItem("lang", "tr");
}

const i18n = new VueI18n({
  locale: localStorage.getItem("lang"),
  fallbackLocale: "en",
  messages,
});

export default i18n;
