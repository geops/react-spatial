const pjson = require('../package.json');

const { peerDependencies } = pjson;

const packageKeys = Object.keys(peerDependencies);

const arg = process.argv[2];

if (arg === 'add') {
  console.log(`yarn install --force`);
} else if (arg === 'remove') {
  console.log(
    `rm -rf ${packageKeys.map((p) => `node_modules/${p}`).join(' ')}`,
  );
} else {
  console.log('echo "wrong argument."');
}
