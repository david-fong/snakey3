import { Player } from "defs/TypeDefs";
import { Group, GroupEv } from "defs/OnlineDefs";
import { Game } from "game/Game";

import { JsUtils, OmHooks, Coord, SkScreen, StorageHooks } from "../SkScreen";
type SID = SkScreen.Id.GROUP_LOBBY;
const OMHC = OmHooks.Screen.Impl.GroupLobby.Class;

/**
 *
 */
export class GroupLobbyScreen extends SkScreen<SID> {

    /**
     * A map from socket ID's to descriptors of players' info.
     */
    private readonly _players:  Map<string, GroupLobbyScreen.UserInfo>;
    private readonly teamsElem: HTMLElement;
    private readonly teamElems: Map<number, HTMLElement>;

    private readonly in: Readonly<{
        username: HTMLInputElement;
        teamId:   HTMLInputElement;
        avatar:   HTMLSelectElement;
    }>;

    /**
     * @override
     */
    public get initialScreen(): SkScreen.Id {
        return SkScreen.Id.GROUP_JOINER;
    }

    private get socket(): typeof io.Socket {
        return this.top.sockets.groupSocket!;
    }

    /**
     * @override
     */
    protected _lazyLoad(): void {
        // @ts-expect-error : RO=
        this._players = new Map();
        this._createInputs();
        this.nav.prev.textContent = "Return To Joiner";

        /* @ts-expect-error : RO= */
        {this.teamsElem = document.createElement("div");
        this.teamsElem.classList.add(OMHC.SEC_TEAMS);
        this.baseElem.appendChild(this.teamsElem);}

        // @ts-expect-error : RO=
        this.teamElems = new Map();

        JsUtils.propNoWrite(this as GroupLobbyScreen, [
            "_players", "teamsElem", "teamElems", "in",
        ]);

        {const goSetup = this.nav.next;
        goSetup.textContent = "Setup Game";
        goSetup.onclick = () => {
            this.requestGoToScreen(SkScreen.Id.SETUP_ONLINE, {});
        }
        this.baseElem.appendChild(goSetup);}
    }

    /**
     */
    private _createInputs(): void {
        const base = document.createElement("div");
        base.classList.add(
            OmHooks.General.Class.INPUT_GROUP,
            OMHC.SEC_CLIENT_INFO,
        );

        const uname = Object.assign(document.createElement("input"), <Partial<HTMLInputElement>>{
            type      : "text",
            minLength : 1,
            maxLength : Player.Username.MAX_LENGTH,
            pattern   : Player.Username.REGEXP.source,
            spellcheck: false,
            value     : this.top.storage.Local.username ?? "",
            onchange  : this._submitInputs.bind(this),
        });
        uname.classList.add(OmHooks.General.Class.INPUT_GROUP_ITEM);
        base.appendChild(uname);

        const teamId = Object.assign(document.createElement("input"), <Partial<HTMLInputElement>>{
            type: "number", inputMode: "numeric",
            min: "0", max: "0", step: "1", value: "0",
            onchange: this._submitInputs.bind(this),
        });
        teamId.classList.add(OmHooks.General.Class.INPUT_GROUP_ITEM);
        base.appendChild(teamId);

        const avatar = document.createElement("select");
        // TODO.impl avatar selection element

        // @ts-expect-error : RO=
        this.in = Object.freeze<GroupLobbyScreen["in"]>({
            username: uname,
            teamId,
            avatar,
        });
        this.baseElem.appendChild(base);
    }
    private _submitInputs(): void {
        if (!this.in.username.validity.valid || !this.in.teamId.validity.valid) {
            return;
        }
        this.top.storage.Local.username = this.in.username.value;
        this.top.storage.Local.avatar   = this.in.avatar.value;
        this.socket.emit(Group.Socket.UserInfoChange.EVENT_NAME, <Group.Socket.UserInfoChange.Req>{
            username: this.in.username.value,
            teamId: parseInt(this.in.teamId.value),
            avatar: Player.Avatar.LOREM_IPSUM, // TODO.impl add an input field for `userInfo.avatar`.
        });
    };

