# Documentation in react-spatial

Two documentation tools are combined:
- react-styleguidist (https://github.com/styleguidist/react-styleguidist)
- documentation.js (https://github.com/documentationjs/documentation)

the folder published by netlify is doc/build (netlify.toml).

## Commands

Styleguidist documentation is visible (with hot reload) with the cmd:
'yarn start'

## Configuration

Variables shared among both documentation are written in /doc/doc-config.json

- Styleguidist: 'styleguide.config.js
    one component need to be overwritten:
    - 'StyleGuideRenderer': to customize the style of the page, with our own
        header, ribbon footer, etc.
