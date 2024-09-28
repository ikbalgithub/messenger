import { SentByOwnPipe } from './sent-by-own.pipe';

describe('SentByOwnPipe', () => {
  it('create an instance', () => {
    const pipe = new SentByOwnPipe();
    expect(pipe).toBeTruthy();
  });
});