    /**
     * @override
     */
    protected async _abstractOnBeforeEnter(navDir: SkScreen.NavDir, args: SkScreen.EntranceArgs[SID]): Promise<void> {
        if (navDir === "forward") {
            this.nav.next.disabled = !this.top.clientIsGroupHost;
            this._players.clear();
            this.teamElems.clear();
            this.teamsElem.textContent = "";
            this._submitInputs();

            this.socket.on(
                Group.Socket.UserInfoChange.EVENT_NAME,
                this._onUserInfoChange.bind(this),
            );
            // Listen for when the server sends tbe game constructor arguments:
            this.socket.once(
                GroupEv.CREATE,
                async (gameCtorArgs: Game.CtorArgs<Game.Type.ONLINE,Coord.System>) => {
                    this.requestGoToScreen(SkScreen.Id.PLAY_ONLINE, gameCtorArgs);
                },
            );
        }
    }

    /**
     * @override
     */
    protected _abstractOnBeforeLeave(navDir: SkScreen.NavDir): boolean {
        if (navDir === SkScreen.NavDir.BACKWARD) {
            // Make sure we stop listening for the game to start
            // in case it hasn't started yet:
            this.socket.removeListener(GroupEv.CREATE);
        }
        return true;
    }

    /**
     */
    private _onUserInfoChange(res: Group.Socket.UserInfoChange.Res): void {
        Object.entries(res).forEach(([socketId, desc]) => {
            const userInfo = this._players.get(socketId);

            // If player is in a team on their own and they are leaving it:
            if (userInfo
                && this.teamElems.get(userInfo.teamId)!.childElementCount === 1
                && (desc === undefined || desc.teamId !== userInfo.teamId)) {
                this.teamElems.get(userInfo.teamId)!.remove();
                this.teamElems.delete(userInfo.teamId);
            }

            // If player is joining a team that has no HTML element yet:
            if (desc && !this.teamElems.has(desc.teamId)) {
                const teamElem = document.createElement("div");
                this.teamElems.set(desc.teamId, teamElem);
                teamElem.classList.add(OMHC.TEAM);
                teamElem.onclick = (ev) => {
                    this.in.teamId.value = desc.teamId.toString();
                }
                this.teamsElem.appendChild(teamElem);
            }

            if (desc === undefined) {
                // Player has left the group:
                userInfo!.base.remove();
                this._players.delete(socketId);
            } else if (userInfo === undefined) {
                // New player has joined the group:
                const userInfo = new GroupLobbyScreen.UserInfo(desc);
                this._players.set(socketId, userInfo);
                this.teamElems.get(desc.teamId)!.appendChild(userInfo.base);
            } else {
                // Player changed their user information:
                userInfo.update(desc);
            }
        });
        this.in.teamId.max = Object.keys(this._players).length.toString();
    }
}
export namespace GroupLobbyScreen {
    /**
     */
    export class UserInfo implements Player.UserInfo {
        #username: Player.Username;
        #teamId:   number;
        #avatar: Player.Avatar;

        public readonly base: HTMLElement;
        private readonly el: Readonly<{
            username: HTMLElement;
            teamId: HTMLElement;
            avatar: HTMLElement;
        }>;

        public constructor(desc: Player.UserInfo) {
            this.base = document.createElement("div");
            this.base.classList.add(OMHC.PLAYER);
            const mkDiv = (): HTMLDivElement => {
                const div = document.createElement("div");
                this.base.appendChild(div);
                return div;
            }
            this.el = Object.freeze<UserInfo["el"]>({
                username: mkDiv(),
                teamId:   mkDiv(),
                avatar:   mkDiv(),
            });
            this.el.username.classList.add(OMHC.PLAYER_NAME);
            this.username = desc.username;
            this.teamId = desc.teamId;
            JsUtils.propNoWrite(this as UserInfo, ["base", "el",]);
        }

        public update(desc: Player.UserInfo): void {
            this.username = desc.username;
            this.teamId   = desc.teamId;
            this.avatar   = desc.avatar;
        };

        public get username(): Player.Username {
            return this.#username;
        }
        public set username(newUsername: Player.Username) {
            this.el.username.textContent = newUsername;
            this.#username = newUsername;
        }

        public get teamId(): number {
            return this.#teamId;
        }
        public set teamId(newTeamId: number) {
            this.el.teamId.textContent = newTeamId.toString();
            this.#teamId = newTeamId;
        }

        public get avatar(): Player.Avatar {
            return this.#avatar;
        }
        public set avatar(newAvatar: Player.Avatar) {
            this.#avatar = newAvatar;
            this.el.avatar; // TODO.impl set the avatar image.
        }
    }
}
JsUtils.protoNoEnum(GroupLobbyScreen, ["_createInputs", "_submitInputs",]);
Object.freeze(GroupLobbyScreen);
Object.freeze(GroupLobbyScreen.prototype);