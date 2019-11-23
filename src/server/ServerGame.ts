import { BarePos } from "src/Pos";
import { ServerTile } from "src/server/ServerTile";
import { GridDimensionDesc, Game } from "src/base/Game";
import { GroupSession } from "src/server/GroupSession";
import { PlayerMovementEvent } from "src/base/PlayerMovementEvent";
import { setTimeout } from "timers";

/**
 * 
 * 
 * @extends Game
 */
export class ServerGame extends Game {

    protected readonly session: GroupSession;

    /**
     * _Calls reset recursively for this entire composition._
     * 
     * @param session - 
     * @param dimensions - 
     */
    public constructor(
        session: GroupSession,
        dimensions: GridDimensionDesc,
    ) {
        super(dimensions);
        this.session = session;

        this.reset();
    }

    /**
     * @override
     */
    public reset(): void {
        super.reset();
        // TODO: broadcast a gamestate dump to all clients
        // and wait for each of their acks before starting to
        // actually process their movement requests and making
        // any artificial players start moving.
    }

    /**
     * @override
     */
    public createTile(pos: BarePos): ServerTile {
        return new ServerTile(pos);
    }

    public setTimeout(callback: VoidFunction, millis: number, ...args: any[]): NodeJS.Timeout {
        return setTimeout(callback, millis, args);
    }

    public cancelTimeout(handle: NodeJS.Timeout): void {
        clearTimeout(handle);
    }

    /**
     * @override
     */
    public processMoveRequest(desc: PlayerMovementEvent): PlayerMovementEvent | null {
        const responseDesc = super.processMoveRequest(desc);
        if (responseDesc !== null) {
            // Request was accepted.
            // Pass on change descriptor to all clients:
            this.session.namespace.emit(
                PlayerMovementEvent.EVENT_NAME,
                responseDesc,
            );
        } else {
            // The request was rejected- Notify the requester. Note the use
            // of `desc` instead of `responseDesc`. `desc` can be used with
            // no change. Its request ID field is correctly unchanged, which
            // according to the spec, indicates a rejected request.
            // TODO: don't broadcast. just respond directly to the requester.
            this.session.namespace.emit(
                PlayerMovementEvent.EVENT_NAME,
                desc,
            );
        }
        return responseDesc;
    }

}
