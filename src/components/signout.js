import { Auth } from 'aws-amplify';

async function signOut() {
    try {
      await Auth.signOut();
      console.log('Sign out success');
    } catch (error) {
      console.log('Error signing out:', error);
    }
  }
  
  
