export class FirebaseErrors {
  static Parse(errorCode: string): string {
    let message: string;

    switch (errorCode) {
      case 'auth/wrong-password':
        message = 'Wrong password!';
        break;
      case 'auth/user-not-found':
        message = 'No user found with this email address!';
        break;
      case 'auth/email-already-exists':
        message = 'Email already in use!';
        break;
      case 'auth/email-already-in-use':
        message = 'Email already in use!';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email!';
        break;
      case 'auth/network-request-failed':
        message = 'Network error!';
        break;
      case 'auth/too-many-requests':
        message = 'Too many requests! Take a break!';
        break;
      case 'auth/user-disabled':
        message = 'User disabled!';
        break;
      case 'auth/requires-recent-login':
        message = 'Perform a fresh login and try again!';
        break;
      case 'auth/expired-action-code':
        message = 'The action code has expired.';
        break;
      case 'auth/invalid-action-code':
        message = 'The action code is invalid.';
        break;
      case 'auth/expired-action-code':
        message = 'The action code has expired.';
        break;
      case 'auth/code-expired':
        message = 'The action code has expired.';
        break;
      case 'auth/credential-already-in-use':
        message = 'The email address is already in use by another account.';
        break;

      default:
        message = 'Oops! Something went wrong! Try again later!';
        break;
    }

    return message;
  }
}
