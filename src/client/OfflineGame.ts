import { Game } from "game/Game";

import type { Coord }           from "floor/Tile";
import { VisibleTile }          from "floor/VisibleTile";
import { VisibleGrid }          from "floor/VisibleGrid";

import type { Player }          from "game/player/Player";
import { OperatorPlayer }       from "game/player/OperatorPlayer";
import { VisiblePlayerStatus }  from "game/player/VisiblePlayerStatus";
import { ArtificialPlayer }     from "game/player/ArtificialPlayer";

import { GameManager } from "game/__gameparts/Manager";


type G = Game.Type.OFFLINE;

/**
 *
 *
 * @extends Game
 */
export class OfflineGame<S extends Coord.System> extends GameManager<G,S> {

    /**
     * @override
     */
    protected __getGridImplementation(coordSys: S): VisibleGrid.ClassIf<S> {
        return VisibleGrid.getImplementation(coordSys);
    }

    /**
     * _Does not call reset._
     *
     * @param gameDesc -
     */
    public constructor(gameDesc: Game.CtorArgs<G,S>) {
        super(
            Game.Type.OFFLINE, {
            tileClass: VisibleTile,
            playerStatusCtor: VisiblePlayerStatus,
            }, gameDesc,
        );
        if (!this.operator) {
            throw new Error("The Operator for an OfflineGame should be defined.");
        }

        // =====================================
        // CALL TO RESET
        this.reset();
        // =====================================

        /* TODO.test This should be safe in a garbage-collection and
        event-handler sense: Since the event handler is added to the
        event-handler-list of the `.game-grid-impl-body` element as an
        anonymous function, which makes it impossible to remove from
        the list without a reference to that function. Luckily for us,
        Grid.__VisibleGrid_super will automatically remove the old game-
        grid-impl-body child, thus allowing it to be GC-ed, and its
        event-handler function with it. */
        this.grid.baseElem.addEventListener("keydown", (ev): boolean => {
            // console.log(`key: ${ev.key}, code: ${ev.code},`
            // + ` keyCode: ${ev.keyCode}, char: ${ev.char},`
            // + ` charCode: ${ev.charCode}`);
            this.operator.processKeyboardInput(ev);
            // Disable scroll-down via spacebar:
            if (ev.keyCode === 32) {
                ev.preventDefault();
                return false;
            }
            return true;
        });
    }

    /**
     * @override
     */
    protected __createOperatorPlayer(desc: Player.__CtorArgs<"HUMAN">): OperatorPlayer<S> {
        return new OperatorPlayer<S>(this, desc);
    }

    /**
     * @override
     */
    protected __createArtifPlayer(desc: Player.__CtorArgs<Player.FamilyArtificial>): ArtificialPlayer<S> {
        return ArtificialPlayer.of(this, desc);
    }

    /**
     * @override
     */
    public setTimeout(callback: TimerHandler, millis: number, ...args: any[]): number {
        return setTimeout(callback, millis, args);
    }

    /**
     * @override
     */
    public cancelTimeout(handle: number): void {
        clearTimeout(handle);
    }
}
Object.freeze(OfflineGame);
Object.freeze(OfflineGame.prototype);
