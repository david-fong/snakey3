import { OfflineGame } from "src/offline/OfflineGame";
import { BalancingScheme } from "src/lang/LangSeqTreeNode";
import { Player } from "src/base/player/Player";

const game = new OfflineGame({
    gridDimensions: {
        height: 20,
    },
    langBalancingScheme: BalancingScheme.WEIGHT,
    languageName: "English",
    playerDescs: [
        {
            beNiceTo: [],
            operatorClass: Player.OperatorClass.HUMAN_CLASS,
            username: "hello world",
            idNumber: undefined,
            socketId: undefined,
        },
    ],
});
game.reset();
console.log(game);
