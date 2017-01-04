import HTML5Locator from '../src/locator/html5';

describe('HTML5 Locator', () => {
    let locator = null;

    beforeEach(() => {
        locator = new HTML5Locator();
        locator.start();
    });
    afterEach(() => {
        locator.stop();
        locator = null;
    });

    it('should be a class', () => {
        expect(typeof HTML5Locator).toBe('function');
    });

    if (!HTML5Locator.isSupport) {
        it('is not supported', () => {
            expect(typeof HTML5Locator).toBe('function');
        });

        return;
    }

    let pathname = window.location.pathname;

    it('should emit redirect event when redirect method is called', done => {
        let onRedirect = e => {
            expect(e.url).toBe('/test/h5-locator.html');
            expect(e.referrer).toBe(pathname);
            locator.un('redirect', onRedirect);
            history.back();
            setTimeout(() => {done()}, 200);
        };
        locator.on('redirect', onRedirect);
        locator.redirect('/test/h5-locator.html');
    });

    it('should emit redirect event when redirect method is called with relative path', done => {
        let onRedirect = e => {
            expect(e.url).toBe('/test/h5-locator.html');
            expect(e.referrer).toBe(pathname);
            locator.un('redirect', onRedirect);
            history.back();
            setTimeout(() => {done()}, 200);
        };
        locator.on('redirect', onRedirect);
        locator.redirect('h5-locator.html');
    });

    it('should emit redirect event when history.back is called', done => {
        let onRedirect = e => {
            expect(e.referrer).toBe('/test/h5-locator.html');
            expect(e.url).toBe(pathname);

            locator.un('redirect', onRedirect);
            setTimeout(() => {done()}, 200);
        };

        locator.redirect('/test/h5-locator.html');
        locator.on('redirect', onRedirect);
        window.history.back();
    });

    it('should emit redirect event when reload is called', done => {
        let onRedirect = e => {
            expect(e.referrer).toBe(pathname);
            expect(e.url).toBe('/test/h5-locator.html');

            locator.un('redirect', onRedirect);
            history.back();
            setTimeout(() => {done()}, 200);
        };

        locator.redirect('/test/h5-locator.html');
        locator.on('redirect', onRedirect);
        locator.reload();
    });

});
