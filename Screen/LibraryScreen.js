
import React, { useRef } from 'react';
import { Container, Header, Content, Card, Button, CardItem, Left, Right, Body, Title, Text, Grid, Row, Col, Form, Input, Item, Label, Tab, Tabs, TabHeading, ScrollableTab } from 'native-base';
import { Icon } from '../Manager/IconManager'
import { ScrollView, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import COLOR, { getTheme, getStyle } from '../StyleSheets/Theme'
//import PreferenceManager from '../Manager/PreferenceManager'
import { Dimensions, View, Image } from 'react-native'
import { Divider, FAB } from 'react-native-paper'
import uuid from 'react-native-uuid'

import DraggableFlatList from 'react-native-draggable-dynamic-flatlist'

const RNFS = require('react-native-fs')

import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize'
import FileManager from '../Manager/FileManager'
import LibrariesManager from '../Manager/LibrariesManager';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class LibraryScren extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            rand: uuid.v4()
        }
    }
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
                    <Body><Title style={[getStyle(COLOR.ITEM, true, true)]}>Library</Title></Body>
                    <Right></Right>
                </Header>
                <Tabs
                    onChangeTab={() => {
                        console.log('tabchanigng')
                        this.setState({ rand: uuid.v4() })
                    }}
                    renderTabBar={() => <ScrollableTab style={getStyle(COLOR.GRAY6, true, true)}></ScrollableTab>}>
                    <Tab heading={<TabHeading style={getStyle(COLOR.GRAY6, true, true)}><Icon type="MaterialCommunityIcons" name="library-music" color={getStyle(COLOR.GRAY3, false, true).color} size={24} style={{ color: getStyle(COLOR.GRAY3, false, true).color, fontSize: 24 }} /><Text>Library</Text></TabHeading>} tabStyle={getStyle(COLOR.GRAY6, true, true)}>
                        <LibraryTab />
                    </Tab>
                    <Tab heading={<TabHeading style={getStyle(COLOR.GRAY6, true, true)}><Icon type="Octicons" name="file-submodule" color={getStyle(COLOR.GRAY3, false, true).color} size={24} style={{ color: getStyle(COLOR.GRAY3, false, true).color, fontSize: 24 }} /><Text>File System</Text></TabHeading>} tabStyle={getStyle(COLOR.GRAY6, true, true)}>
                        <FileSystemTab key={this.state.rand} rand={this.state.rand} />
                    </Tab>
                </Tabs>
            </Container >
        )
    }
}

class LibraryTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showingLibraryList: ''
        }
    }
    handleGoinginLibrary = (name) => {
        this.setState({ showingLibraryList: name })
    }

    showing() {
        console.log('showing')
        if (this.state.showingLibraryList == "") {
            return (<LibraryList handleNav={this.handleGoinginLibrary}></LibraryList>)
        } else {
            return (<SongList libraryname={this.state.showingLibraryList} handleNav={this.handleGoinginLibrary} currentLibrary={this.state.showingLibraryList} />)
        }
    }
    render() {
        return (
            <Content style={{ flex: 1 }}>
                {this.showing()}
            </Content>
        )
    }
}
//choose library with a FAB depends on FAB, know how it is gonna make
class LibraryList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: false,
            libraries: [],
            handlingLibrary: '',
            edittedLibraryName: '',
            showDeleteButton: true
        }
    }
    componentDidMount() {
        this.setState({ libraries: Object.keys(LibrariesManager.getInstance().getLibrariesObject()) })
    }
    handleedit = (name) => {
        this.setState({ handlingLibrary: name, edittedLibraryName: name })
        this.modal.open()
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignContent: 'space-between' }}>
                    <Button
                        transparent style={{ flex: 1, justifyContent: 'center' }}
                        onPress={() => { this.setState({ edit: !this.state.edit }) }}
                    >
                        <Text>{this.state.edit ? 'Done' : 'Edit'}</Text>
                    </Button>

                    <Button
                        transparent
                        style={{ flex: 3, justifyContent: 'center' }}
                        onPress={() => { this.setState({ showDeleteButton: false }, () => { this.modal.open() }) }}
                    >
                        <Text>Add New</Text>
                    </Button>

                    <Button
                        danger
                        transparent style={{ flex: 1, justifyContent: 'center' }}
                        onPress={() => {
                            Alert.alert(
                                'confirm',
                                'this will delete all songs and library back to default',
                                [
                                    {
                                        text: 'Reset', onPress: async () => {
                                            await FileManager.getInstance().resetAppSongDirectory()
                                            await LibrariesManager.getInstance().resetLibraries()
                                            this.setState({ libraries: Object.keys(LibrariesManager.getInstance().getLibrariesObject()) }, () => { console.log(this.state) })
                                        }
                                    },
                                    { text: 'Cancel', onPress: () => { } }
                                ],
                                { cancelable: false }
                            )
                        }}
                    >
                        <Text>reset</Text>
                    </Button>
                </View>
                <Divider />
                <FlatList
                    contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'flex-start' }}
                    data={this.state.libraries}
                    renderItem={({ item }) => { return <LibraryListItem item={item} handleNav={this.props.handleNav} edit={this.state.edit} handleedit={this.handleedit} /> }}
                    keyExtractor={(i, ind) => { return ind }}
                    extraData={this.state.edit}
                >
                </FlatList>
                <Portal>
                    <Modalize
                        ref={(c) => { this.modal = c }}
                        modalHeight={height * 0.4}
                        modalStyle={[getStyle(COLOR.BG, true, true), { paddingTop: 20 }]}
                        onClosed={() => { this.setState({ handlingLibrary: '', edittedLibraryName: '', showDeleteButton: true, libraries: Object.keys(LibrariesManager.getInstance().getLibrariesObject()) }) }}
                        useNativeDriver={true}
                    >
                        <Grid>
                            <Row>
                                <Col>
                                    {this.state.showDeleteButton ?
                                        <Button
                                            transparent
                                            onPress={async () => {
                                                await LibrariesManager.getInstance().deleteLibrary(this.state.handlingLibrary)
                                                this.modal.close()
                                            }}
                                        >
                                            <Text style={[getStyle(COLOR.RED, false, true)]}>Delete</Text>
                                        </Button> : <View></View>}
                                </Col>
                                <Col></Col>
                                <Col>
                                    <Button
                                        transparent
                                        onPress={async () => {

                                            var copy = await LibrariesManager.getInstance().getLibrariesObject()
                                            if (this.state.showDeleteButton) {
                                                console.log(copy)
                                                copy[this.state.edittedLibraryName] = JSON.parse(JSON.stringify(copy[this.state.handlingLibrary]))
                                                delete copy[this.state.handlingLibrary]
                                                console.log(copy)
                                            } else {
                                                copy[this.state.edittedLibraryName] = []
                                            }
                                            await LibrariesManager.getInstance().setLibraries(copy)
                                            this.modal.close()
                                        }}
                                    >
                                        <Text style={[getStyle(COLOR.BLUE, false, true)]}>Save & Quit</Text>
                                    </Button>
                                </Col>
                            </Row>
                            <Divider />
                            <Row>
                                <Col>
                                    <Form>
                                        <Item floatingLabel>
                                            <Label>Library Name:</Label>
                                            <Input value={this.state.edittedLibraryName} onChangeText={(val) => { this.setState({ edittedLibraryName: val }) }} />
                                        </Item>
                                    </Form>
                                </Col>
                            </Row>
                        </Grid>
                    </Modalize>
                </Portal>
            </View >
        )
    }
}
class LibraryListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: props.item,
            edit: props.edit
        }
    }
    static getDerivedStateFromProps(props, state) {
        return { edit: props.edit }
    }
    render() {
        if (this.state.name == 'all')
            return (
                <Button
                    transparent
                    style={[getStyle(COLOR.SHADOW,true,true),getStyle(COLOR.GRAY6, true,true), { aspectRatio: 1, margin: width * 0.12 / 8, borderWidth: 1, borderColor: getStyle(COLOR.GRAY6, false, true).color, borderRadius: 15, height: width * 0.22, justifyContent: 'center' }]}
                    onPress={() => {

                        this.props.handleNav(this.state.name)
                    }}
                >
                    <Text>{this.state.name}</Text>
                </Button>
            )
        else {
            return (
                <Button
                    danger={this.state.edit}
                    transparent={!this.state.edit}
                    style={[getStyle(COLOR.SHADOW,true,true),{backgroundColor:this.state.edit==true?undefined:getStyle(COLOR.GRAY6,true,true).backgroundColor}, { aspectRatio: 1, margin: width * 0.12 / 8, borderWidth: 1, borderColor: getStyle(COLOR.GRAY6, false, true).color, borderRadius: 15, height: width * 0.22, justifyContent: 'center' }]}
                    onPress={() => {
                        if (!this.state.edit)
                            this.props.handleNav(this.state.name)
                        else {
                            this.props.handleedit(this.state.name)
                        }
                    }}
                >
                    <Text>{this.state.name}</Text>
                </Button>
            )
        }
    }
}
class SongList extends React.Component {
    //libraryname={this.state.showingLibraryList} handleNav={this.handleGoinginLibrary}
    constructor(props) {
        super(props)
        this.state = {
            songs: [],
            songsFromAll: [],
            libraryName: props.currentLibrary,
            handleNav: props.handleNav,
        }
    }
    async componentDidMount() {
        this.refresh()
    }
    refresh = async () => {
        const wholeLib = await LibrariesManager.getInstance().getLibrariesObject()
        //console.log(wholeLib)
        //console.log(wholeLib[this.state.libraryName])
        this.setState({
            songsFromAll: wholeLib['all'].map(e => e).filter(e => {
                for (var i = 0; i < wholeLib[this.state.libraryName].length; i++) {
                    if (e.id == wholeLib[this.state.libraryName][i].id) {
                        return false
                    }
                }
                return true
            })
        }, () => {
            //console.log("===========")
            //console.log(this.state.songsFromAll)
        })
        this.setState({ songs: wholeLib[this.state.libraryName].map(e => { return e }) })
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{alignItems:'center', justifyContent:'center', alignContent:'center', height:50}}>
                    <Title>{this.state.libraryName}</Title>
                </View>
                <Divider />
                <View style={{ flex: 1, flexDirection: 'row', alignContent: 'space-between' }}>
                    <Button
                        transparent style={{ flex: 1, justifyContent: 'center' }}
                        onPress={() => { this.props.handleNav('') }}
                    >
                        <Text>back</Text>
                    </Button>
                    <Button
                        transparent style={{ flex: 1, justifyContent: 'center' }}
                        onPress={() => { this.setState({ edit: !this.state.edit }) }}
                    >
                        <Text>{this.state.edit ? 'Done' : 'Edit'}</Text>
                    </Button>
                    <Button
                        disabled={this.state.libraryName == 'all'}
                        transparent
                        style={{ flex: 1, justifyContent: 'center' }}
                        onPress={() => {
                            this.modal.open()
                        }}
                    >
                        <Text>Add Songs</Text>
                    </Button>
                </View>
                <Divider />
                <DraggableFlatList
                    useNativeDriver={true}
                    data={this.state.songs}
                    renderItem={({ item, index, move, moveEnd, isActive }) => {
                        return <SongListItem edit={this.state.edit} item={item} index={index} move={move} moveEnd={moveEnd} isActive={isActive} deleteItem={async (item) => {
                            await LibrariesManager.getInstance().deleteSongFromLibrary(item, this.state.libraryName)
                            this.refresh()
                        }} />
                    }}
                    onMoveEnd={({data, to, from, row})=>{
                        this.setState({songs:data},async()=>{
                            var wholeLib = await LibrariesManager.getInstance().getLibrariesObject()
                            wholeLib[this.state.libraryName]=JSON.parse(JSON.stringify(data))
                            await LibrariesManager.getInstance().setLibraries(wholeLib)
                            this.refresh()
                        })
                    }}
                    extraData={this.state}
                >
                </DraggableFlatList>
                <Portal>
                    <Modalize
                        ref={(c) => { this.modal = c }}
                        modalHeight={height * 0.8}
                        modalStyle={[getStyle(COLOR.BG, true, true), { paddingTop: 20 }]}
                        flatListProps={{
                            data: this.state.songsFromAll,
                            renderItem: ({ item, index }) => {
                                return (
                                    <SelectionListItem item={item} index={index} songlist={this.state.libraryName} handleAddEvent={() => {
                                        this.modal.close()
                                        this.refresh()
                                    }} />)
                            },
                            keyExtractor: item => item.id,
                            extraData: this.state
                        }}

