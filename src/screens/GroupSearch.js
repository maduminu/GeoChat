import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../api/UserContext';
import * as Animatable from 'react-native-animatable';
import { HOST_BASE_URL } from '../api/config';
import api from '../api/api';
import { theme } from '../theme';
import ThemedText from '../components/ThemedText';
import ThemedInput from '../components/ThemedInput';
import ThemedCard from '../components/ThemedCard';

export function GroupSearch({ navigation }) {
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState('');

  const loadGroupList = useCallback(async (text) => {
    try {
      const data = await api.post('load_group.php', {
        userJSONText: JSON.stringify(user),
        text: text,
      });
      setItems(data);
    } catch (error) {
      console.error('Failed to search groups:', error);
    }
  }, [user]);

  useEffect(() => {
    loadGroupList('');
  }, [loadGroupList]);

  const ItemUI = ({ item, index }) => (
    <Animatable.View animation={'fadeInUp'} duration={600} delay={index * 50}>
      <TouchableOpacity
        onPress={() => {
          const obj = {
            name: item.name,
            id: item.id,
            img: item.pic,
          };
          navigation.navigate('GroupChat', obj);
        }}
        activeOpacity={0.7}
      >
        <ThemedCard style={styles.itemContainer}>
          <Image
            source={{ uri: HOST_BASE_URL + item.pic }}
            style={styles.itemImage}
          />
          <View style={styles.itemContent}>
            <ThemedText type="subheading" weight="semiBold" color="textMain">
              {item.name}
            </ThemedText>
            {(item.chatStatusId == 2 || (item.msg && (item.msg.includes('/upload/') || item.msg.includes('/postUpload/') || item.msg.includes('/groupImg/')))) ? (
              <View style={styles.imageIconRow}>
                <Icon name="image-outline" size={16} color={theme.colors.textSecondary} />
                <ThemedText type="small" color="textSecondary" style={{ marginLeft: 4 }}>Photo</ThemedText>
              </View>
            ) : (
              <ThemedText type="small" color="textSecondary" numberOfLines={1}>
                {item.msg || 'Join the conversation'}
              </ThemedText>
            )}
          </View>
          <Icon name="chevron-forward" size={20} color={theme.colors.textLight} />
        </ThemedCard>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <View style={styles.searchWrapper}>
          <ThemedInput
            icon="search-outline"
            placeholder="Search groups..."
            onChangeText={(text) => {
              setSearchText(text);
              loadGroupList(text);
            }}
            value={searchText}
            style={styles.input}
          />
        </View>
      </View>

      <FlatList
        data={items}
        renderItem={({ item, index }) => <ItemUI item={item} index={index} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="chatbubbles-outline" size={60} color={theme.colors.textLight} />
            <ThemedText color="textLight" style={{ marginTop: 10 }}>No groups found</ThemedText>
          </View>
        }
      />
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
    paddingHorizontal: theme.spacing.s,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.s,
  },
  backBtn: {
    padding: theme.spacing.s,
  },
  searchWrapper: {
    flex: 1,
    marginRight: theme.spacing.m,
  },
  listContent: {
    padding: theme.spacing.m,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.inputBackground,
  },
  itemContent: {
    flex: 1,
    marginLeft: theme.spacing.m,
  },
  imageIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  }
});
