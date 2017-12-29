import { GameLavelData } from "../types";
import CrossLevel from './cross';
import ModernLevel from './modern';

export enum LevelsNames {
    CROSS = 'Cross',
    CLASSIC = 'Classic',
    MODERN = 'Modern'
}

export type Level = {
    name: LevelsNames,
    data: GameLavelData
}

const Levels : Level[] = [
    {
        name: LevelsNames.CROSS,
        data: CrossLevel
    },
    {
        name: LevelsNames.MODERN,
        data: ModernLevel
    }
]

export default Levels;
