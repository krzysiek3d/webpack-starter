import { canvas } from '../constants';
import { events } from '../utils';
export const canvasOrder = {
	init() {
		events.on( 'pointsChanged', () => {
			canvas._objects.sort( ( a, b ) => {
				// Order objects lexically by their id's in canvas - Z is the highest layer
				// return a.id > b.id ? 1 : -1;
				return a.id.localeCompare( b.id );
			} );
		} );
	}
};
