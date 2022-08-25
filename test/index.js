
var router = sanRouter.router;
var withRoute = sanRouter.withRoute;
var Link = sanRouter.Link;
var HashLocator = sanRouter.HashLocator;
var HTML5Locator = sanRouter.HTML5Locator;

var parseURL = sanRouter.parseURL;
var stringifyURL = sanRouter.stringifyURL;

describe('parseURL', function () {
    it('should parse path/query/hash correctly', function () {
        var url = parseURL('/this-is-path?this-is-query#this-is-hash?hash-query');
        expect(url.hash).toBe('this-is-hash?hash-query');
        expect(url.queryString).toBe('this-is-query');
        expect(url.path).toBe('/this-is-path');
    });

    it('should parse query from queryString', function () {
        var url = parseURL('/this-is-path?a=000&d=www#this-is-hash?hash-query');
        expect(url.queryString).toBe('a=000&d=www');
        expect(url.query.a).toBe('000');
        expect(url.query.d).toBe('www');
    });

    it('should auto decode query', function () {
        var name = '大爷';
        var nameLiteral = '名字'
        var url = parseURL('/this-is-path?a=000&' + nameLiteral + '=' + encodeURIComponent(name));
        expect(url.queryString).toBe('a=000&' + nameLiteral + '=' + encodeURIComponent(name));
        expect(url.query.a).toBe('000');
        expect(url.query['名字']).toBe(name);
    });

    it('should auto merge same name query as array', function () {
        var url = parseURL('/this-is-path?a=1&name=2&a=3');
        expect(url.queryString).toBe('a=1&name=2&a=3');
        expect(url.query.a.length).toBe(2);
        expect(url.query.a[0]).toBe('1');
        expect(url.query.a[1]).toBe('3');
        expect(url.query.name).toBe('2');
    });
});

// stringifyURL unit test
describe('stringifyURL', function () {
    it('false invalid value will return empty string :)', function () {
        var result = stringifyURL('');
        expect(result).toBe('');
        result = stringifyURL(undefined);
        expect(result).toBe('');
        result = stringifyURL(null);
        expect(result).toBe('');
        result = stringifyURL(NaN);
        expect(result).toBe('');
    });

    it('path + query', function () {
        var result = stringifyURL(
            {
                path: '/a/b',
                query: {
                    foo: 'bar',
                    bar: 'foo'
                }
            }
        );
        expect(result).toBe('/a/b?foo=bar&bar=foo');
    });

    it('path + queryString', function () {
        var result = stringifyURL(
            {
                path: '/a/b',
                queryString: 'foo=bar&bar=foo'
            }
        );
        expect(result).toBe('/a/b?foo=bar&bar=foo');

        result = stringifyURL(
            {
                path: '/a/b',
                queryString: '?foo=bar&bar=foo'
            }
        );
        expect(result).toBe('/a/b?foo=bar&bar=foo');
    });

    it('queryString first', function () {
        var result = stringifyURL(
            {
                path: '/a/b',
                query: {
                    foo: 'bar',
                    bar: 'foo'
                },
                queryString: 'a=1'
            }
        );
        expect(result).toBe('/a/b?a=1');
    });

    it('query should auto encode', function () {
        var result = stringifyURL({
            path: './b',
            query: {
                foo: '你好',
                bar: '不好'
            }
        });
        expect(result).toBe('./b?foo=%E4%BD%A0%E5%A5%BD&bar=%E4%B8%8D%E5%A5%BD');
    });

    it('query fill path', function () {
        var result = stringifyURL(
            {
                path: '/:foo/:bar',
                query: {
                    foo: 'bar',
                    bar: 'foo'
                }
            }
        );
        expect(result).toBe('/bar/foo');
    });

    it('params fill path, query tailed', function () {
        var result = stringifyURL(
            {
                path: '/:foo/:bar',
                params: {
                    foo: 'bar',
                    bar: 'foo'
                },
                query: {
                    foo: 'bar',
                    bar: 'foo'
                }
            }
        );
        expect(result).toBe('/bar/foo?foo=bar&bar=foo');
    });
});

var resolveURL = sanRouter.resolveURL;

describe('resolveURL', function () {
    it('absolute path', function () {
        expect(resolveURL('/a/b', '/test'))
            .toBe('/a/b');
    });

    it('absolute path with query', function () {
        expect(resolveURL('/a/b?ddccee', '/test'))
            .toBe('/a/b?ddccee');
    });

    it('relative path', function () {
        expect(resolveURL('a/b', '/test/index.html'))
            .toBe('/test/a/b');
    });

    it('relative path with query', function () {
        expect(resolveURL('a/b?ddc', '/test/index.html'))
            .toBe('/test/a/b?ddc');
    });

    it('relative path with query, ignore base query', function () {
        expect(resolveURL('a/b?ddc', '/test/index.html?test'))
            .toBe('/test/a/b?ddc');
    });

    it('relative path has ..', function () {
        expect(resolveURL('../../a/b?ddc', '/test/test2/test3/test4/index.html?test'))
            .toBe('/test/test2/a/b?ddc');
    });

    it('relative path has .. out of base, ignore outer ..', function () {
        expect(resolveURL('../../../a/b?ddc', '/test/index.html?test'))
            .toBe('/a/b?ddc');
    });
});



