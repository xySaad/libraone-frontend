export function formatBytes(bytes: number, decimals: number = 2): string {
	// Catch 0 or invalid inputs immediately
	if (!+bytes) return '0 Bytes';

	const k: number = 1000;
	const dm: number = decimals < 0 ? 0 : decimals;
	const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	// Calculate the unit index based on powers of 1024
	const i: number = Math.floor(Math.log(bytes) / Math.log(k));

	// Divide the bytes by 1024 to the power of the unit index, round, and append the string
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
