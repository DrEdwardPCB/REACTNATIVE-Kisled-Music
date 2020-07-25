import React, { useState, useEffect } from "react"
import { Portal } from 'react-native-portalize'
import { Modalize } from 'react-native-modalize'
import { useSelector, useDispatch } from 'react-redux'
import { MAX_HEIGHT, MAX_WIDTH } from '../../../utils/Constant'
import { View, BackHandler } from "react-native"
import * as Progress from 'react-native-progress'
import { Button, Grid, Row, Col, Text } from 'native-base'
import COLOR, { getStyle } from '../../../utils/StyleSheets/Theme'
import { Divider } from 'react-native-paper'
import TextTicker from 'react-native-text-ticker'
const RNFS = require('react-native-fs')
const DownloadCenter = React.forwardRef((props, referece) => {
    //props.ref
    const theme = props.theme
    const crackDownload = useSelector(state => Object.keys(state.download.download).map(e => { return state.download.download[e] }))


    const dispatch = useDispatch()
    const _handleRemoveDownload = (jobid) => {
        RNFS.stopDownload(jobid)
        dispatch({ type: 'REMOVE_DOWNLOAD', jobid: jobid })
    }
    return (
        <Portal>
            <Modalize
                ref={referece}
                modalHeight={MAX_HEIGHT * 0.8}
                modalStyle={getStyle(COLOR.GRAY6, true, true, theme)}
                flatListProps={{
                    style: { padding: 10 },
                    keyExtractor: (item) => item.title,
                    data: crackDownload,
                    renderItem: ({ item }) => {
                        return (
                            <FlatListItem theme={theme} progress={item.progress} title={item.title} jobid={item.jobid} handleRemoveDownload={_handleRemoveDownload} />
                        )
                    },
                    ListHeaderComponent: () => {
                        return (
                            <View>
                                <View style={{ height: (MAX_HEIGHT - 40 - 20) * 0.1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, flexDirection: 'row' }}>
                                    <Text style={[getStyle(COLOR.GRAY, false, true, theme), { fontSize: 20, fontWeight: 'bold' }]}>Download Center</Text>
                                </View>
                                <Divider />
                            </View>)
                    },
                    extraData: crackDownload
                }}
            >
            </Modalize>
        </Portal>
    )
})
const FlatListItem = (props) => {
    //const dispatch = useDispatch()
    const theme = props.theme
    return (
        <View style={[getStyle(COLOR.GRAY3, true, true, theme), {
            margin: 3,
        }, getStyle(COLOR.SHADOW, true, true, theme)]}>
            <Grid>
                <Row>
                    <Col size={2.5} style={{ padding: 10 }}>
                        <TextTicker
                            style={[getStyle(COLOR.ITEM, false, true, theme), { height: 25 }]}
                            duration={3000}
                            loop
                            bounce
                            repeatSpacer={50}
                            marqueeDelay={1000}
                        >
                            {props.title}
                        </TextTicker>
                        <Divider />
                        <View style={{ width: '100%' }}>
                            <Progress.Bar progress={props.progress} width={null} />
                        </View>
                    </Col>
                    <Col size={1} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            danger
                            small
                            style={{ justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                props.handleRemoveDownload(props.jobid)
                            }}
                        >
                            <Text>Remove</Text>
                        </Button>
                    </Col>
                </Row>
            </Grid>

        </View>
    )
}
export default DownloadCenter