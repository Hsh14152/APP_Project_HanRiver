import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { ZONES, PARK_CENTERS } from '../data/zones';

export default function HomeScreen({ navigation }) {
  const seasonStatus = useMemo(() => {
    const now = new Date();
    const start = new Date(ZONES.metadata.season.start);
    const end = new Date(ZONES.metadata.season.end);
    const month = now.getMonth() + 1;
    if (now >= start && now <= end) {
      const hours =
        month >= 6 && month <= 8
          ? ZONES.metadata.allowed_hours.summer
          : ZONES.metadata.allowed_hours.spring_fall;
      return { active: true, text: `✅ 이용 가능 시즌 | ${hours}` };
    }
    return { active: false, text: '❌ 비시즌 (운영: 3월 1일 ~ 11월 30일)' };
  }, []);

  // 공원별 그늘막 구역 수만 집계
  const parkSummary = useMemo(() => {
    const summary = {};
    ZONES.features.forEach((f) => {
      const p = f.properties;
      if (!summary[p.park]) summary[p.park] = { count: 0 };
      if (p.shade) summary[p.park].count += 1;
    });
    return summary;
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.greeting}>한강공원 구역 안내</Text>
        <Text style={styles.heroTitle}>오늘 어디서 쉬어가세요? 🌿</Text>
        <View
          style={[
            styles.seasonBadge,
            {
              backgroundColor: seasonStatus.active
                ? 'rgba(255,255,255,0.22)'
                : 'rgba(255,80,80,0.3)',
            },
          ]}
        >
          <Text style={styles.seasonText}>{seasonStatus.text}</Text>
          <Text
            style={[styles.seasonText, { marginTop: 4 }, { marginLeft: 14 }]}
          >
            (돗자리는 기간, 장소 상관없이 상시 이용 가능)
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>📍 한강공원 목록</Text>
      {Object.entries(PARK_CENTERS).map(([parkId, info]) => {
        const count = parkSummary[parkId]?.count || 0;
        return (
          <TouchableOpacity
            key={parkId}
            style={styles.parkCard}
            onPress={() =>
              navigation.navigate('지도', { parkId, timestamp: Date.now() })
            }
          >
            <View style={styles.parkCardLeft}>
              <Text style={styles.parkIcon}>{info.icon}</Text>
              <View>
                <Text style={styles.parkName}>{info.name} 한강공원</Text>
                <View style={styles.badgeRow}>
                  {/* 그늘막 뱃지만 */}
                  <Text
                    style={[
                      styles.miniBadge,
                      { backgroundColor: COLORS.shade },
                    ]}
                  >
                    🟦 그늘막 {count}구역
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { backgroundColor: COLORS.brand, padding: 24, paddingTop: 48 },
  greeting: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  greeting2: { color: 'rgba(255,255,255,0.85)', fontSize: 11 },
  heroTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  seasonBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  seasonText: { color: 'white', fontSize: 11 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
    padding: 16,
    paddingBottom: 8,
  },
  parkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  parkCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  parkIcon: { fontSize: 22 },
  parkName: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain },
  badgeRow: { flexDirection: 'row', marginTop: 4 },
  miniBadge: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  arrow: { fontSize: 20, color: '#ccc' },
});
