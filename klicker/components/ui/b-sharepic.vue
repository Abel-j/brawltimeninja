<template>
  <div class="h-8">
    <b-button
      v-if="!loading"
      primary
      sm
      @click="trigger"
    >{{ translate('action.share') }}</b-button>
    <div v-if="loading">
      <span class="italic text-sm">{{ translate('state.generating-sharepic') }}...</span>
    </div>
    <lazy-sharepic-content
      v-if="loading"
      :debug="debug"
      @done="done"
    >
      <slot></slot>
    </lazy-sharepic-content>
  </div>
</template>

<script lang="ts">
import { useKlicker } from '../../composables'
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  props: {
    debug: {
      type: Boolean,
      default: false
    },
  },
  setup(props, { emit }) {
    const { translate } = useKlicker()
    const loading = ref(false)

    const trigger = () => loading.value = true
    const done = () => {
      loading.value = false
      emit('done')
    }

    return {
      translate,
      loading,
      trigger,
      done,
    }
  },
})
</script>