var point = (new Date).getTime();
var nextURL = function () {return '/' + (++point);}
var currentURL = function () {return '/' + point;}
var prevURL = function () {return '/' + (point - 1);}



describe('Hash Locator', function () {
    var locator = null;

    beforeEach(function (done) {
        locator = new HashLocator();
        locator.start();
        location.hash = nextURL();

        setTimeout(function () {done();}, 50)
    });
    afterEach(function () {
        locator.stop();
        locator = null;
    });

    it('can read current correctly, when location.hash', function (done) {
        location.hash = nextURL();
        setTimeout(function () {
            expect(locator.current).toBe(currentURL());
            done();
        }, 50)

    });

    it('should emit redirect event on hash change', function (done) {
        locator.on('redirect', function (e) {
            expect(e.url).toBe(currentURL());
            expect(e.referrer).toBe(prevURL());
            setTimeout(function () {done();}, 1)
        });
        location.hash = nextURL();
    });

    it('should emit redirect event when redirect is called', function (done) {
        locator.on('redirect', function (e) {
            expect(e.url).toBe(currentURL());
            expect(e.referrer).toBe(prevURL());

            setTimeout(function () {done();}, 1)
        });
        locator.redirect(nextURL());
    });

    it('should emit redirect event when redirect is called with relative path', function (done) {

        locator.redirect(nextURL() + '/level1/level2/level3');
        setTimeout(function () {
            locator.on('redirect', function (e) {
                expect(e.url).toBe(currentURL() + '/a/b');
                expect(e.referrer).toBe(currentURL() + '/level1/level2/level3');

                setTimeout(function () {done();}, 1)
            });

            locator.redirect('../../a/b');
        }, 1)
    });

     it('should not emit redirect event when redirect is called with same url and force option', function (done) {
        var onRedirect = jasmine.createSpy('redirect');
        locator.on('redirect', onRedirect);
        locator.redirect(currentURL());
        setTimeout(function () {
            expect(onRedirect).not.toHaveBeenCalled();
            done();
        }, 0);
    });

     it('should emit redirect event when redirect is called with same url and force option', function (done) {
        locator.on('redirect', function (e) {
            expect(e.url).toBe(currentURL());
            expect(e.referrer).toBe(prevURL());

            setTimeout(function () {done();}, 1)
        });
        locator.redirect(currentURL(), {force: true});
    });

     it('should not emit redirect event when redirect is called with silent option', function (done) {
        var onRedirect = jasmine.createSpy('redirect');
        locator.on('redirect', onRedirect);
        locator.redirect(nextURL(), {silent: true});
        setTimeout(function () {
            expect(onRedirect).not.toHaveBeenCalled();
            done();
        }, 0);
    });

     it('should emit redirect event when reload is called', function (done) {
        locator.on('redirect', function (e) {
            expect(e.url).toBe(currentURL());
            expect(e.referrer).toBe(prevURL());

            setTimeout(function () {done();}, 1)
        });
        locator.reload();
    });
});

var notIE = !/msie/i.test(navigator.userAgent);

notIE && describe('HTML5 Locator', function () {
    var locator = null;

    beforeEach(function () {
        locator = new HTML5Locator();
        locator.start();
    });
    afterEach(function () {
        locator.stop();
        locator = null;
    });

    it('should be a class', function () {
        expect(typeof HTML5Locator).toBe('function');
    });

    if (!HTML5Locator.isSupport) {
        it('is not supported', function () {
            expect(typeof HTML5Locator).toBe('function');
        });

        return;
    }

    var pathname = window.location.pathname;

    it('should emit redirect event when redirect method is called', function (done) {
        var onRedirect = function (e) {
            expect(e.url).toBe('/test/h5-locator.html');
            expect(e.referrer).toBe(pathname);
            locator.un('redirect', onRedirect);
            history.back();
            setTimeout(function () {done()}, 200);
        };
        locator.on('redirect', onRedirect);
        locator.redirect('/test/h5-locator.html');
    });

    it('should emit redirect event when redirect method is called with relative path', function (done) {
        var onRedirect = function (e) {
            expect(e.url).toBe('/test/h5-locator.html');
            expect(e.referrer).toBe(pathname);
            locator.un('redirect', onRedirect);
            history.back();
            setTimeout(function () {done()}, 200);
        };
        locator.on('redirect', onRedirect);
        locator.redirect('h5-locator.html');
    });

    it('should emit redirect event when history.back is called', function (done) {
        var onRedirect = function (e) {
            expect(e.referrer).toBe('/test/h5-locator.html');
            expect(e.url).toBe(pathname);

            locator.un('redirect', onRedirect);
            setTimeout(function () {done()}, 200);
        };

        locator.redirect('/test/h5-locator.html');
        locator.on('redirect', onRedirect);
        window.history.back();
    });

    it('should emit redirect event when reload is called', function (done) {
        var onRedirect = function (e) {
            expect(e.referrer).toBe(pathname);
            expect(e.url).toBe('/test/h5-locator.html');

            locator.un('redirect', onRedirect);
            history.back();
            setTimeout(function () {done()}, 200);
        };

        locator.redirect('/test/h5-locator.html');
        locator.on('redirect', onRedirect);
        locator.reload();
    });

});



