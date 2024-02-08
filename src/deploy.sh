#!/bin/bash

STAGE="$1"

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR


function die {
    echo $*
    exit 1
}

if [ -z "${STAGE}" ] ; then
    die stage is missing
fi

if [ ${STAGE} == test ] ; then
    DEST=static-website-deploy@10.208.2.27:/opt/apps/static_website/backoffice-operativo.test.geniodiligence.it/readoc-swagger

elif [ ${STAGE} == prod ] ; then
    DEST=static-website-deploy@10.208.2.27:/opt/apps/static_website/backoffice-operativo.geniodiligence.it/readoc-swagger

else
    die unknown stage ${STAGE}

fi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

nvm use v18

npm_version=$(npm -v)
# Get the first 2 numbers of the npm version
first_two_numbers=$(echo "$npm_version" | cut -d. -f1,2)

desired_version="8.19"

if [[ "$first_two_numbers" != "$desired_version" ]]; then
    die "npm 8.19 is required"
fi

npm i || die "npm i failed"
npm run build:${STAGE} || die "build failed"

rsync -avz --delete dist/ ${DEST} || die "rsync failed"

if [ -z "$(git status --porcelain)" ] ; then

    git tag -a -m "deploy on ${STAGE} made by $(git config user.name)/$(git config user.email)" deploy-${STAGE}-$(date +%Y-%m-%d-%H-%M)
    git push origin $(git tag)

else

    die "deploy complete. Cannot tag thought, due to uncommitted changes"

fi
