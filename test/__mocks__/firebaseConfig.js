// Manual mock for ../firebaseConfig used across the app.
// The real module wires up @react-native-firebase / firebase web SDK which are
// native and cannot run under Jest. Tests only need a stable `auth` object.
export const auth = {
  currentUser: null,
  signOut: jest.fn(async () => {}),
};

export default { auth };
