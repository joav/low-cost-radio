import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage} from 'react-native';
import TrackPlayer from 'react-native-track-player';
export default class StationScreen extends React.Component {
	static navigationOptions = {
		title: 'Emisora',
	};
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			disabled: true,
			info: {},
      		track: {},
      		trackPlayerState: false,
      		btnTitle: 'Reproducir',
      		out: 'Sin salida',
      		out2: 'Sin salida',
		};

		const willFocusSubsciption = this.props.navigation.addListener(
			'willFocus',
			this._willfocus.bind(this)
		);
	}
	componentDidMount() {
		this._getStation();
		TrackPlayer.setupPlayer({}).then(this._trackPlayerReady);
		TrackPlayer.updateOptions({
			stopWithApp: true,
			capabilities: [
				TrackPlayer.CAPABILITY_PLAY,
				TrackPlayer.CAPABILITY_PAUSE,
				TrackPlayer.CAPABILITY_STOP
			]
		});
	}
	componentWillUnmount(){
		TrackPlayer.reset();
	}
	_trackPlayerReady = ()=>{
		this.setState({trackPlayerState: true, disabled: false});
	}
	_willfocus = payload => {
		console.log(payload);
		this._getStation()
	}
	_getStation = async ()=>{
		try{
			let station = await AsyncStorage.getItem('selectedStation');
			station = JSON.parse(station);
			let track = {
				id: station.guide_id,
				url: station.streams[0].Url
			};
			console.log(station)
			this.setState({
				name: station.text,
				disabled: !this.state.trackPlayerState,
				info: station,
				track: track
			});
		}catch(e){
			console.log(e);
		}
		
	}
	_play = async ()=>{
		const currentTrack = await TrackPlayer.getCurrentTrack();
		const state = await TrackPlayer.getState();
		this.setState({out2: JSON.stringify([state,currentTrack])});
		if (this.state.btnTitle == 'Reproducir') {
			this.setState({btnTitle: 'Intentando...', out: JSON.stringify(this.state.track) });
			await TrackPlayer.reset();
			await TrackPlayer.add([this.state.track]);
			try{
				await TrackPlayer.play();
				this.setState({btnTitle: 'Pausar'});
			}catch(e){
				this.setState({out: JSON.stringify(e)});
			}
		}else{
			await TrackPlayer.reset();
			this.setState({btnTitle: 'Reproducir'});
		}
	}
	render(){
		return (
			<View style={styles.container}>
				<Text>Reproductor de la emisora {this.state.name}</Text>
				<Button title={this.state.btnTitle} disabled={this.state.disabled} onPress={this._play.bind(this)} />
        		<Text>{this.state.trackPlayerState?'Está listo':'No está listo'}</Text>
        		<Text>{this.state.out}</Text>
        		<Text>{this.state.out2}</Text>
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