import UUIDGenerator from 'react-native-uuid-generator';
const RNFS = require('react-native-fs');
//import RNBackgroundDownloader from 'react-native-background-downloader';
import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';
/**
 * scanning from DocumentDirectory and add it to redux store
 * @param {array} storeObjAll - the array in redux contains all songs
 * @param {function} dispatch - redux dispatch function
 */
export async function ScanDocumentDirectory(storeObjAll, dispatch) {
  return new Promise(async (resolve, reject) => {
    console.log('scanning')
    var readDirResult = await RNFS.readDir(RNFS.DocumentDirectoryPath + "/songs")
    //console.log(readDirResult)
    var originalPathList = readDirResult.map(e => e.path).filter(e => e.endsWith('mp3'))
    //console.log(originalPathList)
    //console.log(storeObjAll)
    var listFromStore = storeObjAll.map(e => e.originalurl)
    //console.log(listFromStore)
    for (var i = 0; i < originalPathList.length; i++) {
      //console.log('running outer loop')
      var haveMatch = false
      for (var j = 0; j < listFromStore.length; j++) {
        //console.log('running inner loop')
        //console.log(originalPathList[i])
        //console.log(listFromStore[j])
        if (originalPathList[i].split('/').slice(-1)[0] == listFromStore[j].split('/').slice(-1)[0]) {
          haveMatch = true
          break;
        }
      }
      if (!haveMatch) {
        const track = await createTrackObject(originalPathList[i], originalPathList[i].split('/').slice(-1)[0], 'noname')// create track object
        console.log('done creating track')
        //console.log(track)
        dispatch({ type: 'ADD_SONG', track: track })//dispatch to redux store for internal management
      }
    }
    resolve()

  })
}
/**
 * check if the necessary folder exist in document directory and create if it does not
 */
export async function checkFileAndCreate() {
  var songs = new Promise((resolve, reject) => {
    RNFS.exists(RNFS.DocumentDirectoryPath + "/songs").then((exist) => {
      if (!exist) {
        RNFS.mkdir(RNFS.DocumentDirectoryPath + "/songs").then(() => {
          console.log('create songs success')
          resolve()
        })
      } else {
        resolve()
      }
    })
  })
  var internal = new Promise((resolve, reject) => {
    RNFS.exists(RNFS.DocumentDirectoryPath + "/internal").then((exist) => {
      if (!exist) {
        RNFS.mkdir(RNFS.DocumentDirectoryPath + "/internal").then(() => {
          resolve()
        })
      } else {
        resolve()
      }
    })
  })
  var temp = new Promise((resolve, reject) => {
    RNFS.exists(RNFS.DocumentDirectoryPath + "/temp").then((exist) => {
      if (!exist) {
        RNFS.mkdir(RNFS.DocumentDirectoryPath + "/temp").then(() => {
          resolve()
        })
      } else {
        resolve()
      }
    })
  })
  return Promise.all([songs, internal, temp])

}
/**
 * Similar with linux ls, list file in the directory but in RNFS way
 * @param {String} dir - path of the document you want to ls
 */
