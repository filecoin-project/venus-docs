const config = require("../docs/.vuepress/config");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const console = require("console");

const proxy = process.env.http_proxy || process.env.HTTP_PROXY;

function downloadFile(uri, dest) {
    docDir = path.resolve(__dirname, '../');
    const targetPath = path.join(docDir, "docs", dest);
    const file = fs.createWriteStream(targetPath);
    let param = null

    if (proxy != null && proxy != "") {
        proxy_host = proxy ? proxy.split("//")[1].split(":")[0] : null;
        proxy_port = proxy ? proxy.split("//")[1].split(":")[1] : null;
        proxy_scheme = proxy ? proxy.split("//")[0].split(":")[0] : null;
        proxy_scheme = proxy_scheme == "socks5" ? "http" : proxy_scheme;
        param = {
            proxy: {
                host: proxy_host,
                port: parseInt(proxy_port),
                protocol: proxy_scheme != "socks5" ? proxy_scheme : "http"
            }
        };
    }

    rawUri = uri.replace("github.com", "raw.githubusercontent.com");
    rawUri = rawUri.replace("/blob/", "/");

    axios.get(rawUri, param).then(res => {
        if (res.status !== 200) {
            content = `# 文档引用
    请访问这个[链接](${uri})，了解更多相关信息。`
            file.write(content)
            console.log(`download error : ${res.statusCode}(${rawUri})`);
            return;
        }

        file.write(res.data, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('finish write file to ' + targetPath)
            file.close();
        })
    }).catch(err => {
        console.log(err)
    })
}

function preDownload(config) {
    const preDownloadUrls = [];
    const { base, themeConfig } = config;
    locales = Object.keys(themeConfig.locales || {});
    if (locales.length === 0) {
        locales = [''];
    }
    locales.forEach((locale) => {
        const sidebar = themeConfig.locales[locale].sidebar;
        const sidebarKeys = Object.keys(sidebar);
        sidebarKeys.forEach((key) => {
            const sidebarItem = sidebar[key];
            sidebarItem.forEach((item) => {
                if (item.children) {
                    item.children.forEach((child) => {
                        if (child[2]) {
                            preDownloadUrls.push({
                                path: `${key}${child[0]}`,
                                url: child[2]
                            });
                        }
                    });
                }
            });
        });
    });

    preDownloadUrls.forEach((url) => {
        console.debug(`download ${url.url} to ${url.path}`);
        downloadFile(url.url, url.path);
    });

}


preDownload(config);
