var RNFS = require('react-native-fs')

export default class FileManager {
    static instance = null
    static getInstance() {
        if (FileManager.instance == null) {
            FileManager.instance = new FileManager()
        }
        return FileManager.instance
    }
    constructor() {
        this.ready = false
        RNFS.exists(RNFS.DocumentDirectoryPath + '/songs').then((ex) => {
            if (ex) {
                this.ready = true
            } else {
                RNFS.mkdir(RNFS.DocumentDirectoryPath + '/songs', { NSURLIsExcludedFromBackupKey: true }).then(() => {
                    this.ready = true
                })
            }
        })
    }
    isReady = () => {
        return this.ready
    }
    //reset the whole RNFS.DocumentDirectoryPath
    resetAppSongDirectory = (successCallback, errorCallback) => {
        RNFS.unlink(RNFS.DocumentDirectoryPath + '/songs').then(() => {
            RNFS.exists(RNFS.DocumentDirectoryPath + '/songs').then((ex) => {
                if (ex) {
                    this.ready = true
                } else {
                    RNFS.mkdir(RNFS.DocumentDirectoryPath + '/songs', { NSURLIsExcludedFromBackupKey: true }).then(() => {
                        this.ready = true
                    })
                }
                if (successCallback) {
                    successCallback()
                }
            })
        }).catch((err) => {
            RNFS.exists(RNFS.DocumentDirectoryPath + '/songs').then((ex) => {
                if (ex) {
                    this.ready = true
                } else {
                    RNFS.mkdir(RNFS.DocumentDirectoryPath + '/songs', { NSURLIsExcludedFromBackupKey: true }).then(() => {
                        this.ready = true
                    })
                }
                if (successCallback) {
                    successCallback()
                }
            })
        })
    }
    //.mp3 must be included
    deleteFile = (name, successCallback, errorCallback) => {
        RNFS.unlink(RNFS.DocumentDirectoryPath + '/songs/' + name).then(() => {
            if (successCallback) {
                successCallback()
            }
        }).catch((err) => {
            if (errorCallback) {
                errorCallback(err)
            }
        })
    }
    moveFile = (originalAbsPath, newAbsPath) => {
        RNFS.moveFile(originalAbsPath, newAbsPath)
    }
    //just name=name of the song+.mp3, full path will be filled
    downloadFile = (from, name, resultCallback, beginCallback, progressCallback, errorCallback) => {
        const { jobId, promise } = RNFS.downloadFile({
            fromUrl: from,
            toFile: encodeURI(RNFS.DocumentDirectoryPath + '/songs/' + name),
            progressInterval: 300,
            progressDivider: 10,
            begin: (DownloadBeginCallbackResult) => { if (beginCallback) { beginCallback(DownloadBeginCallbackResult) } },
            progress: (DownloadProgressCallbackResult) => { if (progressCallback) { progressCallback(DownloadProgressCallbackResult) } },
        })
        Promise.all([promise]).then((stuff) => {
            console.log(stuff)
            resultCallback(stuff)
        }).catch((err) => {
            errorCallback(err)
        }
        )
    }
}

