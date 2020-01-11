import { Lang } from "lang/Lang";
import { BalancingScheme } from "lang/LangSeqTreeNode";

import { Coord, Tile } from "floor/Tile";
import { Grid } from "floor/Grid";

import { Player } from "../player/Player";
import { PuppetPlayer } from "../player/PuppetPlayer";
import { HumanPlayer } from "../player/HumanPlayer";
import { ArtificialPlayer } from "../player/ArtificialPlayer";

import { PlayerMovementEvent } from "../events/PlayerMovementEvent";
import { Bubble } from "../events/Bubble";
import { EventRecordEntry } from "../events/EventRecordEntry";

import { Game } from "game/Game";


export abstract class _GameBase<G extends Game.Type, S extends Coord.System.GridCapable> {

    public readonly gameType: G;

    public readonly tileClass: Tile.ConstructorType<S>;

    public readonly lang: Lang;

    /**
     * NOTE: While this is a field, shuffling operations and the
     * {@link Lang} implementation are able to support mid-game changes
     * to the balancing behaviour. Making it fixed for the lifetime of
     * a `Game` is a choice I made in order to make the user experience
     * more simple. It's one less thing they'll see in the in-game UI,
     * and I don't think they'd feel as if it were missing.
     */
    protected readonly langBalancingScheme: BalancingScheme;

    /**
     * Contains all non-bench tiles in this game.
     */
    public readonly grid: Grid<S>;

    /**
     * 
     */
    private readonly players: Readonly<Player.Bundle<Player<S>>>;

    public readonly operator: G extends Game.Type.SERVER ? undefined : HumanPlayer<S>;

    /**
     * All copies of the game should contain identical entries. That
     * in a {@link ClientGame} may at any instant be missing trailing
     * entries, or contain some trailing holes, but such gaps should
     * eventually be filled to match those in the Game Manager.
     * 
     * Do not modify this directly. To register an accepted event,
     * call the {@link Game#recordEvent} method, passing it the event
     * descriptor. To get a new event ID, just take the current length
     * of this array.
     */
    private readonly eventRecord: Array<Readonly<EventRecordEntry>>;



    /**
     * _Does not call reset._
     * 
     * Performs the "no invincible player" check (See {@link Player#teamSet}).
     * 
     * @param desc -
     * @param tileClass -
     */
    public constructor(desc: Game.CtorArgs<G,S>, tileClass: Tile.ConstructorType<S>) {
        this.gameType = desc.gameType;
        this.tileClass = tileClass;
        this.grid = Grid.of(desc.coordSys, {
            dimensions: desc.gridDimensions,
            tileClass: this.tileClass,
        });

        // TODO: set default language (must be done before call to reset):
        //this.lang = import(desc.languageName);

        // NOTE: This is implementation specific. If the code is ever
        // made to handle more complex connections (Ex. hexagon tiling
        // or variable neighbours through graph structures), then this
        // must change to account for that.
        // TODO: make this static information so the UI can grey out incompatible
        // lang / floor-tiling combinations. Ie. move this check to the UI code.
        // if (this.lang.numLeaves < this.MAX_NUM_U2NTS) {
        //     throw new Error(`Found ${this.lang.numLeaves}, but at least`
        //         + ` ${this.MAX_NUM_U2NTS} were required. The provided mappings`
        //         + ` composing the current Lang-under-construction are not`
        //         + ` sufficient to ensure that a shuffling operation will always`
        //         + ` be able to find a safe candidate to use as a replacement.`
        //         + ` Please see the spec for ${Lang.prototype.getNonConflictingChar.name}.`
        //     );
        // }
        this.langBalancingScheme = desc.langBalancingScheme;
        this.eventRecord = [];

        // Construct players:
        this.players = this.createPlayers(desc);
        if (desc.operatorIndex) {
            (this.operator as HumanPlayer<S>) = this.getPlayerById({
                operatorClass: Player.Operator.HUMAN,
                intraClassId: desc.operatorIndex!,
            }) as HumanPlayer<S>;
        }

        // Check to make sure that none of the players are invincible:
        // @see Player#beNiceTo
        {
            ;
        }
    }

