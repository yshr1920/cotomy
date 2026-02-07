---
title: ICotomyBindNameGenerator
sidebar_position: 6
---

# ICotomyBindNameGenerator

Name generator interface used by `CotomyViewRenderer` to build `data-cotomy-bind` paths for nested objects and arrays.

**Methods**

| Method | Description |
| --- | --- |
| `create(name, parent?)` | Builds a property path for a child name under an optional parent path. |
| `createIndex(parent, index)` | Builds a path for an array index under a parent path. |
