import React, { useEffect, useState } from 'react'
import 'react-native-gesture-handler';

import { View, Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import MasterReducer from './src/redux/MasterReducer'
import { compareStore } from './src/utils/CompareStore'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import TrackPlayer from 'react-native-track-player';
import MyTabs from './src/screens/Tab'
import {
  AdMobBanner,
  AdMobInterstitial,
} from 'react-native-admob'
import { Host } from 'react-native-portalize'
import { isPro } from './src/utils/Constant'
import { Root } from 'native-base'
import { Provider as PaperProvider } from 'react-native-paper'

const initialStore = createStore(MasterReducer)
export default function App() {
  const [store, setStore] = useState(initialStore)
  const [reduxReady, setReduxReady] = useState(false)
  const [trackReady, setTrackReady] = useState(false)
  const [adsReady, setAdReady] = useState(false)

  //Redux and async storage setup
  useEffect(() => {
    AsyncStorage.getItem('savedStore')
      .then((value) => {
        if (value && value.length) {
          const storedStore = createStore(MasterReducer, JSON.parse(value))
          if (compareStore(storedStore.getState(), store.getState())) {
            setStore(storedStore)
            console.log('using async storage')
          } else {
            setStore(initialStore)
            console.log('using default store')
          }
        } else {
          setStore(initialStore)
          console.log('not comparing')
        }
        setReduxReady(true)
      })
      .catch(() => {
        setStore(initialStore)
        console.log('error in getting async storage using initial')
        setReduxReady(true)
      })
  }, [])

  //push notification setup
  useEffect(() => {
    PushNotificationIOS.checkPermissions(({ alert, badge, sound }) => {
      if (!(alert && badge && sound)) {
        PushNotificationIOS.requestPermissions();
      }
    });

    PushNotificationIOS.addEventListener('register', (token) => {
      console.log('haha token')
      console.log(token)
    });
    PushNotificationIOS.addEventListener('registrationError', (token) => {
      console.log('haha token')
      console.log(token)
    });
    return () => {
      PushNotificationIOS.removeEventListener('register', () => {
        console.log('success remove')
      });
      PushNotificationIOS.removeEventListener('registrationError', () => {
        console.log('success remove')
      });
    }
  }, [])
  /*useEffect(()=>{
    //ls()
    checkFileAndCreate()
    ScanDocumentDirectory(store.getState().library.all,dispatch).then((result)=>{
      console.log('done scanning')
      //ls()
    })
  })*/
  //setup TrackPlayer
  useEffect(() => {
    TrackPlayer.setupPlayer().then(() => {
      // The player is ready to be used
      TrackPlayer.updateOptions({
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          //TrackPlayer.CAPABILITY_STOP
        ],
      }).then(() => {
        setTrackReady(true)
      })
    })
  }, [])

  useEffect(() => {
    if (isPro) {
      setAdReady(true)
    } else {
      if (Math.random() > 0.5) {
        AdMobInterstitial.setAdUnitID('ca-app-pub-8656675425768497/4307319281');
        AdMobInterstitial.requestAd().then(() => {
          setAdReady(true)
          AdMobInterstitial.showAd()
        }).catch(() => {
          setAdReady(true)
        })
      } else {
        setAdReady(true)
      }
    }
  }, [])
  //subscribe to store change


  if (reduxReady && trackReady && adsReady) {
    return (
      <Provider store={store}>
        <Root>
          <PaperProvider>
            <Host>
              <MyTabs />
            </Host>
            {isPro ? <View></View> :
              <AdMobBanner
                adSize="smartBannerPortrait"
                adUnitID="ca-app-pub-8656675425768497/2994237613"
                //testDevices={[AdMobBanner.simulatorId]}
                onAdFailedToLoad={error => console.error(error)}
              />
            }
          </PaperProvider>
        </Root>
      </Provider>

    );
  }
  return (
    <View>
      
    </View>
  );
}