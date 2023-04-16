import 'package:client_leger/api/api_repository.dart';
import 'package:client_leger/controllers/create_room_controller.dart';
import 'package:client_leger/models/requests/game_invite_request.dart';
import 'package:client_leger/models/user.dart';
import 'package:client_leger/services/game_service.dart';
import 'package:client_leger/services/room_service.dart';
import 'package:client_leger/services/websocket_service.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:get/get.dart';
import 'package:get/get_core/src/get_main.dart';

import '../services/user_service.dart';
import '../services/users_service.dart';

class FriendsList extends StatelessWidget {
  FriendsList({
    Key? key,
    required RxString inputSearch,
    required List<dynamic> items,
  })  : _inputSearch = inputSearch,
        // _items = items,
        super(key: key);

  final UserService _userService = Get.find();
  final UsersService _usersService = Get.find();

  final RxString _inputSearch;

  RxBool isChecked = false.obs;

  // final List<dynamic> _items;

  Widget build(BuildContext context) {
    return Obx(
      () => Scrollbar(child: _buildList(_inputSearch.value)),
    );
  }

  final ScrollController scrollController = ScrollController();

  void scrollDown() {
    scrollController.jumpTo(scrollController.position.minScrollExtent);
  }

  Widget _buildList(String inputSearch) {
    SchedulerBinding.instance.addPostFrameCallback((timeStamp) {
      scrollDown();
    });

    List<String> filteredItems =
        filterUsersListBy(_inputSearch.value, _userService.friends.value);

    return ListView.builder(
      controller: scrollController,
      padding: const EdgeInsets.all(16.0),
      itemCount: filteredItems.length,
      itemBuilder: (context, item) {
        final index = item;

        return _buildRow(filteredItems[index], index);
      },
    );
  }

  Widget _buildRow(dynamic username, int index) {
    return Column(
      children: [
        const Divider(),
        ListTile(
            title: Row(
              children: [
                Text(username, style: TextStyle(fontSize: 18.0)),
                Icon(Icons.circle,
                    color: _usersService.isOnline(username)
                        ? Colors.green
                        : Colors.grey)
              ],
            ),
            trailing: _buildTrailingButton(username),
            onTap: () {}),
      ],
    );
  }

  //
  // List<String> orderUsersListByAlphabeticAndOnline(List<User> usersList) {
  //   List<String> orderedList = [];
  //   for (User user in usersList) {
  //
  //   }
  // }

  List<String> filterUsersListBy(String filter, List<dynamic> list) {
    List<String> filteredUserList = [];
    for (final user in list) {
      if (user.contains(filter)) {
        filteredUserList.add(user);
      }
    }
    _userService.friends.value.sort();
    return filteredUserList;
  }

  Widget _buildTrailingButton(dynamic username, [int? index]) {
    return IconButton(
        onPressed: () async {
          final res = await _usersService.deleteFriend(username);
          if (res == true) {
            _userService.user.value!.friends.remove(username);
            _userService.friends.remove(username);
          }
        },
        icon: const Icon(Icons.close));
  }
}
