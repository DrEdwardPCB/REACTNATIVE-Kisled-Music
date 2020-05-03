import React from 'react'
import IconA from 'react-native-vector-icons/AntDesign';
import IconEn from 'react-native-vector-icons/Entypo';
import IconEv from 'react-native-vector-icons/EvilIcons'
import IconFe from 'react-native-vector-icons/Feather'
import IconFA from 'react-native-vector-icons/FontAwesome'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import IconFAP from 'react-native-vector-icons/FontAwesome5Pro'
import IconFT from 'react-native-vector-icons/Fontisto'
import IconFD from 'react-native-vector-icons/Foundation'
import IconI from 'react-native-vector-icons/Ionicons'
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons'
import IconM from 'react-native-vector-icons/MaterialIcons'
import IconO from 'react-native-vector-icons/Octicons'
import IconS from 'react-native-vector-icons/SimpleLineIcons'
import IconZ from 'react-native-vector-icons/Zocial'

export class Icon extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        if(this.props.type=='AntDesign'){
            return(
                <IconA style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='Entypo'){
            return(
                <IconEn style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='EvilIcons'){
            return(
                <IconEv style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='Feather'){
            return(
                <IconFe style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='FontAwesome'){
            return(
                <IconFA style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='FontAwesome5'){
            return(
                <IconFA5 style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='FontAwesome5Pro'){
            return(
                <IconFAP style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='Fontisto'){
            return(
                <IconFT style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='Foundation'){
            return(
                <IconFD style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='Ionicons'){
            return(
                <IconI style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='MaterialCommunityIcons'){
            return(
                <IconMC style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='MaterialIcons'){
            return(
                <IconM style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='Octicons'){
            return(
                <IconO style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='SimpleLineIcons'){
            return(
                <IconS style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }else if(this.props.type=='Zocial'){
            return(
                <IconZ style={this.props.style} size={this.props.size} color={this.props.color} name={this.props.name}/>
            )
        }
        
    }
}