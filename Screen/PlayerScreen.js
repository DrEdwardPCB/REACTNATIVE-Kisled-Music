import React from 'react';
import { Container, Header, Content, Card, Button, CardItem, Left, Right, Body, Title, Text, Grid, Row, Col, Form, Input, Item, Label, Picker } from 'native-base';
import { Icon } from '../Manager/IconManager'
import { ScrollView, FlatList, TouchableOpacity, Slider } from 'react-native'
import COLOR, { getTheme, getStyle } from '../StyleSheets/Theme'
//import PreferenceManager from '../Manager/PreferenceManager'
import { Dimensions, View } from 'react-native'
import { Divider } from 'react-native-paper'
import Carousel from 'react-native-snap-carousel'
import uuid from 'react-native-uuid'
import PlayerManager from '../Manager/PlayerManager'
import LibrariesManager from '../Manager/LibrariesManager'
import TrackPlayer, { ProgressComponent, removeListeners } from 'react-native-track-player'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { EventRegister } from 'react-native-event-listeners'
import TextTicker from'react-native-text-ticker' 
const RNFS = require('react-native-fs')

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class PlayerScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            shuffle: false,
            repeat: false,
            loop: false,
            playing: false,
            volume: 0,
            carouselItems: [],
            currentSong: undefined,
            rate: '1'

        }
        

    }
    componentWillMount() {
        this.listener = EventRegister.addEventListener('playback-state-c', async (obj) => {
            //console.log(obj)
            if (obj.state == 'idle') {
                this.setState({ currentSong: undefined })
            }
            var crate = await TrackPlayer.getRate()
            this.setState({ rate: crate.toFixed(2) == '0.00' ? '1.00' : crate.toFixed(2) })
            if (obj.state == 'playing') {
                TrackPlayer.getTrack(await TrackPlayer.getCurrentTrack()).then(nextSong => {
                    //console.log(nextSong)
                    this.setState({ currentSong: nextSong }, () => {
                    })
                })
            }
        })
    }
    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener)
    }

    async componentDidMount() {
        var cstate = await PlayerManager.getInstance().getState()
        var ctrack
        if (cstate == 'playing') {
            ctrack = await TrackPlayer.getTrack(await PlayerManager.getInstance().getCurrentTrack())
        }
        var crate = await TrackPlayer.getRate()
        var clib = PlayerManager.getInstance().getCurrentLib()
        var wholelib = LibrariesManager.getInstance().getLibrariesObject()
        var carouselItems = Object.keys(wholelib).map((e) => { return { title: e, songs: wholelib[e] } })
        this.setState({ carouselItems: carouselItems, playing: cstate == 'playing', currentSong: ctrack, shuffle: clib.shuffle, repeat: clib.repeat, loop: clib.loop, rate: crate.toFixed(2) == '0.00' ? '1.00' : crate.toFixed(2) },
            () => {
                var index = 0
                for (var i = 0; i < Object.keys(wholelib).length; i++) {
                    if (Object.keys(wholelib)[i] == clib.lib) {
                        index = i
                        break;
                    }
                }
                this._carousel.snapToItem(index, false, false)
            })
    }
    componentWillUnmount() {
        var currentlib
        try {
            currentlib = this.state.carouselItems[this._carousel.currentIndex].title
        } catch (e) {

        }

        //console.log(currentlib)
        PlayerManager.getInstance().setCurrentlib({ lib: currentlib, shuffle: this.state.shuffle, repeat: this.state.repeat, loop: this.state.loop })
    }

    _renderItem = ({ item, index }) => {
        return (<CaroselItem item={item} index={index} currentSong={this.state.currentSong ? this.state.currentSong.id : undefined//an id will be fine
        } />)
    }
    render() {
        return (
            <Container>
                <Header style={[getStyle(COLOR.GRAY6, true, true), {
                    shadowOffset: { height: 0, width: 0 },
                    shadowOpacity: 0, elevation: 0
                }, { borderBottomWidth: 0 }]}>
                    <Left></Left>
                    <Body><Title style={[getStyle(COLOR.ITEM, true, true)]}>Player</Title></Body>
                    <Right></Right>
                </Header>
                <Content style={[getStyle(COLOR.BG, true, true)]} scrollEnabled={false}>
                    <Grid style={{ justifyContent: 'space-between' }}>
                        <Row size={1} style={{ height: isIphoneX() ? (height - 84 - 64) * 0.6 : (height - 84 - 64) * 0.6 }}>
                            <Col>
                                <Carousel
                                    onSnapToItem={(slideIndex) => { PlayerManager.getInstance().stop() }}
                                    ref={(c) => { this._carousel = c; }}
                                    data={this.state.carouselItems}
                                    renderItem={this._renderItem}
                                    sliderWidth={width}
                                    itemWidth={width * 0.8}
                                />
                            </Col>
                        </Row>
                        <Divider />

                        <Row size={1} style={{ alignSelf: 'flex-end' }}>
                            {/**
                         * players
                         */}
                            <Col>
                                <Row>
                                    <SeekBar />
                                </Row>
                                <Row style={{ height: 35 }}>
                                    <Col>
                                        <Row>
                                            <Col style={{ height: 20, alignItems: 'center' }}>
                                                <TextTicker loop bounce repeatSpacer={50} marqueeDelay={1000} style={[getStyle(COLOR.ITEM, false, true), { fontSize: 15 }]}>{!(this.state.currentSong == undefined) ? this.state.currentSong.title : ''}</TextTicker>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ height: 15, alignItems: 'center' }}>
                                                <Text style={[getStyle(COLOR.GRAY2, false, true), { fontSize: 11 }]}>{!(this.state.currentSong == undefined) ? this.state.currentSong.artist : ''}</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                    <Col style={{ width: width * 0.15, alignItems: 'center', alignContent: 'center' }}>
                                        <Button
                                            rounded
                                            transparent
                                            style={{ justifyContent: 'center', width: width * 0.15 }}
                                            onPress={async () => {
                                                await PlayerManager.getInstance().prev()
                                            }}>
                                            <Icon type='AntDesign' name='stepbackward' size={17} color={getStyle(COLOR.BLUE, false, true).color} />
                                        </Button>
                                    </Col>
                                    <Col style={{ width: width * 0.15, alignItems: 'center', alignContent: 'center' }}>
                                        <Button
                                            rounded
                                            transparent
                                            style={{ justifyContent: 'center' }}
                                            onPress={async () => {
                                                await PlayerManager.getInstance().pauseSong()
                                            }}
                                        >
                                            <Icon type='Ionicons' name='ios-pause' size={30} color={getStyle(COLOR.BLUE, false, true).color} />
                                        </Button>
                                    </Col>
                                    <Col style={{ width: width * 0.1, alignItems: 'center', alignContent: 'center' }}>
                                        <Button
                                            rounded
                                            transparent
                                            style={{ justifyContent: 'center' }}
                                            onPress={async () => {
                                                await PlayerManager.getInstance().stop()
                                            }}
                                        >
                                            <Icon type='Foundation' name='stop' size={24} color={getStyle(COLOR.BLUE, false, true).color} />
                                        </Button>
                                    </Col>
                                    <Col style={{ width: width * 0.15, alignItems: 'center', alignContent: 'center' }}>
                                        <Button
                                            rounded
                                            transparent
                                            style={{ justifyContent: 'center' }}
                                            onPress={async () => {
                                                //console.log(RNFS.DocumentDirectoryPath)
                                                await PlayerManager.getInstance().playSong()
                                            }}
                                        >
                                            <Icon type='Ionicons' name='ios-play' size={30} color={getStyle(COLOR.BLUE, false, true).color} />
                                        </Button>
                                    </Col>
                                    <Col style={{ width: width * 0.15, alignItems: 'center', alignContent: 'center' }}>
                                        <Button
                                            rounded
                                            transparent
                                            style={{ justifyContent: 'center' }}
                                            onPress={async () => {
                                                await PlayerManager.getInstance().next()
                                            }}
                                        >
                                            <Icon type='AntDesign' name='stepforward' size={17} color={getStyle(COLOR.BLUE, false, true).color} />
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <VolumeControl />
                                </Row>
                                <Row style={{ alignContent: 'space-between' }}>
                                    <Col>
                                        <Button
                                            transparent
                                            style={{ justifyContent: 'center' }}
                                            onPress={() => {
                                                if (this.state.loop == true && this.state.repeat == false) {
                                                    this.setState({ repeat: true, loop: true }, () => {
                                                        PlayerManager.getInstance().setCurrentlib({
                                                            lib: this.state.carouselItems[this._carousel.currentIndex].title,
                                                            shuffle: this.state.shuffle,
                                                            repeat: this.state.repeat,
                                                            loop: this.state.loop
                                                        })
                                                    })
                                                } else if (this.state.repeat == true && this.state.loop == true) {
                                                    if (this.state.shuffle == true) {
                                                        this.setState({ repeat: false, loop: true }, () => {
                                                            PlayerManager.getInstance().setCurrentlib({
                                                                lib: this.state.carouselItems[this._carousel.currentIndex].title,
                                                                shuffle: this.state.shuffle,
                                                                repeat: this.state.repeat,
                                                                loop: this.state.loop
                                                            })
                                                        })
                                                    } else {
                                                        this.setState({ repeat: false, loop: false }, () => {
                                                            PlayerManager.getInstance().setCurrentlib({
                                                                lib: this.state.carouselItems[this._carousel.currentIndex].title,
                                                                shuffle: this.state.shuffle,
                                                                repeat: this.state.repeat,
                                                                loop: this.state.loop
                                                            })
                                                        })
                                                    }

                                                } else if (this.state.loop == false && this.state.repeat == false) {
                                                    this.setState({ loop: true, repeat: false }, () => {
                                                        PlayerManager.getInstance().setCurrentlib({
                                                            lib: this.state.carouselItems[this._carousel.currentIndex].title,
                                                            shuffle: this.state.shuffle,
                                                            repeat: this.state.repeat,
                                                            loop: this.state.loop
                                                        })
                                                    })
                                                }else{
                                                    PlayerManager.getInstance().resetclib()
                                                }

                                            }}
                                        >
                                            <Icon type='MaterialCommunityIcons' name={this.state.repeat ? 'repeat-once' : this.state.loop ? 'repeat' : 'repeat-off'} color={getStyle(COLOR.BLUE, false, true).color} size={24} />
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Form>
                                            <Item
                                                rounded
                                                style={{ paddingLeft: 10 }}
                                            >
                                                <Label>Rate:</Label>
                                                <Picker
                                                    note
                                                    mode="dropdown"
                                                    style={{ width: 120 }}
                                                    selectedValue={this.state.rate}
                                                    onValueChange={async (rate) => {
                                                        await TrackPlayer.setRate(parseFloat(rate))
                                                        this.setState({ rate: rate })
                                                    }}
                                                >
                                                    <Picker.Item label='0.5x' value='0.50' />
                                                    <Picker.Item label='0.75x' value='0.75' />
                                                    <Picker.Item label='1x' value='1.00' />
                                                    <Picker.Item label='1.25x' value='1.25' />
                                                    <Picker.Item label='1.5x' value='1.50' />
                                                    <Picker.Item label='2x' value='2.00' />
                                                </Picker>
                                            </Item>
                                        </Form>
                                    </Col>
                                    <Col>
                                        <Button
                                            transparent
                                            style={{ justifyContent: 'center' }}
                                            onPress={() => {
                                                this.setState({ shuffle: !this.state.shuffle }, () => {
                                                    if (this.state.shuffle) {
                                                        this.setState({ loop: true }, () => {
                                                            PlayerManager.getInstance().setCurrentlib({
                                                                lib: this.state.carouselItems[this._carousel.currentIndex].title,
                                                                shuffle: this.state.shuffle,
                                                                repeat: this.state.repeat,
                                                                loop: this.state.loop
                                                            })
                                                        })
                                                    } else {
                                                        PlayerManager.getInstance().setCurrentlib({
                                                            lib: this.state.carouselItems[this._carousel.currentIndex].title,
                                                            shuffle: this.state.shuffle,
                                                            repeat: this.state.repeat,
                                                            loop: this.state.loop
                                                        })
                                                    }
                                                })
                                            }}
                                        >
                                            <Icon type='MaterialCommunityIcons' name={this.state.shuffle ? 'shuffle' : 'shuffle-disabled'} color={getStyle(COLOR.BLUE, false, true).color} size={24} />

                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        )
    }
}
class CaroselItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.item.songs.map(e => e),
            currentSong: props.currentSong
        }
    }
    static getDerivedStateFromProps(props, state) {
        return { currentSong: props.currentSong }
    }
    render() {

        const { item } = this.props
        return (
            <Card style={{ height: isIphoneX() ? (height - 84 - 64) * 0.55 : (height - 84 - 64) * 0.55 }}>
                <CardItem style={{ height: isIphoneX() ? (height - 84 - 64) * 0.1 : (height - 84 - 64) * 0.1 }}>
                    <Title>{item.title}</Title>
                </CardItem>
                <Divider/>
                <CardItem style={{ height: isIphoneX() ? (height - 84 - 64) * 0.45 : (height - 84 - 64) * 0.45 }}>
                    <FlatList
                        ref={c=> (this.flat = c) }
                        style={{ height: '100%', width: '100%' }}
                        data={this.state.data}
                        renderItem={(obj) => {
                            return (
                                <SelectionListItem item={obj.item} index={obj.index} selected={this.state.currentSong} library={item.title} flatlistParent={this.flat}/>)

                        }}
                        getItemLayout={(data, index) => (
                            { length: 64, offset: 64 * index, index }
                        )}
                        extraData={this.state}
                    >

                    </FlatList>
                </CardItem>
            </Card>
        )
    }
}
class SeekBar extends ProgressComponent {
    constructor(props) {
        super(props)
    }
    render() {
        const { position, duration } = this.state
        return (
            <Col>
                <Row>
                    <Col>
                        <Slider
                            maximumValue={duration}
                            disabled={true}
                            value={position}
                            onSlidingComplete={(val) => { TrackPlayer.seekTo(Math.round(val)) }}
                            minimumTrackTintColor={getStyle(COLOR.BLUE, false, true).color}
                            maximumTrackTintColor={getStyle(COLOR.GRAY6, false, true).color}
                            thumbTintColor={getStyle(COLOR.BLUE, false, true).color}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col style={{ alignItems: 'flex-start', padding: 5 }}><Text style={[getStyle(COLOR.GRAY4, false, true)]} >{Math.floor(parseInt(position) / 60).toString() + ":" + Math.floor(parseInt(position) % 60).toPrecision(2).toString().split("").map((e, i, a) => { if (a.includes(".")) { if (i == 0) { return '0' } else { return a[i - 1] } } else { return e } }).filter((e, i) => { return i == 0 || i == 1 }).reduce((a, b) => { return a + b }, '')}</Text></Col>
                    <Col style={{ alignItems: 'flex-end', padding: 5 }}><Text style={[getStyle(COLOR.GRAY4, false, true)]} >{Math.floor(parseInt(duration) / 60).toString() + ":" + Math.floor(parseInt(duration) % 60).toPrecision(2).toString().split("").map((e, i, a) => { if (a.includes(".")) { if (i == 0) { return '0' } else { return a[i - 1] } } else { return e } }).filter((e, i) => { return i == 0 || i == 1 }).reduce((a, b) => { return a + b }, '')}</Text></Col>
                </Row>

            </Col>
        )
    }
}
class VolumeControl extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            volume: 0
        }
    }
    async componentDidMount() {
        var vol = await TrackPlayer.getVolume()
        this.setState({ volume: vol })
    }
    render() {
        return (
            <Col>
                <Row>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon type='Ionicons' name='ios-volume-low' size={20} color={getStyle(COLOR.GRAY4, false, true).color} />
                    </Col>
                    <Col size={3}>
                        <Slider
                            maximumValue={1}
                            disabled={false}
                            step={20}
                            value={this.state.volume}
                            onSlidingComplete={async (val) => {
                                await TrackPlayer.setVolume(val)
                                this.setState({ volume: val })
                            }}
                            minimumTrackTintColor={getStyle(COLOR.BLUE, false, true).color}
                            maximumTrackTintColor={getStyle(COLOR.GRAY6, false, true).color}
                        />
                    </Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon type='Ionicons' name='ios-volume-high' size={20} color={getStyle(COLOR.GRAY4, false, true).color} />
                    </Col>
                </Row>
            </Col>
        )
    }
}

class SelectionListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: '',
            index:0
        }
    }
    static getDerivedStateFromProps(props, state) {
        //console.log('index telling')
        //console.log(props.index)
        //console.log(props.flatlistParent)
        if(props.item.id==props.selected&&props.flatlistParent!=undefined){
            setTimeout(()=>{
                //console.log(props.index)
                props.flatlistParent.scrollToOffset({offset:props.index*64, animated:true})
            },2000)
        }
        return { selected: props.selected, index:props.index }
    }
    render() {
        const { item, index, library } = this.props
        return (
            <TouchableOpacity
                onPress={
                    async () => {
                        const wholelib = await LibrariesManager.getInstance().getLibrariesObject()

                        PlayerManager.getInstance().stop()
                        await PlayerManager.getInstance().addSongs(wholelib[library])
                        EventRegister.emit('handChange', item.id)
                        await PlayerManager.getInstance().skip(item.id)
                        PlayerManager.getInstance().playSong()

                    }
                }
            >
                <Grid style={[{
                    backgroundColor: this.state.selected == item.id ? getStyle(COLOR.GRAY4, true, true).backgroundColor : getStyle(COLOR.GRAY6, true, true).backgroundColor
                }, getStyle(COLOR.SHADOW, true, true), { marginBottom: 4, paddingRight: 10 }]}>
                    <Row style={{ height: 60, paddingVertical: 5 }}>
                        <Col size={1} style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>{index + 1}</Text>
                        </Col>
                        <Col size={9} style={{ justifyContent: 'center', alignItems: 'flex-start', borderLeftWidth: 1, borderColor: getStyle(COLOR.GRAY5, false, true).color, }}>
                            <Row style={{ borderBottomWidth: 1, borderBottomColor: getStyle(COLOR.GRAY5, false, true).color }}>
                                <Col style={{ justifyContent: "center", alignItems: 'flex-start', paddingLeft: 5 }}>
                                    <TextTicker loop bounce repeatSpacer={50} marqueeDelay={1000} disabled={this.state.selected != item.id} style={[getStyle(COLOR.ITEM, true, true), { fontWeight: 'bold', fontSize: 15 }]}>{item.title}</TextTicker>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ justifyContent: "center", alignItems: 'flex-start', paddingLeft: 5 }}>
                                    <Text style={[getStyle(COLOR.ITEM, true, true), { opacity: 0.6, fontSize: 11 }]} >{item.artist}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Grid>
            </TouchableOpacity>

        )
    }
}
