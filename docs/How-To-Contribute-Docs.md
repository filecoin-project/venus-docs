# How to Contribute Docs

## Installation Dependency 

To run the docs project, you need to install ***node*** and ***yarn***

node:[https://nodejs.org/en/download/]()

yarn:[https://yarn.bootcss.com/docs/install/#mac-stable]()

## pull the project

```shell script
git clone git@github.com:filecoin-project/venus-docs.git
cd venus-docs
yarn install   #安装依赖
```

## Run local

```shell script
yarn docs:dev 
```

The English document changes directly under master, but Chinese under the zh folder, make sure that the folder structure is exactly the same. Changes made on the document are reflected in real time on the Site and do not require the command to be re-run.
Adding documents needs to be modified ***./docs/.vuepress/config.js*** file, and add a new line of directories under sidebarchildren.

## build and deploy

```shell script
yarn docs:links   # verify all links are well-formed
yarn docs:build   # generate html pages
```

the results are written to the ***./docs/.vuepress/dist directory*** after compiled. you can deploy the project document by overwriting gh-page branch withe ***dist*** directory.
