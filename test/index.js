
var router = sanRouter.router;
var Link = sanRouter.Link;
var HashLocator = sanRouter.HashLocator;
var HTML5Locator = sanRouter.HTML5Locator;

var parseURL = sanRouter.parseURL;
var parseQuery = sanRouter.parseQuery;


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

// parseQuery unit test
describe('parseQuery', function () {
    it('false invalid value will return empty string :)', function () {
        var qs = parseQuery('');
        expect(qs).toBe('');
        qs = parseQuery(undefined);
        expect(qs).toBe('');
        qs = parseQuery(null);
        expect(qs).toBe('');
        qs = parseQuery(NaN);
        expect(qs).toBe('');
    });

    it('normal case query', function () {
        var qs = parseQuery({
            foo: 'bar',
            bar: 'foo'
        });
        expect(qs).toBe('?foo=bar&bar=foo');
    });

    it('normal case queryString', function () {
        var qs = parseQuery('?foo=bar&bar=foo');
        expect(qs).toBe('?foo=bar&bar=foo');
        qs = parseQuery('foo=bar&bar=foo');
        expect(qs).toBe('?foo=bar&bar=foo');
    });

    it('should auto decode query', function () {
        var qs = parseQuery({
            foo: '你好',
            bar: '不好'
        });
        expect(qs).toBe('?foo=%E4%BD%A0%E5%A5%BD&bar=%E4%B8%8D%E5%A5%BD');
    });

    it('unsupport data type will return empty string', function () {
        var qs = parseQuery(1);
        expect(qs).toBe('');
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
        location.hash = '/main-route/erik';
        setTimeout(function () {
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

        function listener(e, c) {
            expect(e.query.num).toBe('1');
            expect(c).toBe(config);
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

                setTimeout(done, 100);
                return;
            }

            setTimeout(doneDetect, 500);
        };

        setTimeout(doneDetect, 500);
    });

    it('in router hash mode, relative path', function (done) {
        router.locator.redirect('/router-link2/level1/level2/level3');

        setTimeout(function () {
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

                    setTimeout(done, 100);
                    return;
                }

                setTimeout(doneDetect, 500);
            };

            setTimeout(doneDetect, 500);
        }, 100);
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

            template: '<div><router-link to="./errorrik">Click here to hash route, quickly</router-link>  <b title="{{route.query.name}}">{{route.query.name}}</b></div>'
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
        }, 500);


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

            template: '<div><router-link to="./errorrik">Click here to html5 route, quickly</router-link>  <b title="{{route.query.name}}">{{route.query.name}}</b></div>'
        });

        router.add({
            rule: '/synthesis/html5/:name',
            Component: App
        });


        router.locator.redirect('/synthesis/html5/erik');


        setTimeout(function () {
            expect(routeTimes).toBe(1);
            expect(document.getElementById('main').getElementsByTagName('b')[0].title).toBe('erik');
            detectDone();
        }, 500);


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

            router.stop();
            done();
        }
    });
});

// new feature
describe('test this.$router in San component using hash', function() {

    it('test this.$router exits', function(done) {
        var App = san.defineComponent({
            template: '<div>history / something for nothing.</div>'
        })

        router.setMode('hash');

        router.add({
            rule: '/router/hash',
            Component: App
        });

        router.start();

        setTimeout(function() {
            location.hash = '/router/hash'
        })

        setTimeout(function () {
            expect(router.routeAlives).toBeDefined();
            expect(router.routeAlives[0]).toBeDefined();
            expect(router.routeAlives[0].component).toBeDefined();
            expect(router.routeAlives[0].component.$router).toBeDefined();
            router.stop();
            done();
        }, 200);
    })
})

