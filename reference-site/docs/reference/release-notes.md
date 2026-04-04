---
title: Release Notes
description: Cotomy version history and architectural milestones.
---

# Release Notes

Cotomy version history and architectural milestones.

### v2.0.1 (2026-04-04 12:48 UTC)

Downloads: [ZIP](https://github.com/yshr1920/cotomy/archive/refs/tags/v2.0.1.zip) | [TAR.GZ](https://github.com/yshr1920/cotomy/archive/refs/tags/v2.0.1.tar.gz)

- Updated README with Node.js 20.19.0+ requirements and v2 release notes.

### v2.0.0 (2026-04-04 12:43 UTC)

Downloads: [ZIP](https://github.com/yshr1920/cotomy/archive/refs/tags/v2.0.0.zip) | [TAR.GZ](https://github.com/yshr1920/cotomy/archive/refs/tags/v2.0.0.tar.gz)

- Updated core development dependencies, including TypeScript 6, Vitest 4, jsdom 29, and webpack-cli 7.
- Switched internal DOM identity generation from `cuid` to `@paralleldrive/cuid2`.
- Added explicit `rootDir` settings for TypeScript 6 build compatibility.

### v1.0.5 (2026-02-21 14:54 UTC)

Downloads: [ZIP](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.5.zip) | [TAR.GZ](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.5.tar.gz)

- Added timezone-aware `utc` and `date` rendering in `CotomyViewRenderer`, including explicit `Z` offset handling and ancestor `data-cotomy-timezone` lookup.

### v1.0.4 (2026-02-21 06:43 UTC)

Downloads: [ZIP](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.4.zip) | [TAR.GZ](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.4.tar.gz)

- Added page-level default bind-name-generator support for `CotomyEntityFillApiForm` and `CotomyViewRenderer`.

### v1.0.3 (2026-02-20 15:37 UTC)

Downloads: [ZIP](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.3.zip) | [TAR.GZ](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.3.tar.gz)

- Restored attached-state semantics and added `isConnected` handling.

### v1.0.2 (2026-02-20 13:24 UTC)

Downloads: [ZIP](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.2.zip) | [TAR.GZ](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.2.tar.gz)

- Updated attached-state detection to use `Node.isConnected`.
- Expanded and refined reference-site docs (overview/release notes, class index, navigation, SEO, and policy pages).

### v1.0.1 (2026-02-09 13:03 UTC)

Downloads: [ZIP](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.1.zip) | [TAR.GZ](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.1.tar.gz)

- Fixed keepalive option handling.
- Updated reference-site docs and build configuration (TypeScript 5.8.x, sitemap, overview/comparison, and support info).

### v1.0.0 (2026-02-07 15:30 UTC)

Downloads: [ZIP](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.0.zip) | [TAR.GZ](https://github.com/yshr1920/cotomy/archive/refs/tags/v1.0.0.tar.gz)

- Released 1.0.0.
- Updated README and reference URL guidance for the stable line.
