import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../api/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable';
import { API_BASE_URL, HOST_BASE_URL } from '../api/config';
import api from '../api/api';
import { theme } from '../theme';
import ThemedText from '../components/ThemedText';

export function GroupChat({ route, navigation }) {
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState([]);
  const [chat, setChat] = useState('');
  const [loading, setLoading] = useState(false);
  const listViewRef = useRef(null);

  const { id, name, img } = route.params || {};

  const loadChatHistory = useCallback(async () => {
    if (!id || !user?.id) return;

    try {
      const data = await api.post('group_chat.php', {
        id1: user.id,
        id2: id,
      });

      setChatHistory(prev => {
        if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
        return data;
      });
    } catch (error) {
      console.error('Failed to load group chat history:', error);
    }
  }, [user?.id, id]);

  useFocusEffect(
    useCallback(() => {
      loadChatHistory();
      const interval = setInterval(loadChatHistory, 5000);
      return () => clearInterval(interval);
    }, [loadChatHistory])
  );

  const sendMessage = async () => {
    if (!chat.trim()) return;

    try {
      const requestObject = {
        from_user_id: user.id,
        to_user_id: id, // In group chat, to_user_id is the Group ID
        message: chat,
      };

      await api.post('saveGroupChat.php', {
        requsetJson: JSON.stringify(requestObject),
      });
      setChat('');
      loadChatHistory();
    } catch (error) {
      console.error('Send group message error:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const uploadImage = async (image) => {
    const requestObject = {
      from_user_id: user.id,
      to_user_id: id,
    };

    const formData = new FormData();
    formData.append('requsetJson', JSON.stringify(requestObject));
    // saveGroupImgChat.php uses 'img' for the file
    formData.append('img', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.fileName || `group_chat_${Date.now()}.jpg`,
    });

    setLoading(true);
    try {
      await api.upload('saveGroupImgChat.php', formData);
      loadChatHistory();
    } catch (error) {
      console.error('Upload group image error:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    if (result.assets) {
      uploadImage(result.assets[0]);
    }
  };

  const renderChatItem = ({ item }) => {
    const isMe = item.side === 'right';
    // Match group_chat.php keys: msg and chatStatusId
    const isText = item.chatStatusId == 1;

    return (
      <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.theirMessageWrapper]}>
        {!isMe && (
          <ThemedText type="caption" color="textSecondary" style={styles.senderName}>
            {item.name}
          </ThemedText>
        )}
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          {isText ? (
            <ThemedText color={isMe ? 'textOnPrimary' : 'textMain'}>
              {item.msg}
            </ThemedText>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('ChatImage', { imgage: item.msg, name, id, img, pageId: '2' })}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: HOST_BASE_URL + item.msg }}
                style={styles.chatImageContent}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          <View style={styles.timeRow}>
            <ThemedText type="caption" color={isMe ? 'textOnPrimary' : 'textLight'} style={styles.timeText}>
              {item.time}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <Image source={{ uri: HOST_BASE_URL + img }} style={styles.headerAvatar} />
        <TouchableOpacity
          style={styles.headerTitleContainer}
          onPress={() => navigation.navigate('GroupUserDetails', { name, id, img })}
        >
          <ThemedText type="subheading" weight="bold" numberOfLines={1}>{name}</ThemedText>
          <ThemedText type="caption" color="textSecondary">Tap for group info</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerActionBtn}>
          <Icon name="people-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={listViewRef}
          data={chatHistory}
          renderItem={renderChatItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => chatHistory.length > 0 && listViewRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.actionBtn}>
            <Icon name="image-outline" size={26} color={theme.colors.primary} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Message group..."
              value={chat}
              onChangeText={setChat}
              multiline
              maxLength={1000}
            />
          </View>
          <TouchableOpacity
            onPress={sendMessage}
            style={styles.sendBtn}
            disabled={!chat.trim() || loading}
          >
            <Icon
              name="send"
              size={24}
              color={chat.trim() ? theme.colors.primary : theme.colors.textLight}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.cardBackground,
  },
  backBtn: {
    padding: theme.spacing.s,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.inputBackground,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: theme.spacing.s,
  },
  headerActionBtn: {
    padding: theme.spacing.s,
  },
  keyboardView: {
    flex: 1,
  },
  listContent: {
    padding: theme.spacing.m,
    paddingBottom: theme.spacing.l,
  },
  messageWrapper: {
    marginVertical: 4,
    maxWidth: '85%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
  },
  theirMessageWrapper: {
    alignSelf: 'flex-start',
  },
  senderName: {
    marginLeft: 4,
    marginBottom: 2,
    fontSize: 11,
  },
  bubble: {
    padding: theme.spacing.s,
    borderRadius: theme.spacing.borderRadiusLarge,
    minWidth: 80,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  myBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomLeftRadius: 4,
  },
  chatImageContent: {
    width: 220,
    height: 220,
    borderRadius: theme.spacing.borderRadiusMedium,
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  timeText: {
    fontSize: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.s,
    backgroundColor: theme.colors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionBtn: {
    padding: theme.spacing.s,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 22,
    marginHorizontal: theme.spacing.xs,
    paddingHorizontal: theme.spacing.m,
    maxHeight: 120,
  },
  input: {
    paddingVertical: theme.spacing.xs,
    fontSize: 16,
    color: theme.colors.textMain,
    minHeight: 40,
  },
  sendBtn: {
    padding: theme.spacing.s,
  }
});
