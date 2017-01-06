import {router, Link} from '../src/main';



describe('Component Link', () => {

    it('in router hash mode, absolute path', done => {
        let App = san.defineComponent({
            components: {
                'router-link': Link
            },

            template: `<div><router-link to="/router-link1"><b>please click here quickly</b></router-link></div>`
        });

        let app = new App();
        app.attach(document.getElementById('main'));

        let oldHash = location.hash;
        let doneDetect = () => {
            if (location.hash !== oldHash) {
                let a = document.getElementById('main').getElementsByTagName('a')[0];
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

    it('in router hash mode, relative path', done => {
        router.locator.redirect('/router-link2/level1/level2/level3');

        setTimeout(() => {
            let App = san.defineComponent({
                components: {
                    'router-link': Link
                },

                template: `<div><router-link to="../b/c">please click here quickly 2</router-link></div>`
            });

            let app = new App();
            app.attach(document.getElementById('main'));

            let oldHash = location.hash;
            let doneDetect = () => {
                if (location.hash !== oldHash) {
                    let a = document.getElementById('main').getElementsByTagName('a')[0];
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


    it('in router html5 mode, absolute path', done => {
        router.setMode('html5');
        let App = san.defineComponent({
            components: {
                'router-link': Link
            },

            template: `<div><router-link to="/router-link3">please click here quickly 3</router-link></div>`
        });

        let app = new App();
        app.attach(document.getElementById('main'));

        let oldHref = location.href;
        let doneDetect = () => {
            if (location.href !== oldHref) {
                let a = document.getElementById('main').getElementsByTagName('a')[0];
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

    it('in router html5 mode, relative path', done => {
        router.setMode('html5');
        router.locator.redirect('/router-link4/level1/level2/level3');

        let App = san.defineComponent({
            components: {
                'router-link': Link
            },

            template: `<div><router-link to="../a/b">please click here quickly 4</router-link></div>`
        });

        let app = new App();
        app.attach(document.getElementById('main'));

        let oldHref = location.href;
        let doneDetect = () => {
            if (location.href !== oldHref) {
                let a = document.getElementById('main').getElementsByTagName('a')[0];
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
