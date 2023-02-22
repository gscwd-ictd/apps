export const GenerateCaptcha = () => {
  // const fonts = ['cursive', 'sans-serif', 'serif', 'monospace'];
  let captcha = '';
  const possible = 'ABDEFGHJLMNPQRTUYabdefghjmnpqrtuy0123456789';

  for (let i = 0; i < 6; i++)
    captcha += possible.charAt(Math.floor(Math.random() * possible.length));
  const captchaArray = captcha.split('');

  return {
    pwd: captcha,
    captcha: captchaArray,
  };
};
