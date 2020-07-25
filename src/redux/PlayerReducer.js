const initialState={
    volume:1,
    rate:1,
    shuffle:false,
    loop:'no',
    library:'all',
    currentSong: '0'
}
const PlayerReducer=(state=initialState, action)=>{
    switch (action.type){
        case 'SET_VOLUME'://action.volume
            return {...state, volume:action.volume}
        case 'SET_RATE'://action.rate
            return {...state, rate:action.rate}
        case 'TOGGLE_SHUFFLE':
            if (state.loop=='no' && !state.shuffle){
                return {...state, loop:'yes', shuffle: true}
            }else{
                return {...state, shuffle: !state.shuffle}
            }
        case 'CHANGE_LIBRARY'://action.library
            return {...state, library:action.library}
        case 'CHANGE_SONG':
            console.log('changing song')
            return {...state, currentSong:action.song}
        case 'SWITCH_LOOP':
            if(state.loop=='no'){
                return {...state, loop:'yes'}
            }else if(state.loop=='yes'){
                return{...state, loop:'single'}
            }else if(state.loop=='single' && state.shuffle){
                return {...state, loop:'yes'}
            }else{
                return {...state, loop:'no'}
            }
        case 'FORCE_RESET':
            return initialState
        default:
            return state
    }
}
export default PlayerReducer