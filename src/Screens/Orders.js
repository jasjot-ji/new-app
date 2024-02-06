import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, ScrollView, Pressable, ActivityIndicator, BackHandler} from 'react-native';
import logo from '../Assets/images/logo.png';
import Sidebar from '../Components/Common/Sidebar';
import {SafeAreaView} from 'react-native-safe-area-context';
import FIcon from 'react-native-vector-icons/Foundation';
import Categories from '../Components/Lisiting/Categories';
import {connect} from 'react-redux';
import {baseUrl} from '../baseUrl';
import OrdersCard from '../Components/Orders/OrdersCard';

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'categories',
      sidebarOpened: false,
      status: 'All',
      all_orders: null,
    };
  }
  componentDidMount() {
    var myHeaders = new Headers();
    myHeaders.append('token', this.props.token);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${baseUrl}/orders/get_all_orders/0`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          this.setState({
            all_orders: result.data,
          });
        } else {
          this.setState({
            all_orders: [],
          });
        }
      })
      .catch(error => console.log('error', error));
    BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButtonClick(this.props));
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick(props) {
    props.navigation.goBack();
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.status !== this.state.status) {
      this.setState({
        all_orders: null,
      });
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/orders/get_all_orders/0${this.state.status !== 'All' ? `?status=${this.state.status}` : ''}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            this.setState({
              all_orders: result.data,
            });
          } else {
            this.setState({
              all_orders: [],
            });
          }
        })
        .catch(error => console.log('error', error));
    }
  }
  render() {
    const changeTab = tab => {
      this.setState({currentTab: tab});
    };
    const closeSideBar = () => {
      this.setState({sidebarOpened: false});
    };
    const changeStatus = status => {
      this.setState({
        status: status,
      });
    };
    const fetchOrdersAgain = () => {
      this.setState({
        all_orders: null,
      });
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/orders/get_all_orders/0${this.state.status !== 'All' ? `?status=${this.state.status}` : ''}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            this.setState({
              all_orders: result.data,
            });
          } else {
            this.setState({
              all_orders: [],
            });
          }
        })
        .catch(error => console.log('error', error));
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
        <View style={{width: '100%', padding: 10, backgroundColor: '#E6EDFF', paddingHorizontal: 20}}>
          <Text style={{fontFamily: 'Roboto-Medium', marginBottom: 2, textTransform: 'uppercase'}}>Seller Fulfilled Orders</Text>
        </View>
        <View>
          <ScrollView horizontal={true} contentContainerStyle={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 20}}>
            <Pressable onPress={() => changeStatus('All')}>
              <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium', paddingTop: 15, paddingBottom: 2, borderBottomWidth: 2, borderBottomColor: this.state.status === 'All' ? '#FF9500' : '#ffffff', marginLeft: 20}}>All Orders</Text>
            </Pressable>
            <Pressable onPress={() => changeStatus('Pending')}>
              <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium', paddingTop: 15, paddingBottom: 2, borderBottomWidth: 2, borderBottomColor: this.state.status === 'Pending' ? '#FF9500' : '#ffffff'}}>Pending</Text>
            </Pressable>
            <Pressable onPress={() => changeStatus('Processing')}>
              <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium', paddingTop: 15, paddingBottom: 2, borderBottomWidth: 2, borderBottomColor: this.state.status === 'Processing' ? '#FF9500' : '#ffffff'}}>Processing</Text>
            </Pressable>
            <Pressable onPress={() => changeStatus('Cancelled')}>
              <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium', paddingTop: 15, paddingBottom: 2, borderBottomWidth: 2, borderBottomColor: this.state.status === 'Cancelled' ? '#FF9500' : '#ffffff'}}>Canceled</Text>
            </Pressable>
            <Pressable onPress={() => changeStatus('Shipped')}>
              <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium', paddingTop: 15, paddingBottom: 2, borderBottomWidth: 2, borderBottomColor: this.state.status === 'Shipped' ? '#FF9500' : '#ffffff'}}>Shipped</Text>
            </Pressable>
            <Pressable onPress={() => changeStatus('Delivered')}>
              <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium', paddingTop: 15, paddingBottom: 2, borderBottomWidth: 2, borderBottomColor: this.state.status === 'Delivered' ? '#FF9500' : '#ffffff', marginRight: 20}}>Delivered</Text>
            </Pressable>
          </ScrollView>
        </View>
        <View style={styles.innerContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {this.state.all_orders ? (
              this.state.all_orders.length > 0 ? (
                this.state.all_orders.map((order, i) => <OrdersCard key={i} order={order} alert={this.props.alert} navigation={this.props.navigation} fetchOrdersAgain={fetchOrdersAgain} />)
              ) : (
                <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16, marginTop: 10}}>No Order Found !</Text>
              )
            ) : (
              <View style={{paddingVertical: 30}}>
                <ActivityIndicator size={30} color={'#0000ff'} />
              </View>
            )}
          </ScrollView>
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
    paddingHorizontal: 20,
    marginTop: 10,
    height: '100%',
    flexShrink: 1,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: 'black',
    marginBottom: 10,
  },
});
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(Orders);
