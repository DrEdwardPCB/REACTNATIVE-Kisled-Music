// service.js
import TrackPlayer from 'react-native-track-player'
import { EventRegister } from 'react-native-event-listeners'
import AsyncStorage from '@react-native-community/async-storage'
module.exports = async function () {
  // This service needs to be registered for the module to work
  // but it will be used later in the "Receiving Events" section
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play()
    EventRegister.emit('client-press')
  })

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause()
    EventRegister.emit('client-press')
  });

  TrackPlayer.addEventListener('remote-next', () => {
    TrackPlayer.skipToNext()
    EventRegister.emit('client-press')
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    TrackPlayer.skipToPrevious()
    EventRegister.emit('client-press')
  });

  TrackPlayer.addEventListener('remote-stop', () => {
    TrackPlayer.destroy()
  });
  TrackPlayer.addEventListener('playback-state', async (state) => {
    console.log('playbackState changed')
    EventRegister.emit('playback-state-change', state)
    console.log(state)
    if (state.state === 'playing') {
      AsyncStorage.getItem('savedStore').then(async (value) => {
        const playerState = JSON.parse(value).player
        console.log(playerState)
        await TrackPlayer.setRate(playerState.rate)
        await TrackPlayer.setVolume(playerState.volume)
      })
    }

  })
  this.eventRegisterTimeout = undefined
  EventRegister.addEventListener('client-press',()=>{
    this.eventRegisterTimeout=setTimeout(()=>{
      clearTimeout(this.eventRegisterTimeout)
      this.eventRegisterTimeout=undefined
    },5000)
  })
  this.debounceTimeout = undefined//used to prevent listen to this event for multiple times
  TrackPlayer.addEventListener('playback-track-changed', async (track, position, nextTrack) => {
    console.log('songChanged')
    //EventRegister.emit('playback-track-change', { track, position, nextTrack })
    if (this.debounceTimeout == undefined && this.eventRegisterTimeout == undefined) {
      //get rid of the debounce timeout
      debounceTimeout = setTimeout(() => {
        clearTimeout(this.debounceTimeout)
        this.debounceTimeout = undefined
      }, 3000
      )
      //start dealing with the logic
      AsyncStorage.getItem('savedStore').then(async (value) => {
        console.log('acceptedSongChanged')
        const playerState = JSON.parse(value).player
        const shuffle = playerState.shuffle
        const loop = playerState.loop
        if (loop == 'single') {
          var Q = await TrackPlayer.getQueue()
          if (playerState.currentSong == Q[Q.length - 1].id) {
            console.log('last song')
            //console.log(nextTrack)
            await TrackPlayer.seekTo(0)
            setTimeout(async () => {
              await TrackPlayer.play()
              await TrackPlayer.setRate(playerState.rate)
              await TrackPlayer.setVolume(playerState.volume)
            }, 1000)
          } else {
            console.log('not last song')
            await TrackPlayer.skipToPrevious()
            setTimeout(async () => {
              await TrackPlayer.play()
              await TrackPlayer.setRate(playerState.rate)
              await TrackPlayer.setVolume(playerState.volume)
            }, 1000)

          }

        } else {
          console.log('lllllllllll')
          console.log(track)
          console.log('lllllllllll')
          if (track == null || track == undefined) { } else {
            if (shuffle) {
              var queue = await TrackPlayer.getQueue()
              var randomNumber = Math.floor(Math.random() * queue.length - 1)
              filteredQueue = queue.filter((e) => e.id != track)
              await TrackPlayer.skip(filteredQueue[randomNumber].id)
              await TrackPlayer.pause()
              setTimeout(async () => {
                await TrackPlayer.play()
                await TrackPlayer.setRate(playerState.rate)
                await TrackPlayer.setVolume(playerState.volume)
              }, 1000)
            }
          }
        }
      })
    }
  })

  TrackPlayer.addEventListener('playback-queue-ended', async (track, position) => {
    console.log('Q ended')
    AsyncStorage.getItem('savedStore').then(async (value) => {
      const playerState = JSON.parse(value).player
      const loop = playerState.loop
      if (loop == 'yes') {
        var queue = await TrackPlayer.getQueue()
        await TrackPlayer.skip(queue[0].id)
      } else if (loop == 'no') {
        TrackPlayer.reset()
      }
    })
  })
}