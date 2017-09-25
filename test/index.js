
import {router, Link} from '../src/main'


import './parse-url.spec'
import './resolve-url.spec'
import './locator-hash.spec'
import './locator-html5.spec'
import './main.spec'
import './component-link.spec'



describe('Synthesis', () => {
    it('hash mode, link to route', done => {
        router.setMode('hash');
        router.start();

        let routeTimes = 0;
        let App = san.defineComponent({
            initData() {
                return {
                    routeTimes: 0
                };
            },

            components: {
                'router-link': Link
            },

            route() {
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


        setTimeout(() => {
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

    it('html5 mode, link to route', done => {
        router.setMode('html5');

        let routeTimes = 0;
        let App = san.defineComponent({
            initData() {
                return {
                    routeTimes: 0
                };
            },

            components: {
                'router-link': Link
            },

            route() {
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


        setTimeout(() => {
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

