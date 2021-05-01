import { JsUtils} from ":defs/JsUtils";
import { Game } from "../Game";
import { Lang } from ":lang/Lang";

import type { Coord, Tile } from ":floor/Tile";
import type { StateChange } from "../StateChange";
import type { Grid } from ":floor/Grid";
import type { OperatorPlayer } from "../player/OperatorPlayer";

import { Player } from "../player/Player";
import { Team } from "../player/Team";

/** */
export abstract class GameMirror<S extends Coord.System = Coord.System> {

	public readonly grid: Grid<S>;
	readonly #onGameBecomeOver: () => void;

	public readonly players: readonly Player[];
	public readonly operators: readonly OperatorPlayer[];
	#currentOperator: OperatorPlayer;
	/** Indexable by team ID's. */
	public readonly teams: readonly Team[];

	#status: Game.Status;

	/** */
	public constructor(args: {
		readonly impl: Game.ImplArgs,
		readonly desc: Game.CtorArgs<S>,
		readonly operatorIds: readonly Player.Id[],
	}) {
		const { impl, desc, operatorIds } = args;
		Object.freeze(desc);
		Object.freeze(desc.players);
		desc.players.forEach((desc) => Object.freeze(desc));
		Object.freeze(operatorIds);

		const langDesc = Lang.GetDesc(args.desc.langId);
		const gridClass = impl.gridClassLookup(desc.coordSys);
		this.grid = new (gridClass)({
			Grid: gridClass,
			system: desc.coordSys,
			dimensions: desc.gridDimensions,
			langCharFontScaling: langDesc.fontScaling,
			players: desc.players,
		}) as GameMirror<S>["grid"];

		this.#onGameBecomeOver = impl.onGameBecomeOver;

		// Construct players:
		const players  = this._createPlayers(desc, impl, operatorIds, langDesc);
		this.players   = players.players;
		this.operators = players.operators;
		{
			const teams: Player[][] = [];
			this.players.forEach((player) => {
				if (!teams[player.teamId]) {
					teams[player.teamId] = [];
				}
				teams[player.teamId]!.push(player);
			});
			this.teams = teams.map((teammateArray, teamId) => {
				return new Team(teamId, teammateArray);
			});
		}
		JsUtils.propNoWrite(this as GameMirror<S>,
			"grid", "players", "operators", "teams",
		);
		this.players.forEach((player) => player._onTeamsBootstrapped());
		this.setCurrentOperator(0);
	}

	/** */
	public reset(): void {
		this.grid.reset();

		// We must reset status to PAUSED to pass a state-transition
		// assertion when changing status later to PLAYING.
		this.#status = Game.Status.PAUSED;
	}


	/** Helper for the constructor. */
	private _createPlayers(
		gameDesc: Game.CtorArgs<S>,
		implArgs: Game.ImplArgs,
		operatorIds: readonly Player.Id[],
		langDesc: Lang.Desc,
	): {
		players: readonly Player[],
		operators: readonly OperatorPlayer[],
	} {
		const players = gameDesc.players.map((pDesc) => {
			if (pDesc.familyId === Player.Family.Human) {
				return (operatorIds.includes(pDesc.playerId))
					? new implArgs.OperatorPlayer!(this, pDesc, langDesc)
					: new Player(this, pDesc);
			} else {
				return implArgs.RobotPlayer(
					this as GameMirror<any>,
					pDesc,
				);
			}
		}).freeze();
		return Object.freeze({
			players,
			operators: operatorIds.map((playerId) => players[playerId] as OperatorPlayer).freeze(),
		});
	}

	/** @final */
	public deserializeResetState(ser: Game.ResetSer): void {
		JsUtils.deepFreeze(ser);

		this.grid.forEach((tile, index) => {
			this.grid.write(tile.coord, ser.csps[index]!);
		});
		ser.playerCoords.forEach((coord, playerId) => {
			this.players[playerId]!.reset(coord);
		});
	}

