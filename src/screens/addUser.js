import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../api/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { HOST_BASE_URL } from '../api/config';
import { theme } from '../theme';
import ThemedText from '../components/ThemedText';
import ThemedCard from '../components/ThemedCard';

export function AddUSer({ navigation, route }) {
  const { user } = useUser();
  const [items, setItems] = useState([]);

  async function loadFriendList(text) {
    try {
      const data = await api.post('load_user.php', {
        userJSONText: JSON.stringify(user),
        text: '',
      });
      setItems(data);
    } catch (error) {
      console.error('Failed to load user list:', error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      loadFriendList();
      const interval = setInterval(loadFriendList, 3000);
      return () => clearInterval(interval);
    }, [user])
  );

  const ui = (
    <SafeAreaView style={styles.home}>
      <StatusBar
        hidden={false}
        backgroundColor="#fffffa"
        barStyle="dark-content"
        translucent={true}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={GroupDetails} style={styles.backBtn}>
          <Icon name="chevron-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <Image
          source={{ uri: HOST_BASE_URL + route.params.img }}
          style={styles.headerImage}
        />
        <View style={styles.headerTitleContainer}>
          <ThemedText type="subheading" weight="bold" numberOfLines={1}>{route.params.name}</ThemedText>
          <ThemedText type="caption" color="textSecondary">Add new members</ThemedText>
        </View>
      </View>

      <FlatList data={items} renderItem={ItemUI} />
    </SafeAreaView>
  );

  function ItemUI({ item, index }) {
    const ui = (
      <TouchableOpacity onPress={m}>
        <ThemedCard
          style={styles.item}
          animation={'fadeInUp'}
          duration={600}
          delay={index * 50}>
          <Image
            source={{ uri: HOST_BASE_URL + `${item.pic}` }}
            style={styles.itemImage}
          />
          <View style={styles.itemView1}>
            <ThemedText type="subheading" weight="semiBold" color="textMain">{item.name}</ThemedText>
            {item.chatStatusId == 1 ? (
              <ThemedText type="small" color="textSecondary" numberOfLines={1}>{item.msg}</ThemedText>
            ) : item.chatStatusId == 2 ? (
              <View style={styles.imageIconRow}>
                <Icon name="image-outline" size={16} color={theme.colors.textSecondary} />
                <ThemedText type="small" color="textSecondary" style={{ marginLeft: 4 }}>Photo</ThemedText>
              </View>
            ) : (
              <ThemedText type="small" color="textLight">Tap to message</ThemedText>
            )}
          </View>
          <View style={styles.itemView2}>
            <ThemedText type="caption" color="textLight">{item.time}</ThemedText>
            {parseInt(item.count) > 0 && (
              <View style={styles.badge}>
                <ThemedText type="caption" weight="bold" color="textOnPrimary">{item.count}</ThemedText>
              </View>
            )}
          </View>
        </ThemedCard>
      </TouchableOpacity>
    );

    return ui;

    async function m() {
      try {
        const responseText = await api.post('addUser.php', {
          userId: item.id,
          groupId: route.params.id,
        });

        if (responseText == 'This User is Already in the group') {
          Alert.alert('Message', responseText);
        } else {
          GroupDetails();
        }
      } catch (error) {
        console.error('Failed to add user to group:', error);
      }
    }
  }

  function GroupDetails() {
    const obj = {
      name: route.params.name,
      id: route.params.id,
      img: route.params.img,
    };

    navigation.navigate('GroupUserDetails', obj);
  }

  useEffect(() => {
    loadFriendList();
  }, []);

  return ui;
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.s,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.cardBackground,
  },
  backBtn: {
    padding: theme.spacing.s,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.inputBackground,
    marginLeft: theme.spacing.s,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: theme.spacing.s,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    marginHorizontal: theme.spacing.m,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.inputBackground,
  },
  itemView1: {
    flex: 1,
    marginLeft: theme.spacing.m,
    justifyContent: 'center',
  },
  itemView2: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  imageIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: theme.colors.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  listContent: {
    paddingVertical: theme.spacing.m,
  },
});
