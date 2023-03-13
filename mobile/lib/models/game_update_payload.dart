import 'package:client_leger/models/player.dart';
import 'package:client_leger/models/square.dart';

class GameUpdatePayload {
  String id;
  List<Player> players;
  List<List<Square>> board;
  bool finished;
  int numPassMoves;
  String turn;
  // duration;

  GameUpdatePayload({
    required this.id,
    required this.players,
    required this.board,
    required this.finished,
    required this.numPassMoves,
    required this.turn});

  factory GameUpdatePayload.fromJson(Map<String, dynamic> json) {
    return GameUpdatePayload(
        id: json["id"],
        players: List<Player>.from((json["players"] as List).map(
            (player) => Player.fromJson(player))
        ),
        board: json["board"],
        finished: json["finished"],
        numPassMoves: json["numPassMoves"],
        turn: json["turn"]
    );
  }

  Map<String, dynamic> toJson() => {
    "id": id,
    "players": players.map((player) => player.toJson()).toList(),
    "board": board.map((row) => (row.map((square) => square.toJson()).toList())).toList(),
    "finished": finished,
    "numPassMoves": numPassMoves,
    "turn": turn
  };
}