import React from 'react';
import { Container, Header, Content, Card, Button, CardItem, Left, Right, Body, Title, Text, Grid, Row, Col, Form, Input, Item, Label } from 'native-base';
import {Icon} from '../Manager/IconManager'
import { ScrollView, Flatlist } from 'react-native'
import COLOR, { getTheme, getStyle } from '../StyleSheets/Theme'
import PreferenceManager from '../Manager/PreferenceManager'
import { Dimensions, View } from 'react-native'
import FileManager from '../Manager/FileManager'
import { Divider } from 'react-native-paper'
import Carousel from 'react-native-snap-carousel'
import uuid from 'react-native-uuid'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class PreferenceScreen extends React.Component{
    render(){
        return(
        <Container>
            <Header style={[getStyle(COLOR.GRAY6, true, true), {
                    shadowOffset: { height: 0, width: 0 },
                    shadowOpacity: 0, elevation: 0
                }, { borderBottomWidth: 0 }]}>
                <Left></Left>
                <Body><Title style={[getStyle(COLOR.ITEM, true, true)]}>Preference</Title></Body>
                <Right></Right>
            </Header>
            <Content style={[getStyle(COLOR.BG, true, true)]} scrollEnabled={false}>
               
            </Content>
        </Container>
        )
    }
}