import React, { useRef } from 'react';
import { Container, Header, Content, Card, Button, CardItem, Left, Right, Body, Title, Text, Grid, Row, Col, Form, Input, Item, Label, Tab, Tabs, TabHeading, ScrollableTab } from 'native-base';
import { Icon } from '../Manager/IconManager'
import { ScrollView, Flatlist, Alert, StyleSheet } from 'react-native'
import COLOR, { getTheme, getStyle } from '../StyleSheets/Theme'
//import PreferenceManager from '../Manager/PreferenceManager'
import { Dimensions, View, Image } from 'react-native'
import { Divider } from 'react-native-paper'
import uuid from 'react-native-uuid'
import PlayerManager from '../Manager/PlayerManager'
import * as Progress from 'react-native-progress';
import YoutubeDownloadManager from '../Manager/YoutubeDownloadManager'
const RNFS = require('react-native-fs')
import WebView from 'react-native-webview'
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize'
import FileManager from '../Manager/FileManager'
import LibrariesManager from '../Manager/LibrariesManager';


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class DownloadScreen extends React.Component {


    render() {
        return (
            <Container>
                <Header style={[getStyle(COLOR.GRAY6, true, true), {
                    shadowOffset: { height: 0, width: 0 },
                    shadowOpacity: 0, elevation: 0
                }, { borderBottomWidth: 0 }]}
                    hasTabs
                >
                    <Left></Left>
                    <Body><Title style={[getStyle(COLOR.ITEM, true, true)]}>Download</Title></Body>
                    <Right></Right>
                </Header>
                <Tabs renderTabBar={() => <ScrollableTab style={getStyle(COLOR.GRAY6, true, true)}></ScrollableTab>}>
                    <Tab heading={<TabHeading style={getStyle(COLOR.GRAY6, true, true)}><Icon type="MaterialCommunityIcons" name="youtube" color={getStyle(COLOR.GRAY3, false, true).color} size={24} style={{ color: getStyle(COLOR.GRAY3, false, true).color, fontSize: 24 }} /><Text>Youtube</Text></TabHeading>} tabStyle={getStyle(COLOR.GRAY6, true, true)}>
                        <YoutubeDownloader />
                    </Tab>
                    <Tab heading={<TabHeading style={getStyle(COLOR.GRAY6, true, true)}><Icon type="MaterialIcons" name="http" color={getStyle(COLOR.GRAY3, false, true).color} size={24} style={{ color: getStyle(COLOR.GRAY3, false, true).color, fontSize: 24 }} /><Text>Http</Text></TabHeading>} tabStyle={getStyle(COLOR.GRAY6, true, true)}>
                        <HttpDownloader />
                    </Tab>
                </Tabs>
            </Container >
        )
    }
}
class YoutubeDownloader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            url: 'https://www.youtube.com/',
            texturl: 'https://www.youtube.com/',
            basicInfo: undefined,
            filteredInfo: undefined,
            songTitle: '',
            Artist: '',
            //scrollViewHeight: 100,
            lockModal: 0,
            showProgressBar: false,
            progress: 0
        }
    }
    renderCard = () => {
        if (this.state.basicInfo == undefined) {
            return (
                <Card style={[{ borderRadius: 20, height: '100%' }, getStyle(COLOR.SHADOW, true, true)]}>
                    <CardItem style={[{ borderTopLeftRadius: 20, borderTopRightRadius: 20, height: "33.4%" }, getStyle(COLOR.GRAY6, true, true)]}>

                    </CardItem>
                    <CardItem style={[getStyle(COLOR.GRAY6, true, true), { height: "33.4%", flexDirection: 'column' }]}>
                        <Text style={[getStyle(COLOR.BLUE, false, true), { alignSelf: 'center', fontSize: 20, flex: 1, marginBottom: 5 }]}>Browse to the video</Text>
                        <Text style={[getStyle(COLOR.BLUE, false, true), { alignSelf: 'center', fontSize: 20, flex: 1 }]}>Click Retrieve from Url</Text>
                    </CardItem>
                    <CardItem style={[{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20, height: "33.4%" }, getStyle(COLOR.GRAY6, true, true)]}>

                    </CardItem>
                </Card>
            )
        } else {
            return (
                <Card style={[{ borderRadius: 20, height: '100%' }, getStyle(COLOR.SHADOW, true, true)]}>

                    <CardItem style={[getStyle(COLOR.GRAY6, true, true), { height: "100%", borderRadius: 20 }]}>
                        <Grid>
                            <Row size={1}>
                                <Col style={{ alignItems: 'flex-end' }}>
                                    <Button rounded
                                        transparent
                                        onPress={() => { this.setState({ basicInfo: undefined, filteredInfo: undefined }) }}
                                        style={{ aspectRatio: 1, justifyContent: 'center' }}
                                    >
                                        <Icon type='Entypo' name='cross' color={getStyle(COLOR.GRAY3, false, true).color} size={24}></Icon>
                                    </Button>
                                </Col>
                            </Row>
                            <Row size={2}>
                                <Col size={1}>
                                    <Row size={1}>
                                        <Col>
                                            <Text style={[getStyle(COLOR.ITEM, false, true), getStyle(COLOR.GRAY, true, true), { padding: 2 }]}>{Math.floor(parseInt(this.state.basicInfo.player_response.videoDetails.lengthSeconds) / 60).toString() + ":" + Math.floor(parseInt(this.state.basicInfo.player_response.videoDetails.lengthSeconds) % 60).toPrecision(2).toString().split("").map((e, i, a) => { if (a.includes(".")) { if (i == 0) { return '0' } else { return a[i - 1] } } else { return e } }).filter((e, i) => { return i == 0 || i == 1 }).reduce((a, b) => { return a + b }, '')}</Text>
                                        </Col>
                                    </Row>
                                    <Row size={4}>
                                        <Col>
                                            <Image
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode='contain'
                                                source={{ uri: this.state.basicInfo.player_response.videoDetails.thumbnail.thumbnails[0].url }}
                                            />
                                        </Col>
                                    </Row>

                                </Col>
                                <Col size={2} style={{ paddingLeft: 10, marginBottom: 10 }}>
                                    <Row>
                                        <Col><Text style={[getStyle(COLOR.ITEM), { fontWeight: 'bold', fontSize: 14 }]} numberOfLines={2}>{this.state.basicInfo.title}</Text></Col>
                                    </Row>
                                    <Row>
                                        <Col size={1}><Image
                                            style={{ height: 50, aspectRatio: 1, borderRadius: 25 }}
                                            resizeMode='contain'
                                            source={{ uri: this.state.basicInfo.author.avatar }}
                                        /></Col>
                                        <Col size={3} style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}><Text style={[getStyle(COLOR.GRAY), { fontSize: 14 }]} numberOfLines={2}>{this.state.basicInfo.author.name}</Text></Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row size={1}>
                                <Button
                                    onPress={async () => {
                                        YoutubeDownloadManager.getInstance().getVideoInfo(this.state.basicInfo.video_url, {}, (info) => {
                                            //console.log(this.state.filteredInfo)
                                            this.setState({ filteredInfo: info, songTitle: this.state.basicInfo.title }, () => {
                                                //console.log(info)
                                                this.onOpen()
                                            })
                                        })
                                    }}
                                >
                                    <Text>Choose Download Format</Text>
                                </Button>
                            </Row>
                        </Grid>
                    </CardItem>

                </Card>
            )
        }

    }
    renderScreenLock() {
        if (this.state.alwaysOpen > 0) {
            return (<Portal><View style={{ backgroundColor: 'rgba(0,0,0,.1)', height: height, width: width, zIndex: 1000, position: "absolute" }}></View></Portal>)
        } else {
            return (<Portal><View style={{ height: 0, width: 0, zIndex: 1000, position: "absolute" }}></View></Portal>)
        }
    }

    render() {
        return (

            <Content style={[getStyle(COLOR.BG, true, true)]} >

                <View>

                    <Form>
                        <Item rounded
                        >
                            <Button
                                rounded
                                style={[{ height: 50, aspectRatio: 1, justifyContent: 'center', }, getStyle(COLOR.GRAY3, true, true)]}
                                onPress={() => { this.setState({ texturl: '' }) }}
                            >
                                <Icon type='Entypo' name='cross' color={getStyle(COLOR.GRAY6, false, true).color} size={24}></Icon>
                            </Button>
                            <Button
                                rounded
                                style={[{ height: 50, aspectRatio: 1, justifyContent: 'center', marginRight: 10 }, getStyle(COLOR.GRAY3, true, true)]}
                                onPress={() => { this.setState({ texturl: 'https://www.youtube.com/' }) }}
                            >
                                <Icon type='AntDesign' name='home' color={getStyle(COLOR.GRAY6, false, true).color} size={24}></Icon>
                            </Button>
                            <Label style={[getStyle(COLOR.GRAY, false, true)]}>Url:</Label>
                            <Input
                                style={[getStyle(COLOR.ITEM, false, true)]}
                                value={this.state.texturl} onChangeText={(val) => { this.setState({ texturl: val }) }} />
                            <Button
                                rounded
                                style={[{ height: 50, aspectRatio: 1, justifyContent: 'center' }, getStyle(COLOR.BLUE, true, true)]}
                                onPress={() => { this.setState({ url: this.state.texturl }) }}
                            >
                                <Icon type='AntDesign' name='arrowright' color={'white'} size={24}></Icon>
                            </Button>
                        </Item>
                    </Form>
                </View>
                <View
                    style={{ width: width, height: height * 0.3, borderBottomWidth: 1, borderColor: getStyle(COLOR.GRAY6, false, true).color }}
                >
                    <CustomWebView
                        url={this.state.url}
                        updateUrl={(newurl) => { this.setState({ url: newurl, texturl: newurl }) }}
                    />

                </View>
                <View style={{ justifyContent: 'center', marginVertical: 30, marginHorizontal: 5 }}>
                    <Divider />
                    <Button
                        rounded
                        style={{ zIndex: 10, position: 'absolute' }}
                        onPress={() => {
                            YoutubeDownloadManager.getInstance().getVideoBasicInfo(this.state.url, {}, (err, info) => {
                                if (err != null) {
                                    Alert.alert(
                                        "Error",
                                        "Do ensure the url is a valid youtube video",
                                        [{ text: 'Ok', onPress: () => { } }],
                                        { cancelable: false }
                                    )
                                }
                                //console.log(info.player_response.videoDetails.thumbnail)
                                this.setState({ basicInfo: info })
                            })
                        }}
                    >
                        <Text>Retrieve from Url</Text>
                    </Button>
                </View>
                <View
                    style={{ width: width, height: height * 0.3, padding: 5, paddingTop: 0 }}
                >
                    {this.renderCard()}
                </View>
                <Portal>
                    <Modalize
                        ref={(c) => { this.modal = c }}
                        modalHeight={height * 0.8}
                        modalStyle={[getStyle(COLOR.BG, true, true), { paddingTop: 20 }]}
                        alwaysOpen={this.state.lockModal}
                    >
                        {this.renderScreenLock()}
                        {this.renderDownloadForm()}
                        {this.renderProgressBar()}
                        {this.renderDownloadableItem(this.state.filteredInfo)
                        }
                    </Modalize>
                </Portal>
            </Content>
        )
    }

    renderProgressBar() {
        if (this.state.showProgressBar) {
            return (
                <View style={{ padding: 10, alignContent: 'center', alignItems: 'center' }}>
                    <Progress.Bar progress={this.state.progress} width={width * 0.9} />
                </View>
            )
        } else {
            return (
                <View style={{ padding: 10 }}>
                    <View style={{ height: 6 }}></View>
                </View>

            )

        }
    }
    renderDownloadForm() {
        return (
            <Card style={[{ borderRadius: 20, }, getStyle(COLOR.SHADOW, true, true)]}>
                <CardItem style={[{ borderRadius: 20 }, getStyle(COLOR.GRAY6, true, true)]}>
                    <Grid>
                        <Row>
                            <Col>
                                <Form>
                                    <Item>
                                        <Label>Saved name</Label>
                                        <Input value={this.state.songTitle} onChangeText={(val) => {
                                            this.setState({ songTitle: val })
                                        }} />
                                    </Item>
                                    <Item>
                                        <Label>Artist</Label>
                                        <Input value={this.state.Artist} onChangeText={(val) => {
                                            this.setState({ Artist: val })
                                        }} />
                                    </Item>
                                </Form>
                            </Col>
                        </Row>
                    </Grid>
                </CardItem>
            </Card>
        )
    }
    renderDownloadableItem = () => {
        if (this.state.filteredInfo == undefined) {
            return (<View></View>)
        }
        console.log(this.state.filteredInfo)
        var Items = []
        for (var i = 0; i < this.state.filteredInfo.length; i++) {
            Items.push(
                <DownloadableItem item={this.state.filteredInfo[i]} handleDownload={this.handleDownload} />
            )
        }
        return (
            Items
        )
    }
    onOpen() {
        this.modal.open()
    }
    handleDownload = (url) => {
        console.log(url)
        this.setState({ alwaysOpen: height * 0.8 }, () => { console.log(this.state) })
        var songid = uuid.v4()
        FileManager.getInstance().downloadFile(url, songid + '.mp3',
            (obj) => {
                this.setState({ showProgressBar: false, progress: 0, alwaysOpen: 0 }, () => {
                    LibrariesManager.getInstance().addSongToLibrary({
                        id: songid,
                        url: encodeURI(RNFS.DocumentDirectoryPath + "/songs/" + songid + '.mp3'),
                        title: this.state.songTitle == "" ? undefined : this.state.songTitle,
                        artist: this.state.Artist == "" ? undefined : this.state.Artist,
                        duration: Math.floor(parseInt(this.state.basicInfo.player_response.videoDetails.lengthSeconds))
                    }, 'all')

                    Alert.alert(
                        'Download complete',
                        '',
                        [{
                            text: 'ok', onPress: () => {
                                this.modal.close()

                            }
                        }],
                        { cancelable: false }
                    )
                })
            },//result callback
            (obj) => {
                this.setState({ showProgressBar: true, progress: 0 }, () => { alert("Background download is not supported, do not exit the app while download") })

            },//begin callback
            (obj) => {
                this.setState({ progress: obj.bytesWritten / obj.contentLength })
            },//progress callback
            (obj) => {
                this.setState({ showProgressBar: false, progress: 0, alwaysOpen: 0 }, () => {
                    Alert.alert(
                        'An error has occured',
                        obj.toString(),
                        [{
                            text: 'ok', onPress: () => {
                                this.modal.close()

                            }
                        }],
                        { cancelable: false }
                    )
                })
            }
        )
    }
}
class DownloadableItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            item: props.item
        }
    }
    render() {
        return (
            <Card style={[{ borderRadius: 20, }, getStyle(COLOR.SHADOW, true, true)]}>
                <CardItem style={[{ borderRadius: 20 }, getStyle(COLOR.GRAY6, true, true)]}>
                    <Grid>
                        <Row>
                            <Col size={2}>
                                <Row size={1}>
                                    <Col><Text style={[getStyle(COLOR.GRAY, false, true)]}>bit rate (kbps):</Text></Col>
                                    <Col><Text style={[getStyle(COLOR.ITEM, false, true)]}>{this.state.item.audioBitrate}</Text></Col>
                                </Row>
                                <Row size={1}>
                                    <Col><Text style={[getStyle(COLOR.GRAY, false, true)]}>#channels:</Text></Col>
                                    <Col><Text style={[getStyle(COLOR.ITEM, false, true)]}>{this.state.item.audioChannels}</Text></Col>
                                </Row>
                                <Row size={1}>
                                    <Col><Text style={[getStyle(COLOR.GRAY, false, true)]}>quality:</Text></Col>
                                    <Col><Text style={[getStyle(COLOR.ITEM, false, true)]}>{this.state.item.audioQuality}</Text></Col>
                                </Row>
                                <Row size={1}>
                                    <Col><Text style={[getStyle(COLOR.GRAY, false, true)]}>format:</Text></Col>
                                    <Col><Text style={[getStyle(COLOR.ITEM, false, true)]}>.mp3</Text></Col>
                                </Row>
                            </Col>
                            <Col size={1}>
                                <Button
                                    onPress={() => {
                                        this.props.handleDownload(this.state.item.url)
                                    }}
                                >
                                    <Text>Download</Text>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </CardItem>
            </Card>
        )
    }

}
class HttpDownloader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            url: 'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3',
            texturl: 'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3',
            basicInfo: undefined,
            filteredInfo: undefined,
            songTitle: '',
            Artist: '',
            //scrollViewHeight: 100,
            lockModal: 0,
            showProgressBar: false,
            progress: 0
        }
    }
    renderCard = () => {
        return (
            <Card style={[{ borderRadius: 20, height: '100%' }, getStyle(COLOR.SHADOW, true, true)]}>
                <CardItem style={[{ borderRadius: 20, height:'100%'}, getStyle(COLOR.GRAY6, true, true)]}>
                    <Grid>
                        <Row>
                            <Col style={{ padding: 10 }}>
                                <Text>
                                    <Text style={{ fontWeight: 'bold' }}>Warning:</Text>
                                    <Text>This feature allows user to download file via http link, yet this feature is not guarentee work. To ensure the feature is possibly working, do ensure the link is work and ensure the file is .mp3</Text>
                                </Text>
                            </Col>
                        </Row>
                    </Grid>
                </CardItem>
            </Card>
        )

    }
    renderScreenLock() {
        if (this.state.alwaysOpen > 0) {
            return (<Portal><View style={{ backgroundColor: 'rgba(0,0,0,.1)', height: height, width: width, zIndex: 1000, position: "absolute" }}></View></Portal>)
        } else {
            return (<Portal><View style={{ height: 0, width: 0, zIndex: 1000, position: "absolute" }}></View></Portal>)
        }
    }

    render() {
        return (

            <Content style={[getStyle(COLOR.BG, true, true)]} >

                <View>

                    <Form>
                        <Item rounded
                        >
                            <Button
                                rounded
                                style={[{ height: 50, aspectRatio: 1, justifyContent: 'center', }, getStyle(COLOR.GRAY3, true, true)]}
                                onPress={() => { this.setState({ texturl: '' }) }}
                            >
                                <Icon type='Entypo' name='cross' color={getStyle(COLOR.GRAY6, false, true).color} size={24}></Icon>
                            </Button>
                            <Button
                                rounded
                                style={[{ height: 50, aspectRatio: 1, justifyContent: 'center', marginRight: 10 }, getStyle(COLOR.GRAY3, true, true)]}
                                onPress={() => { this.setState({ texturl: 'https://www.youtube.com/' }) }}
                            >
                                <Icon type='AntDesign' name='home' color={getStyle(COLOR.GRAY6, false, true).color} size={24}></Icon>
                            </Button>
                            <Label style={[getStyle(COLOR.GRAY, false, true)]}>Url:</Label>
                            <Input
                                style={[getStyle(COLOR.ITEM, false, true)]}
                                value={this.state.texturl} onChangeText={(val) => { this.setState({ texturl: val }) }} />
                            <Button
                                rounded
                                style={[{ height: 50, aspectRatio: 1, justifyContent: 'center' }, getStyle(COLOR.BLUE, true, true)]}
                                onPress={() => { this.setState({ url: this.state.texturl }) }}
                            >
                                <Icon type='AntDesign' name='arrowright' color={'white'} size={24}></Icon>
                            </Button>
                        </Item>
                    </Form>
                </View>
                <View
                    style={{ width: width, height: height * 0.3, borderBottomWidth: 1, borderColor: getStyle(COLOR.GRAY6, false, true).color }}
                >
                    <CustomWebView
                        url={this.state.url}
                        updateUrl={(newurl) => { this.setState({ url: newurl, texturl: newurl }) }}
                        locked={false}
                    />

                </View>
                <View style={{ justifyContent: 'center', marginVertical: 30, marginHorizontal: 5 }}>
                    <Divider />
                    <Button
                        rounded
                        style={{ zIndex: 10, position: 'absolute' }}
                        onPress={() => {
                           this.onOpen()
                        }}
                    >
                        <Text>Proceed to download</Text>
                    </Button>
                </View>
                <View
                    style={{ width: width, height: height * 0.2, padding: 5, paddingTop: 0 }}
                >
                    {this.renderCard()}
                </View>
                <Portal>
                    <Modalize
                        ref={(c) => { this.modal = c }}
                        modalHeight={height * 0.8}
                        modalStyle={[getStyle(COLOR.BG, true, true), { paddingTop: 20 }]}
                        alwaysOpen={this.state.lockModal}
                    >
                        {this.renderScreenLock()}
                        {this.renderDownloadForm()}
                        {this.renderProgressBar()}
                        <Button rounded
                            onPress={()=>{
                                this.handleDownload(this.state.url)
                            }}
                        >
                            <Text>Confirm Download</Text>
                        </Button>
                    </Modalize>
                </Portal>
            </Content>
        )
    }

    renderProgressBar() {
        if (this.state.showProgressBar) {
            return (
                <View style={{ padding: 10, alignContent: 'center', alignItems: 'center' }}>
                    <Progress.Bar progress={this.state.progress} width={width * 0.9} />
                </View>
            )
        } else {
            return (
                <View style={{ padding: 10 }}>
                    <View style={{ height: 6 }}></View>
                </View>

            )

        }
    }
    renderDownloadForm() {
        return (
            <Card style={[{ borderRadius: 20, }, getStyle(COLOR.SHADOW, true, true)]}>
                <CardItem style={[{ borderRadius: 20 }, getStyle(COLOR.GRAY6, true, true)]}>
                    <Grid>
                        <Row>
                            <Col>
                                <Form>
                                    <Item>
                                        <Label>Saved name</Label>
                                        <Input value={this.state.songTitle} onChangeText={(val) => {
                                            this.setState({ songTitle: val })
                                        }} />
                                    </Item>
                                    <Item>
                                        <Label>Artist</Label>
                                        <Input value={this.state.Artist} onChangeText={(val) => {
                                            this.setState({ Artist: val })
                                        }} />
                                    </Item>
                                </Form>
                            </Col>
                        </Row>
                    </Grid>
                </CardItem>
            </Card>
        )
    }
    renderDownloadableItem = () => {
        if (this.state.filteredInfo == undefined) {
            return (<View></View>)
        }
        console.log(this.state.filteredInfo)
        var Items = []
        for (var i = 0; i < this.state.filteredInfo.length; i++) {
            Items.push(
                <DownloadableItem item={this.state.filteredInfo[i]} handleDownload={this.handleDownload} />
            )
        }
        return (
            Items
        )
    }
    onOpen() {
        this.modal.open()
    }
    handleDownload = (url) => {
        console.log(url)
        this.setState({ alwaysOpen: height * 0.8 }, () => { console.log(this.state) })
        var songid = uuid.v4()
        FileManager.getInstance().downloadFile(url, songid + '.mp3',
            (obj) => {
                this.setState({ showProgressBar: false, progress: 0, alwaysOpen: 0 }, () => {
                    LibrariesManager.getInstance().addSongToLibrary({
                        id: songid,
                        url: encodeURI(RNFS.DocumentDirectoryPath + "/songs/" + songid + '.mp3'),
                        title: this.state.songTitle == "" ? undefined : this.state.songTitle,
                        artist: this.state.Artist == "" ? undefined : this.state.Artist,
                    }, 'all')

                    Alert.alert(
                        'Download complete',
                        '',
                        [{
                            text: 'ok', onPress: () => {
                                this.modal.close()

                            }
                        }],
                        { cancelable: false }
                    )
                })
            },//result callback
            (obj) => {
                this.setState({ showProgressBar: true, progress: 0 }, () => { alert("Background download is not supported, do not exit the app while download") })

            },//begin callback
            (obj) => {
                this.setState({ progress: obj.bytesWritten / obj.contentLength })
            },//progress callback
            (obj) => {
                this.setState({ showProgressBar: false, progress: 0, alwaysOpen: 0 }, () => {
                    Alert.alert(
                        'An error has occured',
                        obj.toString(),
                        [{
                            text: 'ok', onPress: () => {
                                this.modal.close()

                            }
                        }],
                        { cancelable: false }
                    )
                })
            }
        )
    }

}

class CustomWebView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            url: props.url,
            locked: props.locked != undefined ? props.locked : true
        }
    }
    static getDerivedStateFromProps(props, state) {
        return { url: props.url }
    }
    render() {
        console.log(this.state)
        if (this.state.locked) {
            return (
                <WebView
                    style={this.props.style}
                    source={{ uri: this.state.url }}
                    useWebKit={true}
                    originWhitelist={['*']}
                    allowsInlineMediaPlayback={true}

                    onShouldStartLoadWithRequest={(request) => {

                        return request.url.startsWith('https://www.youtube.com/') || request.url.startsWith('https://m.youtube.com/')
                    }}
                    onNavigationStateChange={(navstate) => {

                        if (!navstate.url.endsWith('searching')) {
                            this.props.updateUrl(navstate.url)
                        }

                    }}
                />
            )
        } else {
            return (
                <WebView
                    style={this.props.style}
                    source={{ uri: this.state.url }}
                    useWebKit={true}
                    originWhitelist={['*']}
                    allowsInlineMediaPlayback={true}
                    onNavigationStateChange={(navstate) => {

                        this.props.updateUrl(navstate.url)
                    }}
                />
            )
        }

    }
}