describe('test this.$router in San component using html5 history', function() {

    it('test this.$router exits', function(done) {
        var App = san.defineComponent({
            template: '<div>html5 / something for nothing.</div>'
        })

        router.setMode('html5');

        router.add({
            rule: '/router/html5',
            Component: App
        });

        router.start();

        setTimeout(function() {
            router.locator.redirect('/router/html5');
        })

        setTimeout(function () {
            expect(router.routeAlives).toBeDefined();
            expect(router.routeAlives[0]).toBeDefined();
            expect(router.routeAlives[0].component).toBeDefined();
            expect(router.routeAlives[0].component.$router).toBeDefined();

            router.stop();
            done();
        }, 200);
    })
})

describe('test this.$router.push with hash mode', function() {

    it('test this.$router.push with string params', function(done) {
        var App = san.defineComponent({
            template: '<div>something for nothing.</div>'
        })

        router.setMode('hash');

        router.add({
            rule: '/router/hash',
            Component: App
        });

        router.start();

        setTimeout(function (){
            location.hash = '/router/hash'
        });

        setTimeout(function () {
            var $router = router.routeAlives[0].component.$router;
            $router.push('/router/hash/pushok?foo=bar')
        }, 200)

        setTimeout(function () {
            expect(location.hash).toBe('#/router/hash/pushok?foo=bar');
            expect(location.href.indexOf('#/router/hash/pushok?foo=bar') >= 0).toBeTruthy();
            router.stop();
            done();
        }, 300);
    })

    it('test this.$router.push with object params case 1', function(done) {
        var App = san.defineComponent({
            template: '<div>something for nothing.</div>'
        })

        router.setMode('hash');

        router.add({
            rule: '/router/hash',
            Component: App
        });

        router.start();

        setTimeout(function() {
            location.hash = '/router/hash'
        })

        setTimeout(function (){
            var $router = router.routeAlives[0].component.$router;
            $router.push({
                path: '/router/hash/pushok',
                query: {
                    foo: 'bar'
                }
            })
        }, 100);

        setTimeout(function () {
            console.log(location.hash);
            expect(location.hash).toBe('#/router/hash/pushok?foo=bar');
            expect(location.href.indexOf('#/router/hash/pushok') >= 0).toBeTruthy();
            router.stop();
            done();
        }, 200);
    })

    it('test this.$router.push with object params case 2', function(done) {
        var App = san.defineComponent({
            template: '<div>something for nothing.</div>'
        })

        router.setMode('hash');

        router.add({
            rule: '/router/hash',
            Component: App
        });

        router.start();

        setTimeout(function() {
            location.hash = '/router/hash'
        })

        setTimeout(function (){
            var $router = router.routeAlives[0].component.$router;
            $router.push({
                path: '/router/hash/pushok',
                queryString: 'foo=bar&bar=foo'
            })
        }, 100);

        setTimeout(function () {
            console.log(location.hash);
            expect(location.hash).toBe('#/router/hash/pushok?foo=bar&bar=foo');
            expect(location.href.indexOf('#/router/hash/pushok') >= 0).toBeTruthy();
            router.stop();
            done();
        }, 200);
    })

    it('test this.$router.push with object params case 3', function(done) {
        var App = san.defineComponent({
            template: '<div>something for nothing.</div>'
        })

        router.setMode('hash');

        router.add({
            rule: '/router/hash',
            Component: App
        });

        router.start();

        setTimeout(function() {
            location.hash = '/router/hash'
        })

        setTimeout(function (){
            var $router = router.routeAlives[0].component.$router;
            $router.push({
                path: '/router/hash/pushok',
                query: {
                    foo: 'boo'
                },
                queryString: 'foo=bar&bar=foo'
            })
        }, 100);

        setTimeout(function () {
            console.log(location.hash);
            expect(location.hash).toBe('#/router/hash/pushok?foo=bar&bar=foo');
            expect(location.href.indexOf('#/router/hash/pushok') >= 0).toBeTruthy();
            router.stop();
            done();
        }, 200);
    })
})

