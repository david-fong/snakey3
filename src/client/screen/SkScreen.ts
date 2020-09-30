import { OmHooks } from "defs/OmHooks";
import { StorageHooks } from "defs/StorageHooks";
import type { Coord } from "floor/Tile";
import type { Game } from "game/Game";
import type { AllSkScreens } from "./AllSkScreens";
import type { TopLevel } from "../TopLevel";

import type {         HomeScreen } from "./impl/Home";
import type {    HowToPlayScreen } from "./impl/HowToPlay";
import type {    HowToHostScreen } from "./impl/HowToHost";
import type {   ColourCtrlScreen } from "./impl/ColourCtrl";
// ======== :   ~~~ OFFLINE ~~~  :============================
import type { SetupOfflineScreen } from "./impl/SetupOffline";
import type {  PlayOfflineScreen } from "./impl/PlayOffline";
// ======== :   ~~~ ONLINE ~~~~  :============================
import type {  GroupJoinerScreen } from "./impl/GroupJoiner";
import type {  SetupOnlineScreen } from "./impl/SetupOnline";
import type {   GroupLobbyScreen } from "./impl/GroupLobby";
import type {   PlayOnlineScreen } from "./impl/PlayOnline";

export { OmHooks, Coord, StorageHooks };


/**
 *
 *
 * NOTE: Design decision: Isolate from the rest of the architecture.
 * Ie. Do not give it circular / upward references to anything that
 * references it.
 */
export abstract class SkScreen<SID extends SkScreen.Id> {

    public readonly screenId: SID;

    protected readonly top: TopLevel;

    readonly #parentElem: HTMLElement;

    protected readonly baseElem: HTMLElement;

    #hasLazyLoaded: boolean;

    protected readonly nav: Readonly<{
        /**
         * `onclick` callback is registered automatically. Do not overwrite it.
         */
        prev: TU.Omit<HTMLButtonElement, "onclick">;
        next: HTMLButtonElement;
    }>;

    /**
     * Used as the initial screen when arriving at this website via url.
     * Returns this screen's own id by default.
     *
     * **IMPORTANT**: Must identify a screen whose `EntranceArgs` is
     * of type `{}`. Therefore, screens who don't take `{}` as entry
     * arguments must override this method.
     */
    public get initialScreen(): SkScreen.Id {
        return this.screenId;
    }
    /**
     * Used to define the behaviour of the navigation buttons.
     *
     * **IMPORTANT**: Must pass "backward" as the `historyDirection` argument.
     */
    public getNavPrevArgs(): Parameters<AllSkScreens["goToScreen"]> {
        const defaultDest = SkScreen.NavPrevDest[this.screenId] as SkScreen.Id | undefined;
        if (defaultDest) {
            return [defaultDest, {}, "backward"];
        } else {
            throw "never";
        }
    }

    /**
     * Implementations can use this as part of navigation button
     * handlers. Refers directly to AllSkScreens.goToScreen.
     */
    protected readonly requestGoToScreen: AllSkScreens["goToScreen"];

    /**
     *
     * @param parentElem -
     * @param requestGoToDisplay -
     */
    public constructor(
        screenId: SID,
        toplevel: TopLevel,
        parentElem: HTMLElement,
        requestGoToDisplay: AllSkScreens["goToScreen"],
    ) {
        this.screenId           = screenId;
        this.top                = toplevel;
        this.#parentElem        = parentElem;
        this.requestGoToScreen  = requestGoToDisplay;
        this.#hasLazyLoaded     = false;
        (this.nav as SkScreen<SkScreen.Id>["nav"]) = Object.freeze({
            next: document.createElement("button"),
            prev: document.createElement("button"),
        });
        (this.nav.prev as HTMLButtonElement).onclick = (ev) => {
            this.requestGoToScreen(...this.getNavPrevArgs());
        };
    }

    /**
     * **Do not override.**
     */
    public async enter(
        args: SkScreen.EntranceArgs[SID],
        historyDirection: "forward" | "backward",
    ): Promise<void> {
        if (!this.#hasLazyLoaded) {
            const baseElem
                = (this.baseElem as HTMLElement)
                = document.createElement("div");
            baseElem.classList.add(OmHooks.Screen.Class.BASE);
            this._lazyLoad();
            this.#parentElem.appendChild(baseElem);
            const spaceyCamelName = this.screenId.replace(/[A-Z]/g, (letter) => " " + letter);
            { // "<SCREEN NAME> SCREEN"
                const str = spaceyCamelName.toUpperCase();
                this.top.prependComment(baseElem, `${str} SCREEN`);
            }{ // "<Screen Name> Screen"
                const str = spaceyCamelName.split(' ').map((word) =>
                    word.charAt(0).toUpperCase()
                    + word.substring(1)).join(' ');
                baseElem.setAttribute("aria-label", str + " Screen");
            }
            this.#hasLazyLoaded = true;
        }
        {
            const location = new window.URL(window.location.href);
            location.hash = this.screenId;
            const args = <const>[{ screenId: this.screenId, }, "", location.href];
            switch (historyDirection) {
                case "forward":  history.pushState(   ...args);    break;
                case "backward": history.replaceState(...args); break;
                default: throw "never";
            }
        }

        await this._abstractOnBeforeEnter(args);
        // ^Wait until the screen has finished setting itself up
        // before entering it.
        window.requestAnimationFrame((time) => {
            this.baseElem.dataset[OmHooks.Screen.Dataset.CURRENT] = ""; // exists.
            this.baseElem.setAttribute("aria-hidden", "false");
        });
    }

