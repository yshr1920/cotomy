# Cotomy

> This library targets ES2020+.  
> For older browsers (e.g. iOS 13 or IE), you will need a Polyfill such as `core-js`.

**Cotomy** is a lightweight framework for managing form behavior and page controllers in web applications.  
It is suitable for both SPAs (Single Page Applications) and traditional web apps requiring dynamic form operations.

⚠️ **Warning**: This project is in early development. APIs may change without notice until version 1.0.0.


To install Cotomy in your project, run the following command:

```bash
npm i cotomy
```

## Usage

Cotomy will continue to expand with more detailed usage instructions and code examples added to the README in the future.  
For the latest updates, please check the official documentation or repository regularly.

## View Reference

The View layer provides thin wrappers around DOM elements and window events.

- `CotomyElement` — A wrapper around `HTMLElement` with convenient utilities for scoped CSS, querying, attributes/styles, geometry, and event handling.
- `CotomyMetaElement` — Convenience wrapper for `<meta>` tags.
- `CotomyWindow` — A singleton that exposes window-level events and helpers.

### CotomyElement

- Constructor
  - `new CotomyElement(element: HTMLElement)`
  - `new CotomyElement(html: string)` — Creates an element from HTML (single root required)
  - `new CotomyElement({ html, css? })` — Creates from HTML and injects scoped CSS
  - `new CotomyElement({ tagname, text?, css? })`
- Scoped CSS
  - `scopeId: string` — Unique attribute injected into the element for scoping
  - `scopedSelector: string` — Selector string like `[__cotomy_scope__...]`
  - `[scope]` placeholder in provided CSS is replaced by the element’s scope
  - `stylable: boolean` — False for tags like `script`, `style`, `link`, `meta`
- Static helpers
  - `CotomyElement.encodeHtml(text)`
  - `CotomyElement.first(selector, type?)`
  - `CotomyElement.last(selector, type?)`
  - `CotomyElement.find(selector, type?)`
  - `CotomyElement.contains(selector)` / `CotomyElement.containsById(id)`
  - `CotomyElement.byId(id, type?)`
  - `CotomyElement.empty(type?)` — Creates a hidden placeholder element
- Identity & matching
  - `id: string | null | undefined`
  - `generateId(prefix = "__cotomy_elem__"): this`
  - `is(selector: string): boolean` — Parent-aware matching helper
  - `empty: boolean` — True for tags that cannot have children or have no content
- Attributes, classes, styles
  - `attribute(name)` / `attribute(name, value | null): this`
  - `hasAttribute(name): boolean`
  - `addClass(name): this` / `removeClass(name): this` / `toggleClass(name, force?): this` / `hasClass(name): boolean`
  - `style(name)` / `style(name, value | null): this`
- Content & value
  - `text: string` (get/set)
  - `html: string` (get/set)
  - `value: string` — Works for inputs; falls back to `data-cotomy-value` otherwise
  - `readonly: boolean` (get/set) — Uses native property if available, otherwise attribute
  - `enabled: boolean` (get/set) — Toggles `disabled` attribute
  - `setFocus(): void`
- Tree traversal & manipulation
  - `parent: CotomyElement`
  - `parents: CotomyElement[]`
  - `children(selector = "*", type?): T[]` (direct children only)
  - `firstChild(selector = "*", type?)`
  - `lastChild(selector = "*", type?)`
  - `closest(selector, type?)`
  - `find(selector, type?)` / `first(selector = "*", type?)` / `last(selector = "*", type?)` / `contains(selector)`
  - `append(child): this` / `prepend(child): this` / `appendAll(children): this`
  - `insertBefore(sibling): this` / `insertAfter(sibling): this`
  - `appendTo(target): this` / `prependTo(target): this`
  - `clone(type?): CotomyElement` — Returns a deep-cloned element, optionally typed
  - `clear(): this` — Removes all descendants and text
  - `remove(): void`
- Geometry & visibility
  - `visible: boolean`
  - `width: number` (get/set px)
  - `height: number` (get/set px)
  - `innerWidth: number` / `innerHeight: number`
  - `outerWidth: number` / `outerHeight: number` — Includes margins
  - `scrollWidth: number` / `scrollHeight: number` / `scrollTop: number`
  - `position(): { top, left }` — Relative to viewport
  - `absolutePosition(): { top, left }` — Viewport + page scroll offset
  - `screenPosition(): { top, left }`
  - `rect(): { top, left, width, height }`
  - `innerRect()` — Subtracts padding
