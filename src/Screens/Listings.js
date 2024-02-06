import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, ScrollView, Pressable, BackHandler} from 'react-native';
import logo from '../Assets/images/logo.png';
import Sidebar from '../Components/Common/Sidebar';
import {SafeAreaView} from 'react-native-safe-area-context';
import Categories from '../Components/Lisiting/Categories';
import SingleListings from '../Components/Lisiting/SingleListings';
import CategorySelect from '../Components/Lisiting/AddListing/CategorySelect';
import AddImages from '../Components/Lisiting/AddListing/AddImages';
import ProductDetails from '../Components/Lisiting/AddListing/ProductDetails';
import AlreadyListed from '../Components/Lisiting/AlreadyListed/SelectProduct';
import ProductDetailsAL from '../Components/Lisiting/AlreadyListed/ProductDetailsAL';
import FIcon from 'react-native-vector-icons/Foundation';

export default class Listings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'categories',
      sidebarOpened: false,
      path: '',
      selectedCategory: null,
      selectedImages: null,
      dsin: '',
      selectedProduct: null,
      selectedStatus: null,
      catalogType: null,
      selectedCatalog: null,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    const resetState = () => {
      this.setState({
        sidebarOpened: false,
        path: '',
        selectedCategory: null,
        selectedImages: null,
        dsin: '',
        selectedProduct: null,
        selectedStatus: null,
        catalogType: null,
        selectedCatalog: null,
      });
    };
    if (this.state.currentTab === 'categories') {
      this.props.navigation.goBack();
    } else if (this.state.currentTab === 'singleListing') {
      this.setState({
        currentTab: 'categories',
      });
      resetState();
    } else if (this.state.currentTab === 'categorySelect') {
      this.setState({
        currentTab: 'categories',
      });
      resetState();
    }else if (this.state.currentTab === 'addImages') {
      this.setState({
        currentTab: 'categorySelect',
      });
      this.setState({
        sidebarOpened: false,
        path: '',
        selectedCategory: null,
        selectedImages: null,
        dsin: '',
        selectedProduct: null,
        selectedStatus: null,
        catalogType: null,
        selectedCatalog: null,
      });
    }else if (this.state.currentTab === 'productDetails') {
      this.setState({
        currentTab: 'addImages',
      });
      this.setState({
        sidebarOpened: false,
        dsin: '',
        selectedProduct: null,
        selectedStatus: null,
        catalogType: null,
        selectedCatalog: null,
      });
    }else if (this.state.currentTab === 'alreadyListed') {
      this.setState({
        currentTab: 'categories',
      });
      resetState();
    }else if (this.state.currentTab === 'productDetailsAL') {
      this.setState({
        currentTab: 'alreadyListed',
      });
    }
    return true;
  }
  render() {
    const changeTab = tab => {
      this.setState({currentTab: tab});
    };
    const closeSideBar = () => {
      this.setState({sidebarOpened: false});
    };
    const selectCategory = (category, path) => {
      this.setState({
        path: path,
        selectedCategory: category,
      });
    };
    const setImages = images => {
      this.setState({selectedImages: images});
    };
    const setDSIN = dsin => {
      this.setState({dsin: dsin});
    };
    const selectProduct = product => {
      this.setState({selectedProduct: product});
    };
    const setStatus = status => {
      this.setState({selectedStatus: status});
    };
    const setCatalogType = type => {
      this.setState({catalogType: type});
    };
    const setCatalogID = ID => {
      this.setState({selectedCatalog: ID});
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
          {this.state.currentTab === 'categories' && <Categories navigation={this.props.navigation} alert={this.props.alert} changeTab={changeTab} setDSIN={setDSIN} setStatus={setStatus} />}
          {this.state.currentTab === 'singleListing' && <SingleListings navigation={this.props.navigation} alert={this.props.alert} changeTab={changeTab} status={this.state.selectedStatus} setCatalogType={setCatalogType} setCatalogID={setCatalogID} />}
          {this.state.currentTab === 'categorySelect' && <CategorySelect navigation={this.props.navigation} alert={this.props.alert} changeTab={changeTab} selectCategory={selectCategory} />}
          {this.state.currentTab === 'addImages' && <AddImages setCatalogType={setCatalogType} selectedCategory={this.state.selectedCategory} path={this.state.path} navigation={this.props.navigation} alert={this.props.alert} changeTab={changeTab} setImages={setImages} images={this.state.selectedImages} />}
          {this.state.currentTab === 'productDetails' && <ProductDetails navigation={this.props.navigation} alert={this.props.alert} changeTab={changeTab} path={this.state.path} selectedCategory={this.state.selectedCategory} selectedImages={this.state.selectedImages} catalogType={this.state.catalogType} selectedCatalog={this.state.selectedCatalog} />}
          {this.state.currentTab === 'alreadyListed' && <AlreadyListed navigation={this.props.navigation} alert={this.props.alert} changeTab={changeTab} dsin={this.state.dsin} selectProduct={selectProduct} />}
          {this.state.currentTab === 'productDetailsAL' && <ProductDetailsAL navigation={this.props.navigation} alert={this.props.alert} changeTab={changeTab} selectedProduct={this.state.selectedProduct} />}
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
