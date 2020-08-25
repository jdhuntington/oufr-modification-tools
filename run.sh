#!/bin/bash

set -uex

pushd ~/projects/office-ui-fabric-react/packages/office-ui-fabric-react/

pushd ./src/components
node ~/projects/oufr-modification-tools/migration/dist/index.js fix-specific-imports
popd

~/projects/oufr-modification-tools/enforce.rb  ~/projects/oufr-modification-tools/move-map.json

pushd ./src/packages
~/projects/oufr-modification-tools/fix-scss-import.rb
for x in *; do
    pushd ${x};
    node ~/projects/oufr-modification-tools/migration/dist/index.js rehome \
         ~/projects/office-ui-fabric-react/packages/office-ui-fabric-react/src \
         ~/projects/office-ui-fabric-react/packages/office-ui-fabric-react/src/components\
         ./components
    popd
done

popd

./../../scripts/node_modules/.bin/prettier --config ./prettier.config.js --write './src/packages/**/*.ts?(x)'