var TestComponent = san.defineComponent({
    template: '<p title="{{route.query.name}}">Hello {{route.query.name}}</p>'
});

router.add({
    rule: '/main-route/:name',
    handler: function () {},
    target: '#main',
    Component: TestComponent
});

router.start();

describe('Router', function () {
    it('by config array, should call handler, all match string', function (done) {
        router.add([
            {
                rule: '/route-test-a',
                handler: function (e) {
                    expect(true).toBeTruthy();
                }
            },
            {
                rule: '/route-test-b',
                handler: function (e) {
                    expect(true).toBeTruthy();
                    done();
                }
            }
        ]);
        location.hash = '/route-test-a';
        location.hash = '/route-test-b';
    });

    it('by handler, should call handler, all match string', function (done) {
        router.add({
            rule: '/route-test',
            handler: function (e) {
                expect(true).toBeTruthy();
                done();
            }
        });
        location.hash = '/route-test';
    });

    it('by handler, should not call handler, when string is not match', function (done) {
        var isCall = false;
        router.add({
            rule: '/route-test',
            handler: function () {
                isCall = true;
            }
        });
        location.hash = '/route-test2';

        setTimeout(function () {
            expect(isCall).toBeFalsy();
            done();
        }, 0);
    });

    it('by handler, should not call handler, when string is not match (miss start slash)', function (done) {
        var isCall = false;
        router.add({
            rule: '/route-test',
            handler: function () {
                isCall = true;
            }
        });
        location.hash = 'route-test';

        setTimeout(function () {
            expect(isCall).toBeFalsy();
            done();
        }, 0);
    });

    it('by handler, should call handler, match string as rule :xxx', function (done) {
        router.add({
            rule: '/route-test/:id',
            handler: function (e) {
                expect(e.query.id).toBe('1');
                done();
            }
        });
        location.hash = '/route-test/1';
    });

    it('by handler, should call handler, match string as rule :xxxYyy', function (done) {
        router.add({
            rule: '/route-test2/:tagId',
            handler: function (e) {
                expect(e.query.tagId).toBe('3');
                done();
            }
        });
        location.hash = '/route-test2/3';
    });

    it('by handler, should call handler, match non ascii string as rule :xxx', function (done) {
        router.add({
            rule: '/route-test/non/asc/:name',
            handler: function (e) {
                expect(e.params.name).toBe('%E4%BD%A0%E5%A5%BD');
                done();
            }
        });
        location.hash = '/route-test/non/asc/你好';
    });

    it('by handler, should call handler, match string as multi rules :xxx', function (done) {
        router.add({
            rule: '/route-test2/:name/:id',
            handler: function (e) {
                expect(e.query.id).toBe('2');
                expect(e.query.name).toBe('Route-test');
                done();
            }
        });
        location.hash = '/route-test2/Route-test/2';
    });

    it('by handler, should call handler, match string as multi rules :xxxYyy', function (done) {
        router.add({
            rule: '/route-test3/:testName/:tagId',
            handler: function (e) {
                expect(e.query.tagId).toBe('2');
                expect(e.query.testName).toBe('Route-test');
                done();
            }
        });
        location.hash = '/route-test3/Route-test/2';
    });

    it('by handler, should call handler, match string as rule :xxx-yyy', function (done) {
        router.add({
            rule: '/route-test4/:data-id',
            handler: function (e) {
                expect(e.query['data-id']).toBe('3');
                done();
            }
        });
        location.hash = '/route-test4/3';
    });

    it('by handler, should call handler, match RegExp', function (done) {
        router.add({
            rule: /^\/route\/([0-9]+)$/,
            handler: function (e) {
                expect(e.query[1]).toBe('2');
                expect(e.query[0]).toBeUndefined();
                done();
            }
        });
        location.hash = '/route/2';
    });

    it('by component, route should init component and attach to target', function (done) {
        var r;
        router.add({
            rule: '/router-cmpt/1/:name',
            target: '#main',
            Component: san.defineComponent({
                template: '<p title="{{route.query.name}}">Hello {{route.query.name}}</p>',
                created: function () {
                    r = this.$router;
                }
            })
        });

        location.hash = '/router-cmpt/1/erik';
        setTimeout(function () {
            expect(r === router).toBeTruthy();

            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('erik');
            location.hash = '/null';
            setTimeout(function () {
                done();
            }, 2)
        }, 222)
    });

    it('by component, target default #main', function (done) {
        location.hash = '/main-route/erik2';
        setTimeout(function () {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('erik2');
            location.hash = '/null';
            setTimeout(function () {
                done();
            }, 2)
        }, 222)
    });

    it('by component, goout should dispose component', function (done) {
        location.hash = '/main-route/erik';
        setTimeout(function () {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('erik');
            location.hash = '/null';

            setTimeout(function () {
                expect(ps.length).toBe(0);
                done();
            }, 2);
        }, 222)
    });

    it('listen route behavior', function (done) {
        var isCall = false;
        var config = {
            rule: '/main-route/listen/:num',
            handler: function () {
                isCall = true;
            }
        };

        function listener(e) {
            expect(e.query.num).toBe('1');
            expect(e.config).toBe(config);
        }
        router.add(config);
        router.listen(listener);
        location.hash = '/main-route/listen/1';
        setTimeout(function () {
            expect(isCall).toBe(true);

            router.unlisten(listener);
            location.hash = '/null';
            done();
        }, 0)
    });

    it('listen route behavior，suspend and resume', function (done) {
        var isCall = false;
        var config = {
            rule: '/main-route-listen-async',
            handler: function () {
                isCall = true;
            }
        };

        function listener(e) {
            e.suspend();
            setTimeout(function () {
                e.resume();
            }, 100);

            expect(isCall).toBe(false);
        }
        router.add(config);
        router.listen(listener);
        location.hash = '/main-route-listen-async';
        setTimeout(function () {
            expect(isCall).toBe(true);

            router.unlisten(listener);
            location.hash = '/null';
            done();
        }, 500)
    });

    it('listen route behavior，stop and redirect manually', function (done) {
        var isCall = false;
        var config = {
            rule: '/main-route-listen-redirect',
            handler: function () {
                isCall = true;
            }
        };

        function listener(e) {
            expect(isCall).toBe(false);

            e.stop();
            this.locator.redirect('/null');
        }

        router.add(config);
        router.listen(listener);
        location.hash = '/main-route-listen-redirect';
        setTimeout(function () {
            expect(isCall).toBe(false);
            expect(location.hash.indexOf('/null') >= 0).toBe(true);

            router.unlisten(listener);
            done();
        }, 500)
    });
});

