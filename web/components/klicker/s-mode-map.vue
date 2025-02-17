<template>
  <div>
    <b-fake-select @open="lightboxOpen = true">
      <span
        slot="preview"
        class="w-full text-left"
      >
        {{ mode != undefined ? $t('mode.' + mode) : $t('option.all-modes') }} - {{ map != undefined ? mapName : $t('option.all-maps') }}
      </span>
    </b-fake-select>

    <b-lightbox
      v-model="lightboxOpen"
      class="top-14 lg:top-20 bottom-14 lg:bottom-0 h-[calc(100vh-2*3.5rem)] lg:h-[calc(100vh-5rem)] overscroll-contain"
    >
      <b-card
        class="w-full"
        :elevation="0"
      >
        <events-roll
          slot="content"
          v-if="allEvents != undefined"
          :events="allEvents"
          :mode-filter-default="mode"
        >
          <template v-slot="{ event }">
            <event-picture-card
              v-if="!event.key.startsWith('all')"
              :mode="event.mode"
              :map="event.map"
              :id="event.id"
              :class="{
                'bg-primary-400 rounded-2xl': mode == event.mode && map == event.map,
              }"
              @click="onSelectModeMap({ mode: event.mode, map: event.map })"
            ></event-picture-card>
            <event-card
              v-else-if="event.key != 'all'"
              :mode="event.mode"
              :class="{
                'bg-primary-400 rounded-2xl': mode == event.mode && map == 'all',
              }"
              nobackground
              @click="onSelectModeMap({ mode: event.mode })"
            >
              <template v-slot:preview></template>
              <p
                slot="content"
                class="pt-4 h-full flex flex-col justify-center items-center"
              >
                {{ $t('option.all-maps') }}
              </p>
            </event-card>
            <b-card
              v-else
              :class="{
                'bg-primary-400 rounded-2xl': mode == 'all' && map == 'all',
              }"
              @click="onSelectModeMap({})"
            >
              <p
                slot="content"
                class="pt-4 h-full flex flex-col justify-center items-center"
              >
                {{ $t('option.all-modes') }} - {{ $t('option.all-maps') }}
              </p>
            </b-card>
          </template>
        </events-roll>
      </b-card>
    </b-lightbox>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, useAsync, useContext } from '@nuxtjs/composition-api'
import { SliceValue, SliceValueUpdateListener } from '@schneefux/klicker/types'
import { getMapName } from '~/composables/map'
import { BFakeSelect, BLightbox } from '@schneefux/klicker/components'
import { EventMetadata } from '~/plugins/klicker'

export default defineComponent({
  components: {
    BFakeSelect,
    BLightbox,
  },
  props: {
    value: {
      type: Object as PropType<SliceValue>,
      required: true
    },
    onInput: {
      type: Function as PropType<SliceValueUpdateListener>,
      required: true
    },
  },
  setup(props) {
    const { $klicker, i18n } = useContext()

    const mode = computed(() => (props.value.mode ?? [])[0])
    const map = computed(() => (props.value.map ?? [])[0])

    const allEvents = useAsync<EventMetadata[]>(async () => {
      const events = await $klicker.queryAllEvents({})
      const modes = [...new Set(events.map(e => e.mode))]
      return (<EventMetadata[]>[]).concat(
        [{
          key: 'all',
          id: 0,
          map: i18n.t('option.all-modes') as string,
          mode: 'all',
          powerplay: false,
          metrics: {},
        }],
        modes.map(m => ({
          key: `all-${m}`,
          id: 0,
          map: i18n.t('option.all-maps') as string,
          mode: m,
          powerplay: false,
          metrics: {},
        })),
        events,
      )
    }, 's-mode-map-all-events')

    const mapName = computed(() => {
      const map = (props.value.map ?? [])[0]
      if (map == undefined) {
        return ''
      }

      const mode = (props.value.mode ?? [])[0]
      if (mode == undefined) {
        return ''
      }

      if (allEvents.value == undefined) {
        return map
      }

      const mapRecord = allEvents.value.find(e => e.map == map && e.mode == mode)
      if (mapRecord == undefined) {
        return map
      }

      return getMapName(i18n, mapRecord.id, map)
    })

    const onSelectModeMap = (value: { mode?: string, map?: string }) => {
      props.onInput({
        mode: value.mode != undefined ? [value.mode] : [],
        map: value.map != undefined ? [value.map] : [],
      })
      lightboxOpen.value = false
    }

    const lightboxOpen = ref(false)

    return {
      mode,
      map,
      onSelectModeMap,
      allEvents,
      lightboxOpen,
      mapName,
    }
  },
})
</script>
