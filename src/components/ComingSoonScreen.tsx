import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
};

export default function ComingSoonScreen({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9AA0A6',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});

