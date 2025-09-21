import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  backgroundColor?: string;
  color?: string;
  logo?: string;
  logoSize?: number;
  logoBackgroundColor?: string;
  logoMargin?: number;
  logoBorderRadius?: number;
  quietZone?: number;
  enableLinearGradient?: boolean;
  gradientDirection?: string[];
  linearGradient?: string[];
}

export default function QRCodeGenerator({
  value,
  size = 200,
  backgroundColor = 'white',
  color = '#000000',
  logo,
  logoSize = 40,
  logoBackgroundColor = 'white',
  logoMargin = 2,
  logoBorderRadius = 8,
  quietZone = 10,
  enableLinearGradient = false,
  gradientDirection = ['0%', '0%', '100%', '100%'],
  linearGradient = ['#FF6B35', '#FF8A65']
}: QRCodeGeneratorProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <QRCode
        value={value}
        size={size}
        color={color}
        backgroundColor={backgroundColor}
        logo={logo ? { uri: logo } : undefined}
        logoSize={logoSize}
        logoBackgroundColor={logoBackgroundColor}
        logoMargin={logoMargin}
        logoBorderRadius={logoBorderRadius}
        quietZone={quietZone}
        enableLinearGradient={enableLinearGradient}
        gradientDirection={gradientDirection}
        linearGradient={linearGradient}
        ecl="M"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 12,
  },
});