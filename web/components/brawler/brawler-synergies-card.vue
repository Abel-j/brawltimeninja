<template>
  <c-query
    :query="query"
    :filter="filter"
  >
    <p slot="empty" class="text-center">
      {{ $t('state.no-data') }}
    </p>
    <template v-slot="data">
      <v-roll
        v-bind="data"
        :card="{
          title: $t('brawler.synergy.title', { brawler }),
        }"
      ></v-roll>
    </template>
  </c-query>
</template>

<script lang="ts">
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { CubeComparingQuery, CubeComparingQueryFilter } from '@schneefux/klicker/types'
import { CQuery, VRoll } from '@schneefux/klicker/components'

export default defineComponent({
  components: {
    VRoll,
    CQuery,
  },
  props: {
    brawler: {
      type: String,
      required: true
    },
  },
  setup(props) {
    const { i18n } = useContext()

    const query: CubeComparingQuery = {
      name: i18n.t('metric.team') as string,
      comparing: true,
      cubeId: 'brawlerAllies',
      slices: {
        brawler: [props.brawler.toUpperCase()],
      },
      dimensionsIds: ['brawler', 'ally'],
      metricsIds: ['winRate'],
      sortId: 'pvalue',
      limit: 8,
      reference: {
        name: props.brawler,
        cubeId: 'map',
        slices: {},
        dimensionsIds: ['brawler'],
        metricsIds: ['winRate'],
        sortId: 'winRate',
      },
    }

    const filter: CubeComparingQueryFilter = (e) => e.test.difference.pValueRaw <= 0.05

    return {
      filter,
      query,
    }
  },
})
</script>
