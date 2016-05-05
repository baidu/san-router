import Locator from 'Locator';

let point = 0x861005;
let uid = () => (point++).toString();
let current = () => point.toString();

describe('Locator', () => {
    let locator = null;

    beforeEach(() => {
        locator = new Locator();
        locator.start()
    });
    afterEach(() => locator.stop());

    it('should be a class', () => {
        expect(typeof Locator).toBe('function');
    });

    it('should emit forward event on hash change', done => {
        let onForward = jasmine.createSpy('forward');
        locator.on('forward', onForward);
        location.hash = uid();
        setTimeout(() => {
            expect(onForward).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should emit redirect event on hash change', done => {
        let onRedirect = jasmine.createSpy('redirect');
        locator.on('redirect', onRedirect);
        location.hash = uid();
        setTimeout(() => {
            expect(onRedirect).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should emit forward event when redirect is called', done => {
        let onForward = jasmine.createSpy('forward');
        locator.on('forward', onForward);
        locator.redirect(uid());
        setTimeout(() => {
            expect(onForward).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should emit redirect event when redirect is called', done => {
        let onRedirect = jasmine.createSpy('redirect');
        locator.on('redirect', onRedirect);
        locator.redirect(uid());
        setTimeout(() => {
            expect(onRedirect).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should emit forward event when redirect is called with silent option', done => {
        let onForward = jasmine.createSpy('forward');
        locator.on('forward', onForward);
        locator.redirect(uid(), {silent: true});
        setTimeout(() => {
            expect(onForward).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should not emit redirect event when redirect is called with silent option', done => {
        let onRedirect = jasmine.createSpy('redirect');
        locator.on('redirect', onRedirect);
        locator.redirect(uid(), {silent: true});
        setTimeout(() => {
            expect(onRedirect).not.toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should emit forward event when redirect is called with same url and force option', done => {
        let onForward = jasmine.createSpy('forward');
        locator.on('forward', onForward);
        locator.redirect(current(), {force: true});
        setTimeout(() => {
            expect(onForward).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should emit redirect event when redirect is called with same url and force option', done => {
        let onRedirect = jasmine.createSpy('redirect');
        locator.on('redirect', onRedirect);
        locator.redirect(current(), {force: true});
        setTimeout(() => {
            expect(onRedirect).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should emit forward event when reload is called', done => {
        let onForward = jasmine.createSpy('forward');
        locator.on('forward', onForward);
        locator.reload();
        setTimeout(() => {
            expect(onForward).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should emit redirect event when reload is called', done => {
        let onRedirect = jasmine.createSpy('redirect');
        locator.on('redirect', onRedirect);
        locator.reload();
        setTimeout(() => {
            expect(onRedirect).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should map empty url to indexURL', () => {
        locator.indexURL = 'foo';
        expect(locator.resolveURL('')).toBe('foo');
    });

    it('should map root url to indexURL', () => {
        locator.indexURL = 'foo';
        expect(locator.resolveURL('/')).toBe('foo');
    });

    it('should map custom url mapping', () => {
        locator.urlMapping.set('foo', 'bar');
        expect(locator.resolveURL('foo')).toBe('bar');
    });
});