    /**
     * **Do not override.**
     *
     * @returns false if the leave was cancelled.
     */
    public leave(): boolean {
        if (this._abstractOnBeforeLeave()) {
            delete this.baseElem.dataset[OmHooks.Screen.Dataset.CURRENT]; // non-existant.
            this.baseElem.setAttribute("aria-hidden", "true");
            return true;
        }
        return false;
    }

    /**
     * Implementations should set the CSS class for the base element.
     */
    protected abstract _lazyLoad(): void;

    /**
     * This is a good place to start any `setInterval` schedules, and
     * to bring focus to a starting HTML element if appropriate.
     *
     * The default implementation does nothing. Overriding implementations
     * from direct subclasses can safely skip making a supercall.
     *
     * Important: Calls to `HTMLElement.focus` may require a small delay
     * via setTimeout. The reason for this is currently unknown.
     */
    protected async _abstractOnBeforeEnter(args: SkScreen.EntranceArgs[SID]): Promise<void> { }

    /**
     * Return false if the leave should be cancelled. This functionality
     * allows an implementation to provide a prompt to the user such as
     * a confirmation modal warning that unsaved changes would be lost.
     *
     * This is a good place, for example, to stop any non-essential
     * `setInterval` schedules.
     */
    protected _abstractOnBeforeLeave(): boolean {
        return true;
    }

}
export namespace SkScreen {

    export enum Id {
        // General:     ===================
        HOME            = "home",
        HOW_TO_PLAY     = "howToPlay",
        HOW_TO_HOST     = "howToHost",
        COLOUR_CTRL     = "colourControl",
        // Offline:     ===================
        SETUP_OFFLINE   = "setupOffline",
        PLAY_OFFLINE    = "playOffline",
        // Online:      ===================
        GROUP_JOINER    = "groupJoiner",
        SETUP_ONLINE    = "setupOnline",
        GROUP_LOBBY     = "groupLobby",
        PLAY_ONLINE     = "playOnline",
        // =======      ===================
    }
    export interface Dict {
        [ Id.HOME          ]: HomeScreen;
        [ Id.HOW_TO_PLAY   ]: HowToPlayScreen;
        [ Id.HOW_TO_HOST   ]: HowToHostScreen;
        [ Id.COLOUR_CTRL   ]: ColourCtrlScreen;
        //==================
        [ Id.SETUP_OFFLINE ]: SetupOfflineScreen;
        [ Id.PLAY_OFFLINE  ]: PlayOfflineScreen;
        //==================
        [ Id.GROUP_JOINER  ]: GroupJoinerScreen;
        [ Id.SETUP_ONLINE  ]: SetupOnlineScreen;
        [ Id.GROUP_LOBBY   ]: GroupLobbyScreen;
        [ Id.PLAY_ONLINE   ]: PlayOnlineScreen;
    }
    export interface EntranceArgs {
        [ Id.HOME          ]: {};
        [ Id.HOW_TO_PLAY   ]: {};
        [ Id.HOW_TO_HOST   ]: {};
        [ Id.COLOUR_CTRL   ]: {};
        //==================
        [ Id.SETUP_OFFLINE ]: {};
        [ Id.PLAY_OFFLINE  ]: Game.CtorArgs<Game.Type.OFFLINE,Coord.System>;
        //==================
        [ Id.GROUP_JOINER  ]: {};
        [ Id.SETUP_ONLINE  ]: {};
        [ Id.GROUP_LOBBY   ]: GroupLobbyScreen.EntranceArgs;
        [ Id.PLAY_ONLINE   ]: Game.CtorArgs<Game.Type.ONLINE,Coord.System>;
    }
    export const NavPrevDest = Object.freeze(<const>{
        [ Id.HOME          ]: Id.HOME,
        [ Id.HOW_TO_PLAY   ]: Id.HOME,
        [ Id.HOW_TO_HOST   ]: Id.HOME,
        [ Id.COLOUR_CTRL   ]: Id.HOME,
        //==================
        [ Id.SETUP_OFFLINE ]: Id.HOME,
        [ Id.PLAY_OFFLINE  ]: Id.SETUP_OFFLINE,
        //==================
        [ Id.GROUP_JOINER  ]: Id.HOME,
        [ Id.SETUP_ONLINE  ]: Id.GROUP_JOINER,
        [ Id.GROUP_LOBBY   ]: undefined as never,
        [ Id.PLAY_ONLINE   ]: undefined as never,
    });
    const a: {} = {hi: ""}

    /**
     * Helper type for overriding SkScreen.getNavPrevArgs.
     */
    export type NavPrevRet<SID extends SkScreen.Id> = [SID, SkScreen.EntranceArgs[SID], "backward"];
}
Object.freeze(SkScreen);
Object.freeze(SkScreen.prototype);
