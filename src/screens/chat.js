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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable';
import { API_BASE_URL, HOST_BASE_URL } from '../api/config';
import api from '../api/api';
import { theme } from '../theme';
import ThemedText from '../components/ThemedText';

export function Chat({ route, navigation }) {
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState([]);
  const [chat, setChat] = useState('');
  const [loading, setLoading] = useState(false);
  const listViewRef = useRef(null);

  // Safeguard params
  const { id, name, img } = route.params || {};

  const loadChatHistory = useCallback(async () => {
    if (!id || !user?.id) return;

    try {
      const data = await api.post('load_chat.php', {
        id1: user.id,
        id2: id,
      });

      // Prevent flickering by only updating if data changed
      setChatHistory(prev => {
        if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
        return data;
      });
    } catch (error) {
      console.error('Failed to load chat history:', error);
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
        to_user_id: id,
        message: chat,
      };

      await api.post('saveChat.php', {
        requsetJson: JSON.stringify(requestObject),
      });
      setChat('');
      loadChatHistory();
    } catch (error) {
      console.error('Send message error:', error);
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
    formData.append('pageId', "1"); // As per saveImageChat.php logic
    formData.append('img', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.fileName || `chat_${Date.now()}.jpg`,
    });

    setLoading(true);
    try {
      await api.upload('saveImageChat.php', formData);
      loadChatHistory();
    } catch (error) {
      console.error('Upload image error:', error);
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

  const takePhoto = async () => {
    const result = await launchCamera({ mediaType: 'photo', quality: 0.7 });
    if (result.assets) {
      uploadImage(result.assets[0]);
    }
  };

  const renderChatItem = ({ item }) => {
    const isMe = item.side === 'right';
    // Match backend keys: msg and chatStatusId
    const isText = item.chatStatusId == 1;

    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          {isText ? (
            <ThemedText color={isMe ? 'textOnPrimary' : 'textMain'}>
              {item.msg}
            </ThemedText>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('ChatImage', { imgage: item.msg })}
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
            {isMe && (
              <Icon
                name={item.status === 'seen' ? "checkmark-done" : "checkmark"}
                size={14}
                color={isMe ? 'rgba(255,255,255,0.7)' : theme.colors.textLight}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <Image source={{ uri: HOST_BASE_URL + img }} style={styles.headerAvatar} />
        <View style={styles.headerTitleContainer}>
          <ThemedText type="subheading" weight="bold" numberOfLines={1}>{name}</ThemedText>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <ThemedText type="caption" color="textSecondary">Active now</ThemedText>
          </View>
        </View>
        <TouchableOpacity style={styles.headerActionBtn}>
          <Icon name="call-outline" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerActionBtn}>
          <Icon name="videocam-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            ref={listViewRef}
            data={chatHistory}
            renderItem={renderChatItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => chatHistory.length > 0 && listViewRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.actionBtn}>
            <Icon name="image-outline" size={26} color={theme.colors.primary} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={chat}
              onChangeText={setChat}
              multiline
              maxLength={1000}
            />
          </View>
          <TouchableOpacity
            onPress={chat.trim() ? sendMessage : takePhoto}
            style={styles.sendBtn}
            disabled={loading}
          >
            <Icon
              name={chat.trim() ? "send" : "camera-outline"}
              size={24}
              color={theme.colors.primary}
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
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.cardBackground,
  },
  backBtn: {
    padding: theme.spacing.xs,
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: 4,
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
  messageContainer: {
    marginVertical: 4,
    maxWidth: '85%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
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
