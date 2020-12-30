import { JsUtils } from "defs/JsUtils";
import { Game } from "game/Game";
import type { Coord, Tile } from "floor/Tile";
import type { GameManager } from "game/gameparts/GameManager";

export { JsUtils };
export type { Coord, Tile };
export type { GameManager };

// Implementations:
import type { Chaser } from "./artificials/Chaser";

import { Player } from "./Player";
export { Player };


/**
 * Unlike {@link OperatorPlayer}s, these are not guided by human input.
 * Instead, they are essentially defined by how often they move, and
 * where they decide to move toward each time they move.
 *
 * Can be paused and un-paused by the Game Manager.
 */
export abstract class ArtificialPlayer<S extends Coord.System> extends Player<S> {

	declare public readonly game: GameManager<any,S>;

	private _nextMovementTimerMultiplier: number;

	private _scheduledMovementCallbackId: number;

	/**
	 * @see ArtificialPlayer.of for the public, non-abstract interface.
	 */
	protected constructor(game: GameManager<any,S>, desc: Player.CtorArgs) {
		super(game, desc);
		if (DEF.DevAssert && game.gameType === Game.Type.ONLINE) {
			throw new TypeError("OnlineGames should be using regular Players instead.");
		}
	}

	/**
	 * Returns a {@link Pos} representing an absolute coordinate (ie.
	 * one that is relative to the {@link Game}'s origin position')
	 * that this `ArtificialPlayer` intends to move toward in its next
	 * movement request. Pos may contain non-integer coordinate values,
	 * and it does not have to be inside the bounds of the {@link Grid}.
	 */
	protected abstract computeDesiredDest(): Coord;

	protected abstract getNextMoveType(): Player.MoveType;

	/**
	 * Units are in milliseconds.
	 */
	protected abstract computeNextMovementTimer(): number;

	/** @override */
	public onGamePlaying(): void {
		super.onGamePlaying();
		this._delayedMovementContinue();
	}
	/** @override */
	public onGamePaused(): void {
		this.game.cancelTimeout(this._scheduledMovementCallbackId);
		this._scheduledMovementCallbackId = undefined!;
	}
	/** @override */
	public onGameOver(): void {
		this.game.cancelTimeout(this._scheduledMovementCallbackId);
		this._scheduledMovementCallbackId = undefined!;
	}

	/**
	 * Executes a single movement and then calls `delayedMovementContinue`.
	 */
	private _movementContinue(): void {
		const desiredDest = this.computeDesiredDest();
		// This is a little different than how human players experience
		// "penalties" when moving to tiles with long language-sequences-
		// humans must pay the penalty before landing on the tile, but
		// in the implementation here, it's much easier to simulate such
		// a penalty if it applies _after_ landing on the tile.
		this._nextMovementTimerMultiplier = this.game.grid.tileAt(desiredDest).seq.length;

		this.makeMovementRequest(
			this.game.grid.getUntToward(desiredDest, this.coord).coord,
			this.getNextMoveType(),
		);
		// Schedule a task to do this again:
		this._delayedMovementContinue();
	}

	/**
	 * Schedules a call to `movementContinue`.
	 */
	private _delayedMovementContinue(): void {
		// Schedule the next movement.
		this._scheduledMovementCallbackId = this.game.setTimeout(
			this._movementContinue.bind(this),
			this.computeNextMovementTimer() * this._nextMovementTimerMultiplier,
			// * Callback function arguments go here.
		);
		return;
	}
}
export namespace ArtificialPlayer {

	export const _Constructors: {
		readonly [ F in Player.FamilyArtificial ]: {
			new<S extends Coord.System>(
				game: GameManager<Game.Type.Manager,S>,
				desc: Player._CtorArgs[F]
			): ArtificialPlayer<S>;
		};
	} = {
		// These are initialized later to avoid bootstrapping issues.
		["CHASER"]: undefined!,
	};

	export interface FamilySpecificPart {
		[Player.Family.CHASER]: Chaser.Behaviour;
	}

	export const of = <S extends Coord.System>(
		game: GameManager<Game.Type.Manager,S>,
		playerDesc: Player._CtorArgs[Player.FamilyArtificial],
	): ArtificialPlayer<S> => {
		const familyId = playerDesc.familyId as Player.FamilyArtificial;
		if (DEF.DevAssert) {
			// Enforced By: Caller adherence to contract.
			if (!Object.keys(_Constructors).includes(familyId)) {
				throw new RangeError(familyId + " is not a valid artificial player family id.");
			}
		}
		return new (_Constructors[familyId])(game, playerDesc);
	};

	/**
	 * Provides slightly higher level abstractions for computing the
	 * desired destination for the next movement.
	 */
	// export class PrioritizedBehaviours<S extends Coord.System> extends ArtificialPlayer<S> {
	// 	public computeDesiredDest(): Coord {
	// 		;
	// 	}
	// }
}
JsUtils.protoNoEnum(ArtificialPlayer, "_movementContinue");
// ArtificialPlayer is frozen in PostInit after _Constructors get initialized.
Object.seal(ArtificialPlayer);
Object.freeze(ArtificialPlayer.prototype);