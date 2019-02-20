# Themes

We are NOT a CSS library so we provide some default CSS helpers to help you start but feel free to use your own technology bootstrap or JSS or styled-compoennts.

## How to use

We provide a set of CSS variables and classes to help you start using `react-spatial` .
To use it just import the `index.scss` file of the `default` theme in your application:

```js
import  'react-spatial/themes/default/index.scss`;
```

If you want to override variables just import the `default/variables.css` and the default CSS files you want, there is one CSS file by component.

## Create a new theme

Just add a folder with an `index.scss` file.

Some rules must be followed:

- no positionning css for container.
- no size information without using CSS variable.
- use `display: flex` for container when possible.

Of course the is rules must be adapted depending on the component.
