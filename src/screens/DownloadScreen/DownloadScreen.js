import { Container, Header,Button, Content, Title, Text, Card, CardItem, Grid, Col, Row, Left, Right, Body } from 'native-base'
import { useSelector } from 'react-redux'
import COLOR, { getStyle } from '../../utils/StyleSheets/Theme'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, ScrollView, Dimensions } from 'react-native'
import CustomWebView from './Components/CustomWebView'
import { Divider } from 'react-native-paper'
import RetrieveMetaData from './Components/RetrieveMetaData'
import DownloadPreview from './Components/DownloadPreview'
import DownloadCenter from './Components/DownloadCenter'
import Icon from '../../utils/IconManager'
//mport UUIDGenerator from 'react-native-uuid-generator';
import TrackPlayer from 'react-native-track-player'

const width = Dimensions.get('window').width
const DownloadScreen = (props) => {
    const theme = useSelector(state => state.preference.theme)
    const [url, setUrl] = useState('https://www.google.com/')
    const [metaData, setMetaData] = useState({
        isYoutube: false,
        formats: [{
            audioChannels: 'N/A',
            audioQuality: "N/A",
            bitrate: 0,
            url: 'N/A'
        }],
    })
    //const [PreviewUUID, setPreviewUUID] = useState()
    const DownloadPreviewModal = useRef()
    const DownloadCenterModal = useRef()
    useEffect(()=>{
        TrackPlayer.reset()//if not stop the music, app will crash
    },[])
    useEffect(() => {
        console.log(metaData)
        console.log('callbacking')
        //console.log(metaData.formats[0].url)
        //console.log(metaData.formats[0].url === 'N/A')
        if (!(metaData.formats[0].url === 'N/A')) {
            console.log('callback receive')
            DownloadPreviewModal.current.open()
        }
        //setPreviewUUID(Math.random().toFixed(9))

    }, [metaData])


    return (
        <Container>
            <Header style={[getStyle(COLOR.BG, true, true, theme)]}>
                <Left></Left>
                <Body>
                    <Title style={[getStyle(COLOR.ITEM, false, true, theme)]}>
                        Download
                    </Title>
                </Body>
                <Right>
                    <Button transparent onPress={()=>{
                        DownloadCenterModal.current.open()
                    }}>
                        <Icon type="MaterialCommunityIcons" name="progress-download" color={getStyle(COLOR.GRAY3, false, true, theme).color} size={24} style={{ color: getStyle(COLOR.BLUE, false, true, theme).color, fontSize: 24 }} />
                    </Button>
                </Right>
            </Header>
            <View style={[getStyle(COLOR.BG, true, true, theme), { flexGrow: 1 }]}>
                <View style={{ position: 'relative', zIndex: 10, }}>
                    <CustomWebView url={url} setUrl={setUrl} theme={theme} style={[{ margin: 5, position: 'absolute', width: width - 10, height: 60 }]} firstPage='https://www.google.com/' />
                </View>
                <Divider />
                <ScrollView style={[getStyle(COLOR.BG, true, true, theme), { marginTop: 70 }]} >
                    <RetrieveMetaData url={url} theme={theme} passMetaData={setMetaData} />
                    
                </ScrollView>
            </View>
            <DownloadPreview key='haha' ref={DownloadPreviewModal} metaData={metaData} theme={theme} />
            <DownloadCenter ref={DownloadCenterModal} theme={theme} />
        </Container >
    )
}
export default DownloadScreen