import {Dimensions} from 'react-native'
const RNFS = require('react-native-fs')

export const MAX_HEIGHT = Dimensions.get('window').height
export const MAX_WIDTH = Dimensions.get('window').width
export const YoutubeVideoLink = "https://m.youtube.com/watch"
export const isPro = true //if false, cannot load from youtube + have ads
export const SongDirectory = RNFS.DocumentDirectoryPath+'/songs/'