export interface TransformedSuggestResponse {
  value: string;
  title: string;
  subtitle?: string;

  raw: SubtitleSuggestResponse;
}

interface SubtitleSuggestResponse {
  subtitle: string;
  searchValue: string;
}