describe('Component Link', function () {

    it('in router hash mode, absolute path', function (done) {
        var App = san.defineComponent({
            components: {
                'router-link': Link
            },

            template: '<div><router-link to="/router-link1"><b>please click here quickly</b></router-link></div>'
        });

        var app = new App();
        app.attach(document.getElementById('main'));

        var oldHash = location.hash;
        var doneDetect = function () {
            if (location.hash !== oldHash) {
                var a = document.getElementById('main').getElementsByTagName('a')[0];
                expect(a.href.indexOf('#/router-link1') >= 0)
                    .toBeTruthy();
                expect(location.hash).toBe('#/router-link1');
                app.dispose();

                setTimeout(done, 200);
                return;
            }

            setTimeout(doneDetect, 500);
        };

        setTimeout(doneDetect, 500);
    });

    it('in router hash mode, relative path', function (done) {
        router.locator.redirect('/router-link2/level1/level2/level3');

        var App = san.defineComponent({
            components: {
                'router-link': Link
            },

            template: '<div><router-link to="../b/c">please click here quickly 2</router-link></div>'
        });

        var app = new App();
        app.attach(document.getElementById('main'));

        var oldHash = location.hash;
        var doneDetect = function () {
            if (location.hash !== oldHash) {
                var a = document.getElementById('main').getElementsByTagName('a')[0];
                expect(a.href.indexOf('#/router-link2/level1/b/c') >= 0)
                    .toBeTruthy();
                expect(location.hash).toBe('#/router-link2/level1/b/c');
                app.dispose();

                setTimeout(done, 200);
                return;
            }

            setTimeout(doneDetect, 500);
        };

        setTimeout(doneDetect, 500);
    });


    notIE && it('in router html5 mode, absolute path', function (done) {
        router.setMode('html5');
        var App = san.defineComponent({
            components: {
                'router-link': Link
            },

            template: '<div><router-link to="/router-link3">please click here quickly 3</router-link></div>'
        });

        var app = new App();
        app.attach(document.getElementById('main'));

        var oldHref = location.href;
        var doneDetect = function () {
            if (location.href !== oldHref) {
                var a = document.getElementById('main').getElementsByTagName('a')[0];
                expect(a.href.indexOf('/router-link3') >= 0)
                    .toBeTruthy();
                expect(location.pathname).toBe('/router-link3');
                app.dispose();
                history.back();

                setTimeout(done, 200);
                return;
            }

            setTimeout(doneDetect, 500);
        };

        setTimeout(doneDetect, 500);
    });

    notIE && it('in router html5 mode, relative path', function (done) {
        router.setMode('html5');
        router.locator.redirect('/router-link4/level1/level2/level3');

        var App = san.defineComponent({
            components: {
                'router-link': Link
            },

            template: '<div><router-link to="../a/b">please click here quickly 4</router-link></div>'
        });

        var app = new App();
        app.attach(document.getElementById('main'));

        var oldHref = location.href;
        var doneDetect = function () {
            if (location.href !== oldHref) {
                var a = document.getElementById('main').getElementsByTagName('a')[0];
                expect(a.href.indexOf('/router-link4/level1/a/b') >= 0)
                    .toBeTruthy();
                expect(location.pathname).toBe('/router-link4/level1/a/b');
                app.dispose();
                history.back();
                history.back();

                setTimeout(done, 200);

                return;
            }

            setTimeout(doneDetect, 500);
        };

        setTimeout(doneDetect, 500);
    });
});

