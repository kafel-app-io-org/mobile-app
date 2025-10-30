import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export const Header = () => {
  return (
    <View style={headerStyles.container}>
      <View style={{}}>
        <Text style={headerStyles.hello}>Have a good day!</Text>
        <Text style={headerStyles.userName}>Eman 👋</Text>
      </View>
      <TouchableOpacity onPress={() => console.log('Open menu')}>
        <Ionicons name="menu" size={28} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    height: 150,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 80 : 30,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  hello: {
    fontSize: 14,
    fontWeight: '400',
    color: '#202226',
    marginBottom: 6,
  },

  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202226',
  },
});

// export default Header;