import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { theme } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons';

const ThemedInput = ({
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    style,
    ...props
}) => {
    return (
        <View style={[styles.container, style]}>
            {icon && <Icon name={icon} size={20} color={theme.colors.primary} style={styles.icon} />}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textLight}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.inputBackground,
        borderRadius: theme.spacing.borderRadiusLarge,
        height: 55,
        paddingHorizontal: theme.spacing.m,
        marginVertical: theme.spacing.s,
        width: '100%',
    },
    icon: {
        marginRight: theme.spacing.s,
        width: 25,
        textAlign: 'center',
    },
    input: {
        flex: 1,
        color: theme.colors.textMain,
        fontSize: theme.typography.size.body,
        fontWeight: theme.typography.weight.medium,
        height: '100%',
    },
});

export default ThemedInput;
