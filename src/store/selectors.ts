
import { IState } from './reducer';
import config from '../config';

export function areNewFeaturesAvailable( state: IState ) {
	return ( config.newFeatureIncrement > state.featureIncrement );
}
