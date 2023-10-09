

// const SECRET_TOKEN = "y0_AgAAAABa_4Z1AAnp5gAAAADjSp8YrP-NFtCwSWuSQJTzw3YODyN48ZA";


export default class YandexDisk {
    constructor(secretKey) {
        this.secretKey = secretKey;
        console.log(this.secretKey);
        this.url = "https://cloud-api.yandex.net/v1/disk/resources";
    }

    updateSecretKey(newSecretKey) {
        this.secretKey = newSecretKey;
    }

    async uploadFile(dirPath, fileName, file) {
        let href = null;
        let res = await this.createDir(dirPath.split("/"));
        if (res) {
            href = await this.getUploadURL(dirPath, fileName, file);
        }
        if (href) {
            res = await this.putFile(href, file);
        }
        let urlMetaInfoFile = null;
        if (res && href) {
            urlMetaInfoFile = await this.publishFile(`${dirPath}/${fileName}`);
        }
        if (res && href && urlMetaInfoFile) {
            let publishUrl = await this.getPublishLinkFile(this.replaceHttpWithHttps(urlMetaInfoFile));
            return publishUrl;
        }
    }

    // https://cloud-api.yandex.net/v1/disk/resources
    // ? path=<путь к удаляемому ресурсу>
    // & [permanently=<признак безвозвратного удаления>]
    // & [fields=<свойства, которые нужно включить в ответ>]
    async removeFile(dirPath, fileName) {
        const fileNameEncode = encodeURIComponent(fileName);
        const response = await fetch(`${this.url}?path=app:/${dirPath}/${fileNameEncode}&permanently=false`, {
            method: 'DELETE',
            headers: {
                Authorization: `OAuth ${this.secretKey}`,
            },
        });
        if (response.ok) {
            return response;
        } else {
            let result = await response.json();
            console.error("Ошибка удаления файла на YandexDisk: ", result);
        }
    }

    async removeDir(dirPath) {
        const response = await fetch(`${this.url}?path=app:/${dirPath}&permanently=false`, {
            method: 'DELETE',
            headers: {
                Authorization: `OAuth ${this.secretKey}`,
            },
        });
        if (response.ok) {
            return response;
        } else {
            let result = await response.json();
            console.error("Ошибка удаоения файла на YandexDisk: ", result);
        }
    }

    async getUploadURL(dirPath, fileName, file) {
        const fileNameEncode = encodeURIComponent(fileName);
        const response = await fetch(`${this.url}/upload?path=app:/${dirPath}/${fileNameEncode}&overwrite=true`, {
            method: 'GET',
            headers: {
                Authorization: `OAuth ${this.secretKey}`,
            },
        });
        if (response.ok) {
            let { href } = await response.json();
            return href;
        } else {
            let result = await response.json();
            console.error("Ошибка получения ссылки для загрузки файла на YandexDisk: ", result);
        }
    }

    async putFile(href, file) {
        const response = await fetch(href, {
            method: 'PUT',
            body: file,
        });
        if (!response.ok) {
            console.error('Ошибка загрузки файла на YandexDisk');
        }

        return response.ok;
    }

    async createDir(dirPath) {
        let dirResult = "";
        for (let dir of dirPath) {
            dirResult += dir;
            console.log("dirResult = ", dirResult);
            const response = await fetch(`${this.url}?path=app:/${dirResult}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `OAuth ${this.secretKey}`,
                    'Content-Type': 'application/json'
                }
            });
    
            let result = await response.json();
            if (response.ok || ("error" in result && result.error === "DiskPathPointsToExistentDirectoryError")) {
                dirResult += "/";
                continue;
                // 
            }
    
            console.log(`Ошибка создания директории ${dirPath} в YandexDisk: `, result);
            return false;    
        }
        return true;
    }

    async publishFile(pathFile) {
        const response = await fetch(`${this.url}/publish?path=app:/${pathFile}`, {
            method: 'PUT',
            headers: {
                'Authorization': `OAuth ${this.secretKey}`,
                'Content-Type': 'application/json'
            }
        });

        let result = await response.json();
        if (response.ok) {
            return result.href;
        }

        console.log(`Ошибка публикации файла ${pathFile} в YandexDisk: `, result);

        return false;
    }

    async getPublishLinkFile(url) {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `OAuth ${this.secretKey}`,
                'Content-Type': 'application/json'
            }
        });

        let result = await response.json();
        if (response.ok) {
            return result.public_url;
        }

        console.log(`Ошибка получения публичной ссылки на файл в YandexDisk: `, result);

        return false;
    }

    replaceHttpWithHttps(url) {
        if (url.startsWith("http://")) {
          return url.replace(/^http:\/\//, "https://");
        }
        return url;
      }

}
