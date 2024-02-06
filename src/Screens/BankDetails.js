import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, ScrollView, ActivityIndicator, Pressable, TextInput} from 'react-native';
import logo from '../Assets/images/logo.png';
import {SafeAreaView} from 'react-native-safe-area-context';
import BankingCard from '../Components/BankingCard';
import {connect} from 'react-redux';
import FIcon from 'react-native-vector-icons/Foundation';
import Sidebar from '../Components/Common/Sidebar';

class BankDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpened: false,
    };
  }
  render() {
    const closeSideBar = () => {
      this.setState({sidebarOpened: false});
    };
    return (
      <SafeAreaView style={styles.container}>
        {this.state.sidebarOpened && <Sidebar navigation={this.props.navigation} alert={this.props.alert} closeSideBar={closeSideBar} />}
        <View style={styles.logoContainer}>
          <Pressable style={{position: 'absolute', left: 0, top: 0, width: 70, height: 70, display: 'flex', justifyContent: 'center', alignItems: 'center'}} onPress={() => this.setState({sidebarOpened: !this.state.sidebarOpened})}>
            <FIcon name="list" size={25} color="black" />
          </Pressable>
          <Image source={logo} style={styles.logo} />
        </View>
        <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#E6EDFF', marginBottom: 10}}>Bank Details</Text>
        <ScrollView>
          <View style={{paddingHorizontal: 20, marginBottom: 20}}>{this.props.seller_info && this.props.seller_info.sellers_bank_details && this.props.seller_info.sellers_bank_details.length > 0 ? this.props.seller_info.sellers_bank_details.map((detail, i) => <BankingCard detail={detail} key={i} navigation={this.props.navigation} />) : <Text>Bank Details Not available</Text>}</View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    position: 'relative',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 100,
    height: 30,
  },
  innerContainer: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: 'black',
    marginBottom: 10,
  },
  submitButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD814',
    borderRadius: 100,
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 7,
  },
  field: {
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    color: '#00000080',
    fontFamily: 'Roboto-Bold',
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#697475',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginTop: 2,
    fontSize: 14,
  },
});
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(BankDetails);
