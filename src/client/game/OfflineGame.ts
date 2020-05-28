// Tell WebPack about the CSS chunk we want:
require("assets/style/game/index.css");

import {
    applyMixins,
    Game,
    Coord, VisibleTile, VisibleGrid,
    BrowserGameMixin,
    Player, OperatorPlayer, VisiblePlayerStatus,
} from "./BrowserGame";

import { GamepartManager } from "game/gameparts/GamepartManager";


type G = Game.Type.OFFLINE;

/**
 *
 */
export class OfflineGame<S extends Coord.System>
extends GamepartManager<G,S> implements BrowserGameMixin<G,S> {

    declare public currentOperator: NonNullable<GamepartManager<G,S>["currentOperator"]>;

    public htmlElements: BrowserGameMixin.HtmlElements;

    /**
     * @override
     */
    protected _getGridImplementation(coordSys: S): VisibleGrid.ClassIf<S> {
        return VisibleGrid.getImplementation(coordSys);
    }

    /**
     * @param gameDesc -
     */
    public constructor(
        onGameBecomeOver: () => void,
        gameDesc: Game.CtorArgs<G,S>,
    ) {
        super(
            Game.Type.OFFLINE, {
            onGameBecomeOver,
            tileClass: VisibleTile,
            playerStatusCtor: VisiblePlayerStatus,
            }, gameDesc,
        );
        this._ctorBrowserGame();
    }

    declare public readonly _createArtifPlayer: GamepartManager<G,S>["_createArtifPlayer"];

    public setTimeout(callback: TimerHandler, millis: number, ...args: any[]): number {
        return setTimeout(callback, millis, args);
    }

    public cancelTimeout(handle: number): void {
        clearTimeout(handle);
    }

    // NOTE: We need to declare this for OfflineGame
    // to be able to use this Mixin for some reason...
    declare public readonly processBubbleRequest: GamepartManager<G,S>["processBubbleRequest"];
}
export interface OfflineGame<S extends Coord.System> extends BrowserGameMixin<G,S> {};
applyMixins(OfflineGame, [BrowserGameMixin,]);
Object.freeze(OfflineGame);
Object.freeze(OfflineGame.prototype);
