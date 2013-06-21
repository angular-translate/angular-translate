describe('pascalprecht.translate', function () {

  describe('$missingTranslationHandlerFactory', function () {

    var missingTranslations = {};

    beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
      $translateProvider.translations({
        'EXISTING_TRANSLATION_ID': 'foo',
        'TRANSLATION_ID': 'Lorem Ipsum {{value}}',
        'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
        'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}'
      });

      $provide.factory('customHandler', function () {
        return function (translationId, language) {
          missingTranslations[translationId] = { lang: language };
        };
      });

      $translateProvider.useMissingTranslationHandler('customHandler');
    }));

    var $translate;

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));


    it('should not invoke missingTranslationHandler if translation id exists', function () {
      inject(function ($translate) {
        $translate('TRANSLATION_ID');
        expect(missingTranslations).toEqual({});
      });
    });

    it('should invoke missingTranslationHandler if set and translation id doesn\'t exist', function () {
      inject(function ($translate) {
        $translate('NOT_EXISTING_TRANSLATION_ID');
        expect(missingTranslations).toEqual({
          'NOT_EXISTING_TRANSLATION_ID': {
            lang: undefined
          }
        });
      });
    });
  });
});