- Events
  - Generic: `on(eventOrEvents, handler, options?)`, `off(eventOrEvents, handler?, options?)`, `once(eventOrEvents, handler, options?)`, `trigger(event[, Event])` — `eventOrEvents` accepts either a single event name or an array for batch registration/removal. `trigger` emits bubbling events by default and can be customized by passing an `Event`.
  - Delegation: `onSubTree(eventOrEvents, selector, handler, options?)` — `eventOrEvents` can also be an array for listening to multiple delegated events at once.
  - Mouse: `click`, `dblclick`, `mouseover`, `mouseout`, `mousedown`, `mouseup`, `mousemove`, `mouseenter`, `mouseleave`
  - Keyboard: `keydown`, `keyup`, `keypress`
  - Inputs: `change`, `input`
  - Focus: `focus`, `blur`, `focusin`, `focusout`
  - Viewport: `inview`, `outview` (uses `IntersectionObserver`)
  - Layout (custom): `resize`, `scroll`, `changelayout` — requires `listenLayoutEvents()` on the element
  - Move lifecycle: `cotomy:transitstart`, `cotomy:transitend` — emitted automatically by `append`, `prepend`, `insertBefore/After`, `appendTo`, and `prependTo`. While moving, the element (and its descendants) receive a temporary `data-cotomy-moving` attribute so removal observers know the node is still in transit.
  - Removal: `removed` — fired when an element actually leaves the DOM (MutationObserver-backed). Because `cotomy:transitstart`/`transitend` manage the `data-cotomy-moving` flag, `removed` only runs for true detachments, making it safe for cleanup.
  - File: `filedrop(handler: (files: File[]) => void)`

Example (scoped CSS and events):

```ts
import { CotomyElement } from "cotomy";

const panel = new CotomyElement({
  html: `<div class="panel"><button class="ok">OK</button></div>`,
  css: `
    [scope] .panel { padding: 8px; }
    [scope] .ok { color: green; }
  `,
});

panel.onSubTree("click", ".ok", () => console.log("clicked!"));
document.body.appendChild(panel.element);
```

### CotomyMetaElement

- `CotomyMetaElement.get(name): CotomyMetaElement`
- `content: string` — Reads `content` attribute.

### CotomyWindow

- Singleton
  - `CotomyWindow.instance`
  - `initialized: boolean` — Call `initialize()` once after DOM is ready
  - `initialize(): void`
- DOM helpers
  - `body: CotomyElement`
  - `append(element: CotomyElement)`
  - `moveNext(focused: CotomyElement, shift = false)` — Move focus to next/previous focusable
- Window events
  - `on(eventOrEvents, handler)` / `off(eventOrEvents, handler?)` / `trigger(event[, Event])` — `eventOrEvents` accepts a single event name or an array. CotomyWindow’s `trigger` also bubbles by default and accepts an `Event` to override the behavior.
  - `load(handler)` / `ready(handler)`
  - `resize([handler])` / `scroll([handler])` / `changeLayout([handler])` / `pageshow([handler])`
- Window state
  - `scrollTop`, `scrollLeft`, `width`, `height`, `documentWidth`, `documentHeight`
  - `reload(): void` (sets internal `reloading` flag), `reloading: boolean`

Quick start:

```ts
import { CotomyWindow, CotomyElement } from "cotomy";

CotomyWindow.instance.initialize();
CotomyWindow.instance.ready(() => {
  const el = new CotomyElement("<div>Hello</div>");
  CotomyWindow.instance.append(el);
});
```

## Form Reference

The Form layer builds on `CotomyElement` for common form flows.

- `CotomyForm` — Base class with submit lifecycle hooks
- `CotomyQueryForm` — Submits to query string (GET)
- `CotomyApiForm` — Submits via `CotomyApi` (handles `FormData`, errors, events)
- `CotomyEntityApiForm` — REST entity helper with surrogate key support
- `CotomyEntityFillApiForm` — Adds automatic field filling and simple view binding

### CotomyForm (base)

- Construction & basics
  - Extends `CotomyElement` and expects a `<form>` element
  - `initialize(): this` — Wires a `submit` listener that calls `submitAsync()`
  - `initialized: boolean` — Set after `initialize()`
  - `submitAsync(): Promise<void>` — Abstract in base
- Routing & reload
  - `method: string` — Getter that defaults to `get` in base; specialized in subclasses
  - `actionUrl: string` — Getter that defaults to the `action` attribute or current path
  - `reloadAsync(): Promise<void>` — Page reload using `CotomyWindow`
  - `autoReload: boolean` — Backed by `data-cotomy-autoreload` (default true)

### CotomyQueryForm

- Always uses `GET`
- `submitAsync()` merges current query string with form inputs and navigates via `location.href`.

### CotomyApiForm

- API integration
  - `apiClient(): CotomyApi` — Override to inject a client; default creates a new one
  - `actionUrl: string` — Uses `action` attribute
  - `method: string` — Defaults to `post`
  - `formData(): FormData` — Builds from form, converts `datetime-local` to ISO (UTC offset)
  - `submitAsync()` — Calls `submitToApiAsync(formData)`
  - `submitToApiAsync(formData): Promise<CotomyApiResponse>` — Uses `CotomyApi.submitAsync`
- Events
  - `apiFailed(handler)` — Listens to `cotomy:apifailed`
  - `submitFailed(handler)` — Listens to `cotomy:submitfailed`
  - Both events bubble from the form element; payload is `CotomyApiFailedEvent`

