const documentation = require('documentation');
const streamArray = require('stream-array');
const vfs = require('vinyl-fs');

const docConfig = require('../doc/doc-config.json');

// Use geOps default template (https://github.com/geops/geops-docjs-template)
documentation
  .build([`./src/layers/**`], { shallow: false })
  .then(out =>
    documentation.formats.html(out, {
      'project-name': docConfig.appName,
      'project-url': docConfig.githubRepo,
      theme: 'node_modules/geops-docjs-template',
    }),
  )
  .then(output => {
    streamArray(output).pipe(vfs.dest(`./docjs`));
  });
