import parseURL from '../src/util/parse-url';

describe('parseURL', () => {
    it('should parse path/query/hash correctly', () => {
        let url = parseURL('/this-is-path?this-is-query#this-is-hash?hash-query');
        expect(url.hash).toBe('this-is-hash?hash-query');
        expect(url.queryString).toBe('this-is-query');
        expect(url.path).toBe('/this-is-path');
    });

    it('should parse query from queryString', () => {
        let url = parseURL('/this-is-path?a=000&d=www#this-is-hash?hash-query');
        expect(url.queryString).toBe('a=000&d=www');
        expect(url.query.a).toBe('000');
        expect(url.query.d).toBe('www');
    });

    it('should auto decode query', () => {
        let name = '大爷';
        let nameLiteral = '名字'
        let url = parseURL('/this-is-path?a=000&' + nameLiteral + '=' + encodeURIComponent(name));
        expect(url.queryString).toBe('a=000&' + nameLiteral + '=' + encodeURIComponent(name));
        expect(url.query.a).toBe('000');
        expect(url.query['名字']).toBe(name);
    });

    it('should auto merge same name query as array', () => {
        let url = parseURL('/this-is-path?a=1&name=2&a=3');
        expect(url.queryString).toBe('a=1&name=2&a=3');
        expect(url.query.a.length).toBe(2);
        expect(url.query.a[0]).toBe('1');
        expect(url.query.a[1]).toBe('3');
        expect(url.query.name).toBe('2');
    });
});
