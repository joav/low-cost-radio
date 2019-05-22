import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage} from 'react-native';

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
		console.log('listado de Streams recibidos');
		for (var i = 0; i < stations.length; i++) {
			stations[i].streams = stations[i].StreamsFile.split("\n");
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
				stations[i].StreamsFile = stationsD[i];
			}
			this.saveStreams(stations)
		};
		fetch('https://opml.radiotime.com/Browse.ashx?id=r100716&render=json')
			.then(d=>d.json())
			.then(d=>{
				console.log('Emisoras recibidas info basica');
				stations = d.body[0].children;
				return Promise.all(stations.map(station=>{
					return fetch(station.URL)
						.then(resp=>resp.text())
						.catch(e=>{
							console.log(e)
						})
					})
				)
			})
			.then(lastResp.bind(this))
			.catch(e=>{
				console.log(e);
			});
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