import React, {Component} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import productImage from '../../Assets/images/product.png';
import { connect } from 'react-redux';
import { baseUrl } from '../../baseUrl';

class ListingCard extends Component {
  render() {
    const {product} = this.props;
    console.log(product);
    const deleteDraft = () => {
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        product_id: product.product_id,
        dsin: product.dsin,
        catalog_id: product.catalog_id,
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/prd_lst/delete_catalog_prdct`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          if(result.status === "success"){
            this.props.alert(result.msg, "success");
            this.props.changeTab("categories")
          }
          else{
            this.props.alert(result.data || result.msg, "error")
          }
        })
        .catch(error => console.log('error', error));
    };
    return (
      <View style={{width: '100%', borderRadius: 10, borderWidth: 1, borderColor: '#000', padding: 10, marginVertical: 10}}>
        {!(this.props.type === 'product-info') && (
          <View style={{display: 'flex', flexDirection: 'row', marginBottom: 10}}>
            <Text style={{paddingHorizontal: 10, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 12, textAlign: 'center', verticalAlign: 'middle'}}>{product ? product.status : ''}</Text>
          </View>
        )}
        <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
          <Image source={{uri: product ? product.products_images[0].url : ''}} style={{width: 75, height: 75}} />
          <View style={{width: '100%', flexShrink: 1}}>
            {product && product.product_name && (
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16, marginBottom: 2}} numberOfLines={1}>
                {product ? product.product_name.en : ''}
              </Text>
            )}
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Catalog ID : </Text>
              <Text style={{fontSize: 12}}>{product ? product.catalog_id : ''}</Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>DSIN : </Text>
              <Text style={{fontSize: 12}}>{product ? product.dsin : ''}</Text>
            </View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Status : </Text>
              <Text style={{fontSize: 12}}>{product ? product.status : ''}</Text>
            </View>
            {!(this.props.type === 'product-info') && (
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Uploaded By : </Text>
                <Text style={{fontSize: 12}}>{product ? product.uploaded_by : ''}</Text>
              </View>
            )}
          </View>
        </View>
        {!(this.props.type === 'product-info') && product && (product.status === 'LIVE' || product.status === 'DRAFT') && (
          <View style={{display: 'flex', flexDirection: 'row', gap: 10, marginTop: 10}}>
            <Pressable
              style={{width: '100%', flexShrink: 1}}
              onPress={() => {
                this.props.setCatalogType('edit-draft');
                this.props.setCatalogID(product.catalog_id);
                this.props.changeTab('productDetails');
              }}>
              <Text style={{paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 14, textAlign: 'center', verticalAlign: 'middle', width: '100%'}}>Edit</Text>
            </Pressable>
            {product.status === 'DRAFT' && <Pressable style={{width: '100%', flexShrink: 1}} onPress={() => deleteDraft()}><Text style={{paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 14, textAlign: 'center', verticalAlign: 'middle', width: '100%'}}>Delete</Text></Pressable>}
          </View>
        )}
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    token: state.token,
    seller_info: state.seller_info,
  };
};
export default connect(mapStateToProps, null)(ListingCard);