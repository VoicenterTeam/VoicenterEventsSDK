import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from './store/store'

Vue.use(VueI18n);

function loadLocaleMessages() {
  // if (process.env.NODE_ENV === 'development'){
  const locales = require.context(
  './locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([a-z0-9]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  console.log(messages, 'messages', store, 'translations')
  return messages;
  // }

  // return {}
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages()
});
