import {router} from '../src/main';



let TestComponent = san.defineComponent({
    template: `<p title="{{route.query.name}}">Hello {{route.query.name}}</p>`
});

router.add({
    rule: '/main-route/:name',
    handler: function () {alert('if u see this, it must be an error!')},
    target: '#main',
    Component: TestComponent
});

router.start();

describe('Router', () => {
    it('by handler, should call handler, all match string', done => {
        router.add({
            rule: '/route-test',
            handler: e => {
                expect(true).toBeTruthy();
                done();
            }
        });
        location.hash = '/route-test';
    });

    it('by handler, should not call handler, when string is not match', done => {
        let isCall = false;
        router.add({
            rule: '/route-test',
            handler: function () {
                isCall = true;
            }
        });
        location.hash = '/route-test2';

        setTimeout(() => {
            expect(isCall).toBeFalsy();
            done();
        }, 0);
    });

    it('by handler, should not call handler, when string is not match (miss start slash)', done => {
        let isCall = false;
        router.add({
            rule: '/route-test',
            handler: function () {
                isCall = true;
            }
        });
        location.hash = 'route-test';

        setTimeout(() => {
            expect(isCall).toBeFalsy();
            done();
        }, 0);
    });

    it('by handler, should call handler, match string as rule :xxx', done => {
        router.add({
            rule: '/route-test/:id',
            handler: e => {
                expect(e.query.id).toBe('1');
                done();
            }
        });
        location.hash = '/route-test/1';
    });

    it('by handler, should call handler, match string as rule :xxxYyy', done => {
        router.add({
            rule: '/route-test2/:tagId',
            handler: e => {
                expect(e.query.tagId).toBe('3');
                done();
            }
        });
        location.hash = '/route-test2/3';
    });

    it('by handler, should call handler, match non ascii string as rule :xxx', done => {
        router.add({
            rule: '/route-test/non/asc/:name',
            handler: e => {
                expect(e.params.name).toBe('%E4%BD%A0%E5%A5%BD');
                done();
            }
        });
        location.hash = '/route-test/non/asc/你好';
    });

    it('by handler, should call handler, match string as multi rules :xxx', done => {
        router.add({
            rule: '/route-test2/:name/:id',
            handler: e => {
                expect(e.query.id).toBe('2');
                expect(e.query.name).toBe('Route-test');
                done();
            }
        });
        location.hash = '/route-test2/Route-test/2';
    });

    it('by handler, should call handler, match string as multi rules :xxxYyy', done => {
        router.add({
            rule: '/route-test3/:testName/:tagId',
            handler: e => {
                expect(e.query.tagId).toBe('2');
                expect(e.query.testName).toBe('Route-test');
                done();
            }
        });
        location.hash = '/route-test3/Route-test/2';
    });

    it('by handler, should call handler, match string as rule :xxx-yyy', done => {
        router.add({
            rule: '/route-test4/:data-id',
            handler: e => {
                expect(e.query['data-id']).toBe('3');
                done();
            }
        });
        location.hash = '/route-test4/3';
    });

    it('by handler, should call handler, match RegExp', done => {
        router.add({
            rule: /^\/route\/([0-9]+)$/,
            handler: e => {
                expect(e.query[1]).toBe('2');
                expect(e.query[0]).toBeUndefined();
                done();
            }
        });
        location.hash = '/route/2';
    });

    it('by component, route should init component and attach to target', done => {
        location.hash = '/main-route/erik';
        setTimeout(() => {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('erik');
            location.hash = '/null';
            setTimeout(() => {
                done();
            }, 2)
        }, 222)
    });

    it('by component, target default #main', done => {
        location.hash = '/main-route/erik2';
        setTimeout(() => {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('erik2');
            location.hash = '/null';
            setTimeout(() => {
                done();
            }, 2)
        }, 222)
    });

    it('by component, goout should dispose component', done => {
        location.hash = '/main-route/erik';
        setTimeout(() => {
            var ps = document.getElementById('main').getElementsByTagName('p');
            expect(ps[0].title).toBe('erik');
            location.hash = '/null';

            setTimeout(() => {
                expect(ps.length).toBe(0);
                done();
            }, 2);
        }, 222)
    });

    it('listen route behavior', done => {
        let isCall = false;
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
        setTimeout(() => {
            expect(isCall).toBe(true);

            router.unlisten(listener);
            location.hash = '/null';
            done();
        }, 0)
    });

    it('listen route behavior，suspend and resume', done => {
        let isCall = false;
        var config = {
            rule: '/main-route-listen-async',
            handler: function () {
                isCall = true;
            }
        };

        function listener(e) {
            e.suspend();
            setTimeout(() => {
                e.resume();
            }, 100);

            expect(isCall).toBe(false);
        }
        router.add(config);
        router.listen(listener);
        location.hash = '/main-route-listen-async';
        setTimeout(() => {
            expect(isCall).toBe(true);

            router.unlisten(listener);
            location.hash = '/null';
            done();
        }, 500)
    });

    it('listen route behavior，stop and redirect manually', done => {
        let isCall = false;
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
        setTimeout(() => {
            expect(isCall).toBe(false);
            expect(location.hash.indexOf('/null') >= 0).toBe(true);

            router.unlisten(listener);
            done();
        }, 500)
    });
});
