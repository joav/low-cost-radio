import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage} from 'react-native';

function getst(stations) {
	return Promise.all(stations.map(station=>{
		return fetch('https:'+station.StreamUrl)
			.then(d=>d.json())
			.catch(e=>console.log(e))
	}));
}

export default class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Home',
	};

	constructor(props) {
		super(props);
		this.state = {stations: [], favs: [], stationsLoading: false};
		this.onSync = this.onSync.bind(this);
	}
	async saveStreams(stations){
		var streams = await getst(stations);
		console.log('listado de Streams recibidos');
		for (var i = 0; i < stations.length; i++) {
			stations[i].streams = streams[i].Streams;
		}
		try{
			console.log('intentando guardar json con emisoras');
			await AsyncStorage.setItem('stations',JSON.stringify(stations));
			console.log('json guardado con emisoras');
			this.setState({stations: stations, stationsLoading: false});
		}catch(e){
			console.log(e)
		}
	}
	onSync() {
		console.log('Click onSync');
		this.setState({stationsLoading: true});
		let stations = [];
		var lastResp = function(stationsD){
			console.log('URL a los Streams Recibidos');
			for (var i = 0; i < stations.length; i++) {
				stations[i].StreamUrl = stationsD[i].StreamUrl;
			}
			this.saveStreams(stations)
		};
		fetch('https://opml.radiotime.com/Browse.ashx?id=r100716&render=json')
			.then(d=>d.json())
			.then(d=>{
				console.log('Emisoras recibidas info basica');
				stations = d.body[0].children;
				return Promise.all(stations.map(station=>{
					return fetch('https://tunein.com/tuner/tune/?tuneType=Station&stationId='+station.guide_id.substr(1))
						.then(d=>d.json())
					})
				)
			})
			.then(lastResp.bind(this));
	}
	render() {
		let title = this.state.stationsLoading?'Sincronizando...':'Sincronizar emisoras';
		return (
			<View style={styles.container}>
				<Text>Bienvenido a Jimmy's Radio</Text>
				<Button onPress={this.onSync} title={title} disabled={this.state.stationsLoading} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});