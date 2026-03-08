import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../api/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';
import { HOST_BASE_URL } from '../api/config';
import api from '../api/api';
import { theme } from '../theme';
import ThemedText from '../components/ThemedText';
import ThemedCard from '../components/ThemedCard';
import BottomNav from '../components/BottomNav';

const ImgPopUp = ({ visible, children, onClose }) => {
  return (
    <Modal transparent visible={visible !== '0'} animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>{children}</View>
      </TouchableOpacity>
    </Modal>
  );
};

export function Group({ navigation }) {
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [popUpData, setPopUpData] = useState({ visible: '0', name: '', id: '' });

  const loadGroupList = useCallback(async () => {
    try {
      const data = await api.post('load_group.php', {
        userJSONText: JSON.stringify(user),
        text: '',
      });
      setItems(prevItems => {
        if (JSON.stringify(prevItems) === JSON.stringify(data)) return prevItems;
        return data;
      });
    } catch (error) {
      console.error('Failed to load group list:', error);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadGroupList();
      const interval = setInterval(loadGroupList, 5000);
      return () => clearInterval(interval);
    }, [loadGroupList])
  );

  const ItemUI = React.memo(({ item, index }) => (
    <Animatable.View animation={'fadeInUp'} duration={600} delay={index * 50}>
      <TouchableOpacity
        onPress={() => navigation.navigate('GroupChat', { name: item.name, id: item.id, img: item.pic })}
        activeOpacity={0.7}
      >
        <ThemedCard style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() => setPopUpData({ visible: item.pic, name: item.name, id: item.id })}
            activeOpacity={0.9}
          >
            <Image source={{ uri: HOST_BASE_URL + item.pic }} style={styles.itemImage} />
          </TouchableOpacity>

          <View style={styles.itemContent}>
            <ThemedText type="subheading" weight="semiBold" color="textMain">{item.name}</ThemedText>
            <View style={styles.messageRow}>
              {(item.chatStatusId == 2 || (item.msg && (item.msg.includes('/upload/') || item.msg.includes('/postUpload/') || item.msg.includes('/groupImg/')))) ? (
                <View style={styles.imageIconRow}>
                  <Icon name="image-outline" size={16} color={theme.colors.textSecondary} />
                  <ThemedText type="small" color="textSecondary" style={{ marginLeft: 4 }}>Photo</ThemedText>
                </View>
              ) : (
                <ThemedText type="small" color="textSecondary" numberOfLines={1}>
                  {item.msg || 'No messages yet'}
                </ThemedText>
              )}
            </View>
          </View>

          <View style={styles.itemMeta}>
            <ThemedText type="caption" color="textLight">{item.time}</ThemedText>
            {parseInt(item.count) > 0 && (
              <View style={styles.badge}>
                <ThemedText type="caption" weight="bold" color="textOnPrimary">{item.count}</ThemedText>
              </View>
            )}
          </View>
        </ThemedCard>
      </TouchableOpacity>
    </Animatable.View>
  ));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" translucent />

      <View style={styles.header}>
        <ThemedText type="title" color="primary">Groups</ThemedText>
        <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')}>
          <Icon name="add-circle-outline" size={32} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('GroupSearch')}
        activeOpacity={0.8}
      >
        <Icon name="search-outline" size={20} color={theme.colors.textLight} style={styles.searchIcon} />
        <ThemedText color="textLight">Search groups...</ThemedText>
      </TouchableOpacity>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Animatable.Text animation="fadeIn" style={styles.emptyText}>You haven't joined any groups yet</Animatable.Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={({ item, index }) => <ItemUI item={item} index={index} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ImgPopUp visible={popUpData.visible} onClose={() => setPopUpData({ ...popUpData, visible: '0' })}>
        <ThemedCard style={styles.popUpCard}>
          <TouchableOpacity onPress={() => { navigation.navigate('ChatImage', { imgage: popUpData.visible }); setPopUpData({ ...popUpData, visible: '0' }); }} activeOpacity={0.9}>
            <Image source={{ uri: HOST_BASE_URL + popUpData.visible }} style={styles.homeImg2} resizeMode={'cover'} />
          </TouchableOpacity>
          <View style={styles.popUpFooter}>
            <TouchableOpacity onPress={() => { navigation.navigate('GroupChat', { name: popUpData.name, id: popUpData.id, img: popUpData.visible }); setPopUpData({ ...popUpData, visible: '0' }); }} style={styles.imgPopUpBnt}>
              <Icon name="chatbubbles-outline" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('GroupUserDetails', { name: popUpData.name, id: popUpData.id, img: popUpData.visible }); setPopUpData({ ...popUpData, visible: '0' }); }} style={styles.imgPopUpBnt}>
              <Icon name="people-outline" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </ThemedCard>
      </ImgPopUp>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.m,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBackground,
    marginHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.spacing.borderRadiusLarge,
    marginBottom: theme.spacing.m,
  },
  searchIcon: {
    marginRight: theme.spacing.s,
  },
  listContent: {
    paddingBottom: 100,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    marginHorizontal: theme.spacing.m,
  },
  itemImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: theme.colors.inputBackground,
  },
  itemContent: {
    flex: 1,
    marginLeft: theme.spacing.m,
    justifyContent: 'center',
  },
  messageRow: {
    marginTop: 2,
  },
  imageIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    alignItems: 'center',
  },
  popUpCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: theme.spacing.borderRadiusLarge,
  },
  homeImg2: {
    width: 280,
    height: 280,
  },
  popUpFooter: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    width: 280,
    height: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imgPopUpBnt: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
