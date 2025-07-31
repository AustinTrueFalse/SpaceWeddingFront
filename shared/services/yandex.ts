import type { LngLat } from "@yandex/ymaps3-types";
import { getErrorMessage } from "../utils/errorHandler";

export async function getGeoSuggestByCoords(coords: LngLat) {
  try {
    const config = useRuntimeConfig();

    const response = await fetch(
      `https://geocode-maps.yandex.ru/1.x/?apikey=${config.public.yandexMaps.apikey}&geocode=${coords[0]},${coords[1]}&format=json`
    );
    const data = await response.json();

    return data.response.GeoObjectCollection;

  } catch (error) {
    getErrorMessage(error);
  }
}