describe('Synthesis', function () {
    it('hash mode, link to route', function (done) {
        router.setMode('hash');
        router.start();

        var routeTimes = 0;
        var App = san.defineComponent({
            initData: function () {
                return {
                    routeTimes: 0
                };
            },

            components: {
                'router-link': Link
            },

            route: function () {
                this.data.set('routeTimes', this.data.get('routeTimes') + 1);
                routeTimes = this.data.get('routeTimes');
            },

            template: '<div><router-link to="./errorrik">Click here to hash route</router-link>  <b title="{{route.query.name}}">{{route.query.name}}</b></div>'
        });

        router.add({
            rule: '/synthesis/hash/:name',
            Component: App
        });

        location.hash = '/synthesis/hash/erik';


        setTimeout(function () {
            expect(routeTimes).toBe(1);
            expect(document.getElementById('main').getElementsByTagName('b')[0].title).toBe('erik');
            detectDone();
        }, 200);


        function detectDone() {
            if (location.hash !== '#/synthesis/hash/erik') {
                expect(routeTimes).toBe(2);
                expect(document.getElementById('main').getElementsByTagName('b')[0].title).toBe('errorrik');

                location.hash = '/synthesis/null';
                setTimeout(finish, 500);
                return;
            }

            setTimeout(detectDone, 500);
        }

        function finish() {
            expect(routeTimes).toBe(2);
            expect(document.getElementById('main').getElementsByTagName('b').length).toBe(0);

            done();
        }
    });

    notIE && it('html5 mode, link to route', function (done) {
        router.setMode('html5');

        var routeTimes = 0;
        var myApp;
        var App = san.defineComponent({
            initData: function () {
                return {
                    routeTimes: 0
                };
            },

            components: {
                'router-link': Link
            },

            route: function () {
                myApp = this;
                this.data.set('routeTimes', this.data.get('routeTimes') + 1);
                routeTimes = this.data.get('routeTimes');
            },

            template: '<div><router-link to="./errorrik">Click here to html5 route, quickly</router-link>  <b title="{{route.query.name}}">{{route.query.name}}</b></div>'
        });

        router.add({
            rule: '/synthesis/html5/:name',
            Component: App
        });


        router.locator.redirect('/synthesis/html5/erik');


        setTimeout(function () {
            expect(myApp.$router === router).toBeTruthy();
            expect(routeTimes).toBe(1);
            expect(document.getElementById('main').getElementsByTagName('b')[0].title).toBe('erik');
            detectDone();
        }, 222);


        function detectDone() {
            if (location.href.indexOf('/synthesis/html5/erik') < 0) {
                expect(routeTimes).toBe(2);
                expect(document.getElementById('main').getElementsByTagName('b')[0].title).toBe('errorrik');

                router.locator.redirect('/test/');
                setTimeout(finish, 500);
                return;
            }

            setTimeout(detectDone, 500);
        }

        function finish() {
            expect(routeTimes).toBe(2);
            expect(document.getElementById('main').getElementsByTagName('b').length).toBe(0);

            done();
        }
    });
});

