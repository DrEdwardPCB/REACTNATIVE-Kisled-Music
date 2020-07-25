import React, { useState, useEffect } from "react"
import { Portal } from 'react-native-portalize'
import { Modalize } from 'react-native-modalize'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { MAX_HEIGHT, MAX_WIDTH, SongDirectory } from '../../../utils/Constant'
import { View } from "react-native"
import { Grid, Col, Row, Form, Item, Input, Button, Label, Text } from 'native-base'
import Icon from '../../../utils/IconManager'
import COLOR, { getStyle } from '../../../utils/StyleSheets/Theme'
//import { DownloadFile, ScanDocumentDirectory } from '../../../utils/FileManager'
//import PushNotificationIOS from "@react-native-community/push-notification-ios";

const AddingLibraryView = React.forwardRef((props, reference) => {
    //props.ref
    //props.
    const theme = props.theme
    const store = useStore()
    const dispatch = useDispatch()
    const allSongsArr = useSelector(state => state.library)
    const [libraryName, setLibraryName] = useState()
    useEffect(()=>{
        setLibraryName('Library-' + Object.keys(allSongsArr).length)
    },[allSongsArr,store])
    console.log(store)
    return (
        <Portal>
            <Modalize
                ref={reference}
                modalHeight={MAX_HEIGHT * 0.8}
                snapPoint={MAX_HEIGHT * 0.3}
                modalStyle={getStyle(COLOR.GRAY6, true, true, theme)}
            >
                <View style={[getStyle(COLOR.GRAY4, true, true, theme), getStyle(COLOR.SHADOW, true, true, theme), { margin: 5, borderRadius: 5 }]}>
                    <Form>
                        <Item>
                            <Label style={getStyle(COLOR.GRAY, false, true, theme)}>Library Name</Label>
                            <Input 
                            style={getStyle(COLOR.ITEM, false, true, theme)}
                            onChangeText={(val) => { setLibraryName(val) }} 
                            value={libraryName}
                            onFocus={()=>{reference.current.open('top')}}
                            onBlur={()=>{reference.current.open('snapPoint')}}
                            ></Input>
                        </Item>
                    </Form>
                    <Button onPress={()=>{
                        //dispatch({type:'CREATE_LIBRARY', library:'libraryName'})
                        reference.current.close()
                        dispatch({type:'CREATE_LIBRARY', library:libraryName})
                        
                    }}>
                        <Text> Confirm</Text>
                    </Button>
                </View>
            </Modalize>
        </Portal>
    )
})
export default AddingLibraryView

