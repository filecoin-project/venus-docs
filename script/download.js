const config = require("../docs/.vuepress/config");
const https = require('https');
const fs = require('fs');
const path = require('path');


function downloadFile(rawUri, dest) {
    docDir = path.resolve(__dirname, '../');
    targetPath = path.join(docDir, "docs", dest);
    const file = fs.createWriteStream(targetPath);

    rawUri = rawUri.replace("github.com", "raw.githubusercontent.com");
    rawUri = rawUri.replace("/blob/", "/");

    https.get(rawUri, (res) => {
        if (res.statusCode !== 200) {
            content = `# 文档引用
请访问这个[链接](${uri})，了解更多相关信息。`
            file.write(content)
            console.log(`download error : ${res.statusCode}(${rawUri})`);
            return;
        }

        res.on('end', () => {
            console.log('download end ' + rawUri);
        });

        file.on('finish', () => {
            console.log('finish write file to ' + targetPath)
            file.close();
        }).on('error', (err) => {
            fs.unlink(dest);
            reject(err.message);
        })

        res.pipe(file);
    });
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
        downloadFile(url.url, url.path);
    });

}


preDownload(config);