describe('Component $router', function() {
    beforeAll(function (done) {
        router.setMode('hash');
        location.hash = nextURL();

        setTimeout(function () {done();}, 50)
    });

    afterEach(function (done) {
        location.hash = nextURL();

        setTimeout(function () {done();}, 200)
    });

    it('$router exists', function (done) {
        var myApp;
        var App = san.defineComponent({
            template: '<div>something for nothing.</div>',
            inited: function () {
                myApp = this;
            }
        });

        router.add({
            rule: '/dr/1',
            Component: App
        });

        location.hash = '/dr/1';
        setTimeout(function () {
            expect(myApp.$router).toBe(router);
            done();
        }, 222)
    });


    it('use push', function (done) {
        var myApp;
        var App = san.defineComponent({
            initData: function () {
                return {
                    name: 'router'
                };
            },
            template: '<p title="{{route.query.name || name}}">{{route.query.name || name}}</p>',
            inited: function () {
                myApp = this;
            }
        });

        router.add({
            rule: '/dr/2',
            Component: App
        });

        router.add({
            rule: '/dr/2/:name',
            Component: App
        });

        location.hash = '/dr/2';
        setTimeout(function () {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('router');
            expect(myApp.data.get('route.config')).toBeUndefined();

            myApp.$router.push('/dr/2/erik');
            setTimeout(function () {
                expect(ps[0].title).toBe('erik');

                done();
            }, 222)
        }, 222)
    });

    it('use push with obj, add query', function (done) {
        var myApp;
        var App = san.defineComponent({
            initData: function () {
                return {
                    name: 'router'
                };
            },
            template: '<p title="{{route.query.name || name}}">{{route.query.name || name}}</p>',
            inited: function () {
                myApp = this;
            }
        });

        router.add({
            rule: '/dr/3',
            Component: App
        });

        location.hash = '/dr/3';
        setTimeout(function () {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('router');

            myApp.$router.push({
                path: '/dr/3',
                query: {
                    name: 'erik'
                }
            });
            setTimeout(function () {
                expect(ps[0].title).toBe('erik');
                expect(location.hash).toBe('#/dr/3?name=erik');

                done();
            }, 222)
        }, 222)
    });

    it('use push with obj, add queryString', function (done) {
        var myApp;
        var App = san.defineComponent({
            initData: function () {
                return {
                    name: 'router'
                };
            },
            template: '<p title="{{route.query.name || name}}">{{route.query.name || name}}</p>',
            inited: function () {
                myApp = this;
            }
        });

        router.add({
            rule: '/dr/4',
            Component: App
        });

        location.hash = '/dr/4';
        setTimeout(function () {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('router');

            myApp.$router.push({
                path: '/dr/4',
                queryString: 'name=erik2'
            });
            setTimeout(function () {
                expect(ps[0].title).toBe('erik2');
                expect(location.hash).toBe('#/dr/4?name=erik2');

                done();
            }, 222)
        }, 222)
    });

    it('use push with obj, add query, no path', function (done) {
        var myApp;
        var App = san.defineComponent({
            initData: function () {
                return {
                    name: 'router'
                };
            },
            template: '<p title="{{route.query.name || name}}">{{route.query.name || name}}</p>',
            inited: function () {
                myApp = this;
            }
        });

        router.add({
            rule: '/dr/5',
            Component: App
        });

        location.hash = '/dr/5';
        setTimeout(function () {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('router');

            myApp.$router.push({
                query: {
                    name: 'erik'
                }
            });

            setTimeout(function () {
                expect(location.hash).toBe('#/dr/5?name=erik');
                expect(ps[0].title).toBe('erik');

                done();
            }, 222)
        }, 222)
    });

    it('use push with obj, fill by query', function (done) {
        var myApp;
        var App = san.defineComponent({
            initData: function () {
                return {
                    name: 'router'
                };
            },
            template: '<p title="{{route.query.name || name}}">{{route.query.name || name}}</p>',
            inited: function () {
                myApp = this;
            }
        });

        router.add({
            rule: '/dr/6',
            Component: App
        });

        router.add({
            rule: '/dr/6/:name',
            Component: App
        });

        location.hash = '/dr/6';
        setTimeout(function () {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('router');

            myApp.$router.push({
                path: '/dr/6/:name',
                query: {
                    name: 'erik'
                }
            });
            setTimeout(function () {
                expect(ps[0].title).toBe('erik');
                expect(location.hash).toBe('#/dr/6/erik');

                done();
            }, 222)
        }, 222)
    });


    it('use push with obj, fill by params', function (done) {
        var myApp;
        var App = san.defineComponent({
            initData: function () {
                return {
                    name: 'router'
                };
            },
            template: '<p title="{{route.query.name || name}}">{{route.query.name || name}}</p>',
            inited: function () {
                myApp = this;
            }
        });

        router.add({
            rule: '/dr/7',
            Component: App
        });

        router.add({
            rule: '/dr/7/:name',
            Component: App
        });

        location.hash = '/dr/7';
        setTimeout(function () {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('router');

            myApp.$router.push({
                path: '/dr/7/:name',
                params: {
                    name: 'erik'
                }
            });
            setTimeout(function () {
                expect(ps[0].title).toBe('erik');
                expect(location.hash).toBe('#/dr/7/erik');

                done();
            }, 222)
        }, 222)
    });


    it('use push with obj, add more queries', function (done) {
        var myApp;
        var App = san.defineComponent({
            initData: function () {
                return {
                    name: 'router'
                };
            },
            template: '<p title="{{route.query.name || name}}">{{route.query.name || name}}</p>',
            inited: function () {
                myApp = this;
            }
        });

        router.add({
            rule: '/dr/8',
            Component: App
        });

        location.hash = '/dr/8';
        setTimeout(function () {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('router');

            myApp.$router.push({
                query: {
                    name: 'erik',
                    sex: 1,
                    age: 18
                }
            });
            setTimeout(function () {
                expect(ps[0].title).toBe('erik');
                expect(location.hash.indexOf('#/dr/8')).toBe(0);
                expect(location.hash).toContain('name=erik');
                expect(location.hash).toContain('age=18');
                expect(location.hash).toContain('sex=1');

                done();
            }, 222)
        }, 222)
    });

    it('use push with obj, clear by empty object query', function (done) {
        var myApp;
        var App = san.defineComponent({
            initData: function () {
                return {
                    name: 'router'
                };
            },
            template: '<p title="{{route.query.name || name}}">{{route.query.name || name}}</p>',
            inited: function () {
                myApp = this;
            }
        });

        router.add({
            rule: '/dr/9',
            Component: App
        });

        location.hash = '/dr/9?name=erik';
        setTimeout(function () {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('erik');

            myApp.$router.push({
                query: {}
            });
            setTimeout(function () {
                expect(ps[0].title).toBe('router');
                expect(location.hash).toBe('#/dr/9');

                done();
            }, 222)
        }, 222)
    });

    notIE && it('use push with obj, fill by params, html5 mode', function (done) {

        router.setMode('html5');

        var myApp;
        var App = san.defineComponent({
            initData: function () {
                return {
                    name: 'router'
                };
            },
            template: '<p title="{{route.query.name || name}}">{{route.query.name || name}}</p>',
            inited: function () {
                myApp = this;
            }
        });

        router.add({
            rule: '/dr/10',
            Component: App
        });

        router.add({
            rule: '/dr/10/:name',
            Component: App
        });


        router.push('/dr/10');
        setTimeout(function () {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('router');

            myApp.$router.push({
                path: '/dr/10/:name',
                params: {
                    name: 'erik'
                }
            });
            setTimeout(function () {
                expect(ps[0].title).toBe('erik');
                expect(location.pathname).toBe('/dr/10/erik');

                history.back();
                history.back();

                setTimeout(done, 200);
            }, 222)
        }, 222)
    });

    notIE && it('use push with obj, fill by query, html5 mode', function (done) {

        router.setMode('html5');

        var myApp;
        var App = san.defineComponent({
            initData: function () {
                return {
                    name: 'router'
                };
            },
            template: '<p title="{{route.query.name || name}}">{{route.query.name || name}}</p>',
            inited: function () {
                myApp = this;
            }
        });

        router.add({
            rule: '/dr/11',
            Component: App
        });


        router.push('/dr/11');
        setTimeout(function () {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('router');

            myApp.$router.push({
                query: {
                    name: 'erik'
                }
            });
            setTimeout(function () {
                expect(ps[0].title).toBe('erik');
                expect(location.pathname).toBe('/dr/11');
                expect(location.href).toContain('name=erik');

                history.back();
                history.back();

                setTimeout(done, 200);
            }, 222)
        }, 222)
    });

    
});

