import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import { Quasar } from 'quasar'
import quasarIconSet from 'quasar/icon-set/material-icons-outlined'
import quasarLang from 'quasar/lang/pt-BR'
// Import icon libraries
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
// Import Quasar css
import 'quasar/src/css/index.sass'

var pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .use(Quasar, {
    plugins: {},
    lang: quasarLang,
    iconSet: quasarIconSet
  })
  .mount('#app')
