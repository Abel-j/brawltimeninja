<template>
  <v-card-wrapper
    v-bind="$props"
    :card="card != undefined && { ...card, title: $t('metric.balance-rating'), tooltipLink: '/faq/measuring-map-quality' }"
    component="v-gini"
    wrapper="b-bigstat"
  >
    <p slot="content">
      <span
        class="text-xl"
        :class="{
          'text-red-400': giniScore > 0.4,
          'text-orange-400': giniScore > 0.3 && giniScore <= 0.4,
          'text-green-400': giniScore <= 0.3,
        }"
      >{{ giniScore == undefined ? '?' : giniScoreWords[Math.floor(giniScore * 10)] }}</span>
      <span>
        ({{ giniScore == undefined ? '?' : giniScore.toFixed(2) }})
      </span>
    </p>
  </v-card-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, useContext } from '@nuxtjs/composition-api'
import { MetaGridEntry } from '@schneefux/klicker/types'
import { VCardWrapper } from '@schneefux/klicker/components'
import { VisualisationProps } from '@schneefux/klicker/props'

export default defineComponent({
  components: {
    VCardWrapper,
  },
  props: {
    ...VisualisationProps,
  },
  setup(props) {
    const giniScore = computed((): number => {
      const getStat = (r: MetaGridEntry) => r.metricsRaw.useRate as number

      // calculate Gini coefficient
      let absoluteDifference = 0
      let arithmeticMean = 0
      for (const e1 of props.response.data) {
        arithmeticMean += getStat(e1) / props.response.data.length
        for (const e2 of props.response.data) {
          absoluteDifference += Math.abs(getStat(e1) - getStat(e2))
        }
      }
      return absoluteDifference / (2 * Math.pow(props.response.data.length, 2) * arithmeticMean)
    })

    const { app: { i18n } } = useContext()
    // results from a hand-drawn sample of different maps and modes:
    // 25%ile 0.225
    // 50%ile 0.32
    // 75%ile 0.425
    // words chosen from http://www.mcdonald.me.uk/storytelling/lichert_article.htm
    const giniScoreWords = [
      i18n.tc('rating.excellence.9'),
      i18n.tc('rating.excellence.8'),
      i18n.tc('rating.excellence.7'),
      i18n.tc('rating.excellence.6'),
      i18n.tc('rating.excellence.5'),
      i18n.tc('rating.excellence.4'),
      i18n.tc('rating.excellence.3'),
      i18n.tc('rating.excellence.2'),
      i18n.tc('rating.excellence.1'),
      i18n.tc('rating.excellence.0'),
    ]

    return {
      giniScore,
      giniScoreWords,
    }
  },
})
</script>
