import React from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { useLivestock } from '../hooks/useLivestock';
import { AnimalCard } from '../components/AnimalCard';
import { EmptyState, LoadingState, ErrorState } from '@/components/ui';

export function LivestockScreenView() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { animals, isLoading, isError } = useLivestock();

  if (isLoading) return <LoadingState message="Chorva ro&apos;yxati yuklanmoqda..." />;
  if (isError) return <ErrorState title="Xatolik" error="Chorva ro&apos;yxatini yuklab bo&apos;lmadi." />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Chorva Ro&apos;yxati</Text>
      {animals.length === 0 ? (
        <EmptyState
          title="Hayvonlar topilmadi"
          description="Hozircha fermangizda ro&apos;yxatga olingan hayvonlar yo&apos;q."
        />
      ) : (
        <FlatList
          data={animals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AnimalCard animal={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});
