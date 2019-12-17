import { Player } from "base/player/Player";
import { EventRecordEntry } from "events/EventRecordEntry";

export { EventRecordEntry } from "events/EventRecordEntry";

export interface PlayerGeneratedRequest extends EventRecordEntry {

    readonly playerId: Player.Id;

    /**
     * ### Client Request
     *
     * Requester sends this desc to the Game Manager with a value of
     * the ID of the last request it that the server _accepted_. This
     * naturally implies that a requester cannot send a new request to
     * the Game Manager until it has received the Game Manager's
     * response to the last request it made.
     *
     * ### Server Response
     *
     * If the server accepts the request, it must broadcast a response
     * with this field set to the incremented value.
     *
     * If it rejects this request, it must directly acknowledge its
     * receipt of the request (no need to broadcast to all clients)
     * with this field unchanged, which indicates a rejection of the
     * request.
     *
     * ### Handling Unexpected Values
     *
     * If the server / Game Manager receives a request with a value in
     * this field lower than the one it set in its last response to the
     * requester, this would mean that the requester didn't wait for a
     * response to its previous request, which it is not supposed to do.
     *
     * **Important:** If the above requirement is ever changed, (in
     * addition to other mechanisms I haven't reasoned through,) this
     * field's spec should change to require _all_ server responses to
     * have this field set to an incremented value, including rejects.
     *
     * The server should never receive a request with a value higher
     * than the one it provided in its last response to this requester
     * because it in charge of incrementing it- the client should only
     * change the value it sees to match the one from the server's
     * response.
     *
     * In both these cases, the server may throw an assertion error for
     * debugging purposes.
     */
    lastAcceptedRequestId: number;

};

