import { AnyAction, Action } from "redux";

export type GameState = {
    readonly mapWidth: number,
    readonly mapHeight: number,
    readonly blockers: {x: number, y: number}[]
    readonly pawns: Pawn[],
    readonly startPawnsCount : number
}

export type GameLavelData = {
    readonly mapWidth: number,
    readonly mapHeight: number,
    readonly blockers: {x: number, y: number}[]
    readonly pawns: {x: number, y: number}[]
}


export type Pawn = {
    id: number,
    x: number,
    y: number
}
