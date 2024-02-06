import React, {Component} from 'react';
import {BackHandler, Image, StyleSheet, Text, View} from 'react-native';
import logo from '../Assets/images/logo.png';
import GstMsme from '../Components/Onboarding/GstMsme';
import Banking from '../Components/Onboarding/Banking';
import Billing from '../Components/Onboarding/Billing';
import Shipping from '../Components/Onboarding/Shipping';
import Return from '../Components/Onboarding/Return';
import Sidebar from '../Components/Common/Sidebar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import Verification from '../Components/Onboarding/Verification';

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curentTab: 'gst',
      fullTabName: 'GST / MSME',
      billing_address: null,
      shipping_address: null,
    };
  }
  componentDidMount() {
    if (this.props.seller_info) {
      let seller = this.props.seller_info;
      console.log(seller);
      if (seller.verified) {
        if (seller.gst_tax_status) {
          if (seller.bank_details_status) {
            if (seller.billing_address_status) {
              if (seller.shipping_address_status) {
                if (seller.return_address_status) {
                  this.props.navigation.navigate('Dashboard');
                } else {
                  this.setState({curentTab: 'return', fullTabName: 'Return Address'});
                }
              } else {
                this.setState({curentTab: 'shipping', fullTabName: 'Shipping Address'});
              }
            } else {
              this.setState({curentTab: 'billing', fullTabName: 'Billing Address'});
            }
          } else {
            this.setState({curentTab: 'bank', fullTabName: 'Banking Details'});
          }
        } else {
          this.setState({curentTab: 'gst', fullTabName: 'GST / MSME'});
        }
      }
      else{
        this.setState({curentTab: 'verification', fullTabName: 'Verify Account'});
      }
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick() {
    return true;
  }
  render() {
    const changeTab = tab => {
      this.setState({curentTab: tab});
    };
    const setBillingAddress = address => {
      this.setState({billing_address: address});
    };
    const setShippingAddress = address => {
      this.setState({shipping_address: address});
    };
    return (
      <SafeAreaView style={styles.container}>
        {/* <Sidebar /> */}
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.header}>
          <View style={styles.headerBoarder}></View>
          <View style={styles.headTextBox}>
            <Text style={styles.headerText}>{this.state.fullTabName}</Text>
          </View>
        </View>
        {this.state.curentTab === 'verification' && <Verification changeTab={changeTab} alert={this.props.alert} navigation={this.props.navigation} token={this.props.token} seller_info={this.props.seller_info} />}
        {this.state.curentTab === 'gst' && <GstMsme changeTab={changeTab} alert={this.props.alert} navigation={this.props.navigation} token={this.props.token} />}
        {this.state.curentTab === 'bank' && <Banking changeTab={changeTab} alert={this.props.alert} navigation={this.props.navigation} token={this.props.token} />}
        {this.state.curentTab === 'billing' && <Billing changeTab={changeTab} alert={this.props.alert} navigation={this.props.navigation} token={this.props.token} setBillingAddress={setBillingAddress} />}
        {this.state.curentTab === 'shipping' && <Shipping billing_address={this.state.billing_address} changeTab={changeTab} alert={this.props.alert} navigation={this.props.navigation} token={this.props.token} setShippingAddress={setShippingAddress} />}
        {this.state.curentTab === 'return' && <Return shipping_address={this.state.shipping_address} changeTab={changeTab} alert={this.props.alert} navigation={this.props.navigation} token={this.props.token} />}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    position: 'relative',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 134,
    height: 40,
  },
  header: {
    position: 'relative',
    marginTop: 10,
  },
  headerBoarder: {
    width: '100%',
    height: 2,
    backgroundColor: '#bbb',
  },
  headerText: {
    fontFamily: 'Roboto-Medium',
    backgroundColor: 'white',
    padding: 10,
  },
  headTextBox: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    top: -20,
  },
});
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(Onboarding);
