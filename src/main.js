import { createApp } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'

import App from './App.vue'
import { registerPlugins } from '@/plugins'

import createVuetify from './plugins/vuetify'
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  allowComposition: true, // you need to specify that!
  messages: {
    en: {
      back: 'back',
      next: 'next'
    },
    ru: {
      back: 'назад',
      next: 'дальше'
    }
  }
})
const vuetify = createVuetify({ i18n, useI18n });
const app = createApp(App);

registerPlugins(app)
app.use(vuetify);
app.use(i18n);

app.mount('#app');
