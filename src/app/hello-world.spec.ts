describe('Hello World Tests', () => {
    it('should return "Hello, World!"', () => {
        const helloWorld = () => 'Hello, World!';
        expect(helloWorld()).toBe('Hello, World!');
    });
});