<template>
  <div class="-mx-4 lg:mx-0">
    <nav
      :class="navClass"
      ref="navContainer"
      role="tablist"
      class="sticky"
    >
      <ul
        ref="headerContainer"
        class="flex overflow-x-auto hide-scrollbar bg-background"
      >
        <li
          v-for="tab in tabs"
          :ref="`${tab.slot}-header`"
          :key="tab.slot"
        >
          <!-- same layout as b-scrolling-list preview -->
          <a
            role="tab"
            :id="`${prefix}-button-${tab.slot}`"
            :href="`#${tab.slot}`"
            :class="{
              'border-primary-400 text-text': tabVisibility[tab.slot],
              'border-contrast/[.1] hover:border-primary-200 text-text/75 hover:text-text': !tabVisibility[tab.slot],
            }"
            :aria-selected="activeTab == tab.slot ? 'true' : 'false'"
            :aria-controls="`${prefix}-tab-${tab.slot}`"
            class="block px-8 py-2 whitespace-nowrap transition duration-100 ease-in-out border-b-2"
            @click="scrollToTab(tab)"
          >{{ tab.title }}</a>
        </li>
      </ul>
    </nav>

    <div
      ref="tabContainer"
      class="mt-4 px-4 scroll-px-4 lg:px-0 lg:scroll-px-0 snap-x snap-mandatory grid auto-cols-[100%] grid-flow-col gap-x-8 overflow-x-auto hide-scrollbar"
    >
      <div
        v-for="tab in tabs"
        :key="tab.slot"
        :ref="`${tab.slot}-tab`"
        :class="{
          // shrink pages that are outside of the viewport
          // so that the active page does not grow
          'h-screen overflow-y-auto hide-scrollbar': tab.slot != activeTab,
          'snap-center snap-always': scrollSnap,
        }"
        role="tabpanel"
        :aria-labelledby="`${prefix}-button-${tab.slot}`"
        :id="`${prefix}-tab-${tab.slot}`"
      >
        <slot :name="tab.slot"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from '@vue/composition-api'
import { useIntersectionObserver } from '@vueuse/core'
import { useUniqueId } from '../../composables/id'

interface Tab {
  slot: string
  title: string
}

export default defineComponent({
  props: {
    tabs: {
      type: Array as PropType<Tab[]>,
      required: true
    },
    navClass: {
      type: String,
      default: 'top-0'
    },
  },
  // TODO replace refs by function ref when migrating to Vue 3
  setup(props, { refs }) {
    const tabContainer = ref<HTMLElement>()
    const navContainer = ref<HTMLElement>()
    const headerContainer = ref<HTMLElement>()
    const activeTab = ref<string>(props.tabs[0].slot)
    const tabVisibility = ref<Record<string, boolean>>({
      [activeTab.value]: true,
    })

    const scrollUpToTab = () => {
      const offset = tabContainer.value!.getBoundingClientRect().top - navContainer.value!.getBoundingClientRect().bottom
      if (offset < 0) {
        const top = window.scrollY + offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }

    const scrollTabHeaderIntoView = (id: string) => {
      if (!(`${id}-header` in refs)) {
        return
      }

      const headerElement = refs[`${id}-header`][0] as HTMLElement
      const offset = headerElement.getBoundingClientRect().left - headerContainer.value!.getBoundingClientRect().left
      const center = tabContainer.value!.getBoundingClientRect().width / 2
      if (Math.abs(offset) > center / 2) {
        const left = headerContainer.value!.scrollLeft + offset - center
        headerContainer.value!.scrollTo({ left, behavior: 'smooth' })
      }
    }

    const scrollActiveTabIntoView = () => {
      scrollTabHeaderIntoView(activeTab.value)
      scrollUpToTab()
    }

    const scrollToTab = (tab: Tab) => {
      if (!(`${tab.slot}-tab` in refs)) {
        return
      }

      const tabElement = refs[`${tab.slot}-tab`][0] as HTMLElement
      const offset = tabElement.getBoundingClientRect().left - tabContainer.value!.getBoundingClientRect().left
      const left = tabContainer.value!.scrollLeft + offset
      // smooth if it's next to the current tab
      // otherwise auto so no intersection observers get triggered
      const behavior = Math.abs(offset) <= 1.5 * tabElement.getBoundingClientRect().width ? 'smooth' : undefined
      tabContainer.value!.scrollTo({ left, behavior })
    }

    const scrollSnap = ref(true)
    let timeout: NodeJS.Timeout

    const setActiveTab = (tab: Tab) => {
      // FIXME workaround for scroll flicker on mobile devices
      scrollSnap.value = false
      clearTimeout(timeout)
      timeout = setTimeout(() => scrollSnap.value = true, 100)

      activeTab.value = tab.slot
      tabVisibility.value = {
        [activeTab.value]: true,
      }

      scrollActiveTabIntoView()
      if (tab.slot != props.tabs[0].slot) {
        window.history.replaceState(null, '', '#' + tab.slot)
      } else {
        // do not write default tab into URL
        window.history.replaceState(null, '', ' ')
      }
    }

    onMounted(() => {
      for (const tab of props.tabs) {
        const tabElement = refs[`${tab.slot}-tab`][0] as HTMLElement

        useIntersectionObserver(tabElement, ([{ isIntersecting }]) => {
          tabVisibility.value = {
            ...tabVisibility.value,
            [tab.slot]: isIntersecting,
          }
        }, {
          root: tabContainer.value,
          threshold: 0.25,
        })

        useIntersectionObserver(tabElement, ([{ isIntersecting }]) => {
          if (isIntersecting) {
            setActiveTab(tab)
          }
        }, {
          root: tabContainer.value,
          threshold: 1.0,
        })
      }
    })

    onMounted(() => {
      if (window.location.hash.length > 0) {
        const tabId = window.location.hash.slice(1)
        const tab = props.tabs.find(t => t.slot == tabId)
        if (tab != undefined) {
          scrollToTab(tab)
        }
      }
    })

    const { id: prefix } = useUniqueId()

    return {
      tabContainer,
      navContainer,
      headerContainer,
      scrollToTab,
      activeTab,
      tabVisibility,
      prefix,
      scrollSnap,
    }
  },
})
</script>
