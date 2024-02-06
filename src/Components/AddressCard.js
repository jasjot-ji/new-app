import React, {Component} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

export default class AddressCard extends Component {
  render() {
    const {address} = this.props;
    return (
      <View style={styles.addressCard}>
        <Text style={styles.addressType}>{address.address_type}</Text>
        <View style={styles.addressBody}>
          <Text style={styles.addressline}>
            {address.flat_house_building}, {address.area}, {address.landmark},
          </Text>
          <Text style={styles.addressline}>
            {address.town_city}, {address.state} - {address.pincode}
          </Text>
          <Text style={styles.addressline}>India</Text>
          <View style={styles.addressOptions}>
            <Pressable onPress={() => this.props.navigation.navigate("EditAddress", {address: address})}>
              <Text style={styles.addressOptionsText}>Edit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  addressCard: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginVertical: 10,
  },
  addressType: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    fontSize: 12,
    color: '#697475',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    fontFamily: 'Roboto-Medium',
  },
  addressBody: {
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  name: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Roboto-Medium',
  },
  addressline: {
    fontSize: 14,
    color: 'black',
  },
  addressOptionsText: {
    color: '#059CA6',
    fontSize: 14,
  },
  addressOptions: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
  },
  rightBorder: {
    marginRight: 10,
    paddingRight: 10,
    borderRightWidth: 1,
    borderColor: '#059CA6',
  },
});
