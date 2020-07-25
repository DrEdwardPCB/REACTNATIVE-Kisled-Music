import {combineReducers} from 'redux'
import PreferenceReducer from './PreferenceReducer'
import LibraryReducer from './LibraryReducer'
import DownloadReducer from './DownloadReducer'
import PlayerReducer from './PlayerReducer';
const MasterReducer= combineReducers({preference:PreferenceReducer, library:LibraryReducer, download: DownloadReducer, player: PlayerReducer});
export default MasterReducer