# JSON field definitions

## Top-Level Fields

**version**: Semantic versioning of the manifest format (e.g., 0.3.1).

**collectionId**: Unique identifier for this collection.

**collectionAuthorId**: Author ID for failure reporting in centralized collections database implementations. Absent if collection is loaded manually.

**collectionLink**: Optional direct link to the collection manifest.

**collectionProjectLink**: Optional link to the creator/project.

**createdAt**: ISO 8601 timestamp of collection creation.

**updatedAt**: ISO 8601 timestamp of last modification.

**encryption**: Optional encryption configuration. Omit if no encryption is used.

**artists**: Array of deduplicated artist entities.

**albums**: Array of deduplicated album entities.

**tracks**: Array of track entities with references to artists and albums.

---

## Encryption

**type**: Only AES_256_GCM is supported.

**linkEncryption**: Scope of encryption applied to URLs. Options: NONE, AUDIO_ONLY, AUDIO_AND_COVERS.

**fileEncryption**: Scope of encryption applied to files. Options: NONE, AUDIO_ONLY, AUDIO_AND_COVERS.

---

## Artist

**ids**: Cross-platform identifier object.

**name**: Artist name. Required.

**bio**: Artist biography. Optional.

**genres**: Array of genre tags. Optional.

**images**: Array of HTTPS image URLs. First is primary. Optional.

**socials**: Key-value object of social media handles/URLs. Optional.

---

## ArtistReference

**ids**: Cross-platform identifier object.

**role**: Contribution type. Options: MAIN, FEATURED, PRODUCER, MASTERING, COMPOSER, REMIXER.

---

## Album

**ids**: Cross-platform identifier object.

**title**: Album title. Required.

**description**: Album description. Optional.

**releaseDate**: YYYY-MM-DD format. Required.

**numberOfTracks**: Track count. Required.

**isSingle**: Boolean. Required.

**type**: Album category (e.g., "EP", "LP", "Single", "Compilation"). Required.

**explicit**: Boolean. Required.

**label**: Record label. Optional.

**copyright**: Copyright statement. Optional.

**images**: Array of HTTPS image URLs. First is primary. Optional.

**genres**: Array of genre tags. Optional.

**qualityMetadata**: Quality tags available in this album.

**artists**: Array of ArtistReference objects. At least one required.

**tracks**: Array of TrackReference objects. At least one required.

---

## Track

**ids**: Cross-platform identifier object.

**title**: Track title. Required.

**releaseDate**: YYYY-MM-DD format. May differ from album release date. Required.

**durationSeconds**: Track length in seconds (truncated). Required.

**trackNumber**: 1-indexed position in album. Required.

**volumeNumber**: Disc number (1 for single-disc). Required.

**version**: Version descriptor (e.g., "Radio Edit", "Live at Glastonbury"). Optional.

**explicit**: Boolean. Required.

**replayGain**: ReplayGain normalization in dB. Optional.

**bpm**: Dominant beats-per-minute tempo of the track. Optional.

**key**: Dominant musical key of the track. Optional.

**qualityMetadata**: Quality tags available for this track.

**leakMetadata**: Metadata for unreleased/leaked versions. Omit if officially released. Optional.

**album**: AlbumReference object. Required.

**artists**: Array of ArtistReference objects. At least one required. First MAIN artist is primary.

**cover**: HTTPS image URL. Falls back to album cover if omitted. Useful for preserving unique covers (Soundcloud). Optional.

**directLinks**: Array of download/stream links with quality and hash. Optional.

**lyrics**: Lyrics object in multiple formats. Optional.

---

## DirectLink

**url**: HTTPS URL to audio file (R2 or equivalent). Required.

**quality**: Quality tier. Options: LOW, LOSSLESS, HI_RES_LOSSLESS. Required.

**codec**: Audio codec (e.g., MP3, FLAC, AAC). Optional.

**bitrate**: Bitrate in kbps. Optional.

**fileHash**: SHA256 hash of the file for integrity verification. Encrypted if Encryption.linkEncryption is enabled. Required.

---

## QualityMetadata

**tags**: Array of available quality tiers. At least one required. Options: LOW, LOSSLESS, HI_RES_LOSSLESS.

---

## LeakMetadata

**leakTags**: Array of categorization tags. Required if leakMetadata is present. Options: BOOTLEG, SNIPPET, LEAK, DEMO, REFERENCE, INSTRUMENTAL, ACAPELLA.

**leakVersion**: Version number for iterative leaks (e.g., 1, 2, 3). Optional.

**leakContext**: Source and context of the leak. Optional.

**leakDate**: YYYY-MM-DD of leak surfacing. May differ from track release date. Optional.

---

## Lyrics

**basicLyrics**: Plain text lyrics. Optional.

**lrcLyrics**: LRC format (synced). Optional.

**ttmlLyrics**: TTML format. Optional.

---

## ID Formats

All ID objects are optional and platform-specific, except metadataHash. Populate only what's available.

**Primary IDs** (preferred for matching):
- **isni**: Artist International Standard Name Identifier.
- **upc**: Album Universal Product Code.
- **isrc**: Track International Standard Recording Code.

**Fallback ID** (for unreleased/leaked content):
- **metadataHash**: SHA256 hash of concatenated metadata fields.

**Artists**: SHA256(artist name)
**Albums**: SHA256(album title + release date + main artist name)
**Tracks**: SHA256(track title + duration + main artist name + album title)

**Streaming Platforms**: tidalId, spotifyId, appleMusicId, youtubeMusicId, amazonMusicId, deezerId, bandcampId.

**Community Databases**: musicBrainzId, discogsId, lastFmId, geniusId.

**Video Platforms**: youtubeId.

**Audio Identification**: acoustId (fingerprint in base64), shazamId.

**Electronic Music**: beatportId, traxsourceId.

**Social/Discovery**: soundCloudId.