/* eslint-disable no-undef */
// Global mocks for native / Expo modules that the in-scope (non-UI) code imports.
// Only the modules actually pulled in by utils / hooks / query-hooks / api /
// contexts / constants are mocked here.

// --- AsyncStorage: use the official jest mock shipped with the package ---
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// --- expo-local-authentication (utils/helper.js) ---
jest.mock('expo-local-authentication', () => ({
  authenticateAsync: jest.fn(async () => ({ success: true })),
  hasHardwareAsync: jest.fn(async () => true),
  isEnrolledAsync: jest.fn(async () => true),
  supportedAuthenticationTypesAsync: jest.fn(async () => [1, 2]),
}));

// --- expo-router (api/send-api-request, contexts/AuthContext, NotificationContext) ---
jest.mock('expo-router', () => {
  const replace = jest.fn();
  const push = jest.fn();
  const back = jest.fn();
  const navigate = jest.fn();
  return {
    __esModule: true,
    router: { replace, push, back, navigate },
    useRouter: () => ({ replace, push, back, navigate }),
    Redirect: () => null,
    Link: 'Link',
    useLocalSearchParams: () => ({}),
    usePathname: () => '/',
  };
});

// --- @react-native-firebase/messaging (contexts/NotificationContext) ---
jest.mock('@react-native-firebase/messaging', () => {
  const instance = {
    hasPermission: jest.fn(async () => 1),
    requestPermission: jest.fn(async () => 1),
    registerDeviceForRemoteMessages: jest.fn(async () => {}),
    isDeviceRegisteredForRemoteMessages: true,
    getToken: jest.fn(async () => 'fake-fcm-token-1234567890abcdef'),
    onMessage: jest.fn(() => jest.fn()),
    onNotificationOpenedApp: jest.fn(() => jest.fn()),
    getInitialNotification: jest.fn(async () => null),
    onTokenRefresh: jest.fn(() => jest.fn()),
  };
  const messaging = jest.fn(() => instance);
  messaging.AuthorizationStatus = {
    NOT_DETERMINED: -1,
    DENIED: 0,
    AUTHORIZED: 1,
    PROVISIONAL: 2,
  };
  // expose the shared instance for assertions/overrides
  messaging.__instance = instance;
  return { __esModule: true, default: messaging };
});

// --- expo-notifications (contexts/NotificationContext) ---
jest.mock('expo-notifications', () => ({
  __esModule: true,
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(async () => {}),
  requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(async () => 'local-notification-id'),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  AndroidImportance: { MAX: 5, HIGH: 4, DEFAULT: 3 },
  AndroidNotificationPriority: { HIGH: 'high', MAX: 'max', DEFAULT: 'default' },
}));

// Silence noisy console output from the modules under test.
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
