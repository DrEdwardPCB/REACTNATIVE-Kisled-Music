import { AsyncStorage } from 'react-native';
import uuid from 'react-native-uuid'
import FileManager from './FileManager'

const defaultLibraries ={
    all:[],
    liked:[]
} 
export default class LibrariesManager {
    static instance = null
    static getInstance() {
        if (LibrariesManager.instance == null) {
            LibrariesManager.instance = new LibrariesManager()
        }
        return LibrariesManager.instance
    }
    constructor() {
        
        this.Libraries = null;
        this.ready = false;
        this.getLibraries()
    }

    getLibraries = async () => {
        
        try {
            var data = await AsyncStorage.getItem("Libraries")
            
            if (data == null || data == "null" || data == undefined) {
                this.ready = false
                await this.resetLibraries()
                await this.getLibraries()
                
            } else {
                this.Libraries = JSON.parse(data)
            }
        } catch (error) {
            this.ready = false
            await this.resetLibraries()
            await this.getLibraries()
            
        }
        this.ready = true
    }
    isReady=()=>{
        return this.ready
    }
    //Direct settings
    setLibraries = async(newLibraries)=>{
        this.Libraries=newLibraries;
        await this.saveLibraries()
    }
    //Clearing library to just {all:[]}
    resetLibraries = async () => {
        try {
            await AsyncStorage.setItem("Libraries", JSON.stringify(defaultLibraries))
            
            this.Libraries=JSON.parse(JSON.stringify(defaultLibraries))
        } catch (error) {
            //console.log("error occur")
        }
    }
    //saving library to asyncStorage
    saveLibraries = async () => {
        try {
            await AsyncStorage.setItem("Libraries", JSON.stringify(this.Libraries))
        } catch (error) {

        }
    }
    //retrieving a cached library object
    getLibrariesObject = () => {
        if(this.ready){
            return this.Libraries
        }else{
            return null
        }

    }
    

    //creating new library with name since name=id, so cannot have collided name + saving it
    createNewLibrary = async (LibraryName)=>{
        if (this.Libraries[LibraryName]!==undefined){
            console.log(this.Libraries)
            return alert("Name has already been token, use another name instead")
        }
        this.Libraries[LibraryName]=[]
        console.log(this.Libraries)
        await this.saveLibraries()
        console.log('createNewLibraryDone')
    }

    //delete library with name
    deleteLibrary = async(LibraryName)=>{
        delete this.Libraries[LibraryName]
        await this.saveLibraries()
        console.log('deleteLibraryDone')
    }

    //add song to specific library
    addSongToLibrary=async (songs,LibraryName)=>{
        if(this.Libraries[LibraryName]==undefined){
            return alert("Library not found, please create library first")
        }
        this.Libraries[LibraryName].push(this.createNewTrackObject(songs))
        await this.saveLibraries()
        console.log('addSongToLibraryDone')
    }

    //delete song from specific library
    deleteSongFromLibrary=async(songs, LibraryName)=>{
        console.log(LibraryName)
        if(this.Libraries[LibraryName]==undefined){
            return alert("Library not found, please create library first")
        }
        if(LibraryName=="all"){
            Object.keys(this.Libraries).forEach((key)=>{
                this.Libraries[key]=this.Libraries[key].filter((e)=>{return e.id!==songs.id})
            })
            FileManager.getInstance().deleteFile(songs.id+'.mp3')
        }else{
            this.Libraries[LibraryName]=this.Libraries[LibraryName].filter((e)=>{return e.id!==songs.id})
        }
        await this.saveLibraries()
        console.log('deleteSongFromLibraryDone')
    }
    
    //create song object
    createNewTrackObject=(songs)=>{
        return {
            id: songs.id?songs.id:uuid.v4(),
            url: songs.url,
            title: songs.title?songs.title:'unnamed',
            artist: songs.artist?songs.artist:'noname',
            artwork:null
        }
    }
} 