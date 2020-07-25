import React, { useState, useEffect, useRef } from 'react'
import { View, FlatList, Alert, Linking, TouchableOpacity, ScrollView } from 'react-native'
import COLOR, { getStyle } from '../../../utils/StyleSheets/Theme'
import { Grid, Col, Row, Spinner, Text, Right, Left, Body, Button } from 'native-base'
import Icon from '../../../utils/IconManager'
import TextTicker from 'react-native-text-ticker'
import { useSelector, useDispatch } from 'react-redux'
import { Portal } from 'react-native-portalize'
import { Modalize } from 'react-native-modalize'
import { DraggableGrid } from 'react-native-draggable-grid'
import AddingLibraryView from './AddingLibraryView'
import SongListModal from './SongListModal'


const RNFS = require('react-native-fs')
const LibraryViewer = (props) => {
    const theme = props.theme
    //const [isLoading, setIsLoading] = useState(true)
    const [libraryList, setLibraryList] = useState([])
    const [edit, setEdit] = useState(false)
    const library = useSelector(state => state.library)
    const dispatch = useDispatch()
    const AddingLibrary= useRef()
    const SongListView = useRef()
    const [dragging, setDragging] = useState(false)
    const [pressedLibrary, setPressedLibrary] = useState('')
    //console.log('************')
    //console.log(fileList)
    useEffect(() => {
        setLibraryList(Object.keys(library).map(e => { return { library: e, key:e } }))
    }, [library])
    useEffect(() => {
        if(pressedLibrary!=''){
            SongListView.current.open()
        }
    },[pressedLibrary])
    return (
        <View style={[getStyle(COLOR.BG, true, true, theme), { flexGrow: 1 },]} scrollEnabled={false}>
            <View style={[getStyle(COLOR.GRAY6, true, true, theme), { height: 50, width: '100%', flexDirection: 'row', alignContent: 'space-between', borderBottomWidth: 1, borderColor: getStyle(COLOR.GRAY3, false, true, theme).color, padding: 5 }]}>
                <View style={{ flex: 1 }}>
                    <Button 
                    transparent 
                    onPress={() => { AddingLibrary.current.open('snapPoint') }}>
                        <Icon type='MaterialIcons' name='playlist-add' size={24} color={getStyle(COLOR.BLUE, false, true, theme).color} />
                    </Button>
                </View >
                <View style={{ flex: 1 }}>
                    {/*}
                    <Button rounded danger style={[{ height: 40, justifyContent:'center' }]} onPress={() => {dispatch({type:'RESET_LIBRARY'})}}>
                        <Text>Reset</Text>
                    </Button>
                    {*/}
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Button rounded danger transparent={!edit} style={{ height: 40, justifyContent: 'center', width: 90 }} onPress={() => { setEdit(!edit) }}>
                        <Text>{edit ? 'Editing' : 'Edit'}</Text>
                    </Button>
                </View>
            </View>
            <ScrollView style={[getStyle(COLOR.BG, true, true, theme), { flexGrow: 1 }]}
                contentInset={{top: 0, left: 0, bottom: 54, right: 0}}
                crollEnabled={!dragging}
            >
                <DraggableGrid
                    disabledDrag={false}
                    numColumns={3}
                    data={libraryList}
                    renderItem={(item) => {
                        return <FlatListItem item={item} theme={theme} edit={edit} setEdit={setEdit} dispatch={dispatch} setPressedLibrary={setPressedLibrary}/>
                    }}
                    onDragRelease={(data)=>{
                        setLibraryList(data)
                        setDragging(false)
                    }}
                    onDragStart={() => setDragging(true)}
                />
            </ScrollView>
            <AddingLibraryView theme={theme} ref={AddingLibrary}/>
            <SongListModal theme={theme} ref={SongListView} library={pressedLibrary} setPressedLibrary={setPressedLibrary}/>
        </View>
    )


}
const FlatListItemTest =(props)=>{
    return (
        <View style={{backgroundColor:'pink'}}>
            <Text>{props.item.library}</Text>
        </View>
    )
}
const FlatListItem = (props) => {
    const theme = props.theme

    return (
        <View key={props.item.key} style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
                onPress={()=>{
                    props.setPressedLibrary(props.item.library)
                }}
                style={[getStyle(COLOR.GRAY5, true, true, theme), getStyle(COLOR.SHADOW, true, true, theme), { margin: 5, height: 80, width: 80, padding: 10, position: 'relative' }]}>
                {props.edit&&props.item.library!='all' ?
                    <TouchableOpacity
                        onPress={() => { 
                            props.setEdit(false)
                            props.dispatch({type:'DELETE_LIBRARY', library:props.item.library})
                        }}
                        style={[getStyle(COLOR.RED, true, true, theme), { width: 20, height: 20, top: -10, right: -10, position: 'absolute', zIndex: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }]}>
                        <Icon type='Entypo' name='cross' size={15} color='white' />
                    </TouchableOpacity> : <View></View>}
                <Grid>
                    <Row>
                        <Col key={props.index * 3.1415926535.toFixed(8)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Icon type='Entypo' name='folder' size={30} color={getStyle(COLOR.GRAY, false, true, theme).color} />
                        </Col>
                    </Row>
                </Grid>
            </TouchableOpacity>
            <Text style={[getStyle(COLOR.GRAY, false, true, theme), { width: '100%', textAlign: 'center', textAlignVertical: 'center', }]}>
                {props.item.library}
            </Text>
        </View>
    )


}
export default LibraryViewer