import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ArrowDownRight, ArrowUpRight, Plus, Minus } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { feedService, useFeed } from '@/features/feed';
import { RoleGuard } from '@/features/auth';
import { ErrorState } from '@/components/ui';

export default function FeedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const feedItem = id ? feedService.getFeedItemById(id) : null;
  const { transactions } = useFeed(id);

  if (!feedItem) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ErrorState title="Topilmadi" error="Ko'rsatilgan yem turi bazada topilmadi." />
      </View>
    );
  }

  const isLowStock = feedItem.currentQuantity <= feedItem.minQuantity;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{feedItem.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Stock Card */}
        <View style={[styles.mainCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardSubTitle, { color: colors.textSecondary }]}>AMALDAGI QOLDIQ</Text>
          <Text style={[styles.qtyHighlight, { color: isLowStock ? colors.danger : colors.primary }]}>
            {feedItem.currentQuantity} {feedItem.unit}
          </Text>
          <Text style={[styles.minText, { color: colors.textSecondary }]}>
            Minimal belgilangan chegara: {feedItem.minQuantity} {feedItem.unit}
          </Text>

          {/* Kirim / Chiqim Action Buttons */}
          <RoleGuard permission="FEED_TRANSACTION_ADD">
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                onPress={() => router.push({ pathname: '/feed/add-transaction' as any, params: { feedItemId: feedItem.id, initialType: 'IN' } })}>
                <Plus size={18} color="white" />
                <Text style={styles.actionBtnText}>Kirim (Sotib olindi)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.warning }]}
                onPress={() => router.push({ pathname: '/feed/add-transaction' as any, params: { feedItemId: feedItem.id, initialType: 'OUT' } })}>
                <Minus size={18} color="white" />
                <Text style={styles.actionBtnText}>Chiqim (Berildi)</Text>
              </TouchableOpacity>
            </View>
          </RoleGuard>
        </View>

        {/* Transaction History Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Kirim va Chiqimlar Tarixi ({transactions.length})</Text>
        </View>

        {transactions.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
            <Text style={{ color: colors.textSecondary }}>Hozircha operatsiyalar tarixi yo&apos;q.</Text>
          </View>
        ) : (
          transactions.map((tx) => {
            const isAdd = tx.type === 'IN';
            return (
              <View
                key={tx.id}
                style={[styles.txCard, { backgroundColor: colors.backgroundElement, borderColor: colors.cardBorder }]}>
                <View style={styles.txRow}>
                  <View style={styles.txIconRow}>
                    {isAdd ? (
                      <ArrowDownRight size={20} color={colors.primary} />
                    ) : (
                      <ArrowUpRight size={20} color={colors.danger} />
                    )}
                    <View>
                      <Text style={[styles.txTitle, { color: colors.text }]}>
                        {tx.type === 'IN' ? 'Kirim' : tx.type === 'OUT' ? 'Chiqim' : tx.type}
                      </Text>
                      <Text style={[styles.txDate, { color: colors.textSecondary }]}>{tx.date}</Text>
                    </View>
                  </View>
                  <Text style={[styles.txQty, { color: isAdd ? colors.primary : colors.danger }]}>
                    {isAdd ? '+' : '-'}{tx.quantity} {tx.unit}
                  </Text>
                </View>
                {tx.notes ? <Text style={[styles.txNotes, { color: colors.textSecondary }]}>{tx.notes}</Text> : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  mainCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  cardSubTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  qtyHighlight: {
    fontSize: 34,
    fontWeight: '900',
  },
  minText: {
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  actionBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  txCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  txTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  txDate: {
    fontSize: 12,
  },
  txQty: {
    fontSize: 16,
    fontWeight: '800',
  },
  txNotes: {
    fontSize: 12,
    marginTop: 4,
  },
});
