import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native';
import { theme } from '../theme';
import ThemedText from './ThemedText';

const ThemedButton = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    type = 'primary', // primary, secondary, outline
    style,
    textStyle,
    icon,
    ...props
}) => {
    const isPrimary = type === 'primary';
    const isOutline = type === 'outline';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[type],
                (disabled || loading) && styles.disabled,
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={isOutline ? theme.colors.primary : theme.colors.textOnPrimary} />
            ) : (
                <View style={styles.content}>
                    {icon && <View style={styles.icon}>{icon}</View>}
                    <ThemedText
                        type="subheading"
                        weight="semiBold"
                        color={isOutline ? 'primary' : 'textOnPrimary'}
                        style={[styles.text, textStyle]}
                    >
                        {title}
                    </ThemedText>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 55,
        borderRadius: theme.spacing.borderRadiusLarge,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: theme.spacing.s,
    },
    primary: {
        backgroundColor: theme.colors.primary,
        // Premium Shadow
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    secondary: {
        backgroundColor: theme.colors.secondary,
        shadowColor: theme.colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    disabled: {
        opacity: 0.5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: theme.spacing.s,
    },
    text: {
        letterSpacing: 0.5,
    }
});

export default ThemedButton;
