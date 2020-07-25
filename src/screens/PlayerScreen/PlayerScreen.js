import { Container, Header, Content, Title, Text, Card, CardItem, Grid, Col, Row, Left, Right, Body, Button } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import React, { useEffect, useState, useReducer, useRef } from 'react'
import TrackPlayer, { useTrackPlayerProgress } from 'react-native-track-player';
import { View, TouchableOpacity, FlatList } from 'react-native'
import Carousel from 'react-native-snap-carousel';
import Slider from '@react-native-community/slider';
import { EventRegister } from 'react-native-event-listeners'
import { MAX_HEIGHT, MAX_WIDTH, isPro } from '../../utils/Constant'
import COLOR, { getStyle } from '../../utils/StyleSheets/Theme'
import Icon from '../../utils/IconManager'
import { Divider, Menu } from 'react-native-paper'
import TextTicker from 'react-native-text-ticker';
import { useStateCallback } from '../../utils/util'
import * as Progress from 'react-native-progress'
import AsyncStorage from '@react-native-community/async-storage';

const RNFS = require('react-native-fs')
const PlayerScreen = (props) => {
    //common
    const theme = useSelector(state => state.preference.theme)
    const playerSetting = useSelector(state => state.player)
    const dispatch = useDispatch()
    //load data from redux
    const songList = useSelector(state => state.library)
    const [currentSongList, setCurrentSongList] = useState()
    const [currentSong, setCurrentSong] = useStateCallback()
    const [playState, setPlayState] = useState()

    const LibraryCarousel = useRef()
    useEffect(()=>{
        LibraryCarousel.current.snapToItem(Object.keys(songList).map((e, i) => {
            if (e == playerSetting.library) {
                return i
            } else {
                return -1
            }
        }).filter(e => e != -1)[0], true, false)
        TrackPlayer.getCurrentTrack().then((trackid) => {
            setCurrentSong(trackid, (state) => {
                //console.log('Current song:' + state)
                dispatch({ type: 'CHANGE_SONG', song: state })//set the song scroll to the correct position
                //set the carousel scroll to the correct position
            })
        })
    },[])
    useEffect(() => {
        TrackPlayer.getCurrentTrack().then((trackid) => {
            setCurrentSong(trackid, (state) => {
                //console.log('Current song:' + state)
                dispatch({ type: 'CHANGE_SONG', song: state })//set the song scroll to the correct position
                //set the carousel scroll to the correct position
            })
        })
    }, [playerSetting, playState])

    //track player setup
    var Listener
    var stateListener
    //event listener
    useEffect(() => {
        Listener = TrackPlayer.addEventListener('playback-error', _playbackerrorListener)
        stateListener = EventRegister.addEventListener('playback-state-change', (state) => {
            setPlayState(state)
        })
        return () => {
            Listener.remove()
        }
    }, [])
    const _playbackerrorListener = (code, message) => {
        console.warn(code)
        console.warn(message)
    }
    const _changeDispatch = (obj) => {
        dispatch(obj)
    }

    //track player utils
    /**
     * 
     * @param {array} trackArray 
     */
    const _loadTrackList = (trackArray) => {
        return new Promise(async (resolve, reject) => {
            console.log('loading songlist')
            var tracklist = trackArray.map(e => {
                return {
                    id: e.id,
                    title: e.title,
                    url: { uri: "file:///" + RNFS.DocumentDirectoryPath + "/internal/" + e.url.uri.split('/').slice(-1)[0] },
                    artist: e.artist
                }
            })
            TrackPlayer.add(tracklist).then(async () => { 
                await TrackPlayer.pause()
                resolve() }).catch((err) => { reject(err) })
        })


    }

    return (
        <Container>
            <Header style={[getStyle(COLOR.BG, true, true, theme)]}>
                <Left></Left>
                <Body>
                    <Title style={[getStyle(COLOR.ITEM, false, true, theme)]}>
                        Player
                    </Title>
                </Body>
                <Right></Right>
            </Header>
            <SongSelector style={{ height: isPro ? MAX_HEIGHT * 0.5 : MAX_HEIGHT * 0.5 - 90, paddingVertical: 10 }}
                theme={theme}
                ref={LibraryCarousel}
                wholePlaylist={songList}
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                loadTrackList={_loadTrackList}
                dispatch={_changeDispatch}

            />
            <Divider style={getStyle(COLOR.GRAY, true, true, theme)} />
            <ControlPanel style={{ flexGrow: 1 }} theme={theme} />
        </Container>
    )
}

