# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 重要：言語設定
**Claude は必ず日本語で応答してください。英語での応答は禁止します。すべての説明、コメント、エラーメッセージ、技術的な説明は日本語で行ってください。**

## Overview

Cotomy is a lightweight TypeScript framework for managing form behavior and page controllers in web applications. It provides a DOM manipulation library with scoped CSS support, form management capabilities, and API integration features.

## Development Commands

- `npm run build` - Build for production using webpack
- `npm run dev` - Build for development
- `npm run clean` - Remove dist directory
- `npm run check` - Type check without emitting files
- `npm run lint` - Lint TypeScript files in src/
- `npm run format` - Format source code with Prettier
- `npm run prepare` - Runs automatically before publishing (builds the project)
- `npm run release` - Full release workflow: clean, build, version bump, and publish

The project uses webpack to bundle TypeScript into UMD format for both browser and Node.js environments.

## Architecture

### Core Components

**CotomyElement** (`src/view.ts`) - The foundation class that wraps HTMLElement with enhanced functionality:
- Scoped CSS support with automatic scope generation
- Comprehensive DOM manipulation methods
- Event handling with custom layout events
- Position and size utilities
- Factory methods for element creation and finding

**CotomyForm** (`src/form.ts`) - Abstract base class for form management:
- **CotomyQueryForm** - Handles GET requests with URL parameter management
- **CotomyApiForm** - REST API integration with FormData handling
- **CotomyEntityApiForm** - Entity-specific operations with path key support
- **CotomyEntityFillApiForm** - Auto-populates forms from API responses

**CotomyApi** (`src/api.ts`) - HTTP client with comprehensive error handling:
- Support for all HTTP methods
- Automatic content-type handling (JSON, FormData, URL-encoded)
- Structured exception hierarchy for different HTTP status codes
- Request/response debugging capabilities

**CotomyPageController** (`src/page.ts`) - Singleton page lifecycle management:
- Form registration and lifecycle management
- URL utilities and navigation helpers
- Integration with CotomyWindow for global events

### Key Patterns

**Scoped CSS**: Elements can have isolated CSS using `[scope]` selectors that get automatically replaced with unique scope IDs.

**Form Identification**: Entity forms use three identification methods:
1. External keys via `data-cotomy-key` attribute
2. Path keys via `data-cotomy-keyindex` inputs 
3. Regular key inputs via `data-cotomy-key` inputs

**Data Binding**: Two-way binding system using:
- `ICotomyBindNameGenerator` for name generation (bracket or dot notation)
- `CotomyViewRenderer` for rendering data to DOM elements
- Custom type handlers for different data formats

## TypeScript Configuration

- Target: ES2020 (supports modern browsers, iOS 13+ requires polyfills)
- Module: ESNext with bundler resolution
- Strict mode enabled
- Declaration files generated for TypeScript consumers

## Dependencies

**Runtime**:
- `cuid` - Unique ID generation for scoped elements
- `dayjs` - Date/time handling and formatting
- `http-status-codes` - HTTP status code constants
- `locale-currency` - Currency formatting based on locale

**Development**:
- TypeScript 5.8+ for compilation
- Webpack 5 for bundling with ts-loader
- No testing framework configured (placeholder test script)

## Debug Features

The framework includes a localStorage-based debug system (`CotomyDebugSettings`) with features:
- `api` - API request/response logging
- `fill` - Form filling operations
- `bind` - Data binding operations  
- `formdata` - FormData contents
- `html` - Element creation
- `page` - Page controller initialization
- `formload` - Form loading operations

Enable via: `CotomyDebugSettings.enable(CotomyDebugFeature.Api)`