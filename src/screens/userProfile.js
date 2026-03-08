import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  ImageBackground,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../api/UserContext';
import { useFocusEffect } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { API_BASE_URL, HOST_BASE_URL } from '../api/config';
import api from '../api/api';
import { theme } from '../theme';
import ThemedText from '../components/ThemedText';
import ThemedCard from '../components/ThemedCard';
import ThemedButton from '../components/ThemedButton';
import ThemedInput from '../components/ThemedInput';

export function UserProfile({ navigation, route }) {
  const { user, login } = useUser();
  const [items, setItems] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [editVisible, setEditVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  // Edit State
  const [name, setName] = useState(route.params.name);
  const [mobile, setMobile] = useState(route.params.mobile);
  const [about, setAbout] = useState(route.params.about);
  const [profileImage, setProfileImage] = useState(route.params.img);
  const [profileImageUrl, setProfileImageUrl] = useState(HOST_BASE_URL + route.params.img);
  const [country, setCountry] = useState(route.params.country);
  const [countries, setCountries] = useState(['Sri Lanka', 'India', 'America', 'Dubai']);

  const isOwnProfile = route.params.pageId == '1';

  async function loadPosts() {
    try {
      const params = {
        pageId: '2',
        id: isOwnProfile ? '1' : '2',
        userId: isOwnProfile ? user.id : route.params.id,
      };
      if (!isOwnProfile) {
        params.userId2 = user.id;
      }

      const data = await api.post('post.php', params);
      setItems(data);
      if (Array.isArray(data) && data.length > 0) {
        setPostCount(data[0].post || 0);
        setLikeCount(data[0].like || 0);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
      const interval = setInterval(loadPosts, 5000);
      return () => clearInterval(interval);
    }, [user, route.params.id])
  );

  const selectProfilePicture = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets) {
      const imageObject = {
        uri: result.assets[0].uri,
        name: 'profile.png',
        type: 'image/png',
      };
      setProfileImage(imageObject);
      setProfileImageUrl(imageObject.uri);
    }
  };

  const updateUser = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('name', name);
      formData.append('mobile', mobile);
      formData.append('about', about);
      formData.append('Contry', country === 'Sri Lanka' ? '1' : country === 'India' ? '2' : country === 'America' ? '3' : '4');
      formData.append('countryType', '1');

      if (typeof profileImage === 'string') {
        formData.append('img', profileImage);
        formData.append('imgType', '1');
      } else {
        formData.append('img', profileImage);
        formData.append('imgType', '2');
      }

      const response = await api.upload('update_user.php', formData);
      await login(response.user);
      setEditVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const renderPost = ({ item, index }) => (
    <ThemedCard style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: HOST_BASE_URL + item.profilePic }}
          style={styles.postAvatar}
        />
        <View style={styles.postHeaderInfo}>
          <ThemedText weight="bold">{route.params.name}</ThemedText>
          <ThemedText type="caption" color="textLight">{item.time}</ThemedText>
        </View>
      </View>
      <Image
        source={{ uri: HOST_BASE_URL + item.pic }}
        style={styles.postImage}
        resizeMode="cover"
      />
      <View style={styles.postFooter}>
        <View style={styles.interactionRow}>
          <Icon name="heart" size={24} color={theme.colors.error} />
          <ThemedText style={{ marginLeft: 6 }}>{item.PostLikeCount}</ThemedText>
        </View>
        <ThemedText type="small" color="primary" style={{ marginTop: 8 }}>
          #{item.name}
        </ThemedText>
      </View>
    </ThemedCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerCover}>
          <ImageBackground
            source={{ uri: `${API_BASE_URL}/image/background2.jpg` }}
            style={styles.coverImage}
            blurRadius={2}
          >
            <View style={styles.navBar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="chevron-back" size={28} color="#ffffff" />
              </TouchableOpacity>
              <ThemedText weight="bold" color="textOnPrimary" type="subheading">Profile</ThemedText>
              {isOwnProfile ? (
                <TouchableOpacity onPress={() => setEditVisible(true)}>
                  <ThemedText color="textOnPrimary" weight="semiBold">Edit</ThemedText>
                </TouchableOpacity>
              ) : <View style={{ width: 40 }} />}
            </View>
          </ImageBackground>

          <View style={styles.profileSummary}>
            <View style={styles.avatarBorder}>
              <Image
                source={{ uri: HOST_BASE_URL + route.params.img }}
                style={styles.mainAvatar}
              />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText type="heading" weight="bold">{route.params.name}</ThemedText>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <ThemedText weight="bold">{postCount}</ThemedText>
                  <ThemedText type="caption" color="textSecondary">Posts</ThemedText>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <ThemedText weight="bold">{likeCount}</ThemedText>
                  <ThemedText type="caption" color="textSecondary">Likes</ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Tab Selection */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, !detailsVisible && styles.activeTab]}
            onPress={() => setDetailsVisible(false)}
          >
            <ThemedText weight="semiBold" color={!detailsVisible ? 'primary' : 'textSecondary'}>Posts</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, detailsVisible && styles.activeTab]}
            onPress={() => setDetailsVisible(true)}
          >
            <ThemedText weight="semiBold" color={detailsVisible ? 'primary' : 'textSecondary'}>About</ThemedText>
          </TouchableOpacity>
        </View>

        {detailsVisible ? (
          <Animatable.View animation="fadeIn" style={styles.detailsContainer}>
            <ThemedCard style={styles.infoCard}>
              <InfoRow icon="person-outline" label="Name" value={route.params.name} />
              <InfoRow icon="phone-portrait-outline" label="Mobile" value={route.params.mobile} />
              <InfoRow icon="flag-outline" label="Country" value={route.params.country === '1' ? 'Sri Lanka' : 'Others'} />
              <InfoRow icon="information-outline" label="About" value={route.params.about} isLast />
            </ThemedCard>
          </Animatable.View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderPost}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.postList}
          />
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editVisible} animationType="slide">
        <SafeAreaView style={styles.editContainer}>
          <View style={styles.editHeader}>
            <TouchableOpacity onPress={() => setEditVisible(false)}>
              <Icon name="close" size={28} color={theme.colors.textMain} />
            </TouchableOpacity>
            <ThemedText type="subheading" weight="bold">Edit Profile</ThemedText>
            <TouchableOpacity onPress={updateUser}>
              <ThemedText color="primary" weight="bold">Save</ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.editForm}>
            <TouchableOpacity style={styles.editAvatarContainer} onPress={selectProfilePicture}>
              <Image source={{ uri: profileImageUrl }} style={styles.editAvatar} />
              <View style={styles.cameraIcon}>
                <Icon name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            <ThemedInput icon="person-outline" placeholder="Name" value={name} onChangeText={setName} />
            <ThemedInput icon="phone-portrait-outline" placeholder="Mobile" value={mobile} onChangeText={setMobile} keyboardType="numeric" />
            <ThemedInput icon="information-outline" placeholder="About" value={about} onChangeText={setAbout} />

            <ThemedText type="small" color="textLight" style={{ marginTop: theme.spacing.m }}>Select Country</ThemedText>
            <SelectDropdown
              data={countries}
              onSelect={setCountry}
              defaultValue={country === '1' ? 'Sri Lanka' : 'India'}
              buttonStyle={styles.dropdown}
              buttonTextStyle={styles.dropdownText}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const InfoRow = ({ icon, label, value, isLast }) => (
  <View style={[styles.infoRow, !isLast && styles.infoBorder]}>
    <View style={styles.infoIcon}>
      <Icon name={icon} size={20} color={theme.colors.primary} />
    </View>
    <View style={styles.infoContent}>
      <ThemedText type="caption" color="textLight">{label}</ThemedText>
      <ThemedText weight="medium">{value}</ThemedText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerCover: {
    height: 300,
  },
  coverImage: {
    height: 180,
    width: '100%',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.xl,
  },
  profileSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    marginTop: -40,
  },
  avatarBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.background,
    padding: 4,
    elevation: 5,
  },
  mainAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  profileInfo: {
    marginLeft: theme.spacing.m,
    marginTop: 40,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  statItem: {
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.border,
    marginRight: theme.spacing.m,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  detailsContainer: {
    padding: theme.spacing.m,
  },
  infoCard: {
    padding: 0,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  infoBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  infoContent: {
    flex: 1,
  },
  postList: {
    paddingBottom: 20,
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
  },
  postHeaderInfo: {
    marginLeft: theme.spacing.s,
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  postFooter: {
    padding: theme.spacing.m,
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  editForm: {
    padding: theme.spacing.m,
  },
  editAvatarContainer: {
    alignSelf: 'center',
    marginVertical: theme.spacing.l,
  },
  editAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  dropdown: {
    width: '100%',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.spacing.borderRadiusLarge,
    marginTop: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: theme.colors.textMain,
    textAlign: 'left',
  }
});
