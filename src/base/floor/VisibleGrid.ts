import style from "./grid.m.css";
import player_style from "game/player/player.m.css";
import { JsUtils } from "defs/JsUtils";

import type { Coord, Tile } from "floor/Tile";
import type { Grid } from "floor/Grid";

/**
 * All implementations must call `Grid._superVisibleGrid` at the end
 * of their constructors.
 *
 * NOTE: This is put in a separate file from the
 * base `Grid` class with a _separate_ dictionary of implementation
 * literals so that the build tooling can infer that this code can
 * be excluded (tree shaking). The implementations may still go in
 * the same file as their non-visible implementation since they are
 * separate exports (this can be tree-shaken). Specifically, the
 * _server_ related code will benefit from this choice.
 */
export interface VisibleGrid<S extends Coord.System>
extends Grid<S>, VisibleGridMixin { }

export namespace VisibleGrid {

	export interface ClassIf<S extends Coord.System> extends Grid.ClassIf<S> {
		/**
		 * @override
		 */
		new(desc: Grid.CtorArgs<S>): VisibleGrid<S>;
	};

	// Each implementation must register itself into this dictionary.
	export declare const _Constructors: {
		readonly [ S in Coord.System ]: Grid.ClassIf<S>
	};

	export const getImplementation = <S extends Coord.System>(coordSys: S): ClassIf<S> => {
		const ctor = _Constructors[coordSys];
		return ctor as unknown as ClassIf<S>;
	};
}


/**
 */
export class VisibleGridMixin {
	/**
	 * Contains the implementation-dependant HTML representation of
	 * the grid.
	 */
	declare public readonly baseElem: HTMLElement;
	declare public readonly spotlightElems: TU.RoArr<HTMLElement>;

	/**
	 * Note: I would rather have this implementation go under the
	 * `VisibleGrid` class, but I don't want to get into mixins as of
	 * now to get around no-multiple-inheritance.
	 */
	public _superVisibleGrid(tiles: HTMLElement): void {
		tiles.setAttribute("role", "presentation");
		tiles.translate  = false; // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate
		tiles.spellcheck = false; // typically assumed by the UA, but it doesn't hurt to say explicitly.

		// @ts-expect-error : RO=
		const base = this.baseElem = JsUtils.mkEl("div", [style["impl-body"]]);
		const root = base.attachShadow({ mode: "closed" });
		tiles.classList.add(style["impl-body"]);
		root.appendChild(tiles);
		root.appendChild(JsUtils.mkEl("link", [], {
			rel: "stylesheet",
			href: "css-common.css",
		}));
		root.appendChild(JsUtils.mkEl("link", [], {
			rel: "stylesheet",
			href: "chunk/game-css.css",
		}));

		// Initialize spotlight elements:
		const shortSpotlight = JsUtils.mkEl("div", [player_style["spotlight-short"]]);
		const longSpotlight  = JsUtils.mkEl("div", [player_style["spotlight-long"]]);
		// @ts-expect-error : RO=
		this.spotlightElems = Object.freeze([ shortSpotlight, longSpotlight ]);
	}
}
export interface VisibleGridMixin {};
Object.freeze(VisibleGridMixin);
Object.freeze(VisibleGridMixin.prototype);