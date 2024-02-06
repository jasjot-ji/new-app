import React, {Component} from 'react';
import {Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import {baseUrl} from '../../baseUrl';
import InventoryCard from './InventoryCard';
import productImage from '../../Assets/images/product.png';
import {TextInput} from 'react-native-gesture-handler';
import EIcon from 'react-native-vector-icons/Entypo';
import {Picker} from '@react-native-picker/picker';

const GetTableFormInput = ({id, name, identifier, type, required, description, placeholder, options, value, changeValue}) => {
  if (type === 'text') {
    return (
      <View style={{width: 150, borderColor: 'black', borderWidth: 1, paddingVertical: 10}}>
        <View style={{paddingHorizontal: 10}}>
          <TextInput numberOfLines={1} style={styles.tableInput} placeholder={placeholder} value={value} onChangeText={e => changeValue(e)} />
        </View>
      </View>
    );
  } else if (type === 'select') {
    return (
      <View style={{width: 150, borderColor: 'black', borderWidth: 1, paddingVertical: 10}}>
        <View style={{paddingHorizontal: 10}}>
          <View style={styles.tablePickerBox}>
            <Picker itemStyle={styles.picker} mode="modal" selectedValue={value} onValueChange={e => changeValue(e)}>
              <Picker.Item label="Select" value="" />
              {options?.map(value => (
                <Picker.Item label={value} value={value} key={value} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    );
  } else if (type === 'number') {
    return (
      <View style={{width: 150, borderColor: 'black', borderWidth: 1, paddingVertical: 10}}>
        <View style={{paddingHorizontal: 10}}>
          <TextInput numberOfLines={1} style={styles.tableInput} placeholder={placeholder} value={value} onChangeText={e => changeValue(e)} keyboardType="numeric" />
        </View>
      </View>
    );
  } else {
    return <Text>...</Text>;
  }
};

class SingleInventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_variantion: null,
      update_type: null,
      inventory: '',
      formData: null,
      product_data: null,
      showSizeOptions: false,
      selectedVariations: [],
      selectedFullVariations: [],
      variationsData: [],
    };
  }
  componentDidMount() {
    var myHeaders = new Headers();
    myHeaders.append('token', this.props.token);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      category_4_id: this.props.selectedProduct.product.category_4_id,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${baseUrl}/prd_lst/get_new_variant_flds`, requestOptions)
      .then(response => response.json())
      .then(result => {
        let pr = {
          seller_products_id: this.props.selectedProduct.seller_products_id,
          product_variations: [],
        };
        this.setState({formData: result, product_data: pr});
      })
      .catch(error => console.log('error', error));
  }
  render() {
    const product = this.props.selectedProduct;
    console.log(this.state);
    const editInventory = () => {
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        seller_products_variants_id: this.state.selected_variantion.seller_products_variants_id,
        inventory: this.state.inventory,
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch('https://marketplaceapi.quadbtech.com/api/v1/seller/prd_lst/edit_inventory', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            this.props.alert(result.msg, 'success');
            this.props.changeTab('categories');
          } else {
            this.props.alert(result.msg, 'error');
          }
        })
        .catch(error => console.log('error', error));
    };
    const pauseInventory = variant => {
      this.setState({
        update_type: null,
        selected_variantion: null,
      });
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        seller_products_variants_id: [variant.seller_products_variants_id],
      });

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/prd_lst/pause_seller_prdct_variant`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            this.props.alert(result.msg, 'success');
            this.props.changeTab('categories');
          } else {
            this.props.alert(result.msg, 'error');
          }
        })
        .catch(error => console.log('error', error));
    };
    const toggleVariation = variation => {
      if (this.state.selectedVariations.includes(variation.name)) {
        let arr, arr2;
        arr = this.state.selectedVariations.filter(function (selected_variation) {
          return selected_variation !== variation.name;
        });
        arr2 = this.state.selectedFullVariations.filter(function (selected_variation) {
          return selected_variation.name !== variation.name;
        });
        this.setState({selectedVariations: arr, selectedFullVariations: arr2});
      } else {
        let arr = [...this.state.selectedVariations],
          arr2 = [...this.state.selectedFullVariations];
        arr.push(variation.name);
        arr2.push(variation);

        this.setState({selectedVariations: arr, selectedFullVariations: arr2});
      }
    };

    const getVariations = variationsData => {
      let pvArr = [];
      variationsData.forEach(vd => {
        let attributesArr = [];
        this.state.formData.productvariationdatafields.forEach((field, i) => {
          const attributes = {
            name: field.productVarFields.name,
            identifier: field.productVarFields.identifier,
            value: '',
          };
          attributesArr = [...attributesArr, Object.assign({}, attributes)];
        });
        let pv = {};
        if (vd.sku === 'free-size') {
          pv = {
            variation_value: 'Free Size',
            variation_name: 'Free Size',
            variation_name_sku: 'free-size',
            variation_value_sku: 'free-size',
            inventory: '',
            seller_price: '',
            supplier_sku_id: '',
            product_mrp: '',
            variation_attributes: [...attributesArr],
          };
        } else {
          pv = {
            variation_value: vd.name,
            variation_name: 'Size',
            variation_name_sku: 'size',
            variation_value_sku: vd.sku,
            inventory: '',
            seller_price: '',
            supplier_sku_id: '',
            product_mrp: '',
            variation_attributes: [...attributesArr],
          };
        }
        pvArr.push(Object.assign({}, pv));
      });
      let pd = this.state.product_data;
      pd.product_variations = [...pvArr];
      this.setState({product_data: pd});
    };

    const applyVariations = () => {
      this.setState({showSizeOptions: false, variationsData: this.state.selectedFullVariations});
      getVariations(this.state.selectedFullVariations);
    };
    const resetVariations = () => {
      this.setState({
        showSizeOptions: false,
        selectedVariations: [],
        selectedFullVariations: [],
        variationsData: [],
      });
      let pd = this.state.product_data;
      pd.product_variations = [];
      this.setState({product_data: pd});
    };
    const addVariant = () => {
      var myHeaders = new Headers();
      myHeaders.append('token', this.props.token);
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify(this.state.product_data);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };

      fetch(`${baseUrl}/prd_lst/add_new_variant`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status === 'success') {
            this.props.alert(result.msg, 'success');
            this.props.changeTab('categories');
          } else {
            this.props.alert(result.msg, 'error');
          }
        })
        .catch(error => console.log('error', error));
    };
    return (
      <View>
        <View style={{width: '100%', padding: 10, backgroundColor: '#E6EDFF', paddingHorizontal: 20}}>
          <Text style={{fontFamily: 'Roboto-Medium', marginBottom: 2, textTransform: 'uppercase'}}>INVENTORY DETAILS</Text>
        </View>
        <ScrollView style={{marginBottom: 130}}>
          <View style={{paddingHorizontal: 20}}>
            <View style={{width: '100%', borderRadius: 10, borderWidth: 1, borderColor: '#000', padding: 10, marginVertical: 10}}>
              <View style={{display: 'flex', flexDirection: 'row', marginBottom: 10}}>
                <Text style={{paddingHorizontal: 10, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 12, textAlign: 'center', verticalAlign: 'middle'}}>{product.status}</Text>
              </View>
              <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                <Image source={{uri: product.product.products_images[0].url}} style={{width: 75, height: 75}} />
                <View style={{width: '100%', flexShrink: 1}}>
                  <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16, marginBottom: 2}} numberOfLines={2}>
                    {product.product.product_name_n}
                  </Text>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Catalog ID : </Text>
                    <Text style={{fontSize: 12}}>{product.catalog_id}</Text>
                  </View>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>DSIN : </Text>
                    <Text style={{fontSize: 12}}>{product.dsin}</Text>
                  </View>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Uploaded By : </Text>
                    <Text style={{fontSize: 12}}>{product.uploaded_by}</Text>
                  </View>
                </View>
              </View>
              <Text style={{fontFamily: 'Roboto-Medium', marginTop: 10, paddingVertical: 5, borderTopColor: '#000', borderTopWidth: StyleSheet.hairlineWidth}} numberOfLines={2}>
                Product Variants
              </Text>
              {product.seller_products_variants.map((variant, i) => (
                <View key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', gap: 10, borderColor: '#000', borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 10}}>
                  <View>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}}>Variation : </Text>
                      <Text style={{fontSize: 14}}>{variant.product_variant.variation_value}</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>SKU : </Text>
                      <Text style={{fontSize: 12}}>{variant.supplier_sku_id}</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Stock : </Text>
                      <Text style={{fontSize: 12}}>{variant.inventory}</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <Text style={{fontFamily: 'Roboto-Medium', fontSize: 12}}>Price : </Text>
                      <Text style={{fontSize: 12}}>{variant.seller_price}</Text>
                    </View>
                  </View>
                  <View style={{width: '100%', flexShrink: 1, gap: 10, maxWidth: '50%'}}>
                    <View>
                      {(!this.state.selected_variantion || this.state.selected_variantion.seller_products_variants_id !== variant.seller_products_variants_id) && (
                        <Pressable
                          onPress={() => {
                            this.setState({
                              update_type: 'edit',
                              selected_variantion: variant,
                            });
                          }}>
                          <Text style={{paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 14, textAlign: 'center', verticalAlign: 'middle', width: '100%'}}>Edit</Text>
                        </Pressable>
                      )}
                      {this.state.selected_variantion && this.state.selected_variantion.seller_products_variants_id === variant.seller_products_variants_id && (
                        <Pressable
                          onPress={() => {
                            this.setState({
                              update_type: null,
                              selected_variantion: null,
                            });
                          }}>
                          <Text style={{paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, color: '#000', fontFamily: 'Roboto-Medium', backgroundColor: '#FFDFDF', borderColor: '#FF7F7F', borderWidth: 2, fontSize: 14, textAlign: 'center', verticalAlign: 'middle', width: '100%'}}>Cancel</Text>
                        </Pressable>
                      )}
                    </View>
                    {!variant.is_pause && (
                      <Pressable onPress={() => pauseInventory(variant)}>
                        <Text style={{paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 14, textAlign: 'center', verticalAlign: 'middle', width: '100%'}}>Pause</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}
              {!product.seller_products_variants[0].is_pause && !(this.state.update_type === 'new-variant') && (
                <Pressable onPress={() => this.setState({update_type: 'new-variant', selected_variantion: null})}>
                  <Text style={{paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, color: '#697475', fontFamily: 'Roboto-Medium', backgroundColor: '#FEF6EB', borderColor: '#FFE5C7', borderWidth: 2, fontSize: 14, textAlign: 'center', verticalAlign: 'middle', width: '100%', marginTop: 10}}>Add New Variant</Text>
                </Pressable>
              )}
              {this.state.update_type === 'new-variant' && (
                <Pressable onPress={() => this.setState({update_type: null, selected_variantion: null})}>
                  <Text style={{paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, color: '#000', fontFamily: 'Roboto-Medium', backgroundColor: '#FFDFDF', borderColor: '#FF7F7F', borderWidth: 2, fontSize: 14, textAlign: 'center', verticalAlign: 'middle', width: '100%', marginTop: 10}}>Cancel</Text>
                </Pressable>
              )}
            </View>
          </View>
          {this.state.update_type === 'edit' && this.state.selected_variantion && (
            <>
              <View style={{width: '100%', padding: 10, backgroundColor: '#E6EDFF', paddingHorizontal: 20}}>
                <Text style={{fontFamily: 'Roboto-Medium', marginBottom: 2, textTransform: 'uppercase'}}>EDIT INVENTORY</Text>
              </View>
              <View style={{paddingHorizontal: 25, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#000', marginBottom: 10}}>
                <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
                  <View style={{display: 'flex', flexDirection: 'row', width: '50%', marginVertical: 5}}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16}}>Variation : </Text>
                    <Text style={{fontSize: 16}}>{this.state.selected_variantion.product_variant.variation_value}</Text>
                  </View>
                  <View style={{display: 'flex', flexDirection: 'row', width: '50%', marginVertical: 5}}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}}>SKU : </Text>
                    <Text style={{fontSize: 14}}>{this.state.selected_variantion.supplier_sku_id}</Text>
                  </View>
                  <View style={{display: 'flex', flexDirection: 'row', width: '50%', marginVertical: 5}}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}}>Stock : </Text>
                    <Text style={{fontSize: 14}}>{this.state.selected_variantion.inventory}</Text>
                  </View>
                  <View style={{display: 'flex', flexDirection: 'row', width: '50%', marginVertical: 5}}>
                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 14}}>Price : </Text>
                    <Text style={{fontSize: 14}}>{this.state.selected_variantion.seller_price}</Text>
                  </View>
                </View>
                <View style={styles.inputBox}>
                  <Text style={styles.label}>Inventory Stock</Text>
                  <TextInput
                    numberOfLines={1}
                    style={styles.input}
                    placeholder="Updated Inventory Stock"
                    keyboardType="numeric"
                    value={this.state.inventory}
                    onChangeText={e => {
                      this.setState({inventory: e});
                    }}
                  />
                </View>
                <Pressable style={{display: 'flex', flexDirection: 'row', marginTop: 5}} onPress={() => editInventory()}>
                  <Text style={{backgroundColor: 'green', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium', borderRadius: 5}}>Submit</Text>
                </Pressable>
              </View>
            </>
          )}
          {this.state.update_type === 'new-variant' && this.state.formData && (
            <>
              <View style={{width: '100%', padding: 10, backgroundColor: '#E6EDFF', paddingHorizontal: 20}}>
                <Text style={{fontFamily: 'Roboto-Medium', marginBottom: 2, textTransform: 'uppercase'}}>ADD NEW VARIANT</Text>
              </View>
              <View style={{paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#000', marginBottom: 10}}>
                <Pressable style={{position: 'relative'}} onPress={() => this.setState({showSizeOptions: !this.state.showSizeOptions})}>
                  <View style={styles.inputBox}>
                    <Text style={styles.label}>Select Size</Text>
                    <Text style={{borderWidth: 1, borderColor: '#697475', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10, fontSize: 16}}>Select Size</Text>
                  </View>
                </Pressable>
                {this.state.showSizeOptions && (
                  <View style={{backgroundColor: 'white', width: '100%', padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', borderWidth: 1, borderColor: 'black', zIndex: 999, flexDirection: 'row', borderRadius: 10, marginTop: 5}}>
                    <Pressable
                      style={{display: 'flex', alignItems: 'center', gap: 5, flexDirection: 'row', margin: 5, width: 110}}
                      onPress={() => {
                        toggleVariation(this.state.formData.productvariationsfields[1].variation);
                      }}>
                      <View style={{width: 15, height: 15, borderWidth: 1, borderColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{this.state.selectedVariations.includes(this.state.formData.productvariationsfields[1]?.variation.name) && <EIcon name="check" size={10} color="black" />}</View>
                      <Text>{this.state.formData.productvariationsfields[1]?.variation.name}</Text>
                    </Pressable>
                    {this.state.formData.productvariationsfields[0].variation.variation_values.map((variation, i) => (
                      <Pressable
                        key={i}
                        style={{display: 'flex', alignItems: 'center', gap: 5, flexDirection: 'row', margin: 5, width: 50}}
                        onPress={() => {
                          toggleVariation(variation);
                        }}>
                        <View style={{width: 15, height: 15, borderWidth: 1, borderColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{this.state.selectedVariations.includes(variation.name) && <EIcon name="check" size={10} color="black" />}</View>
                        <Text>{variation.name}</Text>
                      </Pressable>
                    ))}
                    <View style={{display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'center', paddingTop: 10, gap: 10}}>
                      <Pressable onPress={() => resetVariations()}>
                        <Text style={{backgroundColor: 'red', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium'}}>Reset</Text>
                      </Pressable>
                      <Pressable onPress={() => applyVariations()}>
                        <Text style={{backgroundColor: 'blue', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium'}}>Apply</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
                <ScrollView horizontal={true} style={{marginVertical: 10, borderColor: 'black'}}>
                  {this.state.product_data.product_variations.length > 0 && (
                    <View>
                      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'stretch'}}>
                        <View style={{width: 150, borderColor: 'black', borderWidth: 1}}>
                          <Text style={{textAlign: 'center', paddingBottom: 5, paddingHorizontal: 10, paddingTop: 10}}>Size</Text>
                        </View>
                        {this.state.formData.productvariationdatafields.map((field, i) => (
                          <View style={{width: 150, borderColor: 'black', borderWidth: 1}} key={i}>
                            <Text style={{textAlign: 'center', paddingBottom: 5, paddingHorizontal: 10, paddingTop: 10}}>{field.productVarFields.name}</Text>
                          </View>
                        ))}
                        {this.state.formData.productpricetaxfields.map((field, i) => (
                          <View style={{width: 150, borderColor: 'black', borderWidth: 1}} key={i}>
                            <Text style={{textAlign: 'center', paddingBottom: 5, paddingHorizontal: 10, paddingTop: 10}}>{field.name}</Text>
                          </View>
                        ))}
                      </View>

                      {this.state.product_data.product_variations.map((variation, i) => {
                        return (
                          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'stretch'}} key={i}>
                            <View style={{width: 150, borderColor: 'black', borderWidth: 1}}>
                              <Text style={{textAlign: 'center', paddingBottom: 5, paddingHorizontal: 10, paddingTop: 10}}>{variation.variation_value}</Text>
                            </View>
                            {this.state.formData.productvariationdatafields.map((field, j) => (
                              <GetTableFormInput
                                key={field.identitfier}
                                id={field.productVarFields.identitfier}
                                name={field.productVarFields.name}
                                options={field.productVarFields.options}
                                identifier={field.productVarFields.identifier}
                                type={field.productVarFields.input_types}
                                required={field.productVarFields.required}
                                placeholder={field.productVarFields.placeholder}
                                value={this.state.product_data.product_variations[i].variation_attributes[j].value}
                                changeValue={e => {
                                  let pd = this.state.product_data;
                                  pd.product_variations[i].variation_attributes[j].value = e;
                                  this.setState({product_data: pd});
                                }}
                              />
                            ))}
                            {this.state.formData.productpricetaxfields.map((field, j) => (
                              <GetTableFormInput
                                key={field.identitfier}
                                id={field.identitfier}
                                name={field.name}
                                options={field.options}
                                identifier={field.identifier}
                                type={field.input_types}
                                required={field.required}
                                placeholder={field.placeholder}
                                value={this.state.product_data.product_variations[i][field.identifier]}
                                changeValue={e => {
                                  let pd = this.state.product_data;
                                  pd.product_variations[i][field.identifier] = e;
                                  this.setState({product_data: pd});
                                }}
                              />
                            ))}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </ScrollView>
                <Pressable style={{display: 'flex', flexDirection: 'row', marginTop: 5, marginBottom: 10}} onPress={() => addVariant()}>
                  <Text style={{backgroundColor: 'green', color: 'white', textTransform: 'uppercase', paddingHorizontal: 20, paddingVertical: 5, fontFamily: 'Roboto-Medium', borderRadius: 5}}>Submit</Text>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
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
  label: {
    fontFamily: 'Roboto-Medium',
    marginLeft: 5,
    fontSize: 14,
    marginBottom: 3,
  },
  inputBox: {
    marginVertical: 5,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#697475',
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 3,
    overflow: 'hidden',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
  },
  tablePickerBox: {
    borderWidth: 1,
    borderColor: '#697475',
    backgroundColor: 'white',
    marginTop: 3,
    overflow: 'hidden',
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    fontSize: 14,
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  tableInput: {
    borderWidth: 1,
    borderColor: '#697475',
    paddingVertical: 0,
    paddingHorizontal: 10,
    height: 25,
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
export default connect(mapStateToProps, null)(SingleInventory);
