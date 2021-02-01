# 如何运行文档项目

## 依赖

运行docs项目需要安装 ***node*** 和 ***yarn***

安装node:[https://nodejs.org/en/download/]()

安装yarn:[https://yarn.bootcss.com/docs/install/#mac-stable]()

## 拉取项目

```sh
    git clone git@github.com:filecoin-project/venus-docs.git
    cd venus-docs
    yarn install   #安装依赖
```

## 本地运行

运行命令：
```sh
    yarn docs:dev 
```

英文文档直接在master下更改，中文在zh文件夹下面更改，请确保文件夹结构完全相同。在文档上做的修改能够实时的反映在网站上，不需要重新运行命令。
增加文档需要修改 ***./docs/.vuepress/config.js*** 文件，并在sidebar下的children增加一行新的记录。

## 编译与部署

```sh
    yarn docs:links   # verify all links are well-formed
    yarn docs:build   # generate html pages
```
build完成后结果输入到 ***./docs/.vuepress/dist*** 目录里面，将本目录覆盖 ***gh-page*** 分支即可部署项目文档。