describe('withRouter Component', function() {
    beforeAll(function (done) {
        router.setMode('hash');
        location.hash = nextURL();

        setTimeout(function () {done();}, 50)
    });

    afterEach(function (done) {
        location.hash = nextURL();

        setTimeout(function () {done();}, 200)
    });

    it('$router exists, route data exists', function (done) {
        var myApp;
        var child;
        var routeData;
        var routeCalled = false;
        var Child = withRoute(san.defineComponent({
            template: '<div>child is here</div>',
            inited: function () {
                child = this;
            },

            attached() {
                routeData = this.data.get('route');
            },
            
            route() {
                routeCalled = true;
            }
        }));

        var App = san.defineComponent({
            template: '<div>something for nothing.<x-child/></div>',
            inited: function () {
                myApp = this;
            },

            components: {
                'x-child': Child
            }
        });

        router.add({
            rule: '/wr/1/:num',
            Component: App
        });

        location.hash = '/wr/1/1';
        setTimeout(function () {
            expect(myApp.$router).toBe(router);
            expect(child.$router).toBe(router);

            expect(myApp.data.get('route.config')).toBeUndefined();
            expect(routeData.path).toBe("/wr/1/1");
            expect(routeData.params.num).toBe("1");
            expect(routeData.resume).toBeUndefined();
            expect(routeCalled).toBeTruthy();
            done();
        }, 222)
    });

    it('route data is updated', function (done) {
        var myApp;
        var child;
        var routeData;
        var Child = withRoute(san.defineComponent({
            template: '<div>child is here</div>',
            inited: function () {
                child = this;
            },

            route() {
                routeData = this.data.get('route');
            }
        }));
        var App1 = san.defineComponent({
            template: '<div>something for nothing.<x-child/></div>',
            inited: function () {
                myApp = this;
            },

            components: {
                'x-child': Child
            }
        });

        router.add([
            {
                rule: '/wr/2/:num',
                Component: App1
            }
        ]);

        location.hash = '/wr/2/1';
        setTimeout(function () {
            expect(myApp.$router).toBe(router);
            expect(child.$router).toBe(router);
            expect(routeData.path).toBe('/wr/2/1');
            expect(routeData.query.num).toBe("1");
            expect(routeData.resume).toBeUndefined();


            location.hash = '/wr/2/2';
            setTimeout(function () {
                expect(routeData.path).toBe('/wr/2/2');
                expect(routeData.query.num).toBe("2");
                expect(routeData.resume).toBeUndefined();

                done();
            }, 222);
        }, 222)
    });

    it('more than 1 instances', function (done) {
        var myApp;
        var childLen = 0;
        var routeInvokes = 0;
        var num = '1';
        var path = '/wr/3/1';
        var Child = withRoute(san.defineComponent({
            template: '<div>child is here</div>',
            attach() {
                childLen++;
            },

            route() {
                expect(this.data.get('route.params.num')).toBe(num);
                expect(this.data.get('route.path')).toBe(path);
                routeInvokes++;
            }
        }));
        var App = san.defineComponent({
            template: '<div>something for nothing.<x-child s-for="item in list"/></div>',

            inited: function () {
                myApp = this;
            },
            initData: function () {
                return {
                    list: [1, 2, 3, 4]
                };
            },
            components: {
                'x-child': Child
            }
        });

        router.add({
            rule: '/wr/3/:num',
            Component: App
        });

        location.hash = '/wr/3/1';
        setTimeout(function () {
            expect(childLen).toBe(4);
            expect(routeInvokes).toBe(4);

            num = '2';
            path = '/wr/3/2';
            location.hash = '/wr/3/2';
            setTimeout(function () {
                expect(routeInvokes).toBe(8);

                done();
            }, 222);
        }, 222)
    });

    it('for class', function (done) {
        var attached = 0;
        var routed = 0;

        class Child extends san.Component {
            static template = '<u>{{route.params.num}}</u>';
            attached() {
                attached++;
            }
            
            route() {
                routed++;
            }
        }
        var ChildWithRoute = withRoute(Child);
        var App = san.defineComponent({
            template: '<div><x-child/></div>',

            components: {
                'x-child': ChildWithRoute
            }
        });

        router.add([
            {
                rule: '/wr/4/:num',
                Component: App
            }
        ]);

        location.hash = '/wr/4/1';
        setTimeout(function () {
            expect(attached).toBe(1);
            expect(routed).toBe(1);
            expect(document.getElementById('main').getElementsByTagName('u')[0].innerHTML)
                .toContain('1');

            location.hash = '/wr/4/2';
            setTimeout(function () {
                expect(attached).toBe(1);
                expect(routed).toBe(2);

                expect(document.getElementById('main').getElementsByTagName('u')[0].innerHTML)
                    .toContain('2');

                done();
            }, 222);
        }, 222);
    });

    it('inner partial update', function (done) {

        var attached = 0;
        var routed = 0;

        var Home = san.defineComponent({
            template: '<b class="content">home</b>'
        });
        var About = san.defineComponent({
            template: '<b class="content">about</b>'
        });
        var Content = withRoute(san.defineComponent({
            template: '<div class="abc" style="width:100px;height:100px;background-color:green">'
                + '<child s-is="route.query.name"/>'
                + '</div>',

            components: {
                'home': Home,
                'about': About
            },
            
            attached() {
                attached++;
            },
            
            route() {
                routed++;
            }
        }));
        var App = san.defineComponent({
            template: `
                <div>
                    <h3>{{route.query.name}}</h3>
                    <x-content />
                </div>
            `,
            components: {
                'x-content': Content
            }
        });

        router.add([
            {
                rule: '/wr/5/:name',
                Component: App
            }
        ]);
        location.hash = '/wr/5/none';

        setTimeout(function () {
            expect(attached).toBe(1);
            expect(routed).toBe(1);
            expect(document.getElementById('main').getElementsByTagName('h3')[0].innerHTML)
                .toContain('none');
            expect(document.getElementById('main').getElementsByTagName('b').length).toBe(0);

            location.hash = '/wr/5/home';
            setTimeout(function () {
                expect(attached).toBe(1);
                expect(routed).toBe(2);
                
                expect(document.getElementById('main').getElementsByTagName('h3')[0].innerHTML)
                    .toContain('home');
                expect(document.getElementById('main').getElementsByTagName('b').length).toBe(1);
                
                expect(document.getElementById('main').getElementsByTagName('b')[0].innerHTML)
                    .toContain('home');   

                done();
            }, 222);
        }, 222);
    });
});

describe('Async Component', function() {
    beforeAll(function (done) {
        router.setMode('hash');
        location.hash = nextURL();

        setTimeout(function () {done();}, 50)
    });

    afterEach(function (done) {
        location.hash = nextURL();

        setTimeout(function () {done();}, 200)
    });

    it('Async Component attached once', function (done) {
        var App = san.defineComponent({
            template: '<div class="async-app">something for nothing.</div>'
        });

        router.add([
            {
                rule: '/ac/6',
                Component: function() {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve(App);
                        }, 0);
                    });
                }
            }
        ]);

        router.listen(e => {
            e.suspend();
            // doSomething()
            e.resume();
        });

        location.hash = '/ac/6';
    
        setTimeout(function () {
            expect(document.querySelectorAll('.async-app').length ).toBe(1);
            done();
        }, 100)
    });
});
