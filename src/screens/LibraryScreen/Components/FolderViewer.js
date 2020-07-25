import React, { useState, useEffect } from 'react'
import { View, FlatList, Alert, Linking } from 'react-native'
import COLOR, { getStyle } from '../../../utils/StyleSheets/Theme'
import { Grid, Col, Row, Spinner, Text, Right, Left, Body, Button } from 'native-base'
import Icon from '../../../utils/IconManager'
import TextTicker from 'react-native-text-ticker'
import {useSelector} from 'react-redux'
const RNFS = require('react-native-fs')
const FolderViewer = (props) => {
    const theme = props.theme
    useEffect(() => {
        reloadFile()
    },[])
    const [isLoading, setIsLoading] = useState(true)
    const [fileList, setFileList] = useState([])
    const [edit, setEdit] = useState(false)
    const reloadFile=()=>{
        console.log('reading')
        RNFS.readDir(RNFS.DocumentDirectoryPath + '/songs').then((result) => {
            setFileList(result.map(e => { return { path: e.path } }))
            setIsLoading(false)
        })
    }
    if (isLoading) {
        return (
            <View style={[getStyle(COLOR.BG, true, true, theme), { flexGrow: 1, justifyContent: 'center', alignContent: 'center', alignSelf: 'center' }]} scrollEnabled={false}>
                <Spinner color={getStyle(COLOR.BLUE, false, true, theme).color} />
            </View>
        )
    } else {
        console.log('************')
        console.log(fileList)
        return (
            <View style={[getStyle(COLOR.BG, true, true, theme), { flexGrow: 1 },]} scrollEnabled={false}>
                <View style={[getStyle(COLOR.GRAY6, true, true, theme), { height: 50, width: '100%', flexDirection: 'row', alignContent: 'space-between', borderBottomWidth: 1, borderColor: getStyle(COLOR.GRAY3, false, true, theme).color, padding: 5 }]}>
                    <View style={{ flex: 1 }}>
                        <Button transparent onPress={()=>{reloadFile()}}>
                            <Icon type='Ionicons' name='ios-reload' size={24} color={getStyle(COLOR.BLUE, false, true, theme).color} />
                        </Button>
                    </View >
                    <View style={{ flex: 1 }}>
                        <Button rounded style={[{ height: 40 }]} onPress={() => { Linking.openURL('shareddocuments://' + RNFS.DocumentDirectoryPath + '/songs') }}>
                            <Text>View in Files</Text>
                        </Button>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Button rounded danger transparent={!edit} style={{ height: 40, justifyContent: 'center', width: 90 }} onPress={() => { setEdit(!edit) }}>
                            <Text>{edit ? 'Editing' : 'Edit'}</Text>
                        </Button>
                    </View>
                </View>
                <View style={[getStyle(COLOR.BG, true, true, theme), { flexGrow: 1 }]}>
                    {fileList.length == 0 ?
                        <Text style={[getStyle(COLOR.ITEM, false, true, theme), { alignSelf: 'center', top: '50%' }]}>Currently no songs in Folder</Text>
                        :
                        <FlatList
                            contentContainerStyle={{paddingBottom:100}}
                            data={fileList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (<FlatListItem item={item} index={index} edit={edit} theme={theme} setEdit={setEdit} reloadFile={reloadFile}/>)
                            }}
                            extraData={[edit, theme, isLoading]}
                        />
                    }
                </View>
            </View>
        )
    }

}
const FlatListItem = (props) => {
    //console.log('(((((((((((((((((')
    //console.log(props)
    //console.log(props.item)
    const theme = useSelector(state=>state.preference.theme)
    if (props.edit) {
        return (
            <View style={[getStyle(COLOR.GRAY6, true, true, theme), getStyle(COLOR.SHADOW, true, true, theme), { margin: 5, height: 50, padding:10 }]}>
                <Grid>
                    <Row>
                        <Col size={6} key={props.index * 3.1415926535.toFixed(8)} style={{justifyContent:'center'}}>
                            <TextTicker
                                style={[getStyle(COLOR.ITEM, false, true, theme),{ fontSize: 14 }]}
                                duration={3000}
                                loop
                                bounce
                                repeatSpacer={50}
                                marqueeDelay={1000}
                            >
                                {props.item.path.split('/').slice(-1)[0]}</TextTicker>
                        </Col>
                        <Col size={1}>
                            <Button
                                danger
                                small
                                rounded
                                style={{justifyContent:'center'}}
                                onLayout={e => console.log(e)}
                                onPress={() => {
                                    console.log()
                                    RNFS.unlink(props.item.path).then(() => {
                                        Alert.alert(
                                            "Delete successful",
                                            "Deleted song is still in the internal library, you may still listen to it, if you wish to completely remove the song, delete it from the internal library",
                                            [
                                                { text: "OK", onPress: () => { } }
                                            ],
                                            { cancelable: false }
                                        );
                                    }).catch(() => {
                                        alert('Operation not successful')
                                    }).finally(() => {
                                        props.setEdit(false)
                                        props.reloadFile()
                                    })

                                }}><Text>-</Text></Button>
                        </Col>
                    </Row>
                </Grid>
            </View>
        )
    }
    return (
        <View style={[getStyle(COLOR.GRAY6, true, true, theme), getStyle(COLOR.SHADOW, true, true, theme), { margin: 5, height: 50, padding:10}]}>
            <Grid>
                <Row>
                    <Col key={props.index * 3.1415926535.toFixed(8)} style={{justifyContent:'center'}}>
                        <TextTicker
                            style={[getStyle(COLOR.ITEM, false, true, theme),{ fontSize: 14 }]}
                            duration={3000}
                            loop
                            bounce
                            repeatSpacer={50}
                            marqueeDelay={1000}
                        >{props.item.path.split('/').slice(-1)[0]}</TextTicker>
                    </Col>
                </Row>
            </Grid>
        </View>
    )
}
export default FolderViewer