export function ls(dir = RNFS.DocumentDirectoryPath) {
  RNFS.readDir(dir) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then((result) => {
      console.log('GOT RESULT', result);

      // stat the first file
      return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    })
    .then((statResult) => {
      if (statResult[0].isFile()) {
        // if we have a file, read it
        return RNFS.readFile(statResult[1], 'utf8');
      }

      return 'no file';
    })
    .then((contents) => {
      // log the file contents
      console.log(contents);
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
}

/**
 * generate internal copy of the song and create a track object required by react-native-tracks
 * @param {String} url - original url of the song in songs folder
 * @param {String} title - title of the song
 * @param {String} artist - artist in the song
 */
export const createTrackObject = async (url, title, artist) => {
  const id = await UUIDGenerator.getRandomUUID();

  /*await RNFS.copyFile(url, RNFS.DocumentDirectoryPath + '/internal/' + id + '.mp3')
  const track = {
    id: id,
    url: { uri: "file:///" + RNFS.DocumentDirectoryPath + '/internal/' + id + '.mp3' },
    artist: artist,
    title: title,
    originalurl: url
  }
  return track*/
  //-i input.mp3 -c:a libfdk_aac -vbr 4 -vn output.m4a
  await RNFS.copyFile(url, RNFS.DocumentDirectoryPath + '/temp/' + id + '.mp3')
  await RNFFmpeg.execute('-i ' + RNFS.DocumentDirectoryPath + '/temp/' + id + '.mp3' + ' -c:a aac_at -b:a 192k ' + "file:///" + RNFS.DocumentDirectoryPath + '/internal/' + id + '.m4a')
    .then((result) => {
      console.log("FFmpeg process exited with rc " + result.rc)
      RNFS.unlink(RNFS.DocumentDirectoryPath + '/temp/').then(() => {
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/temp/')
      })
    });

  const track = {
    id: id,
    url: { uri: "file:///" + RNFS.DocumentDirectoryPath + '/internal/' + id + '.m4a' },
    artist: artist,
    title: title,
    originalurl: url
  }
  return track

}

/**
 * Download file to from specific location to specific location, with 4 callbacks, 
 * @param {String} from 
 * @param {String} to 
 * @param {function} beginCallback 
 * @param {function} progressCallBack 
 * @param {function} SuccessCallback 
 * @param {function} FailCallback 
 */
export const DownloadFile = (from, to, beginCallback, progressCallBack, SuccessCallback, FailCallback) => {
  const ret = RNFS.downloadFile({
    fromUrl: from,          // URL to download file from
    toFile: to,           // Local filesystem path to save the file to
    //headers?: Headers;        // An object of headers to be passed to the server
    background: true,     // Continue the download in the background after the app terminates (iOS only)
    discretionary: true,  // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)
    //cacheable?: boolean;      // Whether the download can be stored in the shared NSURLCache (iOS only, defaults to true)
    progressInterval: 300,
    progressDivider: 10,
    begin: (obj) => { beginCallback(obj) },
    progress: (obj) => { progressCallBack(obj) },
    //resumable?: () => void;    // only supported on iOS yet
    //connectionTimeout?: number // only supported on Android yet
    //readTimeout?: number       // supported on Android and iOS
    backgroundTimeout: 60 * 1000 // Maximum time (in milliseconds) to download an entire resource (iOS only, useful for timing out background downloads)
  })
  const jobId = ret.jobId
  ret.promise.then(res => {
    SuccessCallback(res)
    RNFS.completeHandlerIOS(jobId)
  }).catch(err => {
    FailCallback(err)
    RNFS.completeHandlerIOS(jobId)
  });
}
/*
export const backgroundDownload = (from, to, beginCallback, progressCallback, SuccessCallback, FailCallback) => {
  const jobId = to.split('/')[0].replace('.mp3', '')
  let task = RNBackgroundDownloader.download({
    id: jobId,
    url: from,
    destination: to,
  }).begin((expectedBytes) => {
    beginCallback({ jobId: jobId, })
  }).progress((percent, byteWritten, totalbyte) => {
    progressCallback({ jobId: jobId, bytesWritten: byteWritten, contentLength: totalbyte })
  }).done(() => {
    SuccessCallback({ jobId: jobId })
  }).error((error) => {
    FailCallback(error)
  });
}
/**
 *
 * @param {function} beginCallback
 * @param {function} progressCallBack
 * @param {function} SuccessCallback
 * @param {function} FailCallback
 * @param {array} currentList
 * @param {function} notFoundHandler

export const retrieveDownload = async (beginCallback, progressCallBack, SuccessCallback, FailCallback, currentList, notFoundHandler) => {
  let lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
  for (let task of lostTasks) {
    //console.log(`Task ${task.id} was found!`);
    task.progress((percent, byteWritten, totalbyte) => {
      progressCallback({ jobId: jobId, bytesWritten: byteWritten, contentLength: totalbyte })
    }).done(() => {
      SuccessCallback({ jobId: jobId })
    }).error((error) => {
      FailCallback(error)
    });
  }
  notFoundHandler(currentList.map(e=>e.jobid).filter(f=>!lostTasks.map(e=>e.id).includes(f)))
}
*/