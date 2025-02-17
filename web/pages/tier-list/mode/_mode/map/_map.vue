<template>
  <b-page
    v-if="event != undefined"
    :title="$t('tier-list.map.title', { map: mapName })"
  >
    <mode-map-jumper
      :mode="event.mode"
      :map="event.map"
      :id="event.id"
    ></mode-map-jumper>

    <p class="prose dark:prose-invert">
      {{ $t('tier-list.map.description', {
        map: mapName,
        mode: $t('mode.' + event.mode)
      }) }}
    </p>

    <ad
      ad-slot="1665534416"
      first
    ></ad>

    <b-lightbox v-model="lightboxOpen">
      <map-img
        :id="event.id"
        :map="event.map"
        clazz="h-full object-contain"
        class="contents"
        size=""
      ></map-img>
    </b-lightbox>

    <b-page-section>
      <b-split-dashboard>
        <event-picture-card
          v-if="showImage"
          slot="aside"
          :mode="event.mode"
          :map="event.map"
          :id="event.id"
          class="relative"
          @click="lightboxOpen = true"
        >
          <font-awesome-icon
            :icon="faExpand"
            class="absolute bottom-4 right-6"
          ></font-awesome-icon>
        </event-picture-card>

        <map-views
          :mode="event.mode"
          :map="event.map"
          :id="event.id"
          ga-category="map"
        ></map-views>
      </b-split-dashboard>
    </b-page-section>

    <ad
      ad-slot="3536131238"
      lazy
    ></ad>
  </b-page>
</template>

<script lang="ts">
import { defineComponent, useContext, useMeta, computed, useAsync, useRoute, ref } from '@nuxtjs/composition-api'
import { deslugify, kebabToCamel } from '~/lib/util'
import { BSplitDashboard, BCard, BLightbox } from '@schneefux/klicker/components'
import { getMapName } from '~/composables/map'
import MapViews from '~/components/map/map-views.vue'
import { faExpand } from '@fortawesome/free-solid-svg-icons'

interface Map {
  id: string
  mode: string
  map: string
}

export default defineComponent({
  components: {
    BSplitDashboard,
    BLightbox,
    BCard,
    MapViews,
  },
  head: {},
  setup() {
    const { i18n, $config, $klicker } = useContext()

    const route = useRoute()
    const event = useAsync(async () => {
      const mode = kebabToCamel(route.value.params.mode)
      const map = deslugify(route.value.params.map)
      const events = await $klicker.query({
        cubeId: 'map',
        slices: {
          mode: [mode],
          map: [map],
        },
        dimensionsIds: [],
        metricsIds: ['eventId'],
        sortId: 'eventId',
        limit: 1,
      })
      const event = events.data[0]

      return {
        id: event.metricsRaw.eventId,
        map,
        mode,
      } as Map
    }, `map-${route.value.params.mode}-${route.value.params.map}`)

    useMeta(() => {
      if (event.value == undefined) {
        return {}
      }

      const description = i18n.tc('tier-list.map.meta.description', 1, {
        map: i18n.t('map.' + event.value.id),
        mode: i18n.t('mode.' + event.value.mode),
      })
      return {
        title: i18n.tc('tier-list.map.meta.title', 1, {
          map: i18n.t('map.' + event.value.id),
        }),
        meta: [
          { hid: 'description', name: 'description', content: description },
          { hid: 'og:description', property: 'og:description', content: description },
          ...(event.value.id != undefined && event.value.id != '0' ? [{ hid: 'og:image', property: 'og:image', content: $config.mediaUrl + '/maps/' + event.value.id + '.png' }] : []),
        ]
      }
    })

    const showImage = computed(() => event.value?.id != undefined && event.value.map != 'Competition Entry')

    const mapName = computed(() => {
      if (event.value != undefined) {
        return getMapName(i18n, event.value.id, event.value.map)
      }
    })

    const lightboxOpen = ref(false)

    return {
      event,
      mapName,
      faExpand,
      showImage,
      lightboxOpen,
    }
  },
  middleware: ['cached'],
  async validate({ params, $klicker }) {
    const mode = kebabToCamel(params.mode)
    const map = deslugify(params.map)
    if (map.startsWith('Competition')) {
      return true
    }

    const events = await $klicker.query({
      cubeId: 'map',
      slices: {
        mode: [mode],
        map: [map],
      },
      dimensionsIds: [],
      metricsIds: ['eventId'],
      sortId: 'eventId',
      limit: 1,
    })
    return events.data[0].metricsRaw.eventId != '0'
  },
})
</script>
