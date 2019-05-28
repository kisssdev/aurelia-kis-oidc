import { UserPrompt } from '../../src/user-prompt';
import { defaultReconnectPrompt } from '../../src/constants';

describe('UserPrompt', () => {
  describe('ctor()', () => {
    test('defines "reconnectPrompt" as defaultReconnectPrompt when none is specified in configuration', () => {
      const expectedReconnectPrompt = defaultReconnectPrompt;
      const configuration = {};
      const result = new UserPrompt(configuration);
      expect(result.reconnectPrompt).toBe(expectedReconnectPrompt);
    });

    test('defines "reconnectPrompt" as configuration.reconnectPrompt', () => {
      const expectedReconnectPrompt = () => {};
      const configuration = { reconnectPrompt: expectedReconnectPrompt };
      const result = new UserPrompt(configuration);
      expect(result.reconnectPrompt).toBe(expectedReconnectPrompt);
    });
  });
});
