import api from '$lib/api';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ depends }) => {
	const occupancy = await api.LIBRAONE.map();
	depends('app:occupancy');
	return { occupancy };
};
