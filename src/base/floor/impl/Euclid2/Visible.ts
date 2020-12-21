import { JsUtils } from "defs/JsUtils";
import type { Coord, Tile } from "floor/Tile";
import type { Grid as AbstractGrid } from "floor/Grid";
import { VisibleTile } from "floor/visible/VisibleTile";
import { VisibleGrid, VisibleGridMixin } from "floor/visible/VisibleGrid";

import { WrappedEuclid2 } from "./System";
import style from "./style.m.css";
type S = Coord.System.W_EUCLID2;

/**
 */
export class Euclid2VisibleGrid extends WrappedEuclid2.Grid implements VisibleGrid<S> {
	#tiles: TU.RoArr<VisibleTile>;
	public constructor(desc: AbstractGrid.CtorArgs<S>) {
		super(desc);
		const gridElem = JsUtils.mkEl("div", [style["grid"]]);
		gridElem.style.setProperty("--euclid2-grid-width", this.dimensions.width.toString());

		const tiles: Array<VisibleTile> = [];
		this.grid.forEach((tile) => {
			const vTile = new VisibleTile();
			tiles.push(vTile);
			gridElem.appendChild(vTile.baseElem);
		});
		this.#tiles = tiles;

		this._superVisibleGrid(gridElem);
	}
	/** @override */
	public editTile(changes: Tile.InternalChanges): void {
		super.editTile(changes);
		const tile = this.#tiles[changes.coord]!;
		if (JsUtils.hasProp(changes, "occId")) {
			tile.occId = changes.occId!;
		}
		if (JsUtils.hasProp(changes, "char")) {
			tile.char = changes.char!;
		}
		if (JsUtils.hasProp(changes, "health")) {
			tile.health = changes.health!;
		}
	}
}
export interface Euclid2VisibleGrid extends VisibleGridMixin { };
JsUtils.applyMixins(Euclid2VisibleGrid, [VisibleGridMixin]);
Object.freeze(Euclid2VisibleGrid);
Object.freeze(Euclid2VisibleGrid.prototype);