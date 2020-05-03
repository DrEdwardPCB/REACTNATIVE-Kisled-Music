import ytdl from "react-native-ytdl";
//import FileManager from './fileManager';

export default class YoutubeDownload {
    static instance = null
    static getInstance() {
        if (YoutubeDownload.instance == null || YoutubeDownload.instance == undefined) {
            YoutubeDownload.instance = new YoutubeDownload()
        }
        return YoutubeDownload.instance
    }
    constructor(){
        console.log('constructing')
    }
    getVideoID = (url) => {
        return ytdl.getURLVideoID(url)
    }
    getVideoBasicInfo = (url, options, callback) => {
        ytdl.getBasicInfo(url, options, callback)
    }
    getVideoInfo = async (url, options, callback) => {
        ytdl.getInfo(url, options, (err, info) => {
            if (err) {
                alert("an error has occurred")
            } else {
                this.filterFormats(info, callback)
            }
        })
    }
    filterFormats = (info, callback) => {
        var audioFormats = ytdl.filterFormats(info.formats, 'audioonly')
        audioFormats = audioFormats.filter((element) => { return element.container === "mp4" })
        console.log(Object.keys(audioFormats[0]))
        callback(audioFormats)

    }

}