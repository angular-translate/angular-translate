/**
 * @ngdoc overview
 * @name pascalprecht.translate
 *
 * @description
 * The main module which holds everything together.
 */
angular.module('pascalprecht.translate', ['ng'])

.run(['$translate', function ($translate) {

  var key = $translate.storageKey(),
      storage = $translate.storage();

  if (storage) {
    if (!storage.get(key)) {

      if (angular.isString($translate.preferredLanguage())) {
        $translate.uses($translate.preferredLanguage());
      } else {
        storage.set(key, $translate.uses());
      }

    } else {
      $translate.uses(storage.get(key));
    }
  } else if (angular.isString($translate.preferredLanguage())) {
    $translate.uses($translate.preferredLanguage());
  }
}]);


angular.module('pascalprecht.translate').constant('PsuedoTranslation', function (translation, shouldInflate) {
    var uppercaseRegex = new RegExp("[A-Z]");
    var lowercaseRegex = new RegExp("[a-z]");
    var variablesRegEx = new RegExp("{{.*}}", "g")

    var calcInflationRate = function (length) {
        // Ratios provided by http://www.w3.org/International/articles/article-text-size.en
        if (length < 10) {
            return 2.7;
        } else if (length < 20) {
            return 1.9;
        } else if (length < 30) {
            return 1.7;
        } else if (length < 50) {
            return 1.6;
        } else if (length < 70) {
            return 1.5;
        } else {
            return 1.3;
        }
    }

    var translate = function (word) {
        var shouldTranslate = true;
        var output = "";
        for (var i = 0; i < word.length; i++) {
            var letter = word[i] ? word[i] : "x";

            if (lowercaseRegex.test(letter)) {
                output += 'x'
            } else if (uppercaseRegex.test(letter)) {
                output += 'X'
            } else {
                //Keep punctuation characters
                output += letter;
            }
        }
        return output;
    }

    var inflate = function (word, length) {
        //Don't inflate if the beginning and end of the word is a variable
        if (word.length > 4 && word.indexOf("{{") === 0 && word.indexOf("}}") === (word.length - 2)) {
            return word;
        }

        while (word.length < length) {
            word += "x";
        }
        return word;
    }

    var psuedoString = function (input, shouldInflate) {
        var words = input.split(" ");

        var output = [];
        //translate
        for (var i = 0; i < words.length; i++) {
            output[i] = translate(words[i]); //, words[i].length * inflation
        }
        var outputStr = output.join(" ");

        //add variables back
        var match, indexes = [];
        while (match = variablesRegEx.exec(input)) {
            indexes.push([match.index, match.index + match[0].length, match]);
        }

        for (var i = 0; i < indexes.length; i++) {
            //substring before match + match + substring after match
            outputStr = outputStr.substr(0, indexes[i][0]) + indexes[i][2] + outputStr.substr(indexes[i][1], outputStr.length);
        }

        //inflate
        var inflation = 1;
        if (shouldInflate) {
            inflation = calcInflationRate(input.length);

            //split words
            words = outputStr.split(" ");
            var inflated = [];
            for (var i = 0; i < words.length; i++) {
                inflated[i] = inflate(words[i], words[i].length * inflation);
            }

            outputStr = inflated.join(" ");
        }

        return outputStr;
    }

    var psuedoTranslation = {};
    for (var key in translation) {
        if (translation.hasOwnProperty(key)) {
            psuedoTranslation[key] = psuedoString(translation[key], shouldInflate)
        }
    }
    return psuedoTranslation;
});