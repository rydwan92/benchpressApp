import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CompetitionInfoForm from './registration/CompetitionInfoForm';
import CompetitionSummary from './registration/CompetitionSummary';
import CategoryBrowser from './registration/CategoryBrowser';
import { colors, font } from '../theme/theme';

export default function MainNavigation() {
  const [activeTab, setActiveTab] = useState('info'); // dostępne wartości: 'info', 'summary', 'categories'

  const renderContent = () => {
    switch(activeTab){
      case 'info':
        return <CompetitionInfoForm />;
      case 'summary':
        return <CompetitionSummary />;
      case 'categories':
        return <CategoryBrowser />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'info' && styles.activeNavItem]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.navText, activeTab === 'info' && styles.activeNavText]}>Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'summary' && styles.activeNavItem]}
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.navText, activeTab === 'summary' && styles.activeNavText]}>Podsumowanie</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'categories' && styles.activeNavItem]}
          onPress={() => setActiveTab('categories')}
        >
          <Text style={[styles.navText, activeTab === 'categories' && styles.activeNavText]}>Kategorie</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.secondary,
    paddingVertical: 12,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  activeNavItem: {
    backgroundColor: colors.primaryLight,
  },
  navText: {
    color: '#fff',
    fontSize: font.sizeNormal,
    fontWeight: 'bold',
  },
  activeNavText: {
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});