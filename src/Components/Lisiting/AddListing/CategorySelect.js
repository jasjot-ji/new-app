import React, {Component} from 'react';
import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import searchIcon from '../../../Assets/icons/search.png';
import {connect} from 'react-redux';
import {baseUrl} from '../../../baseUrl';

class CategorySelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      category1: null,
      category2: null,
      category3: null,
      category4: null,
      loading: true,
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

    fetch(`${baseUrl}/prd_lst/fetch_all_categories`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          this.setState({
            categories: result.data,
            loading: false,
          });
        }
      })
      .catch(error => console.log('error', error));
  }
  componentDidUpdate() {
    if (this.state.category4) {
      this.props.selectCategory(this.state.category4, `${this.state.category1.name} > ${this.state.category2.name} > ${this.state.category3.name} > ${this.state.category4.name}`);
      this.props.changeTab('addImages');
    }
  }
  render() {
    return (
      <View>
        <Pressable onPress={() => this.props.changeTab('categories')}>
          <Text style={{fontFamily: 'Roboto-Medium', paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#E6EDFF'}}>Select Category</Text>
        </Pressable>
        <View style={{width: '100%', position: 'relative', padding: 15}}>
          {/* <TextInput style={styles.input} placeholder="Search all category" />
          <Image source={searchIcon} style={{width: 25, height: 25, position: 'absolute', right: 25, top: 20}} /> */}
        </View>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 15, marginBottom: 10, flexWrap: 'wrap'}}>
          <Text style={{fontSize: 14, fontFamily: 'Roboto-Bold'}}>Product Path : </Text>
          {this.state.category1 && (
            <Pressable
              onPress={() => {
                if (this.state.category1) {
                  this.setState({loading: true});
                  setTimeout(() => {
                    this.setState({
                      category1: null,
                      category2: null,
                      category3: null,
                      category4: null,
                      loading: false,
                    });
                  }, 1000);
                }
              }}>
              <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium'}}>{this.state.category1.name}</Text>
            </Pressable>
          )}
          {this.state.category2 && (
            <Pressable
              onPress={() => {
                if (this.state.category2) {
                  this.setState({loading: true});
                  setTimeout(() => {
                    this.setState({
                      category2: null,
                      category3: null,
                      category4: null,
                      loading: false,
                    });
                  }, 1000);
                }
              }}>
              <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium'}}>{` > ${this.state.category2.name}`}</Text>
            </Pressable>
          )}
          {this.state.category3 && (
            <Pressable
              onPress={() => {
                if (this.state.category3) {
                  this.setState({loading: true});
                  setTimeout(() => {
                    this.setState({
                      category3: null,
                      category4: null,
                      loading: false,
                    });
                  }, 1000);
                }
              }}>
              <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium'}}>{` > ${this.state.category3.name}`}</Text>
            </Pressable>
          )}
          {this.state.category4 && <Text style={{fontSize: 14, fontFamily: 'Roboto-Medium'}}>{` > ${this.state.category4.name}`}</Text>}
        </View>
        {/* <Text style={{fontSize: 14, paddingHorizontal: 15, marginBottom: 10}}>
          Product Path : {this.state.category1 && `${this.state.category1.name}`} {this.state.category2 && `> ${this.state.category2.name} `} {this.state.category3 && `> ${this.state.category3.name} `} {this.state.category4 && `> ${this.state.category4.name} `}{' '}
        </Text> */}
        <ScrollView style={{paddingHorizontal: 20}}>
          {this.state.loading ? (
            <View style={{paddingVertical: 20}}>
              <ActivityIndicator color={'#0000ff'} size={30} />
            </View>
          ) : (
            <View style={{marginVertical: 10, backgroundColor: '#F6F6F6', borderRadius: 20, overflow: 'hidden', marginBottom: 300}}>
              {!this.state.category1 &&
                this.state.categories &&
                this.state.categories.map(cat => (
                  <Pressable
                    key={cat.category_1_id}
                    onPress={() => {
                      this.setState({loading: true});
                      setTimeout(() => {
                        this.setState({category1: cat, loading: false});
                      }, 750);
                    }}>
                    <Text style={{fontSize: 16, borderBottomColor: '#ddd', borderBottomWidth: 1, paddingVertical: 15, paddingHorizontal: 20}}>{cat.name}</Text>
                  </Pressable>
                ))}
              {!this.state.category2 &&
                this.state.category1 &&
                this.state.category1.category_2s.map(cat => (
                  <Pressable
                    key={cat.category_2_id}
                    onPress={() => {
                      this.setState({loading: true});
                      setTimeout(() => {
                        this.setState({category2: cat, loading: false});
                      }, 750);
                    }}>
                    <Text style={{fontSize: 16, borderBottomColor: '#ddd', borderBottomWidth: 1, paddingVertical: 15, paddingHorizontal: 20}}>{cat.name}</Text>
                  </Pressable>
                ))}
              {!this.state.category3 &&
                this.state.category2 &&
                this.state.category2.category_3s.map(cat => (
                  <Pressable
                    key={cat.category_3_id}
                    onPress={() => {
                      this.setState({loading: true});
                      setTimeout(() => {
                        this.setState({category3: cat, loading: false});
                      }, 750);
                    }}>
                    <Text style={{fontSize: 16, borderBottomColor: '#ddd', borderBottomWidth: 1, paddingVertical: 15, paddingHorizontal: 20}}>{cat.name}</Text>
                  </Pressable>
                ))}
              {this.state.category3 &&
                this.state.category3.category_4s.map(cat => (
                  <Pressable
                    key={cat.category_4_id}
                    onPress={() => {
                      this.setState({loading: true});
                      setTimeout(() => {
                        this.setState({category4: cat, loading: false});
                      }, 750);
                    }}>
                    <Text style={{fontSize: 16, borderBottomColor: '#ddd', borderBottomWidth: 1, paddingVertical: 15, paddingHorizontal: 20}}>{cat.name}</Text>
                  </Pressable>
                ))}
            </View>
          )}
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
export default connect(mapStateToProps, null)(CategorySelect);
