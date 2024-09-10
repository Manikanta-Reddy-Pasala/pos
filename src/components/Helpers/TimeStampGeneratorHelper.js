
export function getUniqueTimestamp() {
    return Date.now();
}

export function getStartOfDayTimestamp(dateString) {
    const currentDate = new Date();

    if (dateString === null) {
        currentDate.setHours(0, 0, 0, 0);
        return currentDate.getTime();
    }

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return currentDate.getTime();
        }
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    } catch (error) {
        console.error(error);
        currentDate.setHours(0, 0, 0, 0);
        return currentDate.getTime();
    }
}
