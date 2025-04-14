import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ProgressBar from '../../components/ProgressBarTotal';
import { useTheme } from 'styled-components/native';
import { defaultTheme } from '../../theme/DefautTheme';
import ProgressBarCategory from '../../components/ProgressBarCategory';

export default function HourScreen() {
  return (
    <View >
      <ProgressBar currentValue={50} maxValue={200}></ProgressBar>
      <ProgressBarCategory currentValue={20} maxValue={100} categoryName='ENSINO' ></ProgressBarCategory>
      <ProgressBarCategory currentValue={80} maxValue={100} categoryName='EMPREENDEDORISMO E INOVAÇÃO' ></ProgressBarCategory>
    </View>
  );
}                           
