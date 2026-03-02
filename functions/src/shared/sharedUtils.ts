import {State} from "./shared.types.js";

export const stateMapping: Record<State, string> = {
    [State.WIEN]: "Wien",
    [State.NIEDEROESTERREICH]: "Niederoesterreich",
    [State.OBEROESTERREICH]: "Oberoesterreich",
    [State.STEIERMARK]: "Steiermark",
    [State.KAERNTEN]: "Kaernten",
    [State.SALZBURG]: "Salzburg",
    [State.TIROL]: "Tirol",
    [State.VORARLBERG]: "Vorarlberg",
    [State.BURGENLAND]: "Burgenland",
}