                    >
                    </Modalize>
                </Portal>
            </View >
        )
    }
}
class SongListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: props.edit
        }
    }
    static getDerivedStateFromProps(props, state) {
        return { edit: props.edit }
    }
    render() {
        const { item, index, move, moveEnd, isActive } = this.props
        return (
            <TouchableOpacity
                onLongPress={move}
                onPressOut={moveEnd}>
                <Grid style={[getStyle(COLOR.GRAY6, true, true), getStyle(COLOR.SHADOW, true, true), { margin: 10 }]}>
                    <Row style={{ height: 70, paddingVertical: 10 }}>
                        <Col size={1} style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <RenderDeleteOrNumber deletefnc={this.props.deleteItem} item={item} edit={this.state.edit} index={index} />
                        </Col>
                        <Col size={3} style={{ padding: 5, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: getStyle(COLOR.GRAY5, false, true).color, borderRightWidth: 1 }}>
                            <Title style={getStyle(COLOR.ITEM, true, true)}>{item.title}</Title>
                        </Col>
                        <Col size={2}>
                            <Row>
                                <Col style={{ padding: 5, justifyContent: "center", alignItems: 'center' }}>
                                    <Text style={getStyle(COLOR.ITEM, true, true)}>{item.artist}</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Grid>
            </TouchableOpacity>
        )
    }
}

class SelectionListItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: props.edit

        }
    }
    static getDerivedStateFromProps(props, state) {
        return { edit: props.edit }
    }
    render() {
        const { item, songlist } = this.props
        return (

            <Grid style={[getStyle(COLOR.GRAY6, true, true), getStyle(COLOR.SHADOW, true, true), { margin: 10 }]}>
                <Row style={{ height: 70, paddingVertical: 10 }}>
                    <Col size={1} style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            small
                            transparent
                            onPress={async () => {
                                await LibrariesManager.getInstance().addSongToLibrary(item, songlist)
                                this.props.handleAddEvent()
                            }}
                        >
                            <Text>Add</Text>
                        </Button>
                    </Col>
                    <Col size={3} style={{ padding: 5, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: getStyle(COLOR.GRAY5, false, true).color, borderRightWidth: 1 }}>
                        <Title style={getStyle(COLOR.ITEM, true, true)}>{item.title}</Title>
                    </Col>
                    <Col size={2}>
                        <Row>
                            <Col style={{ padding: 5, justifyContent: "center", alignItems: 'center' }}>
                                <Text style={getStyle(COLOR.ITEM, true, true)}>{item.artist}</Text>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Grid>

        )
    }
}

class RenderDeleteOrNumber extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: props.edit,
            index: props.index,
        }
    }
    static getDerivedStateFromProps(props, state) {
        return { edit: props.edit, index: props.index, }
    }
    render() {
        if (this.state.edit) {
            return (
                <Button
                    rounded
                    small
                    style={[getStyle(COLOR.RED, true, true),]}
                    onPress={() => {
                        this.props.deletefnc(this.props.item)
                    }}
                >
                    <Text>-</Text>
                </Button>
            )
        } else {
            return (
                <Title style={getStyle(COLOR.ITEM, true, true)}>{(this.props.index + 1) + "."}</Title>
            )
        }
    }
}

// file system, view only
class FileSystemTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            rand: ''
        }
    }
    static getDerivedStateFromProps(props, state) {
        console.log('triggering')
        
        RNFS.readDir(RNFS.DocumentDirectoryPath + '/songs')
            .then((result) => {
                console.log(result)
                return { rand: props.rand, data: result }
            })

    }
    componentDidMount() {
        this.refresh()
    }
    refresh = () => {
        RNFS.readDir(RNFS.DocumentDirectoryPath + '/songs')
            .then((result) => {
                //console.log(result)
                this.setState({ data: result })
            })
    }

    render() {
        //console.log(this.state.data)
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    style={{ flex: 1 }}
                    data={this.state.data}
                    renderItem={({ item }) => {
                        const dname=LibrariesManager.getInstance().getLibrariesObject()['all'].filter(e=>{
                            return e.id===item.path.split(RNFS.DocumentDirectoryPath + "/songs/")[1].split('.')[0]
                        })[0].title
                        if(dname==undefined){
                            this.refresh()
                        }
                        return (
                            <Grid style={[getStyle(COLOR.GRAY6, true, true), getStyle(COLOR.SHADOW, true, true), { margin: 10 }]}>
                                <Row style={{ height: 70, paddingVertical: 10 }}>
                                    <Col size={2} style={{ padding: 5, justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderColor: getStyle(COLOR.GRAY5, false, true).color, borderRightWidth: 1 }}>
                                        <Title style={getStyle(COLOR.ITEM, true, true)}>{dname}</Title>
                                    </Col>
                                </Row>
                            </Grid>
                        )
                    }}
                    keyExtractor={item => item.path}
                    extraData={this.state}
                />

            </View>
        )
    }
}