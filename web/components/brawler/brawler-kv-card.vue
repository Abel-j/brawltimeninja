<template>
  <b-card
    :elevation="0"
    dense
  >
    <div
      slot="content"
      class="h-full flex items-center gap-x-4"
    >
      <media-img
        :path="`/brawlers/${brawlerId}/avatar`"
        :alt="brawlerName"
        size="160"
        clazz="h-16 w-16 rounded-xl object-contain"
      ></media-img>
      <c-query
        :query="query"
        :filter="e => e.dimensionsRaw.brawler.brawler == brawlerName.toUpperCase()"
      >
        <template v-slot="data">
          <v-kv-table
            v-bind="data"
            class="w-full"
          ></v-kv-table>
        </template>
      </c-query>
    </div>
  </b-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@nuxtjs/composition-api'
import { CQuery, VKvTable } from '@schneefux/klicker/components'
import { SliceValue } from '@schneefux/klicker/types'
import { brawlerId as getBrawlerId } from '@/lib/util'

export default defineComponent({
  components: {
    VKvTable,
    CQuery,
  },
  props: {
    brawlerName: {
      type: String,
      required: true
    },
    slices: {
      type: Object as PropType<SliceValue>,
      default: () => ({})
    },
  },
  setup(props) {
    const brawlerId = computed(() => getBrawlerId({ name: props.brawlerName }))

    const query = computed(() => ({
      cubeId: 'map',
      metricsIds: ['winRate', 'useRate', 'picks'],
      dimensionsIds: ['brawler'],
      sortId: 'winRate',
      slices: props.slices,
    }))

    return {
      brawlerId,
      query,
    }
  }
})
</script>
