//const jsmediatags = require('jsmediatags');
const RNFS = require('react-native-fs');
import WebView from 'react-native-webview'
import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react'
import { View, Animated, Dimensions, Image } from 'react-native'
import { Spinner, Thumbnail, Toast } from 'native-base'
import COLOR, { getStyle } from '../../../utils/StyleSheets/Theme'
import { Grid, Text, Input, Row, Col, Form, Label, Button, Item, } from 'native-base'
import Icon from '../../../utils/IconManager'
import { Divider } from 'react-native-paper'
import { YoutubeVideoLink, isPro, MAX_WIDTH } from '../../../utils/Constant'
import ytdl from 'react-native-ytdl'
import { DownloadFile } from '../../../utils/FileManager'
import UUIDGenerator from 'react-native-uuid-generator';
import { LogLevel, RNFFprobe } from 'react-native-ffmpeg';
import { useStateCallbackWrapper } from '../../../utils/util'
//import * as mm from 'music-metadata-browser';

//if https://m.youtube.com/watch
//download as youtube downloader
//else use download as mp3
const localInitialState = { state: 'NODATA' }
const localReducer = (state, action) => {
    console.log(action)
    switch (action.type) {
        case "REMOVE":
            return { state: 'NODATA' }
        case "FAIL":
            return { state: 'FAILED' }
        case "SUCCESS":
            return { state: 'SUCCESSED' }
        case "FORBID":
            return { state: 'FORBIDDEN' }
        case "LOAD":
            return { state: 'LOADING' }
        default:
            return state
    }
}

