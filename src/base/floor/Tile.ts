import type { Lang, Player } from "defs/TypeDefs";
import type { Coord } from "./Coord"; export { Coord };

/**
 * A DTO 📦
 *
 * None of the fields can be `undefined`. This simplifies detection
 * of "nullifying" fields vs leaving fields unchanged when processing
 * state change descriptors.
 *
 * @see Tile.ImplementationNotes
 */
export interface Tile extends Required<Tile.Changes> {
}
export namespace Tile {
	/**
	 * A DTO of changes 📦
	 */
	export interface Changes {
		readonly coord: Coord;
		/**
		 * The requester should set this field to the highest value they
		 * received from any previous responses from the server. In normal
		 * cases (no message reordering), this should be equal to the last
		 * value seen in the response from the server.
		 *
		 * The server should respond with the increment of this value.
		 * The server must reject requests where the requester has not
		 * received changes concerning their desired destination.
		 *
		 * This is used to ensure that in online sessions, each
		 * client has a synchronized copy of the game. The Game Manager
		 * will drop requests for movements made by players who made the
		 * request at a time when they had not yet received information
		 * related to the game-state in affected-zones of their request.
		 */
		readonly now: number;

		/**
		 * To evict an occupant, pass `Player.Id.NULL`.
		 */
		readonly occId?:  Player.Id;
		readonly health?: Player.Health;
		readonly char?:   Lang.Char;
		readonly seq?:    Lang.Seq;
	}
	/**
	 * Does not require a now field.
	 */
	export interface InternalChanges extends TU.Omit<Changes,"now"> {
		readonly now?: number;
	}

	/**
	 * Implementations may design their internals in any way they wish.
	 *
	 * - They may store tiles as separate arrays for each Tile field.
	 * - They may use compile-time Tile immutability and freeze their Tile array.
	 *   - Then they must copy on read during development.
	 *   - They may seal after construction.
	 * - They may use at-runtime Tile immutability with a mutable Tile array.
	 *   - Then they must copy and freeze on write.
	 */
	export type ImplementationNotes = undefined;
}