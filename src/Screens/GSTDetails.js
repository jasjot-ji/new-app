import React, {Component} from 'react';
import {ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, FlatList, Image} from 'react-native';
import logo from '../Assets/images/logo.png';
import {connect} from 'react-redux';
import Sidebar from '../Components/Common/Sidebar';
import FIcon from 'react-native-vector-icons/Foundation';

class GstDetails extends Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
    this.state = {
      gst: '',
      gstButtonDisabled: false,
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
        <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, backgroundColor: '#E6EDFF', marginBottom: 10, paddingHorizontal: 20}}>Tax Details</Text>
        <ScrollView style={{paddingHorizontal: 20}}>
          {this.props.seller_info &&
            this.props.seller_info.sellers_gst_details.map((gst, i) => (
              <View style={styles.GSTCard} key={i}>
                <Text style={styles.GSTHeading}>{gst.business_name}</Text>
                <Text style={styles.GSTText}>GSTN : {gst.gst_number}</Text>
                <Text style={styles.GSTText}>Business Type : {gst.business_type}</Text>
                <Text style={styles.GSTText}>Address : {gst.registered_business_address}</Text>
              </View>
            ))}
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
  field: {
    marginVertical: 5,
  },
  label: {
    fontSize: 12,
    color: '#00000080',
    fontFamily: 'Roboto-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#697475',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginTop: 3,
    fontSize: 12,
  },
  submitButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 150,
    backgroundColor: '#FFD814',
    color: 'black',
    fontFamily: 'Roboto-Bold',
    borderRadius: 20,
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 10,
    elevation: 5,
    shadowColor: '#000000',
    paddingHorizontal: 30,
  },
  GSTCard: {
    padding: 10,
    borderColor: '#ABABAB',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 5,
  },
  GSTHeading: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginBottom: 2,
  },
  GSTText: {
    fontSize: 12,
    marginTop: 2,
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
});

const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(GstDetails);
