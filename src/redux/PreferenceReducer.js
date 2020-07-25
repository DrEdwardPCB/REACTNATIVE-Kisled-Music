const initialState={
    theme:'light',
}
const PreferenceReducer = (state=initialState, action)=>{
    console.log(action)
    switch (action.type){
        case 'SWITCH_THEME':
            if(state.theme=='light'){
                return {...state, theme:'dark'}
            }else{
                return {...state, theme:'light'}
            }
        case 'FORCE_RESET':
            console.log(action)
            return initialState
        default:
            return state
    }
}
export default PreferenceReducer