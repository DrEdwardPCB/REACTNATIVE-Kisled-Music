import { Container, Header, Content, Title, Text, Card, CardItem, Grid, Col, Row, Left, Right, Body, Button, Tab, Tabs, TabHeading } from 'native-base'
import { useSelector, useDispatch, useStore } from 'react-redux'
import COLOR, { getStyle } from '../../utils/StyleSheets/Theme'
import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import Icon from '../../utils/IconManager'
import FolderViewer from './Components/FolderViewer'
import LibraryViewer from './Components/LibraryViewer'
//import AddingLibraryView from './Components/AddingLibraryView'
import TrackPlayer from 'react-native-track-player'
const RNFS = require('react-native-fs')
const LibraryScreen = (props) => {
    const theme = useSelector(state => state.preference.theme)
    const library = useSelector(state => state.library)
    const dispatch = useDispatch()
    const store = useStore()
    const AddingLibrary = useRef()
    useEffect(()=>{
        TrackPlayer.reset()//if not stop the music, app will crash
    },[])
    useEffect(() => {
        console.log(store.getState())
    })
    return (
        <Container>
            <Header style={[getStyle(COLOR.BG, true, true, theme)]} hasTabs>
                <Left></Left>
                <Body>
                    <Title style={[getStyle(COLOR.ITEM, false, true, theme)]}>
                        Library
                    </Title>
                </Body>
                <Right></Right>
            </Header>
            <Tabs locked>
                <Tab heading={<TabHeading style={getStyle(COLOR.BG, true, true,theme)}><Icon type="Ionicons" name="ios-library-outline" color={getStyle(COLOR.GRAY3, false, true, theme).color} size={24} style={{ color: getStyle(COLOR.GRAY3, false, true,theme).color, fontSize: 24 }} /><Text>Library</Text></TabHeading>}>
                   <LibraryViewer theme={theme}/>
                </Tab>
                <Tab heading={<TabHeading style={getStyle(COLOR.BG, true, true,theme)}><Icon type="Entypo" name="folder-music" color={getStyle(COLOR.GRAY3, false, true, theme).color} size={24} style={{ color: getStyle(COLOR.GRAY3, false, true,theme).color, fontSize: 24 }} /><Text>Folder</Text></TabHeading>}>
                    <FolderViewer theme={theme}/>
                </Tab>
            </Tabs>
        </Container>
    )
}
export default LibraryScreen

/**
 * reference code
 *             <Icon type="Entypo" name='folder-music' size={24} color={getStyle(COLOR.GRAY, false, true, theme).color} />
 *            <View style={[getStyle(COLOR.BG, true, true, theme), { flexGrow: 1 }]} scrollEnabled={false}>
                <Button onPress={() => {
                    RNFS.copyFile(RNFS.MainBundlePath + "/《勁咳金曲》晴天林&阿盛 (原曲：古巨基 勁歌金曲) ｜新中國武漢肺炎Medley.mp3", RNFS.DocumentDirectoryPath + '/songs/《勁咳金曲》晴天林&阿盛 (原曲：古巨基 勁歌金曲) ｜新中國武漢肺炎Medley.mp3').then(() => { console.log('done copying') }).catch((error) => { console.warn(error) })
                }}
                ><Text>Copy from bundle to Document</Text></Button>
                <Button onPress={() => { RNFS.readDir(RNFS.DocumentDirectoryPath + "/internal").then((result) => { result.forEach(e => RNFS.unlink(e.path)) }) }}><Text>Clear Internal</Text></Button>
                <Button onPress={() => { dispatch({ type: 'RESET_LIBRARY' }) }}><Text>Clear Reducer</Text></Button>
                <Button onPress={() => { RNFS.readDir(RNFS.DocumentDirectoryPath + "/songs").then((result) => { result.forEach(e => RNFS.unlink(e.path)) }) }}><Text>Clear Document</Text></Button>
                <Text>{JSON.stringify(library)}</Text>
            </View>
 */