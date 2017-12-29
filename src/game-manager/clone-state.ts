import { GameStateWithHistory } from "./types";

export default function cloneState(state: GameStateWithHistory): GameStateWithHistory {
    return JSON.parse(JSON.stringify(state));
}
