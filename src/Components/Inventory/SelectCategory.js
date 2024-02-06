import React, {Component} from 'react';
import {Text, ScrollView, View, TextInput, StyleSheet, Image, Pressable} from 'react-native';
import searchIcon from '../../Assets/icons/search.png';
import AIcon from 'react-native-vector-icons/AntDesign';
import InventoryCard from './InventoryCard';
import {baseUrl} from '../../baseUrl';
import {connect} from 'react-redux';

class SelectCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
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

    fetch(`${baseUrl}/prd_lst/get_inventory_products/0`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          this.setState({
            products: result.data,
          });
        } else {
          this.setState({
            products: [],
          });
        }
      })
      .catch(error => console.log('error', error));
  }
  render() {
    return (
      <View style={{paddingHorizontal: 10}}>
        <View style={{width: '100%', padding: 10, backgroundColor: '#E6EDFF', paddingHorizontal: 20}}>
          <Text style={{fontFamily: 'Roboto-Medium', marginBottom: 2, textTransform: 'uppercase'}}>INVENTORY</Text>
        </View>
        <ScrollView>
          <View style={{padding: 10, position: 'relative', marginVertical: 5}}>
            <TextInput style={styles.input} placeholder="Search listing with sku" />
            <Image source={searchIcon} style={{width: 25, height: 25, position: 'absolute', right: 20, top: 15}} />
          </View>
          <View style={{paddingHorizontal: 15}}>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', width: '100%'}}>
              <Pressable
                onPress={() => {
                  this.props.changeTab('singleInventory');
                  this.props.setInventoryType('paused');
                }}
                style={{padding: 5, width: '50%'}}>
                <View style={{borderWidth: 1, borderColor: '#000', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{width: '100%', flexShrink: 1}}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}} numberOfLines={1}>
                      PAUSED
                    </Text>
                  </View>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  this.props.changeTab('singleInventory');
                  this.props.setInventoryType('active');
                }}
                style={{padding: 5, width: '50%'}}>
                <View style={{borderWidth: 1, borderColor: '#000', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{width: '100%', flexShrink: 1}}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}} numberOfLines={1}>
                      ACTIVE
                    </Text>
                  </View>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  this.props.changeTab('singleInventory');
                  this.props.setInventoryType('blocked');
                }}
                style={{padding: 5, width: '50%'}}>
                <View style={{borderWidth: 1, borderColor: '#000', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{width: '100%', flexShrink: 1}}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}} numberOfLines={1}>
                      BLOCKED
                    </Text>
                  </View>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  this.props.changeTab('activation');
                  this.props.setInventoryType(null);
                }}
                style={{padding: 5, width: '50%'}}>
                <View style={{borderWidth: 1, borderColor: '#000', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{width: '100%', flexShrink: 1}}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}} numberOfLines={1}>
                      FOR ACTIVATION
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>
          <View style={{width: '100%', padding: 10, backgroundColor: '#E6EDFF', paddingHorizontal: 20, marginVertical: 10}}>
            <Text style={{fontFamily: 'Roboto-Medium', marginBottom: 2, textTransform: 'uppercase'}}>ALL PRODUCTS</Text>
          </View>
          <View style={{paddingHorizontal: 20}}>
            {this.state.products &&
              (this.state.products.length > 0 ? (
                this.state.products.map((product, i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      this.props.changeTab('productDetails');
                      this.props.selectProduct(product);
                    }}>
                    <InventoryCard product={product} />
                  </Pressable>
                ))
              ) : (
                <Text style={{fontSize: 16, fontFamily: 'Roboto-Medium'}}>No Products Found!</Text>
              ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    fontSize: 12,
    color: 'black',
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontFamily: 'Roboto-Regular',
    elevation: 5,
    width: '100%',
  },
});
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(SelectCategory);