//Song selector and its component
const SongSelector = React.forwardRef((props, reference) => {
    const theme = props.theme
    const currentSong = props.currentSong
    const dispatch = props.dispatch
    return (
        <View style={[{ ...props.style }, getStyle(COLOR.BG, true, true, theme)]}>
            <Carousel
                ref={reference}
                style={{ flexGrow: 1 }}
                itemWidth={MAX_WIDTH * 0.8}
                sliderWidth={MAX_WIDTH}
                data={Object.keys(props.wholePlaylist).map(e => {
                    var newObj = {}
                    newObj.songList = props.wholePlaylist[e]
                    newObj.title = e
                    return newObj
                })}
                loop
                onSnapToItem={(index) => {
                    TrackPlayer.reset()
                    dispatch({
                        type: 'CHANGE_LIBRARY',
                        library: Object.keys(props.wholePlaylist).filter((e, i) => { return i == index })[0]
                    })
                }}
                renderItem={({ item, index }) => {
                    return (
                        <View style={[getStyle(COLOR.GRAY6, true, true, theme), getStyle(COLOR.SHADOW, true, true, theme), { height: props.style.height * 0.9 }]}>
                            <View style={{ height: '10%', minHeight: 40, justifyContent: 'center', padding: 10 }}>
                                <Text style={getStyle(COLOR.GRAY, false, true, theme)}>{item.title}</Text>
                            </View>
                            <Divider style={getStyle(COLOR.GRAY, true, true, theme)} />
                            <View style={{ flexGrow: 1, paddingBottom: 40 }}>
                                <FlatListInsideCarousel theme={theme} title={item.title} songList={item.songList} currentSong={currentSong} loadTrackList={props.loadTrackList} dispatch={dispatch} library={item.title} />
                            </View>
                        </View>
                    )
                }}
            />
        </View>
    )
})
const FlatListInsideCarousel = (props) => {
    const theme = props.theme
    //console.log(props)
    const dispatch = props.dispatch
    const library = useSelector(state => state.player.library)
    const currentSong = useSelector(state => state.player.currentSong)
    const flatlist = useRef()
    useEffect(() => {
        if (library == props.library) {
            var currentSongIndex = props.songList.map((e, i) => {
                if (e.id == currentSong) {
                    return i
                } else {
                    return -1
                }
            }).filter((e) => { return e != -1 })[0]
            if (currentSongIndex) {
                flatlist.current.scrollToIndex({ index: currentSongIndex })
            }
        }
    }, [currentSong, library])
    return (
        <FlatList
            ref={flatlist}
            getItemLayout={(data, index) => { return { length: 70, index, offset: 70 * index } }}
            style={{ height: '100%', }}
            data={props.songList}
            extraData={props.songList}
            renderItem={({ item, index }) => {
                return (
                    <TouchableOpacity style={[currentSong == item.id && library == props.library? getStyle(COLOR.GRAY2, true, true, theme) : getStyle(COLOR.GRAY4, true, true, theme), getStyle(COLOR.SHADOW, true, true, theme), { margin: 5, padding: 5, height: 60 }]}
                        onPress={async () => {// on press stop the track see queue if queue is not empty then skip to that 
                            await TrackPlayer.pause()
                            var queue = await TrackPlayer.getQueue()
                            console.log(queue)
                            console.log('QL:'+queue.length)
                            if (queue.length == 0) {
                                await props.loadTrackList(props.songList)
                            }
                            await TrackPlayer.pause()
                            var queue = await TrackPlayer.getQueue()
                            console.log(queue)
                            console.log('QL:'+queue.length)
                            setTimeout(async () => {
                                await TrackPlayer.skip(item.id)
                                await TrackPlayer.play()
                                dispatch({ type: 'CHANGE_SONG', song: item.id })
                            }, 300)
                            EventRegister.emit('client-press')

                        }}
                    >

                        <TextTicker
                            style={[getStyle(COLOR.ITEM, false, true, theme)]}
                            duration={3000}
                            loop
                            bounce
                            repeatSpacer={50}
                            marqueeDelay={1000}
                            disabled={currentSong == item.id && library == props.library ? false : true}
                        >{item.title}</TextTicker>

                        <Divider style={getStyle(COLOR.GRAY, true, true, theme)} />
                        <Text
                            style={[getStyle(COLOR.GRAY, false, true, theme)]}
                        >
                            {item.artist}
                        </Text>
                    </TouchableOpacity>
                )
            }}
        />
    )
}
//control panel and its component
const ControlPanel = (props) => {
    const theme = props.theme
    const dispatch = useDispatch()
    const playerState = useSelector(state => state.player)
    useEffect(() => {
        TrackPlayer.setRate(playerState.rate)
        TrackPlayer.setVolume(playerState.volume)
    }, [playerState])

    return (
        <View style={[{ ...props.style }, getStyle(COLOR.BG, true, true, theme)]}>
            <Grid>
                <MusicSlider theme />
                {/**5 button for control */}
                <Row style={{ maxHeight: 0, backgroundColor: 'pink' }}>
                    <Col></Col>
                    <Col style={{ position: 'relative' }}>
                        <Button
                            style={{ position: 'absolute', width: '100%', bottom: 0, justifyContent: 'center' }}
                            onPress={() => {
                                if (playerState.rate == 1) {
                                    dispatch({ type: 'SET_RATE', rate: 1.25 })
                                } else if (playerState.rate == 1.25) {
                                    dispatch({ type: 'SET_RATE', rate: 1.5 })
                                } else if (playerState.rate == 1.5) {
                                    dispatch({ type: 'SET_RATE', rate: 2 })
                                } else if (playerState.rate == 2) {
                                    dispatch({ type: 'SET_RATE', rate: 0.25 })
                                } else if (playerState.rate == 0.25) {
                                    dispatch({ type: 'SET_RATE', rate: 0.5 })
                                } else if (playerState.rate == 0.5) {
                                    dispatch({ type: 'SET_RATE', rate: 0.75 })
                                } else if (playerState.rate == 0.75) {
                                    dispatch({ type: 'SET_RATE', rate: 1 })
                                }
                            }}
                        >
                            <Text>{'Rate: ' + playerState.rate + 'x'}</Text>
                        </Button>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col >
                        <Button
                            transparent
                            onPress={async () => {
                                //prev button
                                EventRegister.emit('client-press')
                                await TrackPlayer.skipToPrevious()
                            }}
                            style={{ justifyContent: 'center' }}
                        >
                            <Icon type='Ionicons' name='ios-play-skip-back' size={24} color={getStyle(COLOR.BLUE, false, true, theme).color} />
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            transparent
                            onPress={async () => {
                                //prev button
                                await TrackPlayer.pause()
                            }}
                            style={{ justifyContent: 'center' }}
                        >
                            <Icon type='Ionicons' name='ios-pause' size={24} color={getStyle(COLOR.BLUE, false, true, theme).color} />
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            transparent
                            onPress={async () => {
                                //prev button
                                await TrackPlayer.stop()
                            }}
                            style={{ justifyContent: 'center' }}
                        >
                            <Icon type='Ionicons' name='ios-stop' size={24} color={getStyle(COLOR.BLUE, false, true, theme).color} />
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            transparent
                            onPress={async () => {
                                //prev button
                                await TrackPlayer.play()
                            }}
                            style={{ justifyContent: 'center' }}
                        >
                            <Icon type='Ionicons' name='ios-play' size={24} color={getStyle(COLOR.BLUE, false, true, theme).color} />
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            transparent
                            onPress={async () => {
                                //prev button
                                EventRegister.emit('client-press')
                                await TrackPlayer.skipToNext()
                            }}
                            style={{ justifyContent: 'center' }}
                        >
                            <Icon type='Ionicons' name='ios-play-skip-forward' size={24} color={getStyle(COLOR.BLUE, false, true, theme).color} />
                        </Button>
                    </Col>
                </Row>

                {/**volume and mode */}
                <Row>
                    <Col size={1} style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Button
                            //loop mode button
                            transparent
                            onPress={() => {
                                dispatch({ type: 'SWITCH_LOOP' })
                            }}
                            style={{ alignItems: 'center' }}
                        >
                            {
                                playerState.loop == 'no' ?
                                    <Icon type='MaterialCommunityIcons' name='repeat-off' size={24} color={getStyle(COLOR.BLUE, false, true, theme).color} /> :
                                    playerState.loop == 'yes' ?
                                        <Icon type='MaterialCommunityIcons' name='repeat' size={24} color={getStyle(COLOR.BLUE, false, true, theme).color} /> :
                                        <Icon type='MaterialCommunityIcons' name='repeat-once' size={24} color={getStyle(COLOR.BLUE, false, true, theme).color} />
                            }
                        </Button>
                    </Col>
                    <Col size={3}>
                        <Row>
                            <Col size={1} style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Icon type='Ionicons' name='ios-volume-low' size={24} color={getStyle(COLOR.GRAY4, false, true, theme).color} />
                            </Col>
                            <Col size={2}>
                                <Slider
                                    style={{ flexGrow: 1 }}
                                    minimumValue={0}
                                    maximumValue={1}
                                    value={playerState.volume}
                                    step={0.05}
                                    minimumTrackTintColor={getStyle(COLOR.BLUE, false, true, theme).color}
                                    maximumTrackTintColor={getStyle(COLOR.GRAY4, false, true, theme).color}
                                    onSlidingComplete={(val) => {
                                        dispatch({ type: 'SET_VOLUME', volume: val })
                                    }}
                                />
                            </Col>
                            <Col size={1} style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Icon type='Ionicons' name='ios-volume-high' size={24} color={getStyle(COLOR.GRAY4, false, true, theme).color} />
                            </Col>
                        </Row>
                    </Col>
                    <Col size={1} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Button
                            //loop mode button
                            transparent
                            onPress={() => {
                                dispatch({ type: 'TOGGLE_SHUFFLE' })
                            }}
                            style={{ alignItems: 'center' }}
                        >
                            {
                                playerState.shuffle ?
                                    <Icon type='MaterialCommunityIcons' name='shuffle' size={24} color={getStyle(COLOR.BLUE, false, true, theme).color} /> :
                                    <Icon type='MaterialCommunityIcons' name='shuffle-disabled' size={24} color={getStyle(COLOR.BLUE, false, true, theme).color} />
                            }
                        </Button>
                    </Col>
                </Row>
            </Grid>
        </View>
    )
}
const MusicSlider = (props) => {
    const { position, bufferedPosition, duration } = useTrackPlayerProgress()
    const theme = useSelector(state => state.preference.theme)
    const _s2ms = (s) => {
        return ((s / 60) > 10 ? (s / 60).toFixed(0) : '0' + (s / 60).toFixed(0)) + ":" + (s % 60 > 10 ? (s % 60).toFixed(0) : "0" + (s % 60).toFixed(0))
    }
    return ([
        <Row>{/**slider for duration */}
            <Col style={{ position: 'relative', justifyContent: 'center' }}>
                <Slider
                    style={{ width: MAX_WIDTH, }}
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    minimumTrackTintColor={getStyle(COLOR.BLUE, false, true, theme).color}
                    maximumTrackTintColor={getStyle(COLOR.GRAY4, false, true, theme).color}
                    onSlidingComplete={async (val) => {
                        await TrackPlayer.seekTo(val)
                    }}
                />
            </Col>
        </Row>
        ,
        <Row>
            <Col style={{ alignItems: 'flex-start' }}>
                <Text style={getStyle(COLOR.ITEM, false, true, theme)}>{_s2ms(position)}</Text>
            </Col>
            <Col style={{ alignItems: 'flex-end' }}>
                <Text style={getStyle(COLOR.ITEM, false, true, theme)}>{_s2ms(duration)}</Text>
            </Col>
        </Row>
    ]
    )
}
export default PlayerScreen