    /**
     * Reset the grid and the language hit-counters, performs language
     * sequence shuffle-ins, respawns players, and spawns in targets.
     * 
     * @override {@link Grid#reset}
     */
    public reset(): void {
        this.grid.reset();

        // Clear the event record:
        this.eventRecord.splice(0);

        // Reset hit-counters in the current language:
        // This must be done before shuffling so that the previous
        // history of shuffle-ins has no effects on the new pairs.
        this.lang.reset();

        // Shuffle everything:
        this.grid.forEachTile(this.shuffleLangCharSeqAt, this);

        for (const sameClassPlayers of Object.values(this.players)) {
            sameClassPlayers.forEach((player) => {
                player.reset();
            });
        }

        // TODO: spawn players and targets:
        // While not necessary, targets should be done after players have
        // spawned so they do not spawn under players.
    }



    /**
     * Private helper for the constructor.
     * 
     * Assigns player ID's.
     * 
     * @param desc -
     * @returns A bundle of the constructed players.
     */
    private createPlayers(
        desc: Readonly<Game.CtorArgs<G,S>>,
    ): Game<G,S>["players"] {
        /**
         * @inheritdoc
         * NOTE: this doc is just here to satisfy some linting warning condition.
         */
        function __assert(desc: Game.CtorArgs<any,S>):
            asserts desc is Readonly<Game.CtorArgs<Game.Type.Manager, S>> {
            if (desc.gameType === Game.Type.CLIENT) {
                throw new TypeError("This must be overriden for an online-client implementation.");
            }
        };
        __assert(desc);

        const players: Partial<Record<Player.Operator, ReadonlyArray<Player<S>>>> = {};
        for (const [ operatorClass, playersCtorArgs, ] of Object.entries(desc.playerDescs)) {
            Player.assertIsOperator(operatorClass);
            players[operatorClass] = playersCtorArgs.map((ctorArgs, intraClassId) => {
                if (operatorClass === Player.Operator.HUMAN) {
                    if (intraClassId === desc.operatorIndex) {
                        if (this.gameType === Game.Type.SERVER) {
                            throw new TypeError("The operator is not defined on the server side.");
                        }
                        // Found the operator. Note: this will never happen for
                        // a ServerGame instance, which sets this to `undefined`.
                        return this.createOperatorPlayer(ctorArgs);
                    } else {
                        // Human-operated players (except for the operator)
                        // are represented by a `PuppetPlayer`-type object.
                        return new PuppetPlayer(this, ctorArgs);
                    }
                } else {
                    // Artificial players' representation depends on the
                    // Game implementation type. We have an abstract method
                    // expressly for that purpose:
                    return this.createArtifPlayer(ctorArgs);
                }
            });
        }
        return players as Game<G,S>["players"];
    }

    /**
     * Called automatically in the constructor for this class. This
     * method should not add the produced player to the game's
     * {@link Game#allHumanPlayers} array or set the game's
     * {@link Game#operator}.
     * 
     */
    protected abstract createOperatorPlayer(desc: Player.CtorArgs): HumanPlayer<S>;

    /**
     * @returns An {@link ArtificialPlayer} of the specified type.
     * 
     * @param desc -
     */
    protected createArtifPlayer(
        desc: Player.CtorArgs,
    ): PuppetPlayer<S> | ArtificialPlayer<S> { // TODO: use conditional types
        return ArtificialPlayer.of(this, desc);
    }



