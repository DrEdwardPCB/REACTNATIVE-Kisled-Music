import React, { useState, useEffect } from "react"
import { Portal } from 'react-native-portalize'
import { Modalize } from 'react-native-modalize'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { MAX_HEIGHT, MAX_WIDTH, SongDirectory } from '../../../utils/Constant'
import { View } from "react-native"
import { Grid, Col, Row, Form, Item, Input, Button, Label, Text, Toast } from 'native-base'
import Icon from '../../../utils/IconManager'
import COLOR, { getStyle } from '../../../utils/StyleSheets/Theme'
import { DownloadFile, ScanDocumentDirectory, backgroundDownload, createTrackObject } from '../../../utils/FileManager'
import PushNotificationIOS from "@react-native-community/push-notification-ios";


const DownloadPreview = React.forwardRef((props, reference) => {
    //props.ref
    //props.
    const theme = props.theme
    const store = useStore()
    const dispatch = useDispatch()
    const allSongsArr = useSelector(state => state.library.all)
    const [title, setTitle] = useState(props.metaData.title == undefined ? 'NONAME' : props.metaData.title)
    const [author, setAuthor] = useState(props.metaData.author == undefined ? 'NONAME' : props.metaData.author)

    const _renderItem = () => {
        return props.metaData.formats.map(item => {
            return (
                <View key={item.url} style={[getStyle(COLOR.GRAY4, true, true, theme), getStyle(COLOR.SHADOW, true, true, theme), { margin: 5, borderRadius: 5, padding: 2, paddingVertical: 10 }]}>
                    <Grid>
                        <Row>
                            <Col size={3}>
                                <Row>
                                    <Col size={1}>
                                        <Text style={[getStyle(COLOR.GRAY, false, true, theme), { textAlign: 'center', fontSize: 14 }]}>audio quality:</Text>
                                    </Col>
                                    <Col size={1.5}>
                                        <Text style={[getStyle(COLOR.GRAY2, false, true, theme), { textAlign: 'center' }]}>{item.audioQuality}</Text>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col size={1}>
                                        <Text style={[getStyle(COLOR.GRAY, false, true, theme), { textAlign: 'center', fontSize: 14 }]}>bitrate:</Text>
                                    </Col>
                                    <Col size={1.5}>
                                        <Text style={[getStyle(COLOR.GRAY2, false, true, theme), { textAlign: 'center' }]}>{(item.bitrate > 1024 ? (item.bitrate / 1024).toFixed(0) : item.bitrate.toFixed(0)) + 'kb/s'}</Text>
                                    </Col>
                                </Row>

                            </Col>
                            <Col size={1.5}>
                                <Button rounded
                                    onPress={() => {
                                        console.log(item.url)

                                        DownloadFile(item.url, SongDirectory + title + '.mp3',
                                            (obj) => {
                                                console.log('start')
                                                dispatch({ type: 'ADD_DOWNLOAD', title: title, jobid: obj.jobId, progress: 0 })
                                                Toast.show({
                                                    text: 'Download Start',
                                                    buttonText: 'Okay',
                                                    duration: 3000,
                                                    position: "top",
                                                    type:"success"
                                                })
                                            },//begin
                                            (obj) => {
                                                console.log('progress')
                                                dispatch({ type: 'UPDATE_PROGRESS', jobid: obj.jobId, progress: obj.bytesWritten / obj.contentLength })
                                            },//progress
                                            async (obj) => {
                                                console.log('done')
                                                const track = await createTrackObject(SongDirectory + title + '.mp3', title, author)
                                                dispatch({ type: 'ADD_SONG', track: track })
                                                dispatch({ type: 'REMOVE_DOWNLOAD', jobid: obj.jobId })
                                                PushNotificationIOS.presentLocalNotification({ alertBody: title + ' download completed', alertTitle: 'Done' });


                                            },//success
                                            (err) => {
                                                console.log('err')
                                                PushNotificationIOS.presentLocalNotification({ alertBody: title + ' download Failed', alertTitle: 'Fail' }); console.warn(err)
                                            },//fail
                                        )
                                        reference.current.close()


                                    }}
                                    style={{ justifyContent: 'center' }}
                                >
                                    <Text>Download</Text>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </View>
            )
        })
    }
    console.log(props.metaData)
    useEffect(() => {
        console.log('opening')
        console.log(props.metaData)
        setTitle(props.metaData.title == undefined ? 'NONAME' : props.metaData.title)
        setAuthor(props.metaData.author == undefined ? 'NONAME' : props.metaData.author)
    }, [props])
    return (
        <Portal>
            <Modalize
                key={props.key}
                ref={reference}
                modalHeight={MAX_HEIGHT * 0.8}
                modalStyle={getStyle(COLOR.GRAY6, true, true, theme)}
                onOpen={() => {

                }}
            >
                <View key='DownloadPreviewHeader' style={[getStyle(COLOR.GRAY4, true, true, theme), getStyle(COLOR.SHADOW, true, true, theme), { margin: 5, borderRadius: 5 }]}>
                    <Form>
                        <Item>
                            <Label style={getStyle(COLOR.GRAY, false, true, theme)}>Title: </Label>
                            <Input key='DownloadPreviewHeaderI1' style={[getStyle(COLOR.ITEM, false, true, theme)]} value={title} onChangeText={val => setTitle(val)} />
                        </Item>
                        <Item>
                            <Label style={getStyle(COLOR.GRAY, false, true, theme)}>Author: </Label>
                            <Input key='DownloadPreviewHeaderI2' style={[getStyle(COLOR.ITEM, false, true, theme)]} value={author} onChangeText={val => setAuthor(val)} />
                        </Item>
                    </Form>
                </View>
                {_renderItem()}
            </Modalize>
        </Portal>
    )
})
export default DownloadPreview

