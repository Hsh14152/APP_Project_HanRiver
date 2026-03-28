import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { ZONES } from '../data/zones';

export default function ZoneDetailSheet({ zone, onClose }) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const hours =
    month >= 6 && month <= 8
      ? ZONES.metadata.allowed_hours.summer
      : ZONES.metadata.allowed_hours.spring_fall;

  return (
    <View style={styles.sheet}>
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={styles.closeBtnText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{zone.zone_name}</Text>

      {/* 그늘막 뱃지 하나만 */}
      <View style={styles.badgeRow}>
        <View
          style={[
            styles.badge,
            { backgroundColor: zone.shade ? COLORS.shade : '#ccc' },
          ]}
        >
          <Text style={styles.badgeText}>
            {zone.shade ? '✅ 그늘막 허용' : '❌ 그늘막 불가'}
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>이용 시간</Text>
          <Text style={styles.infoValue}>{hours}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>이용 기간</Text>
          <Text style={styles.infoValue}>3월 1일 ~ 11월 30일</Text>
        </View>
      </View>

      {zone.notes ? (
        <View style={styles.warnBox}>
          <Text style={styles.warnText}>⚠️ {zone.notes}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  closeBtn: { position: 'absolute', top: 16, right: 20 },
  closeBtnText: { fontSize: 20, color: '#999' },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 12,
  },
  badgeRow: { flexDirection: 'row', marginBottom: 14 },
  badge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  badgeText: { color: 'white', fontSize: 13, fontWeight: 'bold' },
  infoBox: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  infoLabel: { fontSize: 13, color: '#666' },
  infoValue: { fontSize: 13, fontWeight: 'bold', color: COLORS.textMain },
  warnBox: { backgroundColor: '#fff7ed', borderRadius: 10, padding: 12 },
  warnText: { fontSize: 13, color: '#92400e' },
});