const RetrieveMetaData = (props) => {
    const theme = props.theme
    const [state, setState] = useReducer(localReducer, localInitialState)
    const [metaInfo, setMetaInfo] = useStateCallbackWrapper({}, () => {
        setState({ type: 'SUCCESS' })
    });
    const [isYoutube, setIsYouTube] = useState(false)
    useEffect(() => { setState({ type: 'REMOVE' }) }, [])//this is to 
    const _onClickReceiveMeta = () => {
        setState({ type: 'LOAD' })
        if (props.url.startsWith(YoutubeVideoLink)) {// check whether it is a youtube video
            setIsYouTube(true)
            if (!isPro) {// if it is youtube video check whether use is allowed
                setState({ type: 'FORBID' })
            } else {//user is allowed, now process meta data with ytdl
                if (ytdl.validateURL(props.url)) {
                    ytdl.getInfo(props.url).then((info) => {

                        setMetaInfo(info)
                    })
                        .catch(error => {
                            //setMetaInfo(error)
                            setState({ type: 'FAIL' })
                        })
                } else {
                    setState({ type: 'FAIL' })
                }
            }
        } else {
            setIsYouTube(false)
            console.log('not youtube')

            new Promise(async (resolve, reject) => {
                const uuid = await UUIDGenerator.getRandomUUID();
                DownloadFile(props.url, RNFS.DocumentDirectoryPath + '/temp/' + uuid + '.mp3',
                    () => { },//begin callback,
                    () => { },//progress callback,
                    (obj) => {
                        RNFFprobe.getMediaInformation(RNFS.DocumentDirectoryPath + '/temp/' + uuid + '.mp3').then((result) => {
                            console.log(JSON.stringify(result))
                            resolve(result)
                        }).catch((err) => {
                            console.log('fail in FFProbe')
                            reject(err)
                        })
                    },//success callback
                    (err) => { reject(err) },//fail callback
                )

            })
                .then(tagInfo => {
                    // handle the onSuccess return
                    //console.log(tagInfo)
                    if (tagInfo.duration != undefined) {
                        //setState({ type: 'SUCCESS' })
                        tagInfo.url = props.url
                        setMetaInfo(tagInfo)
                    } else {
                        setState({ type: 'FAIL' })
                        //setMetaInfo(tagInfo)
                    }
                })
                .catch(error => {
                    // handle errors
                    setState({ type: 'FAIL' })
                    //setMetaInfo(error)
                    console.log(error)
                })
                .finally(() => {
                    RNFS.unlink(RNFS.DocumentDirectoryPath + '/temp/').then(() => {
                        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/temp/')
                    })
                })

        }

    }
    const ms2hms = (ms) => {
        const s = parseInt((parseInt(ms) / 1000).toFixed(0)) % 60
        const m = parseInt((parseInt(ms) / 1000 / 60).toFixed(0)) % 60
        const h = parseInt((parseInt(ms) / 1000 / 60 / 60).toFixed(0))
        return (h > 9 ? h : ('0' + h)) + ":" + (m > 9 ? m : ('0' + m)) + ":" + (s > 9 ? s : ('0' + s))
    }
    const s2hms = (ms) => {

        const s = parseInt((parseInt(ms)).toFixed(0)) % 60
        const m = parseInt((parseInt(ms) / 60).toFixed(0)) % 60
        const h = parseInt((parseInt(ms) / 60 / 60).toFixed(0))
        const preOutput = (h > 9 ? h : ('0' + h)) + ":" + (m > 9 ? m : ('0' + m)) + ":" + (s > 9 ? s : ('0' + s))
        //console.log(preOutput)
        //console.log(typeof preOutput)
        return preOutput
    }
    const showMiddle = () => {

        if (state.state == 'FORBIDDEN') {
            return (
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', padding: 10, position: 'relative' }}>
                    <Button transparent style={{ position: 'absolute', right: 0, top: 0 }} onPress={() => { setState({ type: 'REMOVE' }) }}><Text><Icon type="Entypo" name='cross' size={24} color={getStyle(COLOR.GRAY, false, true, theme).color} /></Text></Button>
                    <Text style={[getStyle(COLOR.GRAY, false, true, theme), { textAlign: 'center' }]}>You are DIRECTLY downloading Music from Youtube via this app, this is forbidden</Text>
                    <Text style={[getStyle(COLOR.GRAY3, false, true, theme), { textAlign: 'center', marginTop: 15 }]}>If you own the music, you may load it via files app</Text>
                    <Button rounded style={[{ height: 40, width: 150, marginTop: 25 }]} onPress={() => { Linking.openURL('shareddocuments://' + RNFS.DocumentDirectoryPath + '/songs') }}>
                        <Text>Open Files app</Text>
                    </Button>
                </View>
            )
        }
        if (state.state == 'FAILED') {
            return (
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', padding: 10, position: 'relative' }}>
                    <Button transparent style={{ position: 'absolute', right: 0, top: 0 }} onPress={() => { setState({ type: 'REMOVE' }) }} ><Text><Icon type="Entypo" name='cross' size={24} color={getStyle(COLOR.GRAY, false, true, theme).color} /></Text></Button>
                    <Text style={[getStyle(COLOR.GRAY, false, true, theme), { textAlign: 'center' }]}>This link does not contains acceptable media file</Text>
                    <Text style={[getStyle(COLOR.GRAY3, false, true, theme), { textAlign: 'center', marginTop: 15 }]}>Please try another link</Text>
                </View>
            )
        }
        if (state.state == 'LOADING') {
            return (
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', padding: 10, position: 'relative' }}>
                    <Spinner color='gray' />
                    <Text style={[getStyle(COLOR.GRAY3, false, true, theme), { textAlign: 'center', marginTop: 15 }]}>Fetching data from the Internet</Text>
                </View>
            )
        }
        if (state.state == 'SUCCESSED') {
            try {
                if (isYoutube) {
                    return (
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', padding: 10, position: 'relative' }}>
                            <Button transparent style={{ position: 'absolute', right: 0, top: 0 }} onPress={() => { setState({ type: 'REMOVE' }) }} ><Text><Icon type="Entypo" name='cross' size={24} color={getStyle(COLOR.GRAY, false, true, theme).color} /></Text></Button>
                            <Text style={[getStyle(COLOR.GRAY, false, true, theme), { textAlign: 'center' }]}>Youtube Media</Text>

                            <Grid style={{ width: '100%' }}>
                                <Row size={1}></Row>
                                <Row size={2}>
                                    <Col size={1}>
                                        <View style={{ position: 'relative', height: 100, width: '100%' }}>
                                            <Image
                                                onLayout={e => console.log(e.nativeEvent)}
                                                style={{ width: '100%', height: '100%' }}
                                                source={{
                                                    uri: metaInfo.player_response.videoDetails.thumbnail.thumbnails.filter(e => e.height == 110).map(e => e.url)[0]
                                                }}
                                                resizeMode="cover"
                                            />
                                            <View style={{ position: 'absolute', padding: 1, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,.6)' }}>
                                                <Text style={{ color: 'white' }}>{s2hms(metaInfo.videoDetails.lengthSeconds)}</Text>
                                            </View>
                                        </View>
                                    </Col>
                                    <Col size={2} style={{ padding: 5 }} >
                                        <Row>
                                            <Col>
                                                <Text style={[getStyle(COLOR.GRAY, false, true, theme), { textAlign: 'center' }]}>{metaInfo.player_response.videoDetails.title}</Text>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Text style={[getStyle(COLOR.GRAY2, false, true, theme), { textAlign: 'center', marginTop: 15 }]}>{metaInfo.player_response.videoDetails.author}</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row size={1}>

                                    <Col size={1}>
                                        <Button onPress={() => {
                                            try {
                                                props.passMetaData({
                                                    isYoutube: false,
                                                    formats: metaInfo.formats.filter(e => e.mimeType.startsWith('audio/mp4') && e.url),
                                                    title: metaInfo.player_response.videoDetails.title,
                                                    author: metaInfo.player_response.videoDetails.author
                                                })
                                            } catch (err) {
                                                console.warn(err)
                                                Toast.show({
                                                    text: 'Cannot retrieve any download for this song',
                                                    buttonText: 'Okay',
                                                    duration: 3000,
                                                    position: "top",
                                                    type: 'danger'
                                                })
                                            }
                                        }}>
                                            <Text>Choose Download Format</Text>
                                        </Button>
                                    </Col>
                                </Row>
                            </Grid>
                        </View>
                    )
                } else {
                    return (
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', padding: 10, position: 'relative' }}>
                            <Button transparent style={{ position: 'absolute', right: 0, top: 0 }} onPress={() => { setState({ type: 'REMOVE' }) }} ><Text><Icon type="Entypo" name='cross' size={24} color={getStyle(COLOR.GRAY, false, true, theme).color} /></Text></Button>
                            <Text style={[getStyle(COLOR.GRAY, false, true, theme), { textAlign: 'center' }]}>Internet Media</Text>
                            <Grid style={{ width: '100%' }}>
                                <Row size={1}></Row>
                                <Row size={2}>
                                    <Col size={1}>
                                        <View style={{ position: 'relative', height: 100, width: '100%' }}>
                                            <Image
                                                onLayout={e => console.log(e.nativeEvent)}
                                                style={{ width: '100%', height: '100%' }}
                                                source={require('../../../../assets/AppIcon.png')}
                                                resizeMode="cover"
                                            />
                                            <View style={{ position: 'absolute', padding: 1, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,.6)' }}>
                                                <Text style={{ color: 'white' }}>{ms2hms(metaInfo.duration)}</Text>
                                            </View>
                                        </View>
                                    </Col>
                                    <Col size={2} style={{ padding: 5 }} >
                                        <Row>
                                            <Col>
                                                <Text style={[getStyle(COLOR.GRAY, false, true, theme), { textAlign: 'center' }]}>bitrate:</Text>
                                            </Col>
                                            <Col>
                                                <Text style={[getStyle(COLOR.GRAY2, false, true, theme), { textAlign: 'center' }]}>{metaInfo.bitrate + 'kb/s'}</Text>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Text style={[getStyle(COLOR.GRAY, false, true, theme), { textAlign: 'center' }]}>channel layout:</Text>
                                            </Col>
                                            <Col>
                                                <Text style={[getStyle(COLOR.GRAY2, false, true, theme), { textAlign: 'center' }]}>{metaInfo.streams.filter(e => e.type == 'audio')[0].channelLayout}</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row size={1}>
                                    <Col size={1}>
                                        <Button onPress={() => {
                                            console.log('passing data')
                                            props.passMetaData({
                                                isYoutube: false,
                                                formats: [{
                                                    audioChannels: metaInfo.streams.filter(e => e.type == 'audio')[0].channelLayout,
                                                    audioQuality: "N/A",
                                                    //audioSampleRate: "44100",
                                                    //averageBitrate: 968353,
                                                    bitrate: metaInfo.bitrate,
                                                    url: metaInfo.url
                                                }],
                                            })
                                        }}>
                                            <Text>Proceed to download</Text>
                                        </Button>
                                    </Col>
                                </Row>
                            </Grid>
                        </View>
                    )
                }
            } catch (error) {
                console.warn(error)
                return (
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', padding: 10, position: 'relative' }}>
                        <Spinner color='gray' />
                        <Text style={[getStyle(COLOR.GRAY3, false, true, theme), { textAlign: 'center', marginTop: 15 }]}>Fetching data from the Internet</Text>
                    </View>
                )
                //console.warn(metaInfo)
            }
        }
        return (
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', padding: 10 }}>
                <Text style={[getStyle(COLOR.GRAY, false, true, theme), { textAlign: 'center' }]}>NO DATA</Text>
                <Text style={[getStyle(COLOR.GRAY3, false, true, theme), { textAlign: 'center', marginTop: 15 }]}>Press retrieve metadata to see if this link contains media file</Text>
            </View>
        )
    }
    return (
        <View style={{ position: 'relative', paddingTop: 30, marginTop: 15 }}>
            <Button rounded onPress={() => { _onClickReceiveMeta() }} style={{ position: 'absolute', width: 170, left: 5, height: 50, zIndex: 10 }}>
                <Text>Retrieve MetaData</Text>
            </Button>
            <Divider style={[{ position: 'absolute', width: MAX_WIDTH, top: 25, backgroundColor: getStyle(COLOR.GRAY, false, true, theme).color }]} />
            <View style={[getStyle(COLOR.GRAY6, true, true, theme), getStyle(COLOR.SHADOW, true, true, theme), { margin: 5, marginTop: 40, width: MAX_WIDTH - 10, height: 300, }]}>
                {showMiddle()}
            </View>
        </View>
    )

}
export default RetrieveMetaData