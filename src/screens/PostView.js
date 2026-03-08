import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  FlatList,
  TouchableOpacity,
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

export function PostView({ navigation }) {
  const { user } = useUser();
  const [items, setItems] = useState([]);

  const loadPosts = useCallback(async () => {
    try {
      const data = await api.post('post.php', {
        userId: user.id,
        pageId: '1',
        id: '1',
      });
      setItems(prevItems => {
        if (JSON.stringify(prevItems) === JSON.stringify(data)) return prevItems;
        return data;
      });
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
      const interval = setInterval(loadPosts, 5000);
      return () => clearInterval(interval);
    }, [loadPosts])
  );

  const renderPost = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" duration={800} delay={index * 100}>
      <ThemedCard style={styles.postCard}>
        <View style={styles.postHeader}>
          <Image
            source={{ uri: HOST_BASE_URL + item.profilePic }}
            style={styles.postAvatar}
          />
          <View style={styles.postHeaderInfo}>
            <ThemedText weight="bold">{item.useName}</ThemedText>
            <ThemedText type="caption" color="textLight">{item.time}</ThemedText>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ChatImage', { imgage: item.pic, pageId: '3' })}
        >
          <Image
            source={{ uri: HOST_BASE_URL + item.pic }}
            style={styles.postImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={styles.postFooter}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => postAction(item)}>
              <Icon
                name={item.postStatus === '1' ? "heart" : "heart-outline"}
                size={26}
                color={item.postStatus === '1' ? theme.colors.error : theme.colors.textMain}
              />
              <ThemedText style={styles.actionCount} color={item.postStatus === '1' ? 'error' : 'textMain'}>
                {item.PostLikeCount}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('PostChat', { postId: item.id })}>
              <Icon name="chatbubble-outline" size={24} color={theme.colors.textMain} />
            </TouchableOpacity>
          </View>

          <View style={styles.captionContainer}>
            <ThemedText type="small" color="primary" weight="semiBold">#{item.name}</ThemedText>
          </View>
        </View>
      </ThemedCard>
    </Animatable.View>
  );

  async function postAction(item) {
    try {
      await api.post('postStatus.php', {
        userId: user.id,
        postId: item.id,
        postStatus: item.postStatus,
        longPress: '1',
      });
      loadPosts();
    } catch (error) {
      console.error('Action failed:', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <ThemedText type="title" color="primary">Explore</ThemedText>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddPost')}>
          <Icon name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderPost}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

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
    paddingVertical: theme.spacing.m,
  },
  addBtn: {
    backgroundColor: theme.colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  listContent: {
    paddingBottom: 100,
  },
  postCard: {
    marginHorizontal: theme.spacing.m,
    marginVertical: theme.spacing.s,
    padding: 0,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.inputBackground,
  },
  postHeaderInfo: {
    marginLeft: theme.spacing.s,
    flex: 1,
  },
  postImage: {
    width: '100%',
    height: 350,
    backgroundColor: theme.colors.inputBackground,
  },
  postFooter: {
    padding: theme.spacing.m,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.l,
  },
  actionCount: {
    marginLeft: 6,
  },
  captionContainer: {
    marginTop: theme.spacing.s,
  },
});
