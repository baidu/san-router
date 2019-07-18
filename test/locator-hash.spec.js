import {HashLocator} from '../index';

let point = (new Date).getTime();
let nextURL = () => '/' + (++point);
let currentURL = () => '/' + point;
let prevURL = () => '/' + (point - 1);



describe('Hash Locator', () => {
    let locator = null;

    beforeEach(done => {
        locator = new HashLocator();
        locator.start();
        location.hash = nextURL();

        setTimeout(() => {done();}, 50)
    });
    afterEach(() => {
        locator.stop();
        locator = null;
    });

    it('can read current correctly, when location.hash', done => {
        location.hash = nextURL();
        setTimeout(() => {
            expect(locator.current).toBe(currentURL());
            done();
        }, 50)

    });

    it('should emit redirect event on hash change', done => {
        locator.on('redirect', e => {
            expect(e.url).toBe(currentURL());
            expect(e.referrer).toBe(prevURL());
            setTimeout(() => {done();}, 1)
        });
        location.hash = nextURL();
    });

    it('should emit redirect event when redirect is called', done => {
        locator.on('redirect', e => {
            expect(e.url).toBe(currentURL());
            expect(e.referrer).toBe(prevURL());

            setTimeout(() => {done();}, 1)
        });
        locator.redirect(nextURL());
    });

    it('should emit redirect event when redirect is called with relative path', done => {

        locator.redirect(nextURL() + '/level1/level2/level3');
        setTimeout(() => {
            locator.on('redirect', e => {
                expect(e.url).toBe(currentURL() + '/a/b');
                expect(e.referrer).toBe(currentURL() + '/level1/level2/level3');

                setTimeout(() => {done();}, 1)
            });

            locator.redirect('../../a/b');
        }, 1)
    });

     it('should not emit redirect event when redirect is called with same url and force option', done => {
        let onRedirect = jasmine.createSpy('redirect');
        locator.on('redirect', onRedirect);
        locator.redirect(currentURL());
        setTimeout(() => {
            expect(onRedirect).not.toHaveBeenCalled();
            done();
        }, 0);
    });

     it('should emit redirect event when redirect is called with same url and force option', done => {
        locator.on('redirect', e => {
            expect(e.url).toBe(currentURL());
            expect(e.referrer).toBe(prevURL());

            setTimeout(() => {done();}, 1)
        });
        locator.redirect(currentURL(), {force: true});
    });

     it('should not emit redirect event when redirect is called with silent option', done => {
        let onRedirect = jasmine.createSpy('redirect');
        locator.on('redirect', onRedirect);
        locator.redirect(nextURL(), {silent: true});
        setTimeout(() => {
            expect(onRedirect).not.toHaveBeenCalled();
            done();
        }, 0);
    });

     it('should emit redirect event when reload is called', done => {
        locator.on('redirect', e => {
            expect(e.url).toBe(currentURL());
            expect(e.referrer).toBe(prevURL());

            setTimeout(() => {done();}, 1)
        });
        locator.reload();
    });
});

