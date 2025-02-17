import { Plugin } from '@nuxt/types'
import Vue from 'vue'
import VueGtag from 'vue-gtag'

const plugin: Plugin = ({ app }) => {
  const params = {
    optimize_id: 'OPT-PWZ78LC',
    custom_map: {
      'dimension1': 'branch',
      'dimension2': 'ads_blocked',
      'dimension3': 'is_pwa',
      'dimension4': 'is_twa',
      'dimension5': 'test_group',
    },
  }
  Vue.use(VueGtag, {
    config: {
      id: 'G-8GGHZC6QR2',
      params,
    },
    includes: [ {
      // old property
      id: 'UA-137233906-1',
      params,
    } ],
    // toggled in layout.vue
    enabled: app.store!.state.adsAllowed == true,
  }, app.router)
}

export default plugin
