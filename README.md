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

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

You can reach out to me at: [yshr1920@gmail.com](mailto:yshr1920@gmail.com)  
GitHub repository: [https://github.com/yshr1920/cotomy](https://github.com/yshr1920/cotomy)
