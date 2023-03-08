import 'package:client_leger/widgets/user_list.dart';
import 'package:flutter/cupertino.dart';
import 'package:client_leger/services/user_service.dart';
import 'package:get/get.dart';

class FriendsController extends GetxController {
  final UserService userService = Get.find();
  List<Widget> widgetOptions = [];

  final List<dynamic> items = [
    'Friend1',
    'Friend2',
    'Friend3',
    'Friend4',
    'Friend1',
    'Friend2',
    'Friend3',
    'Friend4',
    'Friend1',
    'Friend2',
    'Friend3',
    'Friend4',
  ];

  final List<dynamic> items2 = [
    'Friend1',
    'Friend2',
    'Friend3',
    'Friend4',
  ];

  FriendsController() {
    print(items);
    widgetOptions = <Widget>[
      UserList(items: items),
      UserList(items: items2),
      UserList(items: items2),
      const Text(
        'Index 3: Work',
      ),
    ];
  }

  late RxInt selectedIndex = 0.obs;
  // final List<Widget> widgetOptions = <Widget>[
  //   UserList(items: items),
  //   UserList(),
  //   const Text(
  //     'Index 2: School',
  //   ),
  // ];

  void onItemTapped(int index) {
    selectedIndex.value = index;
    print(selectedIndex.value);
  }
}