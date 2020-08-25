#!/bin/bash
set -uex

function change() {
    pushd react-fundamentals

    pushd components
    mv -v ../../${1}/components/* .
    rmdir ../../${1}/components
    popd

    mv -v ../${1}/* .

    popd
}

# change react-cards
# change react-commanding
# change react-contextual
change react-focus
change react-inputs
change react-notifications
change react-primitives
change react-surfaces
