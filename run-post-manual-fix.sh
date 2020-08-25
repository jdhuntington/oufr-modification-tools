#!/bin/bash

set -uex

pushd ~/projects/office-ui-fabric-react/packages/office-ui-fabric-react/

pushd ./src/packages

for x in *; do
    pushd ${x};
    # node ~/projects/oufr-modification-tools/migration/dist/index.js update-example-requires
    echo "Running this again? Uncomment the previous line."
    node ~/projects/oufr-modification-tools/migration/dist/index.js update-codepen-requires
    popd
done

popd

./../../scripts/node_modules/.bin/prettier --config ./prettier.config.js --write './src/packages/**/*.ts?(x)'
