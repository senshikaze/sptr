import { Route } from "./route"

export interface Nav {
    systemSymbol: string
    waypointSymbol: string
    route: Route
    status: string
    flightMode: string
}
