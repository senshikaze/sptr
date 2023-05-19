import { Route } from "./route"

export interface Nav {
    systemSymbol: string
    waypointSymbol: String
    route: Route
    status: string
    flightMode: string
}
