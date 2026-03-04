export const millisToDateTime = (millis: number): string => {
    return new Date(millis).toLocaleDateString('de-AT', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
};

export const millisToDuration = (millis: number): string => {
    const totalSeconds = Math.floor(millis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
}