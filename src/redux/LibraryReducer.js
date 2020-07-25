const RNFS = require('react-native-fs')
const initialState = {
    all: []
}
const LibraryReducer = (state = initialState, action) => {
    //console.log(action)
    switch (action.type) {
        case 'ADD_SONG'://action.track
            {
                var newState = Object.assign({}, state)
                newState.all.push(action.track)
                return newState
            }
        case 'DELETE_SONG'://action.trackId
            {
                var newState = Object.assign({}, state)
                Object.keys(newState).forEach(e => {
                    newState[e] = newState[e].filter(f => f.id != action.trackId)
                })
                return newState
            }
        case 'ADD_SONG_TO_LIBRARY'://action.library + action.trackId
            //console.log('adding song to library')
            //console.log('step1')
            var newState = Object.assign({}, state)
            //console.log('step2')
            var track = newState.all.filter(e => e.id == action.trackId)[0]
            //console.log(track)
            //console.log('step4')
            newState[action.library].push(track)
            //console.log('step3')
            //console.log(newState)
            return newState
        case 'REMOVE_SONG_FROM_LIBRARY': //action.library + action.trackId
            if (state[action.library] != undefined) {
                const newLibrary = state[action.library].filter((e) => { return e.id !== action.trackId })
                var newState = Object.assign({}, state)
                newState[action.library] = newLibrary
                return newState
            } else {
                return state
            }
        case 'DELETE_LIBRARY'://action.library
            var newState = Object.assign({}, state)
            newState[action.library] = undefined
            delete newState[action.library]
            return newState
        case 'CREATE_LIBRARY'://action.library
            var newState = Object.assign({}, state)
            newState[action.library] = []
            //delete newState[action.library]
            console.log(newState)
            return newState
        case 'EDIT_SONG_INFO'://action.trackId action.newTitle action.newArtist
            var newState = Object.assign({}, state)
            console.log('hd3')
            Object.keys(newState).forEach((e) => {//e is every library
                var newNewState = newState[e].map(f => {//f is every song in library
                    if (f.id == action.trackId) {
                        var newf = Object.assign({}, f)
                        newf.title = action.newTitle
                        newf.artist = action.newArtist
                        return newf
                    } else {
                        return f
                    }
                })
                newState[e] = newNewState
            })
            console.log(newState)
            return newState
        case 'REORDER_LIBRARY'://action.library action.songList
            var newState = Object.assign({}, state)
            newState[action.library] = action.songList
            return newState
        case 'RESET_LIBRARY':
            console.log('resetting')
            return { all: [] }
        case 'FORCE_RESET':
            return initialState
        default:
            return state
    }
}
export default LibraryReducer
