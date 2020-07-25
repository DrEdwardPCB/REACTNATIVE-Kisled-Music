import React, { useState, useEffect } from "react"
import { Portal } from 'react-native-portalize'
import { Modalize } from 'react-native-modalize'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { MAX_HEIGHT, MAX_WIDTH, SongDirectory } from '../../../utils/Constant'
import { View, Animated } from "react-native"
import { Grid, Col, Row, Form, Item, Input, Button, Label, Text } from 'native-base'
import Icon from '../../../utils/IconManager'
import COLOR, { getStyle } from '../../../utils/StyleSheets/Theme'
import { DownloadFile, ScanDocumentDirectory } from '../../../utils/FileManager'
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import SongList from "./SongList"


const SongListModal = React.forwardRef((props, reference) => {
    //props.ref
    //props.
    const theme = props.theme
    return (
        <Portal>
            <Modalize
                ref={reference}
                modalHeight={MAX_HEIGHT - 40}
                modalStyle={getStyle(COLOR.GRAY6, true, true, theme)}
                /*scrollViewProps={{
                    scrollEnabled:false
                }}*/
                onClose={()=>{props.setPressedLibrary('')}}
                customRenderer={<Animated.View>
                    <SongList theme={theme} library={props.library} reference={reference} />
                </Animated.View>}
            >

            </Modalize>
        </Portal>
    )
})
export default SongListModal

