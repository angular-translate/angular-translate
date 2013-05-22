describe('pascalprecht.translate', function () {

  describe('$translationTable', function () {

    var $translate,
        translationTable,
        definedTranslations = {
          'TRANSLATION_ID': 'foo'
        };

    beforeEach(module('pascalprecht.translate', function ($translateProvider) {
      translationTable = $translateProvider.translationTable();

      $translateProvider.translations(definedTranslations);
    }));

    beforeEach(inject(function (_$translate_) {
      $translate = _$translate_;
    }));


    it('should be defined', function () {
      inject(function () {
        expect(translationTable).toBeDefined();
      });
    });

    it('should be an object', function () {
      inject(function () {
        expect(typeof translationTable).toBe('object');
      });
    });

    it('should contain defined translations', function () {
      inject(function () {
        expect(translationTable).toEqual(definedTranslations);
      });
    });

    it('should be mutable', function () {
      inject(function ($translate) {
        translationTable.ANOTHER_TRANSLATION = 'worked?';

        expect($translate('ANOTHER_TRANSLATION')).toEqual('worked?');
      });
    });
  });
});
