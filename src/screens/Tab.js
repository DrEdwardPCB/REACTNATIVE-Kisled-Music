import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlayerScreen from './PlayerScreen/PlayerScreen'
import LibraryScreen from './LibraryScreen/LibraryScreen'
import DownloadScreen from './DownloadScreen/DownloadScreen'
import PreferenceScreen from './PreferenceScreen/PreferenceScreen'
import React, { useState, useEffect } from 'react'
import { useSelector, useStore, useDispatch } from 'react-redux'
import COLOR, { getStyle } from '../utils/StyleSheets/Theme'
import Icon from '../utils/IconManager'
import { checkFileAndCreate, ScanDocumentDirectory, retrieveDownload } from '../utils/FileManager'
import { AppState, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native'
import { View } from 'react-native'
import { Spinner, Text } from 'native-base'
import {MAX_HEIGHT, MAX_WIDTH} from '../utils/Constant'
const Tab = createBottomTabNavigator();

function MyTabs() {
    const store = useStore()
    const all = useSelector(state => state.library.all)
    const dispatch = useDispatch()
    const theme = useSelector(state => state.preference.theme)
    //const [styleStatusBar, setStyleStatusBar] = useState(theme=='light'? 'light-content': 'dark-content')
    const [LoadingAudioFile, setloadingAudioFile] = useState(true)
    useEffect(() => {
        checkFileAndCreate().then(() => {
            ScanDocumentDirectory(all, dispatch).then((result) => {
                console.log('done scanning')
                setloadingAudioFile(false)
            })
        })
    }, [])
    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);
        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, [])
    useEffect(() => {
        const unsubscribe = store.subscribe(_handleAppStateChange);
        return () => {
            unsubscribe()
        }
    }, [])
    useEffect(() => {
        StatusBar.setBarStyle(theme == 'light' ? 'dark-content' : 'light-content')
    })
    //when app state change save redux stuff to async storage
    const _handleAppStateChange = () => {
        //console.log('saving')
        console.log(store.getState())
        let storingValue = JSON.stringify(store.getState())
        //console.log(storingValue)
        AsyncStorage.setItem('savedStore', storingValue);
    }
    //handle retrieve download from background download
    /*useEffect(() => {
        retrieveDownload(
            (obj) => {
                console.log('start')
                dispatch({ type: 'ADD_DOWNLOAD', title: title, jobid: obj.jobId, progress: 0 })
                Toast.show({
                    text: 'Download Start',
                    buttonText: 'Okay',
                    duration: 3000,
                    position: "top"
                })
            },//begin
            (obj) => {
                console.log('progress')
                dispatch({ type: 'UPDATE_PROGRESS', jobid: obj.jobId, progress: obj.bytesWritten / obj.contentLength })
            },//progress
            (obj) => {
                console.log('done')
                ScanDocumentDirectory(allSongsArr, dispatch).then(() => {
                    dispatch({ type: 'REMOVE_DOWNLOAD', jobid: obj.jobId })
                    PushNotificationIOS.presentLocalNotification({ alertBody: title + ' download completed', alertTitle: 'Done' });
                })

            },//success
            (err) => {
                console.log('err')
                PushNotificationIOS.presentLocalNotification({ alertBody: title + ' download Failed', alertTitle: 'Fail' }); console.warn(err)
            },//fail)
            Object.keys(store.getState().download.download).map(e=>store.getState().download.download[e]),//array of download list,
            (extra)=>{
                extra.forEach(element => {
                    dispatch({ type: 'REMOVE_DOWNLOAD', jobid: element.jobid })
                });
                
            }
        )
    }, [])*/

    return (
        <View style={{width: MAX_WIDTH, height:MAX_HEIGHT, position: 'relative'}}>
            {LoadingAudioFile?<View style={{width: MAX_WIDTH, height:MAX_HEIGHT, position: 'absolute', backgroundColor: 'rgba(255,255,255,.5)', justifyContent:'center', alignItems:'center', zIndex: 100}}>
                <Spinner color='gray' ></Spinner>
                <Text style={{textAlign:'center', color:'gray'}}>Detect new Audio files, loading them to internal library</Text>
            </View>:<View></View>}
            <NavigationContainer>
                <Tab.Navigator
                    tabBarOptions={{
                        inactiveBackgroundColor: getStyle(COLOR.GRAY6, true, true, theme).backgroundColor,
                        activeBackgroundColor: getStyle(COLOR.GRAY6, true, true, theme).backgroundColor,
                    }}
                >
                    <Tab.Screen
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Icon type="MaterialCommunityIcons" name="disc-player" color={color} size={size} />
                            ),
                        }} name="Player" component={PlayerScreen} />
                    <Tab.Screen
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Icon type="Ionicons" name="ios-library" color={color} size={size} />
                            ),
                            unmountOnBlur: true
                        }}
                        name="Library" component={LibraryScreen} />
                    <Tab.Screen
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Icon type="MaterialCommunityIcons" name="file-download" color={color} size={size} />
                            ),
                            unmountOnBlur: true
                        }}
                        name="Download" component={DownloadScreen} />
                    <Tab.Screen
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Icon type="Ionicons" name="ios-settings" color={color} size={size} />
                            ),
                        }}
                        name="Preference" component={PreferenceScreen} />
                </Tab.Navigator>
            </NavigationContainer>
        </View>
    );
}
export default MyTabs