	public get currentOperator(): OperatorPlayer {
		return this.#currentOperator;
	}
	public setCurrentOperator(nextOperatorIndex: number): void {
		const nextOperator = this.operators[nextOperatorIndex]!;
		if (!DEF.DevAssert && nextOperator === undefined) { throw new Error("never"); }
		if (this.currentOperator !== nextOperator) {
			this.#currentOperator = nextOperator;
		}
	}


	public get status(): Game.Status {
		return this.#status;
	}

	/**
	 * On the client side, this should only be accessed through a
	 * wrapper function that also makes UI-related changes.
	 *
	 * If the game is already playing, this does nothing.
	 */
	public statusBecomePlaying(): void {
		if (this.status === Game.Status.PLAYING) {
			console.info("[statusBecomePlaying]: Game is already playing");
			return;
		}
		if (this.status !== Game.Status.PAUSED) {
			throw new Error("Can only resume a game that is currently paused.");
		}
		this.players.forEach((player) => {
			player.onGamePlaying();
		});
		this.#status = Game.Status.PLAYING;
	}

	/**
	 * On the client side, this should only be accessed through a
	 * wrapper function that also makes UI-related changes.
	 *
	 * If the game is already paused, this does nothing.
	 */
	public statusBecomePaused(): void {
		if (this.status === Game.Status.PAUSED) {
			console.info("[statusBecomePaused]: Game is already paused");
			return;
		}
		if (this.status === Game.Status.OVER) {
			return;
		}
		this.players.forEach((player) => {
			player.onGamePaused();
		});
		this.#status = Game.Status.PAUSED;
	}

	/**
	 * This should be called when all teams have been eliminated.
	 * A team becomes (and subsequently and unconditionally stays)
	 * eliminated when all their members are in a downed state at
	 * the same time.
	 *
	 * This should not be controllable by UI input elements. Instead,
	 * The UI layer can pass a callback to the constructor.
	 */
	public statusBecomeOver(): void {
		if (this.status === Game.Status.OVER) return;
		this.players.forEach((player) => {
			player.onGameOver();
		});
		this.#status = Game.Status.OVER;
		this.#onGameBecomeOver();
		console.info("game is over!");
	}

	/**
	 * Must eventually result in a call to commitStateChange.
	 * Crosses the network boundary for online games.
	 */
	public abstract requestStateChange(desc: StateChange.Req, authorSock?: any): void;

	/** @virtual */
	protected commitTileMods(coord: Coord, changes: Tile.Changes): void {
		// JsUtils.deepFreeze(changes); // <- already done by caller.
		if (changes.seq !== undefined) {
			const sources = this.grid.tileSourcesTo(coord);
			this.operators.forEach((op) => {
				// Refresh the operator's `seqBuffer` (maintain invariant) for new CSP:
				if (sources.some((src) => src.coord === op.coord)) {
					op.seqBufferAcceptKey(undefined);
				}
			});
		}
		this.grid.write(coord, changes);
	}

	/** @virtual */
	protected commitStateChange(desc: StateChange.Res, authorSock?: WebSocket): void {
		JsUtils.deepFreeze(desc);
		const author = this.players[desc.author]!;

		if (desc.rejectId !== undefined) {
			author.reqBuffer.reject(desc.rejectId, author.coord);
			return; //⚡
		}
		author.reqBuffer.acceptOldest();

		for (const [coord, changes] of Object.entries(desc.tiles).freeze()) {
			this.commitTileMods(parseInt(coord), changes);
		}
		for (const [pid, changes] of Object.entries(desc.players).freeze()) {
			const p = this.players[parseInt(pid)]!;
			p.boosts = changes.boosts;

			if (changes.coord !== undefined) {
				const prevCoord = p.coord;
				// note: the order of the below lines does not matter.
				this.grid.moveEntity(p.playerId, prevCoord, changes.coord);
				p._setCoord(changes.coord);
			}
		}
	}

	/** */
	public setTimeout(callback: TimerHandler, millis: number, ...args: any[]): number {
		return setTimeout(callback, millis, args);
	}

	/** */
	public cancelTimeout(handle: number): void {
		clearTimeout(handle);
	}
}
JsUtils.protoNoEnum(GameMirror, "_createPlayers");
Object.freeze(GameMirror);
Object.freeze(GameMirror.prototype);