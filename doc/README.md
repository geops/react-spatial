# Documentation in react-spatial

Two documentation tools are combined:
- react-styleguidist (https://github.com/styleguidist/react-styleguidist)
- documentation.js (https://github.com/documentationjs/documentation)

the folder published by netlify is doc/build (netlify.toml).

## Commands

Styleguidist documentation is visible (with hot reload) with the cmd:
'yarn doc:server'

However the combinaison of both is not yet accessible with hot-reload, but only with:
'yarn doc' and open 'index.html' in doc/build folder, with server of your choice.

'scripts/prepare-doc.sh' is the bash file chaining all commands to create
the documentation build of both tools.

## Configuration

Variables shared among both documentation are written in /doc/doc-config.json

- Styleguidist: 'styleguide.config.js
    two components need to be overwritten:
    - 'StyleGuideRenderer': to customize the style of the page, with our own
        header, ribbon footer, etc.
    - 'ComponentsList': to change the href and ensure the page
        doesn't reload on item click.


- Documentation.js:
    scripts/doc.js is the script aimed to configure the documentation.js html building

    Params to pass for html creation:
    - 'project-name': displayed in the header
    - 'project-url': href for the footer's ribbon
    - 'theme': custom style from a npm package
        Use geOps default template (https://github.com/geops/geops-docjs-template)
        Same header and footer than styleguidist


/!\ to change the style consistently it needs to be changed
in both places ('geops-docjs-template' & stylegudist)

