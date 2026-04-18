interface ArtistIds {
    isni?: string;
    tidalId?: string;
    spotifyId?: string;
    appleMusicId?: string;
    youtubeMusicId?: string;
    soundCloudId?: string;
    musicBrainzId?: string;
    discogsId?: string;
    deezerId?: string;
    amazonMusicId?: string;
    bandcampId?: string;
    lastFmId?: string;
    geniusId?: string;
    shazamId?: string;
    youtubeId?: string;
    beatportId?: string;
    traxsourceId?: string;
    metadataHash: string;
}

interface AlbumIds {
    upc?: string;
    tidalId?: string;
    spotifyId?: string;
    appleMusicId?: string;
    youtubeMusicId?: string;
    soundCloudId?: string;
    musicBrainzId?: string;
    discogsId?: string;
    deezerId?: string;
    amazonMusicId?: string;
    bandcampId?: string;
    lastFmId?: string;
    geniusId?: string;
    youtubeId?: string;
    beatportId?: string;
    traxsourceId?: string;
    metadataHash: string;
}

interface TrackIds {
    isrc?: string;
    tidalId?: string;
    spotifyId?: string;
    appleMusicId?: string;
    youtubeMusicId?: string;
    soundCloudId?: string;
    acoustId?: string;
    musicBrainzId?: string;
    discogsId?: string;
    deezerId?: string;
    amazonMusicId?: string;
    bandcampId?: string;
    lastFmId?: string;
    geniusId?: string;
    shazamId?: string;
    youtubeId?: string;
    beatportId?: string;
    traxsourceId?: string;
    metadataHash: string;
}

interface ArtistReference {
    ids: ArtistIds;
    role: "MAIN" | "FEATURED" | "PRODUCER" | "MASTERING" | "COMPOSER" | "REMIXER";
}

interface AlbumReference {
    ids: AlbumIds;
}

interface TrackReference {
    ids: TrackIds;
}

interface ArtistSocials {
    [key: string]: string;
}

interface QualityMetadata {
    tags: ("LOW" | "LOSSLESS" | "HI_RES_LOSSLESS")[];
}

interface LeakMetadata {
    leakTags: ("BOOTLEG" | "SNIPPET" | "LEAK" | "DEMO" | "REFERENCE" | "INSTRUMENTAL" | "ACAPELLA")[];
    leakVersion?: number;
    leakContext?: string;
    leakDate?: string;
}

interface DirectLink {
    url: string;
    quality: "LOW" | "LOSSLESS" | "HI_RES_LOSSLESS";
    codec?: string;
    bitrate?: number;
    fileHash: string;
}

interface Lyrics {
    basicLyrics?: string;
    lrcLyrics?: string;
    ttmlLyrics?: string;
}

interface Artist {
    ids: ArtistIds;
    name: string;
    bio?: string;
    genres?: string[];
    images?: string[];
    socials?: ArtistSocials;
}

interface Album {
    ids: AlbumIds;
    title: string;
    description?: string;
    releaseDate: string;
    numberOfTracks: number;
    isSingle: boolean;
    type: string;
    explicit: boolean;
    label?: string;
    copyright?: string;
    images?: string[];
    genres?: string[];
    qualityMetadata: QualityMetadata;
    artists: ArtistReference[];
    tracks: TrackReference[];
}

interface Track {
    ids: TrackIds;
    title: string;
    releaseDate: string;
    durationSeconds: number;
    trackNumber: number;
    volumeNumber: number;
    version?: string;
    explicit: boolean;
    replayGain?: number;
    bpm?: number;
    key?: number;
    qualityMetadata: QualityMetadata;
    leakMetadata?: LeakMetadata;
    album: AlbumReference;
    artists: ArtistReference[];
    cover?: string;
    directLinks?: DirectLink[];
    lyrics?: Lyrics;
}

interface Encryption {
    type: "AES_256_GCM";
    linkEncryption: "NONE" | "AUDIO_ONLY" | "AUDIO_AND_COVERS";
    fileEncryption: "NONE" | "AUDIO_ONLY" | "AUDIO_AND_COVERS";
}

interface FlaxCollectionManifest {
    version: "0.3.1";
    collectionAuthorId?: string;
    collectionId: string;
    collectionLink?: string;
    collectionProjectLink?: string;
    createdAt: string;
    updatedAt: string;
    encryption?: Encryption;
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
}

export type {
  ArtistIds,
  AlbumIds,
  TrackIds,
  ArtistReference,
  AlbumReference,
  TrackReference,
  ArtistSocials,
  QualityMetadata,
  LeakMetadata,
  DirectLink,
  Lyrics,
  Artist,
  Album,
  Track,
  Encryption,
  FlaxCollectionManifest
};