    /**
     * Helper for {@link Game#processMoveRequest}.
     * 
     * **Important:** Does not consume
     * the returned values, which is expected to be done externally.
     * Nullifies the existing values at `tile`.
     * 
     * @param targetTile
     * The {@link Tile} to shuffle their {@link Lang.CharSeqPair}
     * pair for.
     * 
     * @returns
     * A {@link Lang.CharSeqPair} that can be used as a replacement
     * for that currently being used by `tile`.
     */
    public shuffleLangCharSeqAt(targetTile: Tile<S | Coord.System.__BENCH>): Lang.CharSeqPair {
        // TODO: first of all, this should have been specifying the
        // radius argument to be 2. Second, it technically should
        // not even be specifying the radius as two: it should take
        // the set of of all tiles a player can reach from tiles by
        // which a player can reach `targetTile`. This would properly
        // handle directed-graph-type coordinate systems.

        // First, clear values for the target tile so its current
        // (to-be-previous) values don't get unnecessarily avoided.
        targetTile.setLangCharSeq(Lang.CharSeqPair.NULL);

        const benchOwnerId = (targetTile as Tile<Coord.System.__BENCH>).coord.playerId;
        if (benchOwnerId !== undefined) {
            const benchOwner = this.getPlayerById(benchOwnerId);
            return {
                char: benchOwner.playerId.toString(),
                seq: benchOwner.username,
            };
        } else {
            return this.lang.getNonConflictingChar(
                this.grid.getNeighbouringTiles((targetTile as Tile<S>).coord)
                    .map((tile) => tile.langSeq)
                    .filter((seq) => seq), // no falsy values.
                this.langBalancingScheme,
            );
        }
    }

    /**
     * @see PlayerMovementEvent
     * 
     * Call for a {@link HumanPlayer} whose {@link HumanPlayer#seqBuffer}
     * should be that of the {@link Tile} at `dest`. Reject the request
     * by returning `null` if `dest` is occupied, or if the player
     * specified by the given id does not exist, or if the requester has
     * not yet received updates for the destination they requested to
     * move to, or the requester is still bubbling.
     * 
     * Does not actually make any modifications to any part of the game
     * state, and instead, delegates the execution of all necessitated
     * changes to {@link Game#processMoveExecute}.
     * 
     * Should never be called by {@link ClientGame}.
     * 
     * @param desc - A descriptor of the request, with fields indicating
     *      the requester's views of critical parts of the game-state
     *      from their copy of the game-state at the time of the request.
     *      Is modified to describe changes to be made.
     */
    public abstract processMoveRequest(desc: PlayerMovementEvent<S>): void;

    /**
     * @see Bubble.MakeEvent
     * 
     * Should never be called by {@link ClientGame}.
     * 
     * @param desc - Is modified to describe changes to be made.
     */
    public abstract processBubbleMakeRequest(desc: Bubble.MakeEvent): void;



    /**
     * TODO: make abstract. server manages, client displays, offline does both.
     * 
     * @param player - 
     * @param duration - 
     */
    protected freezePlayer(player: Player<S>, duration: number): void { }



    public abstract setTimeout(callback: Function, millis: number, ...args: any[]): G extends Game.Type.SERVER ? NodeJS.Timeout : number;

    public abstract cancelTimeout(handle: number | NodeJS.Timeout): void;

    /**
     * @returns
     * The tile at `dest`, or the specified player's {@link Player#benchTile}.
     * 
     * @param dest -
     */
    public getBenchableTileAt(
        dest: Coord.Bare<S | Coord.System.__BENCH>,
    ): Tile<S | Coord.System.__BENCH> {
        return ((dest as Coord.Bare<Coord.System.__BENCH>).playerId !== undefined)
            ? this.getPlayerById((dest as Coord.Bare<Coord.System.__BENCH>).playerId).benchTile
            : this.grid.getTileAt(dest as Coord.Bare<S>);
    }

    /**
     * @param playerId - The ID of an existing player.
     * @returns The {@link Player} with ID `playerId`.
     */
    protected getPlayerById(playerId: Player.Id): Player<S> {
        return this.players[playerId.operatorClass][playerId.intraClassId];
    }

    /**
     * @returns
     * All {@link Player}s within a `radius` infinity-norm of `pos`.
     * 
     * @param coord - 
     * @param radius - defaults to one.
     */
    public getNeighbours(coord: Coord.Bare<S>, radius: number = 1): Array<Player<S>> {
        return this.grid.getNeighbouringTiles(coord, radius)
            .filter((tile) => tile.isOccupied)
            .map((tile) => this.getPlayerById(tile.occupantId));
    }

}