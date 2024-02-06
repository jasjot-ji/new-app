import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable, ActivityIndicator, BackHandler} from 'react-native';
import logo from '../Assets/images/logo.png';
import DashboardCard from '../Components/Dashboard/DashboardCard';
import Sidebar from '../Components/Common/Sidebar';
import FIcon from 'react-native-vector-icons/Foundation';
import {connect} from 'react-redux';
import {baseUrl} from '../baseUrl';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpened: false,
      dashboard_data: null,
    };
  }
  componentDidMount() {
    var myHeaders = new Headers();
    myHeaders.append('token', this.props.token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${baseUrl}/orders/seller_analytics`, requestOptions)
      .then(response => response.json())
      .then(result =>
        this.setState({
          dashboard_data: result,
        }),
      )
      .catch(error => console.log('error', error));
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  handleBackButtonClick() {
    return true;
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
        <View style={{width: '100%', padding: 10, backgroundColor: '#E6EDFF', paddingHorizontal: 20}}>
          <Text style={{fontFamily: 'Roboto-Medium', textTransform: 'uppercase'}}>Welcome Back! {this.props.seller_info?.seller_name}</Text>
        </View>
        <ScrollView style={styles.innerContainer}>
          {this.state.dashboard_data ? (
            <>
              <Text style={styles.flexHeading}>Overview</Text>
              <Text style={styles.welcomeText}>Here is the information about all your earnings.</Text>
              <View style={styles.dashboardFlex}>
                <DashboardCard status={'Total Earnings'} count={this.state.dashboard_data.total_earnings} />
                <DashboardCard status={'Total Orders'} count={this.state.dashboard_data.total_orders} />
              </View>
              <Text style={styles.flexHeading}>SELLER FULLFILLED ORDERS</Text>
              <Text style={styles.welcomeText}>Here is the information about all your orders.</Text>
              <View style={styles.dashboardFlex}>
                {this.state.dashboard_data.order_status.map((os, i) => (
                  <DashboardCard key={i} status={os.order_status} count={os.count} />
                ))}
              </View>
              <Text style={styles.flexHeading}>PRODUCTS LISTING</Text>
              <Text style={styles.welcomeText}>Here is the information about all your listings.</Text>
              <View style={styles.dashboardFlex}>
                {this.state.dashboard_data.product_status.map((os, i) => (
                  <DashboardCard key={i} status={os.status} count={os.count} />
                ))}
              </View>
            </>
          ) : (
            <View style={{paddingVertical: 10}}>
              <ActivityIndicator size={40} color={'#0000ff'} />
            </View>
          )}
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
    flexDirection: 'row',
    paddingVertical: 20,
    position: 'relative',
  },
  logo: {
    width: 100,
    height: 30,
  },
  innerContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
    color: 'black',
  },
  welcomeText: {
    color: '#00000070',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  dashboardFlex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
  },
  flexHeading: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    width: '100%',
  },
});
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(Dashboard);
