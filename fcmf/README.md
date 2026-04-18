# Overview

**The Flax Collection Manifest Format** is a JSON-based music metadata format for music players and curators. It solves a fundamental problem: music metadata is fragmented across platforms (Spotify, Apple Music, MusicBrainz, etc.), and existing formats embed metadata into files, creating coupling and privacy concerns.

FCMF flips the model. Metadata defines where files live, and optional encryption protects the links and files. Collections are composable: users prioritize them in order, and players respect that hierarchy when merging metadata.

---

## Why FCMF?

A song might have a Spotify ID, an ISRC code, a MusicBrainz identifier, and a dozen other IDs - but no standard way to connect them. Existing formats couple metadata to files, making them hard to share, version, or curate without sharing the audio itself.

### FCMF is:
- **ID-agnostic** (supports every ID that links to music),
- **metadata-first** (links to files instead),
- **composable** (layers collections with field-level priority merging),
- **inclusive** (supports official + community-vetted unofficial content),
- **privacy-conscious** (supports encrypted audio and covers, at link and file level), and
- **extensible** (supports adding custom fields, enables writing conversion scripts and adding only what you need).

---

## Core Concepts

**Cascading lookups:** Match entities by primary ID (ISRC/UPC/ISNI) -> platform IDs -> metadata indexer IDs -> metadataHash. This ensures maximum compatibility: collections with comprehensive IDs get fast matches, while incomplete collections (unreleased, leaked, bootleg) still match via metadata hash.

**Field-level merging:** When collections conflict, players merge field by field respecting collection priority. Scalar fields use the highest-priority collection's value. Array fields (genres, images, artists) merge deduplicated. Lyrics prefer higher-quality formats. Quality metadata merges (if Collection A marks LOSSLESS and Collection B marks HI_RES_LOSSLESS, store both).

**Encryption & privacy:** Collections support AUDIO_ONLY (file URLs encrypted) or AUDIO_AND_COVERS (URLs and images encrypted) scopes. Metadata remains plaintext. Keys are stored locally, protected by user credentials.

---

## Use Cases

| Who | Why |
|-----|-----|
| **Music enthusiasts** | Build a single collection across Spotify, Apple Music, Tidal, and Flax. Link all platform IDs to canonical tracks. |
| **Collectors & archivists** | Catalog leaks, snippets, bootlegs with full metadata, versioning, and Git-backed auditing. |
| **Developers & power users** | Write conversion scripts from existing formats. Populate only what you need (images-only, lyrics-only layers). |
| **Player developers** | Ingest collections without server-side knowledge. Merge and prioritize hierarchically. No authentication required. |
| **Communities** | Use the Flax Collection Editor (coming some day) for Git-backed collaborative curation with audit trails. |

---

### How It Works

**Players normalize the manifest into a local relational database** using cascading ID matching for deduplication. When multiple collections provide metadata for the same entity, field-level merging respects collection priority. A separate search indexer consumes the database for full-text and metadata search. Encryption keys are stored locally, protected by user credentials.

---

### Specification

The format is defined by **spec_interfaces.ts** that specify the structure of manifests.

Each field's purpose and format is documented in **DEFINITIONS.md**. Refer to this for guidance on populating manifests.

---

### Reference Implementation

**Flax** (which will be available at **url**) will be the reference web player. It'll demonstrate how to ingest, merge, and query FCMF collections.

---

### What's Coming

- **Flax Editor:** Git-backed collaboration and auditing.
- **Community converters:** Scripts for Spotify, iTunes, Discogs, etc.

---

### Design Reasoning

**Cascading lookups:** Not all collections provide all ID types. Cascading ensures compatibility while prioritizing authoritative IDs.

**metadataHash as required fallback:** Unreleased and leaked content often lack primary IDs. metadataHash is deterministic, collision-resistant, and ensures the database works with incomplete data.

**Field-level merging:** Collections are composable. One might be metadata-rich but audio-poor; another audio-rich but metadata-sparse. Merging field-by-field lets users combine them optimally.

**Mapping table for platform IDs:** Platform IDs are how the real world links entities. The mapping table is the source of truth for "this Spotify ID is the same person as this MusicBrainz ID."

**Separate search indexer:** The database is normalized for deduplication. The indexer is denormalized for speed. Keeping them separate allows each to optimize for its purpose.

**Tracking provenance:** Users need to understand why their metadata looks the way it does. Tracking which collection provided what enables debugging and informed decision-making.

---

### Contributing

Community contributions are welcome. Propose new ID types, contribute converters, report bugs, or help build integrations.

---

### License

Flax Collection Manifest Format is licensed under CC-BY-4.0. Author: tezvii