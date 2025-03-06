<template>
  <div class="inputs">
    <label>
      API Поиска по организациям
      <input
        v-model="search"
        autocomplete="off"
        list="search"
        placeholder="Начните вводить для поиска"
        type="text"
      />
      <datalist id="search">
        <option
          v-for="(item, index) in searchResponse ?? []"
          :key="item.geometry?.coordinates.join(',') ?? index"
          :value="item.geometry?.coordinates"
        >
          {{ item.properties.name }} ({{ item.properties.description }})
        </option>
      </datalist>
    </label>
    <label>
      API Геосаджеста
      <input
        v-model="suggest"
        autocomplete="off"
        list="suggest"
        placeholder="Начните вводить для поиска"
        type="text"
      />
      <datalist id="suggest">
        <option
          v-for="(item, index) in suggestResponse ?? []"
          :key="index"
          :value="item.subtitle?.text"
        >
          {{ item.title.text }}
        </option>
      </datalist>
    </label>
  </div>
  <yandex-map
    v-model="map"
    :settings="{
      location: {
        center: [37.617644, 55.755819],
        zoom: 9,
      },

      showScaleInCopyrights: true,
    }"
    height="500px"
    width="500px"
  >
    <yandex-map-default-scheme-layer />
    <yandex-map-default-features-layer />
    <yandex-map-default-marker
      v-if="selectedSearch"
      :settings="{ coordinates: selectedSearch, title: 'Результат поиска' }"
    />
    <yandex-map-default-marker
      v-if="selectedSuggest"
      :settings="{
        coordinates: selectedSuggest,
        title: 'Результат геосаджеста',
      }"
    />
  </yandex-map>
</template>

<script setup lang="ts">
import {
  getBoundsFromCoords,
  getLocationFromBounds,
  YandexMap,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultMarker,
  YandexMapDefaultSchemeLayer,
} from "vue-yandex-maps";
import { ref, shallowRef, watch } from "vue";
import type { SearchResponse } from "@yandex/ymaps3-types/imperative/search";
import type { SuggestResponse } from "@yandex/ymaps3-types/imperative/suggest";
import type { LngLat, YMap } from "@yandex/ymaps3-types";

const selectedSearch = ref<LngLat | null>(null);
const selectedSuggest = ref<LngLat | null>(null);

const search = ref("");
const searchResponse = shallowRef<null | SearchResponse>(null);
const suggestResponse = shallowRef<null | SuggestResponse>(null);
const suggest = ref("");
const map = shallowRef<YMap | null>(null);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

watch(search, async (val) => {
  if (!val) return;

  // Проверка, что уже координаты
  if (val.split(/[,.]/).length === 4) {
    selectedSearch.value = val.split(",").map((x) => parseFloat(x)) as LngLat;
    return;
  }

  await sleep(300);
  if (val !== search.value) return;

  searchResponse.value = await ymaps3.search({
    text: val,
    bounds: map.value?.bounds,
  });
});

watch(suggest, async (val) => {
  if (!val) return;

  const existing = suggestResponse.value?.find((x) => x.subtitle?.text === val);
  if (existing) {
    const afterSuggestSearch = await ymaps3.search({
      text: val,
      type: ["toponyms"],
      bounds: map.value?.bounds,
    });
    if (afterSuggestSearch[0].geometry?.coordinates) {
      selectedSuggest.value = afterSuggestSearch[0].geometry.coordinates;
      return;
    }
  }

  await sleep(300);
  if (val !== suggest.value) return;
  suggestResponse.value = await ymaps3.suggest({
    text: val,
    bounds: map.value?.bounds,
    types: ["biz"],
  });
});

watch([selectedSuggest, selectedSearch], async () => {
  if (selectedSuggest.value && !selectedSearch.value) {
    map.value?.setLocation({
      center: selectedSuggest.value,
      zoom: 15,
      duration: 300,
    });
  } else if (!selectedSuggest.value && selectedSearch.value) {
    map.value?.setLocation({
      center: selectedSearch.value,
      zoom: 15,
      duration: 300,
    });
  } else if (selectedSuggest.value && selectedSearch.value) {
    map.value?.setLocation({
      ...(await getLocationFromBounds({
        bounds: getBoundsFromCoords([
          selectedSearch.value,
          selectedSuggest.value,
        ]),
        map: map.value!,
        comfortZoomLevel: true,
      })),
      duration: 300,
    });
  }
});
</script>
