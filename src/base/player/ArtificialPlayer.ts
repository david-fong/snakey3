import { BarePos } from "src/Pos";
import { Pos, Tile } from "src/base/Tile";
import { Game } from "src/base/Game";
import { ClientGame } from "src/client/ClientGame";
import { Player } from "src/base/player/Player";
import { ArtificialPlayerTypes as Types } from "src/base/player/artificials/Chaser";
import { PlayerMovementEvent } from "src/events/PlayerMovementEvent";

/**
 * Unlike {@link HumanPlayer}s, these are not guided by human input.
 * Instead, they are essentially defined by how often they move, and
 * where they decide to move toward each time they move.
 * 
 * Can be paused and un-paused by the Game Manager.
 * 
 * @extends Player
 */
// TODO: if add abstract method hooks for events like player "collision",
// then add this to the above documentation.
export abstract class ArtificialPlayer extends Player {

    /**
     * @override
     */
    public readonly beNiceTo: Player["beNiceTo"];

    protected scheduledMovementCallbackId: number | NodeJS.Timeout;

    /**
     * See {@link ArtificialPlayer.of} for the public constructor interface.
     * 
     * @param game - 
     * @param desc - 
     */
    protected constructor(game: Game, desc: Player.ConstructorArguments) {
        super(game, desc);
        if (this.idNumber >= 0) {
            throw new RangeError(`The ID number for a human-operated player`
                + ` must be strictly lesser than ${Player.Id.NULL}, but we`
                + ` were passed the value \"${this.idNumber}\".`
            );
        }
        if (desc.operatorClass >= Player.OperatorClass.HUMAN_CLASS) {
            throw new RangeError(`The static constant defining the team`
                + ` number for an artificial player type must be strictly`
                + ` less than ${Player.OperatorClass.HUMAN_CLASS}.`
            );
        }
        if (game instanceof ClientGame) {
            throw new TypeError("ClientGames should be using PuppetPlayers instead.");
        }
    }

    /**
     * Returns a {@link Pos} representing an absolute coordinate (ie.
     * one that is relative to the {@link Game}'s origin position')
     * that this `ArtificialPlayer` intends to move toward in its next
     * movement request. Pos may contain non-integer coordinate values,
     * and it does not have to be inside the bounds of the {@link Grid}.
     */
    protected abstract computeDesiredDestination(): Pos;

    protected abstract computeNextMovementTimer(): number;



    /**
     * @returns One of the closest unoccupied neighbouring Tiles in
     *      the direction of `intendedDest`. Will generally choose
     *      between equal-cost options in a manner that follows a
     *      straight-looking path.
     * 
     * **Important:** The caller must first break the upward occupancy
     * link by calling `this.hostTile.evictOccupant();`
     * 
     * Note: the current position of this `ArtificialPlayer` is
     * always an option when everything adjacent to it is occupied.
     * 
     * @param intendedDest - Does not need to be within the boundaries
     *      of the {@link Game}'s grid, or have integer-valued x and y
     *      coordinates.
     */
    private getUntToward(intendedDest: BarePos): Tile {
        const options: Array<Tile> = this.getUNT();
        if (!(options.includes(this.hostTile))) {
            // This should never happen. It is here as a reminder.
            throw new Error("Caller code didn't break the upward occupancy link.");
        }
        if (options.length === 1) {
            // Minor optimization:
            return options[0];
        }
        options.sort((tileA, TileB) => {
            // Break (some) ties by one-norm:
            return tileA.pos.oneNorm(intendedDest) - TileB.pos.oneNorm(intendedDest);
        }).sort((tileA, TileB) => {
            // Break (some) ties by one-norm:
            return tileA.pos.infNorm(intendedDest) - TileB.pos.infNorm(intendedDest);
        });
        // Filter out options that are not equally favorable as the
        // most favorable option. I think this is the best method:
        // Note: it is safe to start at index `1` because of the
        // above short-circuit if `options.length === 1`.
        for (let i = 1; i < options.length; i++) {
            if (options[i].pos.infNorm(intendedDest) > options[0].pos.infNorm(intendedDest)) {
                options.splice(i);
                break;
            }
        }
        if (options.length === 1) {
            // Minor optimization:
            return options[0];
        }
        // Choose one of the most favorable using some randomness
        // weighted to follow a straight-looking path of movement.
        if (options[0].pos.x === 0 || options[0].pos.y === 0) {
            // (the axial option (if it exists) should be the first
            // due to the previous sort's tie-breaker.
            if (this.pos.axialAlignment(intendedDest) - 0.5 > 0.0) {
                // The path to the intended destination is aligned more
                // with the x or y axis than they are with those axes
                // rotated 45 degrees.
                return options[0];
            } else {
                // Ignore the axial option in further computations:
                options.shift();
            }
        }
        // Choose a random non-axial option:
        return options[Math.floor(options.length * Math.random())];
    }

    /**
     * Unlike {@link HumanPlayer}s, `ArtificialPlayer`s are managed
     * directly by the Game Manager, so there is no need to make a
     * request via socket.io.
     * 
     * @override
     */
    protected abstractMakeMovementRequest(dest: Tile): void {
        this.game.processMoveRequest(
            new PlayerMovementEvent(
                this.idNumber,
                this.lastAcceptedRequestId,
                dest,
            ),
        );
    }

}



export namespace ArtificialPlayer {

    const Constructors = new Map<Player.OperatorClass, Function>([
        [ Types.Chaser.TEAM_NUMBER, Types.Chaser.prototype.constructor, ],
    ]);

    export const of = (game: Game, desc: Player.ConstructorArguments): ArtificialPlayer => {
        const typeId: Player.OperatorClass = desc.operatorClass;
        if (!(Constructors.has(typeId))) {
            throw new RangeError(`No artificial player type with the type-id`
                + ` \"${typeId}\" exists.`
            );
        }
        return new ((Constructors.get(typeId) as Function)(game, desc));
    };

}
