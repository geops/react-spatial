const pjson = require('../package.json');

const { peerDependencies } = pjson;

const packageKeys = Object.keys(peerDependencies);

const arg = process.argv[2];

if (arg === 'add') {
  console.log(
    `yarn add ${packageKeys.map(p => `${p}@${peerDependencies[p]}`).join(' ')}`,
  );
} else if (arg === 'remove') {
  console.log(`rm -rf ${packageKeys.map(p => `node_modules/${p}`).join(' ')}`);
} else {
  console.log('echo "wrong argument."');
}
