import { LangChar, LangSeq, LangCharSeqPair } from "src/Lang";
import { Tile } from "src/base/Tile";
import { PlayerId } from "src/base/Player";

/**
 * Bare minimum implementation. Absolutely no visuals or HTML.
 * 
 * @extends Tile
 */
export class ServerTile extends Tile {

    private _occupantId: PlayerId;
    private _scoreValue: number;

    protected _langChar: LangChar;
    protected _langSeq:  LangSeq;



    public get occupantId(): PlayerId {
        return this._occupantId;
    }

    public set occupantId(occupantId: PlayerId) {
        this._occupantId = occupantId;
    }

    public get scoreValue(): number {
        return this._scoreValue;
    }

    public set scoreValue(score: number) {
        this._scoreValue = score;
    }

    public setLangCharSeq(charSeqPair: LangCharSeqPair): void {
        this._langChar = charSeqPair.char;
        this._langSeq  = charSeqPair.seq;
    }

    public get langChar(): LangChar {
        return this._langChar;
    }

    public get langSeq(): LangSeq {
        return this._langSeq;
    }

}
