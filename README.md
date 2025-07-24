# Cotomy

> このライブラリは ES2020+ を対象としています。
> 古いブラウザ（iOS 13以前やIEなど）で使用する場合は `core-js` 等による Polyfill が必要です。

A lightweight framework for managing form behavior and page controllers in web applications.  
Ideal for SPA (Single Page Application) or traditional web apps with dynamic form operations.

## Installation

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Warning

This project is in its early stages, and the API is still evolving.  
Since the version is below `1.0.0`, breaking changes may occur without prior notice.

## Contact

You can reach out to me at: [yshr1920@gmail.com](mailto:yshr1920@gmail.com)  
GitHub repository: [https://github.com/yshr1920/cotomy](https://github.com/yshr1920/cotomy)
