<template>
  <b-card :title="$t('leaderboard.by-metric', { metric: $t('metric.trophies') })">
    <template v-slot:content>
      <p>
        {{ $t('leaderboard.player.description', { length: rows.length }) }}
      </p>
      <div class="mt-2">
        <player-rank-table
          :columns="['trophies']"
          :column-names="[$t('metric.trophies')]"
          :rows="rows"
        ></player-rank-table>
      </div>
    </template>
  </b-card>
</template>

<script lang="ts">
import { defineComponent, useContext, useAsync, computed } from '@nuxtjs/composition-api'
import { PlayerRankTableRow } from '~/components/player/player-rank-table.vue'
import { PlayerRanking } from '~/model/Brawlstars'

export default defineComponent({
  setup() {
    const { $http, $config } = useContext()

    const fetchTrophiesLeaderboard = () => $http.$get<PlayerRanking[]>($config.apiUrl + `/api/rankings/global/players`)
    const leaderboard = useAsync(fetchTrophiesLeaderboard, 'leaderboard-trophies')

    const rows = computed<PlayerRankTableRow[]>(() => {
      return leaderboard.value?.map(e => ({
        player_name: e.name,
        player_tag: e.tag,
        player_icon_id: e.icon.id,
        trophies: e.trophies,
      })) ?? []
    })

    return {
      rows,
    }
  },
  middleware: ['cached'],
})
</script>
