import 'package:client_leger/controllers/auth_controller.dart';
import 'package:client_leger/services/settings_service.dart';
import 'package:client_leger/widgets/common.dart';
import 'package:client_leger/widgets/custom_button.dart';
import 'package:client_leger/widgets/input_field.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';

class RegisterScreen extends StatelessWidget {
  RegisterScreen({Key? key}) : super(key: key);
  final AuthController controller = Get.arguments;
  final SettingsService settingsService = Get.find();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CommonWidget.authAppBar(controller.currentIcon,
          title: 'Inscription a PolyScrabble', callback: () {
        settingsService.switchTheme();
        controller.currentIcon.value =
            Get.isDarkMode ? Icons.wb_sunny : Icons.brightness_2;
      }),
      body: SafeArea(
        minimum: const EdgeInsets.all(40),
        child: Form(
          key: controller.registerFormKey,
          child: Center(
            child: SizedBox(
              width: 600,
              child: Column(
                children: [
                  Gap(Get.height / 4),
                  const Text(
                    'Bienvenue parmis nous, veuillez vous inscrire',
                  ),
                  const Gap(20.0),
                  InputField(
                    controller: controller.registerEmailController,
                    keyboardType: TextInputType.text,
                    labelText: 'Adresse courriel',
                    placeholder: 'Entrer une adresse courriel',
                  ),
                  const Gap(20.0),
                  InputField(
                    controller: controller.registerUsernameController,
                    keyboardType: TextInputType.text,
                    labelText: 'Pseudonyme',
                    placeholder: 'Entrer votre pseudonyme',
                  ),
                  const Gap(20.0),
                  InputField(
                    controller: controller.registerPasswordController,
                    keyboardType: TextInputType.emailAddress,
                    labelText: 'Password',
                    placeholder: 'Entrer votre mot de passe',
                    password: true,
                    validator: (value) {},
                  ),
                  const Gap(50.0),
                  CustomButton(
                    text: 'S\'inscrire',
                    onPressed: () {},
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
