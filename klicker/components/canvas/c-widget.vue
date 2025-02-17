<template>
  <c-query
    v-if="valid && widget.query != undefined"
    :query="widget.query"
  >
    <template v-slot="data">
      <v-auto
        v-bind="data"
        :props="widget.props"
        :component="widget.component"
        :ztyle="style"
        :rows="forGrid ? widget.frame.rows : undefined"
        :columns="forGrid ? widget.frame.columns : undefined"
        :card="forGrid ? true : undefined"
      ></v-auto>
    </template>
  </c-query>
  <v-auto
    v-else-if="valid"
    :props="widget.props"
    :component="widget.component"
    :ztyle="style"
    :rows="forGrid ? widget.frame.rows : undefined"
    :columns="forGrid ? widget.frame.columns : undefined"
    :loading="false"
    :response="undefined"
    :card="forGrid ? true : undefined"
  ></v-auto>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api'
import CQuery from '../c-query'
import { GridWidget, ReportWidget, StaticWidgetSpec } from '../../types'
import VAuto from '../visualisations/v-auto.vue'
import { useKlicker } from '../../composables/klicker'

/**
 * Return a style object to position this widget on a canvas.
 * Uses frame sizings or specified defaults, if available.
 */
export function render(frame: ReportWidget['frame'], spec: StaticWidgetSpec) {
  const { translate, scale, rotate, width, height } = frame
  const style: Record<string, string> = {
    position: 'absolute',
    top: '0',
    left: '0',
    transformOrigin: '50% 50%',
  }
  let transform = ''

  if (translate[0] || translate[1]) {
    transform += `translate(${translate[0]}px, ${translate[1]}px) `
  }
  if (rotate) {
    transform += `rotate(${rotate}deg) `
  }
  if (scale[0] != 1 || scale[1] != 1) {
    transform += `scale(${scale[0]}, ${scale[1]}) `
  }

  style.transform = transform

  if (spec.resizable) {
    style.width = `${spec.initialDimensions.columns * 150}px`
    style.height = `${spec.initialDimensions.rows * 150}px`
  } else {
    style.width = 'max-content'
    style.height = 'max-content'
  }

  if (width) {
    style.width = `${width}px`
  }
  if (height) {
    style.height = `${height}px`
  }

  return style
}

/**
 * Execute the query of the given widget.
 * Render its visualisation component.
 * Optionally, apply widget styles for canvas or grid layout.
 */
export default defineComponent({
  components: {
    CQuery,
    VAuto,
  },
  props: {
    widget: {
      type: Object as PropType<ReportWidget|GridWidget>,
      required: true
    },
    /**
     * Apply styles for rendering in a canvas.
     */
    forCanvas: {
      type: Boolean,
      default: false
    },
    /**
     * Apply styles for rendering in a grid.
     */
    forGrid: {
      type: Boolean,
      default: false
    },
  },
  setup(props) {
    const { $klicker } = useKlicker()
    const spec = computed(() => (
      $klicker.visualisations.find(v => v.component == props.widget.component) ??
      $klicker.staticWidgets.find(w => w.component == props.widget.component)
    ))

    const valid = computed(() => {
      if (spec.value == undefined) {
        return false
      }

      if (spec.value.props == undefined) {
        return true
      }

      if (Object.keys(props.widget.props).every(key => key in spec.value!.props!)) {
        return true
      }
    })

    const style = computed(() => ({
      // c-moveable-widget does not set forCanvas because the parent applies all styles
      // grow the <b-dashboard-cell> container by default so that the visualisations fill it by default
      height: '100%',
      width: '100%',
      ...(props.forCanvas && valid.value ? render((<ReportWidget> props.widget).frame, spec.value!) : {})
    }))

    return {
      valid,
      style,
    }
  },
})
</script>
