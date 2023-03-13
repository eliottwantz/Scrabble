import 'package:client_leger/models/game_room.dart';
import 'package:get/get.dart';

import '../models/room.dart';

class GameService extends GetxService {
  final joinableGames = Rxn<List<GameRoom>>();

  final currentGameRoom = Rxn<Room>();
}