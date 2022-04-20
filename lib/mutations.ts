import fetcher from './fethcer';

// its gonna take in two things
export const auth = (mode: 'signin' | 'signup', body: { email: string; password: string }) => {
  return fetcher(`${mode}`, body);
};
