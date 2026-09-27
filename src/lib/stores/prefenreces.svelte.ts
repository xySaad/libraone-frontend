const INTRA_AUTO_LOGIN_KEY = 'INTRA_AUTO_LOGIN';

export const preferences = $state({
	intraAutoLogin: localStorage.getItem(INTRA_AUTO_LOGIN_KEY) === 'true'
});
$effect.root(() => {
	$effect(() => {
		localStorage.setItem(INTRA_AUTO_LOGIN_KEY, preferences.intraAutoLogin.toString());
	});
});
