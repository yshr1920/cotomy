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
