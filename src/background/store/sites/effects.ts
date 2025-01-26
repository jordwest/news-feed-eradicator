import { BackgroundEffect } from '../effects';
import { Effect } from '../../../lib/redux-effects';
import { getBrowser } from '../../../webextension';
import { checkPermissions as checkPermissionsAction, updatePermissions } from '../slices/permissions';

export const getPermissions = async () => {
	return getBrowser().permissions.getAll();
};

const checkPermissions: BackgroundEffect = (store) => async (action) => {
	if (action.type === checkPermissionsAction.type) {
		const permissions = await getPermissions();
		store.dispatch(updatePermissions(permissions));
	}
};

export const sitesEffect: BackgroundEffect = Effect.all(checkPermissions);
