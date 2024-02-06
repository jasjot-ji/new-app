import React, { Component } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

export default class DashboardCard extends Component {
  render() {
    return (
      <View style={styles.card}>
        <Text style={styles.numbers}>{this.props.count}</Text>
        <Text style={styles.heading}>{this.props.status}</Text>
        {/* <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text style={styles.stats}>10%</Text>
            <Text style={styles.stats}>1.01% this week</Text>
        </View> */}
      </View>
    )
  }
}
const styles = StyleSheet.create({
    card: {
        width: (Dimensions.get('window').width / 2) - 20,
        padding: 10,
        borderRadius: 10, 
        borderWidth: 2,
        borderColor: "#E6EDFF"
    },
    numbers: {
        fontSize: 20, 
        fontFamily: "Roboto-Bold"
    },
    heading: {
        fontSize: 16, 
        fontFamily: "Roboto-Medium",
        marginVertical: 5
    },
    stats:{
        fontSize: 12,
        fontFamily: "Roboto-Regular"
    }
})