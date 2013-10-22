describe('PsuedoTranslation', function () {
    var trans;

    //excuted before each "it" is run.
    beforeEach(function () {

        //load the module.
        module('pascalprecht.translate');

        //inject your service for testing.
        inject(function (PsuedoTranslation) {
            trans = PsuedoTranslation;
        });
    });


    it('should be a config helper function', function () {
        expect(angular.isFunction(trans)).toBe(true);
    });

    it('should give a good error message if it is missing parameters', function () {
        var output = trans();
        expect(output).toEqual({})
    });


    it('should convert letters and keep their case but not punctuation', function () {
        var output = trans({key1: 'Abc, def ghi'});
        expect(output.key1).toEqual('Xxx, xxx xxx')
    });


    it('should not escape interpolated variables', function () {
        var output = trans({key1: 'Abc, def {notAVariable} {{name}} qwerTy'});
        expect(output.key1).toEqual('Xxx, xxx {xxxXXxxxxxxx} {{name}} xxxxXx')
    });

    it('should inflate values based on total length', function () {
        var output = trans({
            key1: 'Abc', //<10
            key2: 'Abcdeabcde', //<20
            key3: 'Abcdeabcde Abcdeabcde', //<30
            key4: 'Abcdeabcde Abcdeabcde Abcdeabcde', //<50
            key5: 'Abcdeabcde Abcdeabcde Abcdeabcde Abcdeabcde Abcdeabcde', //<70
            key6: 'Abcdeabcde Abcdeabcde Abcdeabcde Abcdeabcde Abcdeabcde Abcdeabcde Abcdeabcde'
        }, true);
        expect(output.key1).toEqual('Xxxxxxxxx')
        expect(output.key2).toEqual('Xxxxxxxxxxxxxxxxxxx');
        expect(output.key3).toEqual('Xxxxxxxxxxxxxxxxx Xxxxxxxxxxxxxxxxx')
        expect(output.key4).toEqual('Xxxxxxxxxxxxxxxx Xxxxxxxxxxxxxxxx Xxxxxxxxxxxxxxxx')
        expect(output.key5).toEqual('Xxxxxxxxxxxxxxx Xxxxxxxxxxxxxxx Xxxxxxxxxxxxxxx Xxxxxxxxxxxxxxx Xxxxxxxxxxxxxxx')
        expect(output.key6).toEqual('Xxxxxxxxxxxxx Xxxxxxxxxxxxx Xxxxxxxxxxxxx Xxxxxxxxxxxxx Xxxxxxxxxxxxx Xxxxxxxxxxxxx Xxxxxxxxxxxxx')
    });


    it('should inflate values but not stand alone variables', function () {
        var output = trans({
            key1: 'Abc {{name}} def'
        }, true);
        expect(output.key1).toEqual('Xxxxxx {{name}} xxxxxx')
    });


});