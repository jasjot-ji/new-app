import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, ScrollView, Pressable} from 'react-native';
import logo from '../Assets/images/logo.png';
import Sidebar from '../Components/Common/Sidebar';
import {SafeAreaView} from 'react-native-safe-area-context';
import FIcon from 'react-native-vector-icons/Foundation';
import SelectCategory from '../Components/Inventory/SelectCategory';
import SingleInventory from '../Components/Inventory/SingleInventory';
import ActivationList from '../Components/Inventory/ActivationList';
import ProductDetails from '../Components/Inventory/ProductDetails';

export default class Listings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'categories',
      inventory_type: null,
      sidebarOpened: false,
      selectedProduct: null,
    };
  }
  render() {
    const changeTab = tab => {
      this.setState({currentTab: tab});
    };
    const closeSideBar = () => {
      this.setState({sidebarOpened: false});
    };
    const setInventoryType = type => {
      this.setState({inventory_type: type});
    };
    const selectProduct = product => {
      this.setState({selectedProduct: product});
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
          {this.state.currentTab === 'categories' && <SelectCategory selectProduct={selectProduct} navigation={this.props.navigation} alert={this.props.alert} changeTab={changeTab} setInventoryType={setInventoryType} />}
          {this.state.currentTab === 'singleInventory' && <SingleInventory selectProduct={selectProduct} navigation={this.props.navigation} alert={this.props.alert} changeTab={changeTab} inventory_type={this.state.inventory_type} />}
          {this.state.currentTab === 'activation' && <ActivationList navigation={this.props.navigation} alert={this.props.alert} changeTab={changeTab} inventory_type={this.state.inventory_type} />}
          {this.state.currentTab === 'productDetails' && <ProductDetails selectedProduct={this.state.selectedProduct} navigation={this.props.navigation} alert={this.props.alert} changeTab={changeTab} />}
        </View>
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
});
