class MoveInfo {
  String type;
  String letters;
  Map<String, String> covers;

  MoveInfo({
    required this.type,
    required this.letters,
    required this.covers});

  factory MoveInfo.fromJson(Map<dynamic, dynamic> json) {
    return MoveInfo(
        type: json["type"],
        letters: json["letters"],
        // covers: Map.from((json["covers"] as Map).map
        //   ((key, value) => json["covers"][key][value])
        // )
        covers: Map.from(json["covers"] as Map)
    );
  }

  Map<String, dynamic> toJson() => {
    "type": type,
    "letters": letters,
    "covers": covers
  };

  @override
  String toString() {
    return '{type: ${type}, covers: ${covers.toString()}}';
  }
}