export function timeFormatter (time) {
    
    let days = Math.floor(time / 86400);
    time -= days * 86400;

    let hours = Math.floor(time / 3600) % 24;
    time -= hours * 3600;

    let minutes = Math.floor(time / 60) % 60;
    time -= minutes * 60;

    let seconds = time % 60;

    let data = {
        days: days ? `${days}d:` : '',
        hours: hours ? `${addPrefix(hours)}:` : '',
        minutes: `${addPrefix(minutes)}:`,
        seconds: addPrefix(seconds)
    }

    return Object.values(data).join('')
}

function addPrefix (value) {
    if (value < 10) {
        return `0${value}`
    }
    return value
}
