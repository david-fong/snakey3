import type { Player } from "defs/TypeDefs";
import type * as NodeWebSocket from "ws";

/**
 */
export abstract class SkServer { }
export namespace SkServer {
	export const PROTOCOL = "http://";
	export const DEFAULT_PORT = 80;
	/**
	 * This is placed in this file so that it gets bundled into both the
	 * client and the server code, which both require access to it.
	 */
	export const enum Nsps {
		GROUP_JOINER        = "/joiner.",
		GROUP_LOBBY_PREFIX  = "/group.",
		GROUP_GAME_PREFIX   = "/group-game.",
	}
}
Object.freeze(SkServer);
Object.freeze(SkServer.prototype);


/**
 */
export abstract class Group { }
export namespace Group {

	/** */
	export namespace Socket {

		export namespace UserInfoChange {
			/**
			 * Client emits this with a descriptor of requested username and teamId.
			 * Server broadcasts a response
			 */
			export const EVENT_NAME = "group-lobby-user-info-change";

			export type Req = Player.UserInfo;
			export type Res = Record<string, Player.UserInfo | undefined>;
		}
	}

	export type Name = string;
	export namespace Name {
		export const REGEXP = /(?:[a-zA-Z0-9:-]+)/;
		export const MaxLength = 30;
	}
	export type Passphrase = string;
	export namespace Passphrase {
		export const REGEXP = /(?:[a-zA-Z0-9:-]*)/;
		export const MaxLength = 30;
	}

	export const GameServerReconnectionAttempts = 2;
	export const DEFAULT_TTL = 20; // seconds

	export namespace Exist {
		export const EVENT_NAME = "joiner-group-exist";

		/**
		 * Sent by the client to request the creation of a new group.
		 *
		 * Do not use this to request joining a group - That is done
		 * by opening a socket to that group's namespace and putting
		 * the passphrase in the request's query.
		 */
		export class RequestCreate {
			public constructor(
				public readonly groupName: Name,
				public readonly passphrase: string,
			) {}
		};
		export namespace RequestCreate {
			export const enum Response {
				OKAY = "okay",
				NOPE = "nope",
			};
		}
		/**
		 * Initiated by the server to notify clients of the status of
		 * existing groups.
		 */
		export type NotifyStatus = RequestCreate.Response | {
			[groupNspsName : string]: Status;
		};
		export const enum Status {
			IN_LOBBY = "in-lobby",
			IN_GAME  = "in-game",
			DELETE   = "delete",
		};
	}
}
Object.freeze(Group);
Object.freeze(Group.prototype);


/**
 */
export const enum GroupEv {
	/**
	 * On the clientside, this event is registered to the group socket.
	 */
	CREATE_GAME = "create-game",
}

/**
 */
export const enum GameEv {
	/**
	 */
	CREATE_GAME = "create",

	/**
	 * Upon constructing a _new_ game, the server waits for all clients
	 * to send this event to indicate that they have finished building
	 * any necessary HTML, and are now ready to receive the serialized
	 * reset-state.
	 */
	RESET = "reset",

	/**
	 * Client uses this event during reset procedure after receiving
	 * the serialized reset-state to indicate that it is ready for
	 * the game to be un-paused.
	 */
	UNPAUSE = "unpause",

	/**
	 */
	PAUSE = "pause",

	/**
	 */
	IN_GAME = "ingame",

	/**
	 * The server will send this event with no arguments to indicate
	 * that everyone must now return to the lobby, or with a socket
	 * ID as an argument to indicate that all players operated by
	 * a client with that socket ID are out of the game.
	 */
	RETURN_TO_LOBBY = "return-to-lobby",
};