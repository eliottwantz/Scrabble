import 'package:client_leger/api/api_repository.dart';
import 'package:client_leger/models/requests/login_request.dart';
import 'package:client_leger/models/requests/register_request.dart';
import 'package:client_leger/routes/app_routes.dart';
import 'package:client_leger/services/auth_service.dart';
import 'package:client_leger/utils/app_focus.dart';
import 'package:client_leger/utils/dialog_helper.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:client_leger/services/settings_service.dart';

class AuthController extends GetxController {
  final SettingsService settingsService;
  final AuthService authService;

  AuthController({required this.settingsService,required this.authService});

  @override
  void onInit() {

    super.onInit();
  }

  // Register
  final GlobalKey<FormState> registerFormKey = GlobalKey<FormState>();
  final registerEmailController = TextEditingController();
  final registerPasswordController = TextEditingController();
  final registerUsernameController = TextEditingController();

  // Login
  final GlobalKey<FormState> loginFormKey = GlobalKey<FormState>();
  final loginUsernameController = TextEditingController();
  final loginPasswordController = TextEditingController();

  Rx<IconData> getIconTheme() {
    return settingsService.currentThemeIcon;
  }

  void onThemeChange() {
    settingsService.switchTheme();
  }

  Future<void> onLogin(BuildContext context) async {
    AppFocus.unfocus(context);
    if (loginFormKey.currentState!.validate()) {
      final request = LoginRequest(
          username: loginUsernameController.text,
          password: loginPasswordController.text);
      // await authService.login(request);
      Get.offAllNamed(Routes.HOME);
    }
  }

  Future<void> onRegister(BuildContext context) async {
    AppFocus.unfocus(context);
    if (registerFormKey.currentState!.validate()) {
      final request = RegisterRequest(
          email: registerEmailController.text,
          username: registerUsernameController.text,
          password: registerPasswordController.text);
      await authService.register(request);
      Get.toNamed(Routes.AVATAR_SELECTION,
          arguments: this);
    }
  }
}
