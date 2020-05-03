import { AsyncStorage } from 'react-native';

const defaultPreference = {
    theme: 'light',
    AutoSaveProfile: true,
    StartupPage: 'Random'
}
export default class PreferenceManager {
    static instance = null
    static getInstance() {
        if (PreferenceManager.instance == null) {
            PreferenceManager.instance = new PreferenceManager()
        }
        return PreferenceManager.instance
    }
    constructor() {
        this.preference = null;
        this.ready = false;
        this.getPreference()
    }

    getPreference = async () => {
        try {
            var data = await AsyncStorage.getItem("Preference")
            if (data == null || data == "null" || data == undefined) {
                this.ready = false
                await this.resetPreference()
                await this.getPreference()
            } else {
                this.preference = JSON.parse(data)
            }
        } catch (error) {
            this.ready = false
            await this.resetPreference()
            await this.getPreference()
        }
        this.ready = true
    }
    setPreference = async(newPreference)=>{
        this.preference=newPreference;
        await this.savePreference()
    }
    resetPreference = async () => {
        try {
            await AsyncStorage.setItem("Preference", JSON.stringify(defaultPreference))
            this.preference=JSON.parse(JSON.stringify(defaultPreference));
        } catch (error) {

        }
    }
    savePreference = async () => {
        try {
            await AsyncStorage.setItem("Preference", JSON.stringify(this.preference))
        } catch (error) {

        }
    }
    getPreferenceObject = () => {
        //console.log(this.preference)
        //console.log(this.ready)
        if(this.ready){
            return this.preference
        }else{
            return null
        }


    }
} 