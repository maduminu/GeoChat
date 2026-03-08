import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

const ThemedText = ({
    children,
    type = 'body',
    color = 'textMain',
    weight,
    style,
    ...props
}) => {
    return (
        <Text
            style={[
                styles[type],
                { color: theme.colors[color] || color },
                weight && { fontWeight: theme.typography.weight[weight] || weight },
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    display: {
        fontSize: theme.typography.size.display,
        fontWeight: theme.typography.weight.bold,
    },
    title: {
        fontSize: theme.typography.size.title,
        fontWeight: theme.typography.weight.bold,
    },
    heading: {
        fontSize: theme.typography.size.heading,
        fontWeight: theme.typography.weight.semiBold,
    },
    subheading: {
        fontSize: theme.typography.size.subheading,
        fontWeight: theme.typography.weight.medium,
    },
    body: {
        fontSize: theme.typography.size.body,
        fontWeight: theme.typography.weight.regular,
    },
    small: {
        fontSize: theme.typography.size.small,
        fontWeight: theme.typography.weight.regular,
    },
    caption: {
        fontSize: theme.typography.size.caption,
        fontWeight: theme.typography.weight.regular,
    },
});

export default ThemedText;
