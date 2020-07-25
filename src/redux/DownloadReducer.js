const RNFS = require('react-native-fs')
const initialState = {
    download: {}
}
const DownloadReducer = (state = initialState, action) => {

    switch (action.type) {
        case "ADD_DOWNLOAD"://jobid title progress
            console.log(action)
            var newState = Object.assign({}, state)
            newState.download[action.jobid] = { jobid: action.jobid, title: action.title, progress: action.progress }
            return newState
        case "REMOVE_DOWNLOAD"://jobid
            console.log(action)
            var newState = Object.assign({}, state)
            newState.download[action.jobid] = undefined
            delete newState.download[action.jobid]
            return newState
        case "UPDATE_PROGRESS"://jobid progress
            console.log(action)
            var newState = Object.assign({}, state)
            newState.download[action.jobid].progress = action.progress
            return newState
        case 'FORCE_RESET':
            console.log('from download reducer')
            console.log(action)

            return initialState
        default:
            return state
    }
}
export default DownloadReducer
