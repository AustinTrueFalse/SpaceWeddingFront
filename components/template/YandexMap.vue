<template>
  <div>
    <v-row v-if="!readonly" justify="center" class="mb-5">
      <v-col
        ><v-combobox
          class="text-input"
         
          v-model="suggest"
          :items="transformedSuggestResponse ?? []"
          :item-value="(item: any) => item.key"
          :label="label"
          :placeholder="'Начните вводить для поиска'"
          :readonly="readonly"
          no-filter
          :clearable="!readonly"
          variant="solo-filled"
          rounded="xl"
          @blur="handleBlur"
        >
          <template v-slot:item="{ item }">
            <v-card @click="handleItemSelect(item)">
              <v-card-title>{{ item.title }}</v-card-title>
              <v-card-subtitle>{{
                item.raw.subtitle || "Нет подзаголовка"
              }}</v-card-subtitle>
            </v-card>
          </template>
        </v-combobox>
      </v-col>
    </v-row>

    <v-card
      rounded="xl"
      :height="height"
      class="d-flex justify-center align-center"
    >
      <yandex-map
        v-model="map"
        :settings="{
          location: {
            center: [37.617644, 55.755819],
            zoom: 9,
          },
          showScaleInCopyrights: true,
        }"
        :height="height"
      >
        <yandex-map-default-scheme-layer :settings="{ theme: 'dark' }" />
        <yandex-map-default-features-layer />
        <yandex-map-default-marker
          v-if="selectedSuggest && mapLoaded"
          v-model="defaultMarker"
          :settings="{
            coordinates: selectedSuggest,
            title: suggest,
            draggable: !readonly, // Отключаем перетаскивание, если readonly
            onDragEnd: !readonly ? onDragEnd : undefined, // Только если разрешено
          }"
        />
      </yandex-map>
    </v-card>
  </div>
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
import {
  ref,
  shallowRef,
  computed,
  watch,
  defineProps,
  defineEmits,
  onMounted,
} from "vue";
import { getGeoSuggestByCoords } from "../../helpers/yandexRequests";
import type { SuggestResponse } from "@yandex/ymaps3-types/imperative/suggest";
import type { LngLat, YMap } from "@yandex/ymaps3-types";
import type { TransformedSuggestResponse } from "@/types/suggestResponse";

const emit = defineEmits();

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: "400px",
  }
});

const selectedSuggest = ref<LngLat | null>([37.617644, 55.755819]);
const suggest = ref(props.modelValue);
const map = shallowRef<YMap | null>(null);
const mapLoaded = ref(false);
const defaultMarker = shallowRef<null>(null);
const suggestResponse = shallowRef<null | SuggestResponse>(null);

const transformedSuggestResponse = computed(() => {
  return (
    suggestResponse.value?.map((item, index) => ({
      key: `${item.value}-${index}`, // добавляем index для уникальности
      searchValue: item.value + item.subtitle?.text,
      title: item.title.text,
      subtitle: item.subtitle?.text || "1",
      raw: item, // сохраняем оригинальные данные
    })) ?? []
  );
});

onMounted(async () => {
  const startTime = Date.now();
  const timeout = 60000; // 1 минута

  while (true) {
    console.log("Пробую вызвать ymaps3.suggest...");

    try {
      suggestResponse.value = await ymaps3.suggest({
        text: suggest.value,
        bounds: map.value?.bounds,
        types: ["biz"],
      });

      await findLocationByItemFromDatabase(transformedSuggestResponse.value[0]);
      mapLoaded.value = true;

      console.log("ymaps3.suggest успешно выполнен!");

      break;
    } catch (error) {
      console.log("Ошибка при вызове ymaps3.suggest:", error);
    }

    if (Date.now() - startTime > timeout) {
      console.error("Ошибка загрузки ymaps3. Первышен лимит ожидания.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Пауза 1 секунда
  }
});

watch(suggest, async (val) => {
  emit("update:modelValue", val);
  if (!val) return;
  if (val !== suggest.value) return;
  suggestResponse.value = await ymaps3.suggest({
    text: val,
    bounds: map.value?.bounds,
    types: ["biz"],
  });
});

function handleBlur() {
  // Здесь можно скрывать список предложений, если это нужно
  suggest.value = suggest.value; // Оставляем значение, но скрываем список
}

// Обработчик клика по элементу в combobox
async function findLocationByItemFromDatabase(
  item: TransformedSuggestResponse
) {
  console.log(item);

  const existing = transformedSuggestResponse.value?.find(
    (x) => x.searchValue === item.searchValue
  );

  if (existing) {
    const afterSuggestSearch = await ymaps3.search({
      text: item.searchValue,
      type: ["toponyms"],
      bounds: map.value?.bounds,
    });
    if (afterSuggestSearch[0].geometry?.coordinates) {
      selectedSuggest.value = afterSuggestSearch[0].geometry.coordinates;
      return;
    }
  }
}

async function handleItemSelect(item: TransformedSuggestResponse) {
  console.log(item);

  suggest.value = item.title + " " + item.raw.subtitle;

  const existing = transformedSuggestResponse.value?.find(
    (x) => x.searchValue === item.raw.searchValue
  );

  if (existing) {
    const afterSuggestSearch = await ymaps3.search({
      text: item.raw.searchValue,
      type: ["toponyms"],
      bounds: map.value?.bounds,
    });
    if (afterSuggestSearch[0].geometry?.coordinates) {
      selectedSuggest.value = afterSuggestSearch[0].geometry.coordinates;
      return;
    }
  }
}

// Функция, вызываемая при окончании перетаскивания маркера
let dragTimeout: ReturnType<typeof setTimeout> | null = null;

function onDragEnd() {
  if (!defaultMarker.value) return;

  // Очистка предыдущего таймера
  if (dragTimeout) clearTimeout(dragTimeout);

  if (defaultMarker.value.coordinates) {
    dragTimeout = setTimeout(async () => {
      const newCoords = defaultMarker.value.coordinates;
      if (newCoords) {
        selectedSuggest.value = newCoords;
        await reverseGeocode(newCoords);
      }
    }, 500); // Задержка в 500 мс
  }
}

// Функция для поиска адреса по координатам
async function reverseGeocode(coords: LngLat) {
  const data = await getGeoSuggestByCoords(coords);

  if (data) {
    const closestSuggest = data.featureMember[0];

    suggest.value = closestSuggest.GeoObject.name;
  }
}

watch([selectedSuggest], async () => {
  if (selectedSuggest.value) {
    map.value?.setLocation({
      center: selectedSuggest.value,
      zoom: 15,
      duration: 300,
    });
  }
});
</script>
