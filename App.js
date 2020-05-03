import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, SafeAreaView, Image } from 'react-native'
import PreferenceManager from './Manager/PreferenceManager';
import PlayerManager from './Manager/PlayerManager';
import { Icon } from './Manager/IconManager'
import LibrariesManager from './Manager/LibrariesManager';
import FileManager from './Manager/FileManager'
import COLOR, { getStyle } from './StyleSheets/Theme'
import PlayerScreen from './Screen/PlayerScreen'
import LibraryScreen from './Screen/LibraryScreen'
import PreferenceScreen from './Screen/PreferenceScreen'
import DownloadScreen from './Screen/DownloadScreen'
import { Host } from 'react-native-portalize'

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Player" component={PlayerScreen} options={{ tabBarIcon: ({ focused, color, size }) => { return <Icon type="Fontisto" name="applemusic" color={color} size={size} style={{ color: color, fontSize: size }} /> }, unmountOnBlur: true }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ tabBarIcon: ({ focused, color, size }) => { return <Icon type="MaterialCommunityIcons" name="library-music" color={color} size={size} style={{ color: color, fontSize: size }} /> }, unmountOnBlur: true }} />
      <Tab.Screen name="Downloads" component={DownloadScreen} options={{ tabBarIcon: ({ focused, color, size }) => { return <Icon type="Ionicons" name="ios-download" color={color} size={size} style={{ color: color, fontSize: size }} /> }, unmountOnBlur: true }} />
      {/*<Tab.Screen name="Preference" component={PreferenceScreen} options={{ tabBarIcon: ({ focused, color, size }) => { return <Icon type="Entypo" name="select-arrows" color={color} size={size} style={{ color: color, fontSize: size }} /> }, unmountOnBlur: true }} />*/}
    </Tab.Navigator>
  );
}

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      showSplash: true
    }
    //console.log(this.state)
  }
  componentDidMount() {
    var async1 = new Promise((resolve, reject) => {
      var interval = setInterval(() => {
        var theme = PreferenceManager.getInstance().getPreferenceObject();
        console.log("still not ready")
        if (theme !== null) {
          console.log("ready")
          clearInterval(interval)
          resolve()
        }
      }, 300)
    })
    var async2 = new Promise((resolve, reject) => {
      var interval1 = setInterval(() => {
        var ready = PlayerManager.getInstance().isReady();
        console.log("still not ready")
        if (ready) {
          console.log("ready")
          clearInterval(interval1)
          resolve()
        }
      }, 300)
    })
    var async3 = new Promise((resolve, reject) => {
      var interval3 = setInterval(() => {
        var ready = LibrariesManager.getInstance().isReady();
        console.log("still not ready")
        if (ready) {
          console.log("ready")
          clearInterval(interval3)
          resolve()
        }
      }, 300)
    })
    var async4 = new Promise((resolve, reject) => {
      var interval4 = setInterval(() => {
        var ready = FileManager.getInstance().isReady();
        console.log("still not ready")
        if (ready) {
          console.log("ready")
          clearInterval(interval4)
          resolve()
        }
      }, 300)
    })
    Promise.all([async1, async2, async3, async4]).then(() => this.setState({ showSplash: false }))
  }
  render() {
    if (this.state.showSplash) {
      return (
        <View>
          <SafeAreaView>
            <Image source={require("./assest/Appsplash.png")} resizeMode='contain' style={{ alignContent: 'center', justifyContent: 'center', width: '100%', height: '100%' }}></Image>
          </SafeAreaView>
        </View>
      )
    }
    else {
      return (
        <NavigationContainer>
          <Host>
            <MyTabs />
          </Host>
        </NavigationContainer>
      );
    }

  }
}