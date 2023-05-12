import { Route } from "./route"

export interface Nav {
    systemSymbol: String
    waypointSymbol: String
    route: Route
    status: string
    flightMode: string
}
