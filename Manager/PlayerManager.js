import TrackPlayer from 'react-native-track-player'
import uuid from 'react-native-uuid'
const defaultclib={lib:'all', shuffle:false, repeat: false, loop:false}
import {AsyncStorage} from 'react-native'
export default class PlayerManager {
    clib=''
    static instance = null
    static getInstance() {
        if (PlayerManager.instance == null) {
            PlayerManager.instance = new PlayerManager()
        }
        return PlayerManager.instance
    }

    constructor() {
        this.ready = false
        TrackPlayer.setupPlayer({
            
            }).then(
            async () => {
               
                console.log('player readied')
                //this.ready=true
                await this.getclib()
            }
        )
        //TrackPlayer.registerPlaybackService(()=>require('./PlaybackService'))
        TrackPlayer.updateOptions({
            capabilities: [
              TrackPlayer.CAPABILITY_PLAY,
              TrackPlayer.CAPABILITY_PAUSE,
              TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
              TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
              TrackPlayer.CAPABILITY_STOP
            ],
          });
    }
    isReady() {
        return this.ready
    }

    //queueManagement
    
    async addSong(songs) {
        /*{
            id: 'trackId',
            url: require('track.mp3'),
            title: 'Track Title',
            artist: 'Track Artist',
            artwork: require('track.png')
        }*/
        console.log(songs)
        await TrackPlayer.add({
            id: songs.id?songs.id:uuid.v4(),
            url: {uri:songs.url},
            title: songs.title?songs.title:'unnamed',
            artist: songs.artist?songs.artist:'noname',
            artwork: null,
            duration: songs.duration
        })
    }
    async addSongs(songs) {
        console.log('calledadd')
        const mapped=songs.map(e=>{
            return{
                id: e.id?e.id:uuid.v4(),
                url: {uri:"file:///"+e.url},
                title: e.title?e.title:'unnamed',
                artist: e.artist?e.artist:'noname',
                artwork: null,
                duration: e.duration
            }
        })
        console.log(mapped)
        await TrackPlayer.add(mapped)
    }
    getQueue=async ()=>{
        const queue=await TrackPlayer.getQueue()
        return queue
    }
    getCurrentTrack=async()=>{
        const trackid=await TrackPlayer.getCurrentTrack()
        return trackid
    }
    
    //PlayManagement
    getState=async ()=>{
        console.log('getting state')
        return await TrackPlayer.getState()
    }
    playSong=()=>{
        console.log('calledplay')
        TrackPlayer.play()
    }
    pauseSong=()=>{
        TrackPlayer.pause()
    }
    skip=async (id)=>{
        console.log('calledskip')
        await TrackPlayer.skip(id)
    }
    next=async()=>{
        await TrackPlayer.skipToNext()
    }
    prev=async()=>{
        await TrackPlayer.skipToPrevious()
    }
    stop=()=>{
        console.log('calledstop')
        TrackPlayer.stop()
    }
    getclib = async () => {
        
        try {
            var data = await AsyncStorage.getItem("clib")
            console.log(data+"clib")
            if (data == null || data == "null" || data == undefined) {
                this.ready = false
                await this.resetclib()
                await this.getclib()
                
            } else {
                this.clib = JSON.parse(data)
            }
        } catch (error) {
            this.ready = false
            await this.resetclib()
            await this.getclib()
            
        }
        this.ready = true
    }
    //Direct settings
    setCurrentlib = async(newclib)=>{
        this.clib=newclib;
        await this.saveclib()
    }
    //Clearing library to just {all:[]}
    
    resetclib = async () => {
        try {
            await AsyncStorage.setItem("clib", JSON.stringify(defaultclib))
            
            this.clib=JSON.parse(JSON.stringify(defaultclib))
        } catch (error) {
            //console.log("error occur")
        }
    }
    //saving library to asyncStorage
    saveclib = async () => {
        try {
            await AsyncStorage.setItem("clib", JSON.stringify(this.clib))
        } catch (error) {

        }
    }
    //retrieving a cached library object
    getCurrentLib = () => {
        if(this.ready){
            return this.clib
        }else{
            return null
        }
    }
    

} 