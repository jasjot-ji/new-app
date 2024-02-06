import React, {Component} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

export default class BankingCard extends Component {
  render() {
    const {detail} = this.props;
    return (
      <View style={styles.bankCard}>
        <Text style={styles.bankName}>{detail.name}</Text>
        <View style={styles.bankBody}>
          <Text style={styles.name}>Name : {detail.account_holder_name}</Text>
          <Text style={styles.bankAcountNumber}>A/C : {detail.account_number}</Text>
          <Text style={styles.bankIFSC}>IFSC : {detail.ifsc_code}</Text>
          <Text style={styles.bankLocation}>Branch : {detail.location}</Text>
          <View style={styles.bankOptions}>
            <Pressable onPress={() => this.props.navigation.navigate("EditBankDetails", { id: detail.sellers_bank_info_id})}>
              <Text style={styles.bankOptionsText}>Edit</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  bankCard: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginVertical: 10,
  },
  bankName: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    fontSize: 12,
    color: '#697475',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    fontFamily: 'Roboto-Medium',
  },
  bankBody: {
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  name: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'Roboto-Medium',
  },
  bankAcountNumber: {
    fontSize: 14,
    color: 'black',
  },
  bankOptionsText: {
    color: '#059CA6',
    fontSize: 14,
  },
  bankOptions: {
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
