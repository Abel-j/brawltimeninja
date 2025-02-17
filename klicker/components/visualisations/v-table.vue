<template>
  <v-card-wrapper
    v-bind="$props"
    component="v-table"
  >
    <div
      slot="content"
      class="h-full relative"
    >
      <b-table
        :columns="columns"
        :rows="rows"
        :page-size="pageSize"
        :no-paginator="card == undefined"
        id-key="id"
        class="h-full w-full overflow-auto"
        ranked
      >
        <template
          v-for="m in metrics"
          v-slot:[`metrics.${m.id}`]="{ row }"
        >
          <m-auto
            :key="m.id"
            :response="response"
            :metric-id="m.id"
            :row="row"
          ></m-auto>
        </template>

        <template v-slot:dimensions="{ row }">
          <d-auto
            :response="response"
            :row="row"
            captioned
          ></d-auto>
        </template>
      </b-table>
    </div>

    <router-link
      slot="preview"
      v-if="linkWithParams != undefined"
      :to="linkWithParams"
      class="opacity-75"
    >
      <font-awesome-icon
        :icon="faExternalLinkAlt"
      ></font-awesome-icon>
    </router-link>
  </v-card-wrapper>
</template>

<script lang="ts">
import { VisualisationProps } from '../../props'
import BTable, { Column } from '../ui/b-table.vue'
import DAuto from './d-auto.vue'
import MAuto from './m-auto.vue'
import { Location } from 'vue-router'
import { computed, defineComponent } from '@vue/composition-api'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { useCubeResponseProps } from '../../composables/response'
import VCardWrapper from './v-card-wrapper.vue'
import { useKlicker } from '../../composables'

export default defineComponent({
  components: {
    FontAwesomeIcon,
    BTable,
    DAuto,
    MAuto,
    VCardWrapper,
  },
  props: {
    ...VisualisationProps,
    pageSize: {
      type: Number,
      default: 10
    },
    linkPath: {
      type: String,
      required: false
    },
  },
  setup(props) {
    const { translate } = useKlicker()
    const { $klicker, dimensions, metrics } = useCubeResponseProps(props)

    const columns = computed<Column[]>(() => {
      const columns: Column[] = []

      columns.push({
        title: dimensions.value.map(d => $klicker.getName(d)).join(', '),
        keys: dimensions.value.map(d => `dimensions.${d.id}`),
        // dimensions are rendered n:m
        slot: 'dimensions',
        header: true,
      })
      metrics.value.forEach(m => columns.push({
        // metrics are rendered 1:1
        title: $klicker.getName(m),
        keys: [`metrics.${m.id}`],
        slot: `metrics.${m.id}`,
        shrink: true,
        lightText: true,
      }))

      if (props.response.kind == 'comparingResponse') {
        columns.push({
          title: translate('comparison.difference.to.dataset', { dataset: props.response.query.reference.name ?? translate('comparison.dataset.reference') }),
          keys: [`test.difference.annotatedDifference`],
          slot: 'difference',
          shrink: true,
          lightText: true,
        })
      }

      return columns
    })

    const rows = computed(() => props.response.data)

    const linkWithParams = computed<Location|undefined>(() => {
      if (props.card != undefined && props.linkPath != undefined) {
        return {
          path: props.linkPath,
          ...$klicker.convertQueryToLocation(props.response.query),
        }
      } else {
        return undefined
      }
    })

    return {
      rows,
      columns,
      linkWithParams,
      faExternalLinkAlt,
      metrics,
    }
  },
})
</script>
