import { Location } from "./location"

export interface Route {
    destination: Location
    departure: Location
    depatureTime: string
    arrival: string
}
