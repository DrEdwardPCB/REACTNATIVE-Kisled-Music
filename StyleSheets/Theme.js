import DarkTheme from './DarkTheme';
import LightTheme from './LightTheme';
import PreferenceManager from '../Manager/PreferenceManager'

const COLOR={ 
    BLUE: "Blue",
    GREEN: "Green",
    INDIGO: "Indigo",
    ORANGE: "Orange",
    PINK: "Pink",
    PURPLE: "Purple",
    RED: "Red",
    TEAL: "Teal",
    YELLOW: "Yellow",
    GRAY: "Gray",
    GRAY6: "Gray6",
    GRAY2: "Gray2",
    GRAY3: "Gray3",
    GRAY4: "Gray4",
    GRAY5: "Gray5",
    BG: "Background",
    ITEM:"Item",
    SHADOW:"Shadow",
};
export default COLOR;
export function getStyle(color, bg, isdefault) {
    theme=PreferenceManager.getInstance().getPreferenceObject().theme
    //console.log(theme)
    if ( theme == 'light') {
        var name = "system"
        if (isdefault) {
            name = "D" + name;
        } else {
            name = "A" + name;
        }
        if (bg) {
            name = "bg" + name;
        }
        name = name + color;
        //console.log("light")
        //console.log(name)
        return LightTheme[name]
    } else {
        var name = "system"
        if (isdefault) {
            name = "D" + name;
        } else {
            name = "A" + name;
        }
        if (bg) {
            name = "bg" + name;
        }
        name = name + color;
        //console.log('dark')
        //console.log(name)
        return DarkTheme[name]
    }
}