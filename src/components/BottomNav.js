import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme } from '../theme';
import { useUser } from '../api/UserContext';

const BottomNav = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = useUser();

    const navItems = [
        { name: 'home', icon: 'home', routeName: 'PostView' },
        { name: 'chatbubbles', icon: 'chatbubbles', routeName: 'Home' },
        { name: 'people', icon: 'people', routeName: 'Group' },
        { name: 'person', icon: 'person', routeName: 'UserProfile', params: { pageId: '1', img: user.profile_url, name: user.name } },
    ];

    const isActive = (routeName) => route.name === routeName;

    return (
        <View style={styles.container}>
            {navItems.map((item) => (
                <TouchableOpacity
                    key={item.name}
                    style={styles.navItem}
                    onPress={() => navigation.navigate(item.routeName, item.params)}
                >
                    <Icon
                        name={isActive(item.routeName) ? item.icon : `${item.icon}-outline`}
                        size={26}
                        color={isActive(item.routeName) ? theme.colors.primary : theme.colors.textSecondary}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: theme.colors.cardBackground,
        paddingVertical: theme.spacing.s,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingBottom: theme.spacing.l,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        padding: theme.spacing.s,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default BottomNav;
