const PREFERENCES_KEY = 'PREFERENCES';
const DefaultPreferences = {
	intraAutoLogin: false,
	auditTime: {
		start: '11:00',
		end: '17:00'
	}
};

const getStoredPrefs = (): typeof DefaultPreferences => {
	const stringPrefs = localStorage.getItem(PREFERENCES_KEY);
	if (stringPrefs === null) return DefaultPreferences;
	try {
		const stored = JSON.parse(stringPrefs);
		return {
			...DefaultPreferences,
			...stored,
			// explicitly merge nested object to prevent stored.auditTime from fully overwriting DefaultPreferences.auditTime,
			// dropping any new keys added to the default that aren't in the stored version yet.
			auditTime: { ...DefaultPreferences.auditTime, ...stored.auditTime }
		};
	} catch {
		return DefaultPreferences;
	}
};

export const preferences = $state(getStoredPrefs());
$effect.root(() => {
	$effect(() => localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences)));
});

//backward compatibility
const INTRA_AUTO_LOGIN_KEY = 'INTRA_AUTO_LOGIN';
const outdated_intraAutoLogin = localStorage.getItem(INTRA_AUTO_LOGIN_KEY);
if (outdated_intraAutoLogin !== null) {
	preferences.intraAutoLogin = outdated_intraAutoLogin === 'true';
	localStorage.removeItem(INTRA_AUTO_LOGIN_KEY);
}
