import 'dart:math';

import 'package:client_leger/controllers/game_controller.dart';
import 'package:client_leger/models/tile.dart';
import 'package:client_leger/services/game_service.dart';
import 'package:client_leger/services/settings_service.dart';
import 'package:client_leger/services/user_service.dart';
import 'package:client_leger/widgets/board.dart';
import 'package:client_leger/widgets/board_tile.dart';
import 'package:client_leger/widgets/game_chat.dart';
import 'package:client_leger/widgets/timer.dart';
import 'package:flutter/material.dart';
import 'package:flutter_layout_grid/flutter_layout_grid.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';

import '../models/move_info.dart';
import '../models/move_types.dart';
import '../widgets/player_info.dart';

class GameScreen extends GetView<GameController> {
  GameScreen({Key? key}) : super(key: key);
  final GameService _gameService = Get.find();
  final SettingsService _settingsService = Get.find();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(
          Icons.question_answer_rounded,
        ),
      ),
      body: LayoutGrid(
        areas: '''
        leave  content  settings
        nav    content  aside
        nav    content  aside
        options    easel  passer
      ''',
        rowGap: 0,
        columnSizes: [1.fr, 2.fr, 1.fr],
        rowSizes: const [
          auto,
          auto,
          auto,
          auto,
        ],
        children: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(top: 5),
              child: ElevatedButton.icon(
                onPressed: () {
                  controller.onLeaveGame();
                },
                icon: const Icon(
                  Icons.exit_to_app_rounded,
                  size: 20,
                ),
                label: const Text('Quitter la partie'), // <-- Text
              ),
            ),
          ).inGridArea('leave'),
          Padding(
            padding: const EdgeInsets.only(top: 5, right: 5),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Obx(() =>
                    DropdownButton<String>(
                      underline: SizedBox(),
                      value: _settingsService.currentLangValue.value,
                      style: Theme.of(context).textTheme.button,
                      items: const [
                        DropdownMenuItem(
                          child: Center(child: Text('Français')),
                          value: 'fr',
                        ),
                        DropdownMenuItem(
                            child: Center(child: Text('Anglais')), value: 'en')
                      ],
                      onChanged: (String? value) async {
                        await _settingsService.switchLang(value!);
                      },
                      icon: const Icon(
                        Icons.language,
                      ),
                    )),
                Gap(20),
                InkWell(
                    onTap: () {
                      _settingsService.switchTheme();
                    },
                    child: Obx(
                      () => Icon(
                        _settingsService.currentThemeIcon.value,
                        size: 30,
                      ),
                    )),
                Gap(10),
              ],
            ),
          ).inGridArea('settings'),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Obx(() => Timer(
                    time: _gameService.currentGameTimer.value ??
                        60 * pow(10, 9))),
                const Gap(100),
                Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.all(Radius.circular(12)),
                    side: BorderSide(
                      color: Get.isDarkMode ? Colors.greenAccent : Colors.black,
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text(
                      'Lettres en réserve \n 80',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.headline6,
                    ),
                  ),
                ),
                const Gap(100),
                Obx(() => ElevatedButton.icon(
                      onPressed: controller.isClientTurn() ? () {} : null,
                      icon: const Icon(
                        Icons.lightbulb,
                        size: 30,
                      ),
                      label: const Text('Indices'),
                    )),
              ],
            ),
          ).inGridArea('aside'),
          Obx(() => Align(
                alignment: Alignment.topCenter,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: _buildPlayersInfo(),
                ),
              )).inGridArea('nav'),
          ScrabbleBoard().inGridArea('content'),
          Obx(() => SizedBox(
                height: 80,
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: _gameService
                          .getPlayer()!
                          .rack
                          .tiles
                          .asMap()
                          .map((idx, e) => MapEntry(idx, _buildEasel(e, idx)))
                          .values
                          .toList()),
                ),
              )).inGridArea('easel'),
          Obx(() => Center(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    ElevatedButton.icon(
                      onPressed: controller.isClientTurn()
                          ? () {
                              controller.placeLetters();
                            }
                          : null,
                      icon: const Icon(
                        Icons.check,
                        size: 20,
                      ),
                      label: const Text('Placer'),
                    ),
                    ElevatedButton.icon(
                      onPressed: controller.isClientTurn()
                          ? () {
                              controller.exchangeLetters();
                            }
                          : null,
                      icon: const Icon(
                        Icons.change_circle,
                        size: 20,
                      ),
                      label: const Text('Échanger'), // <-- Text
                    ),
                  ],
                ),
              )).inGridArea('options'),
          Obx(() => Align(
              alignment: Alignment.center,
              child: ElevatedButton.icon(
                onPressed: controller.isClientTurn()
                    ? () {
                        controller.skipTurn();
                      }
                    : null,
                icon: const Icon(
                  Icons.double_arrow,
                  size: 20,
                ),
                label: const Text('Passer'), // <-- Text
              ))).inGridArea('passer'),
        ],
      ),
    );
  }

  Widget _buildEasel(Tile tile, int index) {
    return controller.getEaselChildToDisplay(tile, index);
  }

  List<Widget> _buildPlayersInfo() {
    List<Widget> playerInfoPanels = [];
    for (final player in _gameService.currentGame.value!.players) {
      playerInfoPanels.add(const Gap(20));
      playerInfoPanels.add(PlayerInfo(
          playerName: player.username,
          isPlayerTurn: _gameService.isCurrentPlayer(player.id),
          score: player.score,
          isBot: player.isBot));
      playerInfoPanels.add(const Gap(20));
    }
    return playerInfoPanels;
  }
}
