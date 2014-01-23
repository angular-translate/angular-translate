describe('pascalprecht.translate', function () {

  describe('$selectFilter', function () {

    var $filter;

    beforeEach(module('pascalprecht.translate'));
    
    beforeEach(inject(function (_$filter_) {
      $filter = _$filter_;
    }));

    it('should be a function object', function () {
      expect(typeof $filter('select')).toBe("function");
    });

    it('should return a correct case if possible', function () {
      expect(
        $filter('select')('he', { 
          he : 'man',
          she : 'woman',
          other : 'table' }
        )
      ).toEqual('man');
    });

    it('should return the "other" case if no matching case is found', function () {
      expect(
        $filter('select')('it', {
          he : 'man',
          she : 'woman',
          other : 'table' }
        )
      ).toEqual('table');
    });
    
    it('should return a given value if no matching case is found and there is no "other" case ' +
    'defined', function () {
      expect(
        $filter('select')('it', {
          he : 'man',
          she : 'woman' }
        )
      ).toEqual('it');
    });
    
    it('should return a given value if non-object value given as a param', function () {
      expect($filter('select')('he', '{he:"man",she:"woman",other:"table"}')).toEqual('he');
    });
    
    it('should return a given value if second param if not specified', function () {
      expect($filter('select')('he')).toEqual('he');
    });
    
  });

});
