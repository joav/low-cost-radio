import React from 'react';
import { StyleSheet, Text, View, FlatList, Button, AsyncStorage} from 'react-native';

class Station extends React.Component{
	_onPress = () => {
		this.props.onPress(this.props.station);
	}
	render() {
		return (
			<View style={styles.station} >
				<Text style={styles.stationText} >{this.props.name}</Text>
				<Button style={styles.stationBtn} title="Reproducir" onPress={this._onPress} />
			</View>
		);
	}
}

export default class ListScreen extends React.Component {
	static navigationOptions = {
		title: 'Emisoras',
	};
	constructor(props) {
		super(props);
		this.state = { stations: []}
	}
	componentDidMount(){
		console.log('montando');
		const getStations = d=>{
			console.log('Emisoras obetenidas');
			let stations = d;
			stations = JSON.parse(stations);
			let newStations = stations.map(station=>({key: station.guide_id, name: station.text, station: station}));
			this.setState({stations: newStations});
		}
		console.log('Intentando obtener emisoras');
		AsyncStorage.getItem('stations')
		.then(getStations.bind(this));
	}
	_onPress = (station) => {
		(async (s,n)=>{
			try{
				console.log('Intentando guardar la emisora');
				await AsyncStorage.setItem('selectedStation',JSON.stringify(s));
				console.log('Emisora guardada');
				n('Station');
			}catch(e){
				console.log(e);
			}
		})(station,this.props.navigation.navigate);
	}
	_renderStation = ({item}) => (
		<Station name={item.name} onPress={this._onPress} station={item.station} />
	)
	render() {
		return (
			<View style={styles.container}>
				<FlatList data={this.state.stations} renderItem={this._renderStation} />
			</View> 
		);
	}
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 10
  },
  station: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    borderBottomColor: '#000000',
    borderBottomWidth: 1
  },
  stationText: {
  	width: '70%'
  },
  stationBtn: {
  	width: '30%'
  }
});