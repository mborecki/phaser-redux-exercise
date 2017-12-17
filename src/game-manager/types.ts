import { AnyAction, Action } from "redux";

export type GameState = {
    readonly mapWidth: number,
    readonly mapHeight: number,
    readonly blockers: {x: number, y: number}[]
    readonly pawns: Pawn[]
}

export type Pawn = {
    id: number,
    x: number,
    y: number
}
