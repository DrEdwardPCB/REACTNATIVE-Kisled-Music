import React, { useState, useEffect, useRef, useReducer } from "react"
import { useSelector, useDispatch, useStore } from 'react-redux'
import { MAX_HEIGHT, MAX_WIDTH, SongDirectory } from '../../../utils/Constant'
import { View, FlatList, Animated, TouchableOpacity } from 'react-native'
import { Button, Grid, Form, Input, Row, Col, Item, Label, Text, Toast } from 'native-base'
import COLOR, { getStyle } from "../../../utils/StyleSheets/Theme"
import { Divider } from "react-native-paper"
import Icon from '../../../utils/IconManager'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { useReducerCallback } from '../../../utils/util'
const RNFS = require('react-native-fs')

const SongList = (props) => {
    const theme = props.theme
    const [songLibrary, setSongLibrary] = useState()
    useEffect(() => {
        setSongLibrary(props.library)
    }, [props])
    const songList = useSelector(state => state.library[songLibrary])
    const allSongList = useSelector(state => state.library.all)
    const [addSongList, setAddSongList] = useState([])
    useEffect(() => {
        _updateAddSongList()
    }, [songList, allSongList])

    const _updateAddSongList = () => {
        if (songList && allSongList) {
            console.log(songList)
            console.log(allSongList)
            setAddSongList(allSongList.filter(e => !songList.map(f => f.id).includes(e.id)))
        } else {
            setAddSongList([])
        }
    }
    const [isOpen, setOpen] = useState(false)
    const dispatch = useDispatch()
    const [selectedId, setSelectedId] = useState('-1')

    //if selected id != null isOpen will trigger
    useEffect(() => {
        console.log('effect setopen la')
        if (selectedId != '-1') {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }, [selectedId])

    //if isOpen is triggered, trigger animation
    useEffect(() => {
        console.log('trigger animation la')
        if (isOpen) {
            _openInfo()
        } else {
            _setForm('', '', '')
            _closeInfo()
        }
    }, [isOpen])


    //animation related
    const closeInfoHeight = (MAX_HEIGHT - 40 - 20) * 0.1
    const openInfoHeight = (MAX_HEIGHT - 40 - 20) * 0.4
    const closeBottomHeight = (MAX_HEIGHT - 40 - 20) * 0.9//close =info close
    const openBottomHeight = (MAX_HEIGHT - 40 - 20) * 0.6//close =info close
    const topHeight = useRef(new Animated.Value(closeInfoHeight)).current
    const bottomHeight = useRef(new Animated.Value(closeBottomHeight)).current
    const OpacityVal = useRef(new Animated.Value(1)).current
    const _openInfo = () => {
        Animated.parallel([
            Animated.timing(topHeight, {
                toValue: openInfoHeight,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(bottomHeight, {
                toValue: openBottomHeight,
                duration: 500,
                useNativeDriver: false
            })
        ]).start()
    }
    const _closeInfo = () => {
        Animated.parallel([
            Animated.timing(topHeight, {
                toValue: closeInfoHeight,
                duration: 500,
                useNativeDriver: false
            }),
            Animated.timing(bottomHeight, {
                toValue: closeBottomHeight,
                duration: 500,
                useNativeDriver: false
            })
        ]).start()
    }

    //form
    const [id, setId] = useState('')
    const [title, setTitle] = useState('')
    const [artist, setArtist] = useState('')
    const _setForm = (id, title, artist) => {
        setId(id); setTitle(title); setArtist(artist)
    }
    //addSong deleteSong
    const localReducer = (state, action) => {
        switch (action.type) {
            case 'change':
                if (state.mode == 'order') {
                    return { mode: 'delete' }
                }
                if (state.mode == 'delete') {
                    if (songLibrary == 'all') {
                        return { mode: 'order' }
                    } else {
                        return { mode: 'add' }
                    }
                }
                if (state.mode == 'add') {
                    return { mode: 'order' }
                }
            default:
                return state
        }
    }
    const [editMode, setEditMode] = useReducerCallback(localReducer, { mode: 'order' })
    const _handleFlatListDispatch = (obj) => {
        console.log(obj)
        dispatch(obj)
        _updateAddSongList()
    }
    const _renderEditModeScreen = () => {
        if (editMode.mode == 'order') {
            console.log('mode order')
            if (songList && songList.length != 0) {

                return (
                    <DraggableFlatList
                        style={{ height: '100%' }}
                        keyExtractor={item => item.id}
                        data={songList}
                        extraData={[songList, songLibrary, selectedId, editMode]}
                        renderItem={({ item, index, drag, isActive  }) => { return (<OrderFlatListItem theme={theme} item={item} selectedId={selectedId} setSelectedId={setSelectedId} index={index} setForm={_setForm} drag={drag} isActive={isActive} />) }}
                        onDragEnd={({ data }) => dispatch({ type: 'REORDER_LIBRARY', library: songLibrary, songList: data })}
                    />)
            } else {
                return (
                    <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={getStyle(COLOR.ITEM, false, true, theme)}>Currently No Song in Library</Text>
                    </View>)
            }
        } else if (editMode.mode == 'delete') {
            //console.log('mode order')//delete
            if (songList && songList.length != 0) {
                return (
                    <DraggableFlatList
                        style={{ height: '100%' }}
                        keyExtractor={item => item.id}
                        data={songList}
                        extraData={[songList, songLibrary, selectedId, editMode]}
                        renderItem={({ item, index }) => { return (<DeleteFlatListItem theme={theme} item={item} selectedId={selectedId} setSelectedId={setSelectedId} index={index} library={songLibrary} dispatch={_handleFlatListDispatch} />) }}
                    />)
            } else {
                return (
                    <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={getStyle(COLOR.ITEM, false, true, theme)}>Currently No Song in Library</Text>
                    </View>)
            }
        } else {
            return (
                <DraggableFlatList
                    style={{ height: '100%' }}
                    keyExtractor={item => item.id}
                    data={addSongList}
                    extraData={[addSongList, songList, songLibrary, selectedId, editMode]}
                    renderItem={({ item, index }) => { return (<AddFlatListItem theme={theme} item={item} selectedId={selectedId} setSelectedId={setSelectedId} index={index} library={songLibrary} dispatch={_handleFlatListDispatch} />) }}
                />
            )
        }
    }
    return (
        <View style={{ flexGrow: 1 }}>
            <Animated.View style={[{ height: topHeight, margin: 5 }, getStyle(COLOR.GRAY5, true, true, theme), getStyle(COLOR.SHADOW, true, true, theme)]}>
                <View style={{ height: closeInfoHeight, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, flexDirection: 'row' }}>
                    <Text style={[getStyle(COLOR.GRAY, false, true, theme), { fontSize: 20, fontWeight: 'bold' }]}>{isOpen ? 'Song Info' : songLibrary}</Text>
                    <Button transparent onPress={() => { props.reference.current.close() }}>
                        <Icon type="Entypo" name="cross" size={20} color={getStyle(COLOR.GRAY, false, true, theme).color} />
                    </Button>
                </View>
                <View style={{ height: openInfoHeight - closeInfoHeight }}>
                    <Form>
                        <Item>
                            <Label style={getStyle(COLOR.GRAY3, false, true, theme)}>title</Label>
                            <Input style={getStyle(COLOR.ITEM, false, true, theme)} value={title} onChangeText={(val) => { setTitle(val) }} />
                        </Item>
                        <Item>
                            <Label style={getStyle(COLOR.GRAY3, false, true, theme)}>title</Label>
                            <Input style={getStyle(COLOR.ITEM, false, true, theme)} value={artist} onChangeText={(val) => { setArtist(val) }} />
                        </Item>
                    </Form>
                    <Grid style={{ flexGrow: 1 }}>
                        <Row>
                            <Col>
                                <Button danger onPress={() => {
                                    setSelectedId('-1')
                                }}>
                                    <Text>Cancel</Text>
                                </Button>
                            </Col>
                            <Col></Col>
                            <Col>
                                <Button onPress={() => {
                                    dispatch({ type: 'EDIT_SONG_INFO', trackId: id, newTitle: title, newArtist: artist })
                                    setSelectedId('-1')
                                }}>
                                    <Text>Confirm</Text>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </View>
            </Animated.View>
            <Animated.View style={[{ height: bottomHeight, margin: 5 }, getStyle(COLOR.GRAY5, true, true, theme), getStyle(COLOR.SHADOW, true, true, theme)]}>
                {/** one is songlist and delete songs */}
                <View style={{ flexDirection: 'row', height: 50, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Text style={[{ fontSize: 16 }, getStyle(COLOR.GRAY3, false, true, theme)]}>Edit mode</Text>
                    <Button rounded
                        style={{ margin: 10, width: 150, justifyContent: 'center' }}
                        onPress={() => {
                            Animated.timing(OpacityVal, {
                                toValue: 0,
                                duration: 300,
                                useNativeDriver: true
                            }).start(({ finish }) => {
                                setEditMode({ type: 'change' },
                                    (state) => {
                                        Animated.timing(OpacityVal, {
                                            toValue: 1,
                                            duration: 300,
                                            useNativeDriver: true
                                        }).start()
                                    })
                            })

                        }}
                    >
                        <Text>{editMode.mode}</Text>
                    </Button>
                </View>
                <Animated.View style={{ opacity: OpacityVal, flexGrow: 1 }}>
                    {_renderEditModeScreen()}
                </Animated.View>
            </Animated.View>
        </View>
    )

}
const OrderFlatListItem = (props) => {
    const theme = props.theme
    return (
        <TouchableOpacity style={[props.item.id == props.selectedId ? getStyle(COLOR.GRAY2, true, true, theme) : getStyle(COLOR.GRAY3, true, true, theme), {
            margin: 3,
        }, getStyle(COLOR.SHADOW, true, true, theme)]}
            onPress={() => {
                console.log('pressed')
                if (props.selectedId == props.item.id) {
                    props.setSelectedId('-1')
                } else {
                    props.setSelectedId(props.item.id)
                    props.setForm(props.item.id, props.item.title, props.item.artist)
                }
            }}
            onLongPress={props.drag}
            //onPressOut={props.moveEnd}
        >
            <Grid>
                <Row>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[getStyle(COLOR.ITEM, false, true, theme), { height: 25, fontSize: 20, }]}>
                            {props.index + 1}
                        </Text>
                    </Col>
                    <Col size={4}>
                        <Text style={[getStyle(COLOR.ITEM, false, true, theme), { height: 25 }]}>
                            {props.item.title}
                        </Text>
                        <Divider />
                        <Text style={[getStyle(COLOR.ITEM, false, true, theme), { height: 25 }]}>
                            {props.item.artist}
                        </Text>
                    </Col>
                </Row>
            </Grid>

        </TouchableOpacity>
    )
}
const DeleteFlatListItem = (props) => {
    //const dispatch = useDispatch()
    const theme = props.theme
    return (
        <View style={[props.item.id == props.selectedId ? getStyle(COLOR.GRAY2, true, true, theme) : getStyle(COLOR.GRAY3, true, true, theme), {
            margin: 3,
        }, getStyle(COLOR.SHADOW, true, true, theme)]}>
            <Grid>
                <Row>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Button danger small rounded onPress={() => {
                            if (props.library !== 'all') {
                                props.dispatch({ type: 'REMOVE_SONG_FROM_LIBRARY', trackId: props.item.id, library: props.library })
                                Toast.show({
                                    text: "Successfully Deleted song",
                                    buttonText: "Okay",
                                    duration: 2000,
                                    position: "top",
                                    type: "success",
                                })
                            } else {
                                RNFS.unlink(RNFS.DocumentDirectoryPath + '/internal/' + props.item.id + '.m4a').then(() => {
                                    props.dispatch({ type: 'DELETE_SONG', trackId: props.item.id })
                                    Toast.show({
                                        text: "Successfully Deleted song",
                                        buttonText: "Okay",
                                        duration: 2000,
                                        position: "top",
                                        type: "success",
                                    })
                                }).catch((e) => {
                                    console.warn(e)
                                    console.log(Object.keys(e))
                                    if (e.message.includes('no such file or directory')) {
                                        props.dispatch({ type: 'DELETE_SONG', trackId: props.item.id })
                                        Toast.show({
                                            text: "Successfully Deleted song",
                                            buttonText: "Okay",
                                            duration: 2000,
                                            position: "top",
                                            type: "success",
                                        })
                                    } else {
                                        Toast.show({
                                            text: "Song delete unsuccessful",
                                            buttonText: "Okay",
                                            duration: 2000,
                                            position: "top",
                                            type: "danger",
                                        })
                                    }
                                })
                            }
                        }}>
                            <Text>-</Text>
                        </Button>
                    </Col>
                    <Col size={4}>
                        <Text style={[getStyle(COLOR.ITEM, false, true, theme), { height: 25 }]}>
                            {props.item.title}
                        </Text>
                        <Divider />
                        <Text style={[getStyle(COLOR.ITEM, false, true, theme), { height: 25 }]}>
                            {props.item.artist}
                        </Text>
                    </Col>
                </Row>
            </Grid>

        </View>
    )
}
const AddFlatListItem = (props) => {
    //const dispatch = useDispatch()
    const theme = props.theme
    return (
        <View style={[props.item.id == props.selectedId ? getStyle(COLOR.GRAY2, true, true, theme) : getStyle(COLOR.GRAY3, true, true, theme), {
            margin: 3,
        }, getStyle(COLOR.SHADOW, true, true, theme)]}>
            <Grid>
                <Row>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Button small onPress={() => {
                            props.dispatch({ type: 'ADD_SONG_TO_LIBRARY', library: props.library, trackId: props.item.id })
                            Toast.show({
                                text: "Successfully Added song",
                                buttonText: "Okay",
                                duration: 2000,
                                position: "top",
                                type: "success",
                            })
                        }}>
                            <Text>+</Text>
                        </Button>
                    </Col>
                    <Col size={4}>
                        <Text style={[getStyle(COLOR.ITEM, false, true, theme), { height: 25 }]}>
                            {props.item.title}
                        </Text>
                        <Divider />
                        <Text style={[getStyle(COLOR.ITEM, false, true, theme), { height: 25 }]}>
                            {props.item.artist}
                        </Text>
                    </Col>
                </Row>
            </Grid>

        </View>
    )
}

export default SongList