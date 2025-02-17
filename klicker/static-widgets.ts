import { StaticWidgetSpec } from "./types"

const defaultStaticWidgets: StaticWidgetSpec[] = [{
  name: 'Markdown',
  component: 'v-markdown',
  import: () => import(/* webpackChunkName: "markdown" */ './components/visualisations/v-markdown.vue'),
  initialDimensions: {
    rows: 4,
    columns: 4,
  },
  props: {
    markdown: {
      name: 'Markdown',
      component: 'b-markdown',
      import: () => import(/* webpackChunkName: "markdown" */ './components/ui/b-markdown.vue'),
      props: {
      },
    },
  },
}]

export default defaultStaticWidgets
