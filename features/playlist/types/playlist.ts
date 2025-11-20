export interface TrackInfo {
  title: string;
  artist: string;
  url: string;
  image_url: string;
  source: string;
}

export interface Playlist {
  id: string;
  playlistName: string;
  tracks: TrackInfo[];
}

export interface PlaylistCreate 
  extends Pick<Playlist, "playlistName" | "tracks"> {}

export interface PlaylistUpdate extends Partial<PlaylistCreate> {
  id: string;
}
export const initialPlaylistState: Playlist = {
  id: "",
  playlistName: "",
  tracks: [],
};
