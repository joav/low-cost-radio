/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';

AppRegistry.registerComponent(appName, () => App);

TrackPlayer.registerEventHandler(async data=>{
	switch(data.type){
		case 'remote-stop':
			TrackPlayer.stop();
		break;
		case 'remote-play':
			TrackPlayer.play();
		break;
		case 'remote-pause':
			TrackPlayer.pause();
		break;
	}
});
