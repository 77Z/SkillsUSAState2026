import 'dart:io';

import 'package:args/args.dart';

/// Prints program's help text and exits. This function will not return.
Never showHelp() {
    print("""./Fibonacci-gen [-c|--count] 20 --one-line --last-only --numbering --help

Help for Fibonacci generator:

--help : Print this help
--count | -c : Calculate to this many places. IE: 0, 1, 1, 2, 3, 5 would be the result of -c 6
--one-line: Print all the numbers on one line, separated by commas. Without this option, each number in the sequence will be printer on a new line.
--numbering: Preface each number in the sequence wiht its placement: IE for "-c 6 --numbering --one-line" you would get this: "1:0, 2:1, 3:1, 4:2, 5:3, 6:5" where the first number is the count and the second is the Fibonacci sequence. Note: this argument should work with all other arguments.
--last-only: Only print the last number in the sequence""");
  exit(1);
}

// The core algorithm of the program. Takes a non-negative integer "iterations"
// and returns an array of integers containing the corresponding fibonacci sequence.
List<int> calculateFibonacci(int iterations) {
  // assert
  if (iterations < 0) throw Exception("iterations can't be negative.");

  List<int> sequence = [];
  for (int i = 0; i < iterations; i++) {
    if (i == 0) { sequence.add(0); continue; }
    if (i == 1) { sequence.add(1); continue; }

    sequence.add(sequence[i - 1] + sequence[i - 2]);
  }

  return sequence;
}

void main(List<String> args) {

  final argParser = ArgParser();

  argParser.addFlag("help", callback: (p0) { if (!p0) return; showHelp(); });

  argParser.addOption("count", abbr: "c");
  argParser.addFlag("numbering");
  argParser.addFlag("one-line");
  argParser.addFlag("last-only");

  // Argument setup is all done. Now we can actually tell the parser to compute
  // the results, and we'll bail out if the user didn't write them correctly
  ArgResults arguments;
  try { arguments = argParser.parse(args); }
  catch (e) {
    print("Improperly formatted arguments provided to program!");
    print("Run program with '--help' to see usage example.");
    exit(1);
  }

  // sanity checks to make sure that the user put it something useful into "count"
  String? rawCountArg = arguments.option("count");
  if (rawCountArg == null) {
    print("You didn't specify --count. Program can't continue.");
    print("Run program with '--help' to see usage example.");
    exit(1);
  }

  int? iterations = int.tryParse(arguments.option("count")!);
  if (iterations == null || iterations < 0) {
    print("--count needs to be an integer number, non-negative");
    print("Run program with '--help' to see usage example.");
    exit(1);
  }

  // Actual compute done here
  final List<int> sequence = calculateFibonacci(iterations);


  // We'll use a new string list and project the fibonacci results onto it while
  // taking into account the user's desired special formatting options.
  // Making a new string list means that we can achieve fancier formatting for
  // the user while still keeping it malleable enough to manipulate programmatically
  List<String> userFacingSequence = [];

  // numbering adds list numbers that count linearly next to each fibonacci
  // iteration. It's important that numbering comes before "last-only" because
  // the user can specify both, and therefore would get one result with a single
  // line number
  if (arguments.flag("numbering")) {
    for (int i = 0; i < sequence.length; i++) {
      userFacingSequence.add("${i + 1}:${sequence[i]}");
    }
  } else {
    // ...otherwise if the user doesn't want numbering, we can just map the
    // numbers to strings for future formatting operations.
    for (final item in sequence) { userFacingSequence.add(item.toString()); }
  }

  // These are pretty self-explanatory formats.
  if (arguments.flag("last-only")) {
    print(userFacingSequence.last);
    exit(0);
  }

  // "last-only" option can exit safely without dealing with "one-line" because
  // if only one result is printed, it will be on one line anyway.
  if (arguments.flag("one-line")) {
    print(userFacingSequence.join(", "));
    exit(0);
  }

  // default formatting if nothing else is specified.
  print(userFacingSequence.join("\n"));
  
}

