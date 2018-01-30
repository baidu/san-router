import resolveURL from '../src/util/resolve-url';

describe('resolveURL', () => {
    it('absolute path', () => {
        expect(resolveURL('/a/b', '/test'))
            .toBe('/a/b');
    });

    it('absolute path with query', () => {
        expect(resolveURL('/a/b?ddccee', '/test'))
            .toBe('/a/b?ddccee');
    });

    it('relative path', () => {
        expect(resolveURL('a/b', '/test/index.html'))
            .toBe('/test/a/b');
    });

    it('relative path with query', () => {
        expect(resolveURL('a/b?ddc', '/test/index.html'))
            .toBe('/test/a/b?ddc');
    });

    it('relative path with query, ignore base query', () => {
        expect(resolveURL('a/b?ddc', '/test/index.html?test'))
            .toBe('/test/a/b?ddc');
    });

    it('relative path has ..', () => {
        expect(resolveURL('../../a/b?ddc', '/test/test2/test3/test4/index.html?test'))
            .toBe('/test/test2/a/b?ddc');
    });

    it('relative path has .. out of base, ignore outer ..', () => {
        expect(resolveURL('../../../a/b?ddc', '/test/index.html?test'))
            .toBe('/a/b?ddc');
    });
});
