import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class StorageService extends GetxService {
  late GetStorage _box;

  Future<StorageService> init() async {
    _box = GetStorage();
    await _box.writeIfNull('key', []);
    return this;
  }

  T read<T>(String key) {
    return _box.read(key);
  }

  Future<void> remove(String key) async {
    await _box.remove(key);
  }

  Future<void> write(String key, dynamic value) async {
    await _box.write(key, value);
  }
}
