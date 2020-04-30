import { OmHooks } from "defs/OmHooks";
import type { Coord, Tile } from "floor/Tile";
import type { Player } from "./Player";

import { PlayerStatus } from "./PlayerStatus";


export class VisiblePlayerStatus<S extends Coord.System> extends PlayerStatus<S> {

    readonly #baseElem: HTMLElement;

    private readonly __immigrantInfoCache: Tile.VisibleImmigrantInfo;


    public constructor(player: Player<S>, noCheckGameOver: boolean) {
        super(player, noCheckGameOver);
        {
            const baseElem = document.createElement("div");
            baseElem.classList.add(
                OmHooks.General.Class.CENTER_CONTENTS,
                OmHooks.General.Class.STACK_CONTENTS,
                OmHooks.Player.Class.BASE,
            );
            this.#baseElem = baseElem;
        } {
            // Setup face element:
            const faceElem = document.createElement("div");
            faceElem.classList.add(OmHooks.Player.Class.FACE);
            this.#baseElem.appendChild(faceElem);
        } {
            // Setup downedOverlay element:
            const dOverlayElem = document.createElement("div");
            dOverlayElem.classList.add(OmHooks.Player.Class.DOWNED_OVERLAY);
            this.#baseElem.appendChild(dOverlayElem);
        }
    }

    /**
     * @override
     */
    public __afterAllPlayersConstruction(): void {
        const player = this.player;
        const operatorTeamId = this.player.game.operators[0].teamId;
        this.#baseElem.dataset[OmHooks.Player.Dataset.FACE_SWATCH]
        = (player.isALocalOperator) ? "me"
        : (player.teamId === operatorTeamId) ? "teammate" : "opponent";

        // Setup spotlight element:
        if (player.isALocalOperator) {
            const sslElem = document.createElement("div");
            sslElem.classList.add(OmHooks.Player.Class.SHORT_SPOTLIGHT);
            this.#baseElem.appendChild(sslElem);

            const lslElem = document.createElement("div");
            lslElem.classList.add(OmHooks.Player.Class.LONG_SPOTLIGHT);
            this.#baseElem.appendChild(lslElem);
        }
        (this.__immigrantInfoCache as Tile.VisibleImmigrantInfo) = Object.freeze({
            playerElem: this.#baseElem,
            username: player.username,
        });
    }

    public get immigrantInfo(): Tile.VisibleImmigrantInfo {
        return this.__immigrantInfoCache;
    }


    public get health(): Player.Health {
        return super.health;
    }
    public set health(newHealth: Player.Health) {
        const oldIsDowned = this.isDowned;
        super.health = newHealth;

        if (oldIsDowned !== this.isDowned) {
            // CSS integration for Player.isDowned rendering.
            this.#baseElem.dataset[OmHooks.Player.Dataset.DOWNED] = (this.isDowned)
                ? ((this.player.team.elimOrder) ? "team" : "self") : "no";
        }
    }
}
Object.freeze(VisiblePlayerStatus);
Object.freeze(VisiblePlayerStatus.prototype);
