import { Container, Header,Button, Content, Title, Text, Card, CardItem, Grid, Col, Row, Left, Right, Body, Separator } from 'native-base'
import { useSelector, useDispatch, useStore } from 'react-redux'
import COLOR, { getStyle } from '../../utils/StyleSheets/Theme'
import { Switch, Divider } from 'react-native-paper';
import { View , Linking} from 'react-native'
import React, { useState } from 'react'

const PreferenceScreen = (props) => {
    const theme = useSelector(state => state.preference.theme)
    const [isSwitchOn, setIsSwitchOn] = useState(theme=="dark");
    const dispatch = useDispatch()
    const store=useStore()
    return (
        <Container>
            <Header style={[getStyle(COLOR.BG, true, true, theme)]}>
                <Left></Left>
                <Body>
                    <Title style={[getStyle(COLOR.ITEM, false, true, theme)]}>
                        Preference
                    </Title>
                </Body>
                <Right></Right>
            </Header>
            <View style={[getStyle(COLOR.BG, true, true, theme), { flexGrow: 1, padding: 10 }]} scrollEnabled={false}>
                <Grid>
                    <Row style={{height: 50}}>
                        <Col>
                            <Row>
                            <Col size={2} style={{justifyContent:'center'}}><Text style={[getStyle(COLOR.ITEM,false,true,theme),{}]}>Theme</Text></Col>
                            <Col size={1} style={{justifyContent:'center'}}>
                                <Row>
                                <Col style={{justifyContent:'center'}}><Text  style={[getStyle(COLOR.ITEM,false,true,theme),{}]}>{theme}</Text></Col>
                                <Col style={{justifyContent:'center'}}>
                                    <Switch value={isSwitchOn} onValueChange={() => { 
                                        setIsSwitchOn(!isSwitchOn)
                                        dispatch({type:'SWITCH_THEME'})
                                    }} />
                                </Col>
                                </Row>
                            </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Divider style={getStyle(COLOR.GRAY, true, true, theme)} />
                    <Row style={{height: 50}}>
                        <Col>
                            <Row>
                            <Col size={2} style={{justifyContent:'center'}}><Text style={[getStyle(COLOR.ITEM,false,true,theme),{}]}>Force Reset</Text></Col>
                            <Col size={1} style={{justifyContent:'center'}}>
                                <Row>
                                <Col style={{justifyContent:'center'}}>
                                    <Button danger onPress={() => { 
                                        console.log('pressed Force reset')
                                        dispatch({type:'FORCE_RESET'})
                                    }} style={{justifyContent:'center'}}>
                                        <Text>Reset</Text>
                                    </Button>
                                </Col>
                                </Row>
                            </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Divider style={getStyle(COLOR.GRAY, true, true, theme)} />
                    <Row style={{height: 50}}>
                        <Col>
                            <Row>
                            <Col size={2} style={{justifyContent:'center'}}><Text style={[getStyle(COLOR.ITEM,false,true,theme),{}]}>Privacy</Text></Col>
                            <Col size={1} style={{justifyContent:'center'}}>
                                <Row>
                                <Col style={{justifyContent:'center'}}>
                                    <Button onPress={() => { 
                                        Linking.openURL('http://ekhome.life/Apps/KisledMusic/kisled-music_privacy_policy/privacy.html')
                                    }} style={{justifyContent:'center'}}>
                                        <Text>Privacy</Text>
                                    </Button>
                                </Col>
                                </Row>
                            </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Divider style={getStyle(COLOR.GRAY, true, true, theme)} />
                    <Row style={{height: 50}}>
                        <Col>
                            <Row>
                            <Col size={2} style={{justifyContent:'center'}}><Text style={[getStyle(COLOR.ITEM,false,true,theme),{}]}>Terms of Service</Text></Col>
                            <Col size={1} style={{justifyContent:'center'}}>
                                <Row>
                                <Col style={{justifyContent:'center'}}>
                                    <Button onPress={() => { 
                                       Linking.openURL('http://ekhome.life/Apps/KisledMusic/kisled-music_privacy_policy/TermsOfService.html')
                                       
                                    }} style={{justifyContent:'center'}}>
                                        <Text>Terms</Text>
                                    </Button>
                                </Col>
                                </Row>
                            </Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </View>
        </Container>
    )
}
export default PreferenceScreen