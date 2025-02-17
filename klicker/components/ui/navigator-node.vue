<template>
  <ul
    v-show="links.length > 0"
    class="grid gap-y-2 gap-x-2 grid-cols-[1.5rem,1fr]"
    role="group"
  >
    <li
      v-for="link in links"
      :key="link.id"
      :aria-expanded="expandedLinks[link.id]"
      class="contents"
      role="treeitem"
    >
      <button
        v-if="link.children != undefined && link.children.length > 0"
        :aria-controls="`${prefix}-group`"
        class="col-start-1"
        @click="toggleLink(link)"
      >
        <font-awesome-icon
          v-if="expandedLinks[link.id]"
          :icon="faMinus"
        ></font-awesome-icon>
        <font-awesome-icon
          v-else
          :icon="faPlus"
        ></font-awesome-icon>
      </button>
      <slot
        v-if="link.target"
        :to="link.target"
        :title="link.name"
        name="link"
      ></slot>
      <span
        v-else
        class="col-start-2"
      >
        {{ link.name }}
      </span>
      <navigator-node
        v-if="link.children != undefined && link.children.length > 0"
        :id="`${prefix}-group`"
        :links="expandedLinks[link.id] ? link.children : []"
        :expand-by-default="expandByDefault"
        class="ml-8 col-span-full"
      >
        <template v-slot:link="{ to, title }">
          <slot
            name="link"
            :to="to"
            :title="title"
          ></slot>
        </template>
      </navigator-node>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from '@vue/composition-api'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Link } from './b-navigator.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useUniqueId } from '../../composables'

export default defineComponent({
  name: 'navigator-node',
  components: {
    FontAwesomeIcon,
  },
  props: {
    links: {
      type: Array as PropType<Link[]>,
      required: true
    },
    expandByDefault: {
      type: Boolean,
      default: false
    },
  },
  setup(props) {
    const expandedLinks = ref<Record<string, boolean>>({})

    const toggleLink = (link: Link) => {
      expandedLinks.value = {
        ...expandedLinks.value,
        [link.id]: !expandedLinks.value[link.id],
      }
    }

    watchEffect(() => {
      expandedLinks.value = props.links.reduce((map, link) => ({
        ...map,
        [link.id]: link.expanded ?? props.expandByDefault,
      }), {})
    })

    const { id: prefix } = useUniqueId()

    return {
      toggleLink,
      expandedLinks,
      faMinus,
      faPlus,
      prefix,
    }
  },
})
</script>
