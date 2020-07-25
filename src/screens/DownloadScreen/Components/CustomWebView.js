import WebView from 'react-native-webview'
import React, { useState, useEffect, useRef } from 'react'
import { View, Animated, Dimensions } from 'react-native'
import COLOR, { getStyle } from '../../../utils/StyleSheets/Theme'
import { Grid, Text, Input, Row, Col, Form, Label, Button, Item } from 'native-base'
import Icon from '../../../utils/IconManager'
const CustomWebView = (props) => {
    //props setURL is used to set the top Level URL
    const theme = props.theme
    const [open, setOpen] = useState('close')
    const webView = useRef()
    const [actualUrl, setActualUrl] = useState(props.url)
    const closeValue = 60
    const openValue = Dimensions.get('window').height * 0.6
    const HeightOfCustomWebView = useRef(new Animated.Value(closeValue)).current
    const OpacityOfWebViewDisplay = useRef(new Animated.Value(0)).current
    const _openAnimation = () => {
        //console.log(callback)
        Animated.sequence([
            Animated.timing(HeightOfCustomWebView, {
                toValue: openValue,
                duration: 1000,
                //useNativeDriver: true
            }),
            Animated.timing(OpacityOfWebViewDisplay, {
                toValue: 1,
                duration: 500,
                //useNativeDriver: true
            })
        ]).start(({ finished }) => {
            setOpen('open')
        })
    }
    const _closeAnimation = () => {
        Animated.parallel([
            Animated.timing(HeightOfCustomWebView, {
                toValue: closeValue,
                duration: 1000,
                //useNativeDriver: true
            }),
            Animated.timing(OpacityOfWebViewDisplay, {
                toValue: 0,
                duration: 500,
                //useNativeDriver: true
            })
        ]).start(({ finished }) => {
            setOpen('close')
        })
    }
    const _changeUrl = (url) => {
        props.setUrl(url)
    }
    return (
        <Animated.View style={[getStyle(COLOR.SHADOW, true, true, theme), getStyle(COLOR.GRAY5, true, true, theme), ...props.style, { height: HeightOfCustomWebView }]}>
            <View style={{ height: 52, flexDirection: "row", margin: 3 }}>
                <Item rounded style={{ flex: 8, height: 55 }}>
                    <Button rounded disabled={open != 'open' } onPress={
                        () => {
                            webView.current.goBack()
                        }
                    } style={{ height: 52 }}><Text>{'<-'}</Text></Button>
                    <Label>url:</Label>
                    <Input style={[{ height: 55 }, getStyle(COLOR.ITEM, false, true, theme)]} value={props.url} onChangeText={(val) => { props.setUrl(val) }}></Input>
                    <Button disabled={open != 'open'} style={{ height: 52 }} rounded onPress={() => {
                        _changeUrl(props.url)
                        setActualUrl(props.url)
                    }}><Text>Go</Text></Button>
                </Item>
                <Button transparent style={[getStyle(COLOR.ITEM, false, true, theme), { flex: 1, height: 55, marginLeft: 10 }]} onPress={() => {
                    if (open == 'close') {
                        setOpen('opening')
                        _openAnimation()
                    } else if (open == 'open') {
                        setOpen('closing')
                        _closeAnimation()
                    }
                }}>
                    {open == "open" || open == "opening" ? <Icon type='SimpleLineIcons' name='arrow-up' size={24} color={getStyle(COLOR.ITEM, false, true, theme).color} /> : <Icon type='SimpleLineIcons' name='arrow-down' size={24} color={getStyle(COLOR.ITEM, false, true, theme).color} />}
                </Button>
            </View>
            <Animated.View style={[{ flexGrow: 1, opacity: OpacityOfWebViewDisplay, marginTop: 5 }]}>
                {open=="close"?<View></View>:<WebViewDisplay url={actualUrl} setUrl={_changeUrl} webViewRef={webView}/>}
            </Animated.View>
        </Animated.View>
    )
}
const WebViewDisplay = (props) => {
    return (
        <WebView
            source={{ uri: props.url }}
            useWebKit={true}
            originWhitelist={['*']}
            allowsInlineMediaPlayback={true}
            onNavigationStateChange={(navstate) => {
                if (!navstate.url.endsWith('searching')) {
                    props.setUrl(navstate.url)
                }
            }}
            ref={props.webViewRef}
        />
    )
}

export default CustomWebView
