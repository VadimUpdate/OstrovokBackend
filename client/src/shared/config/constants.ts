export let host: string = `${document.location.protocol.slice(0, -1)}://${document.location.host.split(':')[0]}`

if (document.location.host.split(':')[1]) {
    if (document.location.host.split(':')[1] !== '3000')
        host += ':8081'
    else
        host += ':8080'
} else
    host += ''

export const ROLES = {
    ROLE_ADMIN: "ROLE_ADMIN",
    ROLE_USER: "ROLE_USER",
}

export const REPORT_STATUSES = {
    ON_MISSION: "ON_MISSION",
    REPORT_SENT: "REPORT_SEND",
    CONFIRMED: "CONFIRMED",
    CANCELED: "CANCELED"
}

export const PROFILE_STATUSES = {
    VERIFY: "VERIFY",
    CONFIRMED: "CONFIRMED",
    CANCELED: "CANCELED"
}

export const HOTEL_INSPECTION_STATUSES = {
    OPEN: "OPEN",
    CLOSE: "CLOSE",
}