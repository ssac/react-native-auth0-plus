import Auth0Plus from '../index';

test('Test if can create client instance', async () => {
  const auth0Plus = new Auth0Plus('<client-id>', '<domain>');
  console.log(auth0Plus);
  expect(!!auth0Plus).toBeTruthy();
});
