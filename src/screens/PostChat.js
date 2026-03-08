import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
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
import * as Animatable from 'react-native-animatable';
import api from '../api/api';
import { theme } from '../theme';
import ThemedText from '../components/ThemedText';

export function PostChat({ route, navigation }) {
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState([]);
  const [chat, setChat] = useState('');
  const listViewRef = useRef(null);

  const { postId } = route.params || {};

  const loadChatHistory = useCallback(async () => {
    if (!postId || !user?.id) return;

    try {
      const data = await api.post('post_chat.php', {
        userId: user.id,
        postId: postId,
      });

      setChatHistory(prev => {
        if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
        return data;
      });
    } catch (error) {
      console.error('Failed to load post chat history:', error);
    }
  }, [user?.id, postId]);

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
        userId: user.id,
        postId: postId,
        message: chat,
      };

      await api.post('savePostChat.php', {
        requsetJson: JSON.stringify(requestObject),
      });
      setChat('');
      loadChatHistory();
    } catch (error) {
      console.error('Send post comment error:', error);
      Alert.alert('Error', 'Failed to send comment');
    }
  };

  const renderChatItem = ({ item }) => {
    const isMe = item.side === 'right';

    return (
      <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.theirMessageWrapper]}>
        {!isMe && (
          <ThemedText type="caption" color="textSecondary" style={styles.senderName}>
            {item.name}
          </ThemedText>
        )}
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <ThemedText color={isMe ? 'textOnPrimary' : 'textMain'}>
            {item.msg}
          </ThemedText>
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
        <View style={styles.headerTitleContainer}>
          <ThemedText type="subheading" weight="bold" numberOfLines={1}>Comments</ThemedText>
          <ThemedText type="caption" color="textSecondary">Discussing this post</ThemedText>
        </View>
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText color="textLight">No comments yet. Be the first!</ThemedText>
            </View>
          }
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              value={chat}
              onChangeText={setChat}
              multiline
              maxLength={1000}
            />
          </View>
          <TouchableOpacity
            onPress={sendMessage}
            style={styles.sendBtn}
            disabled={!chat.trim()}
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
  headerTitleContainer: {
    flex: 1,
    marginLeft: theme.spacing.s,
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
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  }
});