describe('test this.$router.push with html5 history mode', function() {

    it('test this.$router.push with string params', function(done) {
        var App = san.defineComponent({
            template: '<div>html5 / something for nothing.</div>'
        })

        router.setMode('html5');

        router.add({
            rule: '/router/html5',
            Component: App
        });

        router.start();

        setTimeout(function (){
            router.locator.redirect('/router/html5');
        });

        setTimeout(function () {
            var $router = router.routeAlives[0].component.$router;
            $router.push('/router/html5/pushok?foo=bar')
        }, 100)

        setTimeout(function () {
            expect(location.pathname).toBe('/router/html5/pushok');
            expect(location.href.indexOf('/router/html5/pushok?foo=bar') >= 0).toBeTruthy();;
            router.stop();
            done();
        }, 200);
    })

    it('test this.$router.push with object params case 1', function(done) {
        var App = san.defineComponent({
            template: '<div>html5 / something for nothing.</div>'
        })

        router.setMode('html5');

        router.add({
            rule: '/router/html5',
            Component: App
        });

        router.start();

        setTimeout(function() {
            router.locator.redirect('/router/html5');
        })

        setTimeout(function (){
            var $router = router.routeAlives[0].component.$router;
            $router.push({
                path: '/router/html5/pushok',
                query: {
                    foo: 'bar'
                }
            })
        }, 100);

        setTimeout(function () {
            expect(location.pathname).toBe('/router/html5/pushok');
            expect(location.search).toBe('?foo=bar');
            expect(location.href.indexOf('/router/html5/pushok?foo=bar') >= 0).toBeTruthy();;
            router.stop();
            done();
        }, 200);
    })

    it('test this.$router.push with object params case 2', function(done) {
        var App = san.defineComponent({
            template: '<div>html5 / something for nothing.</div>'
        })

        router.setMode('html5');

        router.add({
            rule: '/router/html5',
            Component: App
        });

        router.start();

        setTimeout(function() {
            router.locator.redirect('/router/html5');
        })

        setTimeout(function (){
            var $router = router.routeAlives[0].component.$router;
            $router.push({
                path: '/router/html5/pushok',
                queryString: 'foo=bar'
            })
        }, 100);

        setTimeout(function () {
            expect(location.pathname).toBe('/router/html5/pushok');
            expect(location.search).toBe('?foo=bar');
            expect(location.href.indexOf('/router/html5/pushok?foo=bar') >= 0).toBeTruthy();;
            router.stop();
            done();
        }, 200);
    })

    it('test this.$router.push with object params case 3', function(done) {
        var App = san.defineComponent({
            template: '<div>html5 / something for nothing.</div>'
        })

        router.setMode('html5');

        router.add({
            rule: '/router/html5',
            Component: App
        });

        router.start();

        setTimeout(function() {
            router.locator.redirect('/router/html5');
        })

        setTimeout(function (){
            var $router = router.routeAlives[0].component.$router;
            $router.push({
                path: '/router/html5/pushok',
                query: {
                    foo: 'bar'
                },
                queryString: 'bar=foo'
            })
        }, 100);

        setTimeout(function () {
            expect(location.pathname).toBe('/router/html5/pushok');
            expect(location.search).toBe('?bar=foo');
            expect(location.href.indexOf('/router/html5/pushok?bar=foo') >= 0).toBeTruthy();;
            router.stop();
            done();
        }, 200);
    })
})

describe('handler will be trigger whenever Component is defined', function() {

    it('call handler', function(done) {
        var App = san.defineComponent({
            template: '<h1>handler / something for nothing.</h1>'
        })

        router.setMode('hash');

        var ifTrigger = false;

        router.add({
            rule: '/router/handler',
            Component: App,
            handler: function () {
                ifTrigger = true;
            }
        });

        router.start();

        setTimeout(function (){
            router.locator.redirect('/router/handler');
        });

        setTimeout(function () {
            expect(ifTrigger).toBeTruthy();;
            router.stop();
            document.getElementById('main').remove();
            done();
        }, 200);
    })
})
