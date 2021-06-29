## Contributing

PRs, bug reports, and issue suggestions are welcome! For major changes, please propose in an issue first so benefits and impacts can be discussed.

👉 You can also click on click on `Edit this page` links at the bottom of each page to jump directly to Edit mode.

## Deployment

### Running locally

```
  $ yarn install
  $ yarn docs:dev 
```

### Building

```
  $ yarn docs:links   # verify all links are well-formed
  $ yarn docs:build
```

Then deploy the `docs/.vuepress/dist` directory to the `gh-pages` branch of this repo.

### Deploy script

You can also run the following script to combine building and deployment together. Make sure everything is running okay locally.

```bash
#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

# if you are deploying to a custom domain
echo 'venus.filecoin.io' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:filecoin-project/venus-docs.git master:gh-pages

cd -
```

### Notes:

- When new documentation pages are added `./docs/config.js` will need to be **manually updated** in this repo