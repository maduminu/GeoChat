import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

const ThemedCard = ({ children, style, ...props }) => {
    return (
        <View style={[styles.card, style]} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.spacing.borderRadiusMedium,
        padding: theme.spacing.m,
        marginVertical: theme.spacing.xs,
        marginHorizontal: theme.spacing.s,
        // Premium Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default ThemedCard;
