import { OmHooks } from "defs/OmHooks";
import type { Game } from "game/Game";
import type { OnlineGame } from "../../game/OnlineGame";

import { SkScreen } from "../SkScreen";
import { _PlayScreen } from "./Play";


type G = Game.Type.ONLINE;

/**
 *
 */
export class PlayOnlineScreen extends _PlayScreen<SkScreen.Id.PLAY_ONLINE, G> {

    public get initialScreen(): SkScreen.Id {
        return SkScreen.Id.GROUP_JOINER;
    };

    declare public readonly currentGame: OnlineGame<any> | undefined;

    /**
     * @override
     */
    protected readonly wantsAutoPause = false;

    /**
     * @override
     */
    protected _lazyLoad(): void {
        super._lazyLoad();
    }

    /**
     * @override
     */
    protected async _createNewGame(ctorArgs: Game.CtorArgs<G,any>): Promise<OnlineGame<any>> {
        const game = new (await import(
            /* webpackChunkName: "game/online" */
            "../../game/OnlineGame"
        )).OnlineGame(
            this._onGameBecomeOver.bind(this),
            this.toplevel.socket!,
            ctorArgs,
        );
        return Promise.resolve(game);
    }
}
export namespace PlayOnlineScreen {
}
Object.freeze(PlayOnlineScreen);
Object.freeze(PlayOnlineScreen.prototype);