### CotomyEntityApiForm

- Surrogate key flow
  - `data-cotomy-entity-key` — Holds the entity identifier if present
  - `data-cotomy-identify` — Defaults to true; when true and `201 Created` is returned, the form extracts the key from `Location` and stores it in `data-cotomy-entity-key`
  - `actionUrl` — Appends the key to the base `action` when present; otherwise normalizes trailing slash for collection URL
  - `method` — `put` when key exists; otherwise `post` (unless `method` attribute is explicitly set)

### CotomyEntityFillApiForm

- Data loading and field filling
  - `initialize()` — Adds default fillers and triggers `loadAsync()` on `CotomyWindow.ready`
  - `reloadAsync()` — Alias to `loadAsync()`
  - `loadAsync(): Promise<CotomyApiResponse>` — Calls `CotomyApi.getAsync` when `canLoad()` is true
  - `loadActionUrl(): string` — Defaults to `actionUrl`; override for custom endpoints
  - `canLoad(): boolean` — Defaults to `hasEntityKey`
- Naming & binding
  - `bindNameGenerator(): ICotomyBindNameGenerator` — Defaults to `CotomyBracketBindNameGenerator` (`user[name]`)
  - `renderer(): CotomyViewRenderer` — Applies `[data-cotomy-bind]` to view elements
- `filler(type, (input, value))` — Register fillers; defaults provided for `datetime-local`, `checkbox`, `radio`
  - Fills non-array, non-object fields by matching input/select/textarea `name`

#### Array binding

- Both `CotomyViewRenderer.applyAsync` and `CotomyEntityFillApiForm.fillAsync` resolve array elements by index via the active `ICotomyBindNameGenerator` (dot style → `items[0].name`, bracket style → `items[0][name]`).
- Cotomy does **not** create or clone templates for you. Prepare the necessary DOM (e.g., table rows, list items, individual inputs) ahead of time, then call `fillAsync`/`applyAsync` to populate the values.
- Primitive arrays (strings, numbers, booleans, etc.) are treated the same way—have matching `[data-cotomy-bind]`/`name` attributes ready for every index you want to show.
- If you need dynamic row counts, generate the markup yourself before invoking Cotomy; the framework purposely avoids mutating the structure so it does not get in your way.

Example:

```ts
import { CotomyEntityFillApiForm } from "cotomy";

const form = new CotomyEntityFillApiForm(document.querySelector("form")!);
form.initialize();
form.apiFailed(e => console.error("API failed", e.response.status));
form.submitFailed(e => console.warn("Submit failed", e.response.status));
```

### Entity API forms

`CotomyEntityApiForm` targets REST endpoints that identify records with a single surrogate key.  
Attach `data-cotomy-entity-key="<id>"` to the form when editing an existing entity; omit the attribute (or leave it empty) to issue a `POST` to the base `action` URL.  
On `201 Created`, the form reads the `Location` header and stores the generated key back into `data-cotomy-entity-key`, enabling subsequent `PUT` submissions.  
Composite or natural keys are no longer supported—migrate any legacy markup that relied on `data-cotomy-keyindex` or multiple key inputs to the new surrogate-key flow.
When you must integrate with endpoints that still expect natural identifiers, subclass `CotomyEntityApiForm`/`CotomyEntityFillApiForm`, override `canLoad()` to supply your own load condition, and adjust `loadActionUrl()` (plus any submission hooks) to build the appropriate URL fragments.

The core of Cotomy is `CotomyElement`, which is constructed as a wrapper for `Element`.  
By passing HTML and CSS strings to the constructor, it is possible to generate Element designs with a limited scope.

```typescript
    const ce = new CotomyElement({
        html: /* html */`
              <div>
                <p>Text</p>
              </div>
            `,
        css: /* css */`
            [scope] {
              display: block;
            }
            [scope] > p {
              text-align: center;
            }
          `
    });
```

- `"display HTML in character literals with color coding"` → `"syntax highlighting for embedded HTML"`
- `"generate Element designs with a limited scope"` → `"generate scoped DOM elements with associated styles"`

## Development

Cotomy ships with both ESM (`dist/esm`) and CommonJS (`dist/cjs`) builds, plus generated type definitions in `dist/types`.  
For direct `<script>` usage, browser-ready bundles are available at `dist/browser/cotomy.js` and `dist/browser/cotomy.min.js` (also served via the npm `unpkg` entry).
Include the minified build like so:

```html
<script src="https://unpkg.com/cotomy/dist/browser/cotomy.min.js"></script>
<script>
  const el = new Cotomy.CotomyElement("<div>Hello</div>");
  document.body.appendChild(el.element);
</script>
```

Run the build to refresh every target bundle:

```bash
npm install
npm run build
```

The Vitest-based test suite can be executed via:

```bash
npx vitest run
```

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

You can reach out to me at: [yshr1920@gmail.com](mailto:yshr1920@gmail.com)  
GitHub repository: [https://github.com/yshr1920/cotomy](https://github.com/yshr1920/cotomy)
