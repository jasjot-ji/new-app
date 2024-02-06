import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, ScrollView, Pressable} from 'react-native';
import logo from '../Assets/images/logo.png';
import securityIcon from '../Assets/images/security.png';
import addressIcon from '../Assets/images/location.png';
import bankIcon from '../Assets/images/bank.png';
import taxIcon from '../Assets/images/tax.png';
import Sidebar from '../Components/Common/Sidebar';
import {SafeAreaView} from 'react-native-safe-area-context';
import FIcon from 'react-native-vector-icons/Foundation';

export default class Settings extends Component {
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
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Settings</Text>
          <Pressable style={styles.settingsCard} onPress={() => this.props.navigation.navigate('Security')}>
            <View style={styles.cardImage}>
              <Image source={securityIcon} style={styles.icon} />
            </View>
            <View style={{flexShrink: 1, width: '100%', marginLeft: 20}}>
              <Text style={styles.cardHeading}>Login & Security</Text>
              <Text style={styles.cardDescription}>Change or Reset your Login Credentials.</Text>
            </View>
          </Pressable>
          <Pressable style={styles.settingsCard} onPress={() => this.props.navigation.navigate('Address')}>
            <View style={styles.cardImage}>
              <Image source={addressIcon} style={styles.icon} />
            </View>
            <View style={{flexShrink: 1, width: '100%', marginLeft: 20}}>
              <Text style={styles.cardHeading}>Your Addresses</Text>
              <Text style={styles.cardDescription}>Edit or View your saved addresses.</Text>
            </View>
          </Pressable>
          <Pressable style={styles.settingsCard} onPress={() => this.props.navigation.navigate('BankDetails')}>
            <View style={styles.cardImage}>
              <Image source={bankIcon} style={styles.icon} />
            </View>
            <View style={{flexShrink: 1, width: '100%', marginLeft: 20}}>
              <Text style={styles.cardHeading}>Bank Deatils</Text>
              <Text style={styles.cardDescription}>Edit or View your banking details.</Text>
            </View>
          </Pressable>
          <Pressable style={styles.settingsCard} onPress={() => this.props.navigation.navigate('GSTDetails')}>
            <View style={styles.cardImage}>
              <Image source={taxIcon} style={styles.icon} />
            </View>
            <View style={{flexShrink: 1, width: '100%', marginLeft: 20}}>
              <Text style={styles.cardHeading}>Tax Deatils</Text>
              <Text style={styles.cardDescription}>Edit or View your tax details.</Text>
            </View>
          </Pressable>
        </View>
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
    width: 100,
    height: 30,
  },
  innerContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: 'black',
    marginBottom: 10,
  },
  settingsCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
  },
  cardImage: {
    width: 50,
    height: 50,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  cardHeading: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  cardDescription: {
    fontSize: 12,
    marginTop: 2,
  },
});
