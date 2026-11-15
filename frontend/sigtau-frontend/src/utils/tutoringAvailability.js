// La API utiliza fecha/hora local sin zona. El servidor conserva la validación definitiva.
export function hasTutoringStarted(tutoring, now = Date.now()) {
    const start = new Date(`${tutoring.tutoringDate}T${tutoring.startTime}`).getTime();
    return !Number.isFinite(start) || start <= now;
}

export function canEnroll(tutoring, now = Date.now()) {
    return tutoring.status === "OPEN" && tutoring.availableSpots > 0
        && !hasTutoringStarted(tutoring, now);
}
