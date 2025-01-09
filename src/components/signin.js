import { Auth } from 'aws-amplify';

async function signIn(username, password) {
    try {
      const user = await Auth.signIn(username, password);
      console.log('Sign in success:', user);
    } catch (error) {
      console.log('Error signing in:', error);
    }
  }
  
