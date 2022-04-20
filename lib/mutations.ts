import fetcher from './fethcer';

// its gonna take in two things
export const auth = (mode: 'signin' | 'signup', body: { email: String; password: String }) => {
  return fetcher(`${mode}`, body);
};
