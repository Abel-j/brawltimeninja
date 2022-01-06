import { VisualisationSpec } from "."

const defaultVisualisations: VisualisationSpec[] = [{
  name: 'Bar Chart',
  component: 'v-barplot',
  import: () => import('~/klicker/components/visualisations/v-barplot.vue'),
  applicable(dimensions, measurements, size) {
    return dimensions.length == 1 &&
      ['ordinal', 'nominal'].includes(dimensions[0].type) &&
      measurements.length == 1 &&
      size > 1 &&
      size < 100
  },
  initialDimensions: {
    rows: 3,
    columns: 4,
  },
  resizable: true,
}, {
  name: 'Tier List',
  component: 'v-tier-list',
  import: () => import('~/klicker/components/visualisations/v-tier-list.vue'),
  applicable(dimensions, measurements, size) {
    return dimensions.length == 1 && measurements.length == 1 && size > 5 && size < 100
  },
  initialDimensions: {
    rows: 3,
    columns: 5,
  },
}, {
  name: 'Test Info',
  component: 'v-test-info',
  import: () => import('~/klicker/components/visualisations/v-test-info.vue'),
  applicable(dimensions, measurements, size, comparing) {
    return comparing && measurements[0].statistics?.test != undefined
  },
  initialDimensions: {
    rows: 2,
    columns: 3,
  },
}, {
  name: 'Table',
  component: 'v-table',
  import: () => import('~/klicker/components/visualisations/v-table.vue'),
  applicable(dimensions, measurements, size, comparing) {
    return size > 0 && (comparing || measurements.length < 5)
  },
  initialDimensions: {
    rows: 4,
    columns: 3,
  },
  props: {
    pageSize: {
      name: 'Page Size',
      component: 'b-input',
      import: () => import('~/klicker/components/ui/b-number.vue'),
      props: {
        dark: true,
        min: 1,
        max: 20,
      },
    }
  },
}, {
  name: 'Scatter Chart',
  component: 'v-scatterplot',
  import: () => import('~/klicker/components/visualisations/v-scatterplot.vue'),
  applicable(dimensions, measurements, size) {
    return dimensions.length == 1 && measurements.length == 2 && size > 1 && size < 1000
  },
  resizable: true,
  initialDimensions: {
    rows: 3,
    columns: 4,
  },
}, {
  name: 'Horizontal Cards',
  component: 'v-roll',
  import: () => import('~/klicker/components/visualisations/v-roll.vue'),
  applicable(dimensions, measurements, size) {
    return dimensions.length == 1 && measurements.length == 1 && size > 0 && size < 10
  },
  initialDimensions: {
    rows: 1,
    columns: 4,
  },
}, {
  name: 'Pivot Table CSV Download Button',
  component: 'v-pivot-csv',
  import: () => import('~/klicker/components/visualisations/v-pivot-csv.vue'),
  applicable(dimensions, measurements, size) {
    return size > 0 && dimensions.filter(d => d.type == 'temporal').length == 1
        && dimensions.filter(m => m.type == 'nominal').length == 1
        && measurements.length == 1
  },
  initialDimensions: {
    rows: 1,
    columns: 1,
  },
}, {
  name: 'Line Plot',
  component: 'v-lineplot',
  import: () => import('~/klicker/components/visualisations/v-lineplot.vue'),
  applicable(dimensions, measurements, size) {
    return dimensions.length == 1 &&
      ['temporal', 'ordinal'].includes(dimensions[0].type) &&
      measurements.length == 1 && size > 1 && size < 1000
  },
  resizable: true,
  initialDimensions: {
    rows: 3,
    columns: 4,
  },
}, {
  name: 'Measurement Info',
  component: 'v-info',
  import: () => import('~/klicker/components/visualisations/v-info.vue'),
  applicable(dimensions, measurements) {
    return measurements.length == 1
  },
  initialDimensions: {
    rows: 1,
    columns: 2,
  },
}, {
  name: 'Heatmap',
  component: 'v-heatmap',
  import: () => import('~/klicker/components/visualisations/v-heatmap.vue'),
  applicable(dimensions, measurements, size, comparing, data) {
    if (dimensions.length == 2 && measurements.length == 1 && size > 1) {
      const uniqueX = new Set(data.map(d => d.dimensions[dimensions[0].id])).size
      const uniqueY = new Set(data.map(d => d.dimensions[dimensions[1].id])).size

      // less than 50% gaps
      return size > 0.5 * uniqueX * uniqueY
    }
    return false
  },
  resizable: true,
  initialDimensions: {
    rows: 3,
    columns: 4,
  },
}, {
  name: 'Grid',
  component: 'v-grid',
  import: () => import('~/klicker/components/visualisations/v-grid.vue'),
  applicable(dimensions, measurements) {
    return measurements.length > 1
  },
  initialDimensions: {
    rows: 3,
    columns: 4,
  },
}, {
  name: 'CSV Download Button',
  component: 'v-csv',
  import: () => import('~/klicker/components/visualisations/v-csv.vue'),
  applicable(dimensions, measurements, size) {
    return size > 0
  },
  initialDimensions: {
    rows: 1,
    columns: 1,
  },
}, {
  name: 'Markdown',
  component: 'v-markdown',
  import: () => import('~/klicker/components/visualisations/v-markdown.vue'),
  applicable(dimensions, measurements, size) {
    return size == 0
  },
  initialDimensions: {
    rows: 4,
    columns: 4,
  },
  props: {
    markdown: {
      name: 'Markdown',
      component: 'b-markdown',
      import: () => import('~/klicker/components/ui/b-markdown.vue'),
      props: {
      },
    },
  },
}]

export default defaultVisualisations
