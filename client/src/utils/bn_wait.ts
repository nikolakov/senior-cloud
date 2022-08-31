const bn_wait: (ms?: number) => Promise<void> = ms =>
  new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });

export default bn_wait;
