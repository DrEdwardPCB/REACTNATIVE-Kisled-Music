import TrackPlayer from 'react-native-track-player';
import PlayerManager from './PlayerManager'
import LibrariesManager from './LibrariesManager'
import { EventRegister } from 'react-native-event-listeners'

module.exports = async function () {
  this.listener = EventRegister.addEventListener('handChange', (data) => {
    this.currentTrack = data
  })
  this.interval
  this.firstchange = false
  this.currentTrack = ''
  this.nextTrack = ''
  TrackPlayer.addEventListener('remote-play', () => {
    console.log(PlayerManager.getInstance().getCurrentLib())
    TrackPlayer.play()
  })

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause()
  });

  TrackPlayer.addEventListener('remote-next', () => {
    TrackPlayer.skipToNext()
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    TrackPlayer.skipToPrevious()
  });

  TrackPlayer.addEventListener('remote-stop', () => {
    TrackPlayer.destroy()
  });
  TrackPlayer.addEventListener('playback-state', async (obj) => {
    //update ui 
    console.log(obj)
    EventRegister.emit('playback-state-c', obj)
    //remove interval for shuffle
    if (obj.state == 'playing') {
      //handle shuffle
      /*if (PlayerManager.getInstance().getCurrentLib().shuffle == true) {
        clearInterval(this.interval)
        this.interval = setInterval(async () => {
          const [position, duration] = await Promise.all([
            TrackPlayer.getPosition(),
            TrackPlayer.getDuration()
          ])
          if (position && duration && position >= Math.floor(duration)) {
            console.log('SHUFFFFFFFFFLEEEEEEEE')
            let queue = await TrackPlayer.getQueue()
            queue = queue.filter(item => item.id !== this.currentTrack)

            const count = queue.length - 1
            if (count > 0) {
              const index = Math.floor(Math.random() * count)

              const trackId = queue[index].id
              await TrackPlayer.skip(trackId)
            }

          }
        }, 400)
      } else {
        clearInterval(this.interval)
      }*/
      //handle initial enter
      if (this.currentTrack == '') {
        this.currentTrack = await TrackPlayer.getCurrentTrack()
        var curlib = PlayerManager.getInstance().getCurrentLib().lib
        var queue = await LibrariesManager.getInstance().getLibrariesObject()[curlib]
        for (var i = 0; i < queue.length; i++) {
          console.log(this.currentTrack)
          if (queue[i].id == this.currentTrack) {
            if (i < queue.length - 1) {
              this.nextTrack = queue[i + 1].id
              console.log('setting next track')
            } else {
              this.nextTrack = queue[0].id
              console.log('setting next track')
            }
          }
        }
      }
      //handle repeat
      if (PlayerManager.getInstance().getCurrentLib().repeat == true) {

        var thisTrack = await TrackPlayer.getCurrentTrack()

        if (thisTrack !== this.currentTrack) {
          await TrackPlayer.skip(this.currentTrack)
          await TrackPlayer.play()
        }
      } else {
        this.currentTrack = await TrackPlayer.getCurrentTrack()
        var queue = await TrackPlayer.getQueue()
        for (var i = 0; i < queue.length; i++) {
          console.log(this.currentTrack)
          if (queue[i].id == this.currentTrack) {
            if (i < queue.length - 1) {
              this.nextTrack = queue[i + 1].id
              console.log('setting next track')
            } else {
              this.nextTrack = queue[0].id
              console.log('setting next track')
            }
          }
        }
      }
    }
  })


  this.timeout3 = undefined
  TrackPlayer.addEventListener('playback-track-changed', async (obj) => {
    console.log('trackchanged')
    //handle shuffle
    console.log('=next track')
    //console.log(await (await TrackPlayer.getTrack(obj.Track)).title)
    console.log(obj.track == this.currentTrack)
    //console.log(await (await TrackPlayer.getTrack(this.currentTrack)).title)
    console.log('?next track')

    console.log(PlayerManager.getInstance().getCurrentLib())
    if ((obj.track == this.nextTrack || obj.nextTrack == null || obj.nextTrack == undefined) && PlayerManager.getInstance().getCurrentLib().shuffle == true && PlayerManager.getInstance().getCurrentLib().repeat == false) {
      console.log('passed1')
      if (this.timeout3 == undefined) {
        console.log('shuffling')
        let queue = await TrackPlayer.getQueue()
        queue = queue.filter(item => item.id !== this.currentTrack)

        const count = queue.length - 1
        if (count > 0) {
          const index = Math.round(Math.random() * count)

          const trackId = queue[index].id
          await TrackPlayer.skip(trackId)
          await TrackPlayer.play()
        }
        this.timeout3 = setTimeout(() => {
          clearTimeout(this.timeout3)
          this.timeout3 = undefined
        }, 3000)
      }
    }

  })
  this.timeout2 = undefined
  TrackPlayer.addEventListener('playback-queue-ended', async (obj) => {//called every song ended in this version, possibly mapping error
    console.log('Q ended')
    //console.log(await TrackPlayer.getCurrentTrack())
    var songList = await TrackPlayer.getQueue()

    if (this.timeout2 == undefined) {
      for (var i = 0; i < songList.length; i++) {
        if (i == songList.length - 1) {
          if (songList[i].id === this.currentTrack) {

            if (PlayerManager.getInstance().getCurrentLib().shuffle) {
              let queue = await TrackPlayer.getQueue()
              queue = queue.filter(item => item.id !== this.currentTrack)

              const count = queue.length - 1
              if (count > 0) {
                const index = Math.round(Math.random() * count)

                const trackId = queue[index].id
                await TrackPlayer.skip(trackId)
                await TrackPlayer.play()
              }
            }
            else if (PlayerManager.getInstance().getCurrentLib().loop) {
              console.log('changing')
              var thismomentSongList = await TrackPlayer.getQueue()
              console.log(thismomentSongList)
              await TrackPlayer.skip(songList[0].id)
              await TrackPlayer.seekTo(0)
              setTimeout(async () => {
                await TrackPlayer.play()
              }, 1000)

            }
          }
        }
      }
      this.timeout2 = setTimeout(() => {
        clearTimeout(this.timeout2)
        this.timeout2 = undefined
      }, 3000)
    }

  })
};