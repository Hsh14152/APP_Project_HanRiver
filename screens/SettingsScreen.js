import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { COLORS } from '../constants/colors';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>🏕️</Text>
        <Text style={styles.heroTitle}>한강공원 그늘막 안내</Text>
        <Text style={styles.heroVersion}>버전 {APP_VERSION}</Text>
      </View>

      {/* 앱 버전 정보 */}
      <Text style={styles.sectionTitle}>앱 정보</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>앱 버전</Text>
          <Text style={styles.rowValue}>{APP_VERSION}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>그늘막 허용 구역 정보</Text>
      <View style={styles.card}>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>운영 기간</Text>
          <Text style={styles.rowValue}>3월 1일 ~ 11월 30일</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>허용 규격</Text>
          <Text style={styles.rowValue}>2m X 2m 내외 (4인용)</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>이용 시간 (봄·가을)</Text>
          <Text style={styles.rowValue}>09:00 ~ 19:00</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>이용 시간 (여름)</Text>
          <Text style={styles.rowValue}>09:00 ~ 21:00</Text>
        </View>
      </View>

      {/* 데이터 출처 */}
      <Text style={styles.sectionTitle}>데이터 출처</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>제공 기관</Text>
          <Text style={styles.rowValue}>서울시 미래한강본부</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>최종 업데이트</Text>
          <Text style={styles.rowValue}>2026년 3월 28일</Text>
        </View>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            Linking.openURL(
              'https://hangang.seoul.go.kr/www/bbsPost/17/632/detail.do?mid=604',
            )
          }
        >
          <Text style={styles.rowLabel}>공식 홈페이지</Text>
          <Text style={[styles.rowValue, { color: COLORS.brand }]}>
            hangang.seoul.go.kr ›
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            Linking.openURL('https://Hsh14152.github.io/APP_Project_HanRiver')
          }
        >
          <Text style={styles.rowLabel}>개인정보처리방침</Text>
          <Text style={[styles.rowValue, { color: COLORS.brand }]}>보기 ›</Text>
        </TouchableOpacity>
      </View>

      {/* 안내 문구 */}
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          ⚠️ 본 앱의 구역 정보는 서울시 공식 데이터를 기반으로 하며, 현장 상황에
          따라 달라질 수 있습니다. 방문 전 공식 홈페이지에서 확인해 주세요.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { backgroundColor: COLORS.brand, padding: 32, alignItems: 'center' },
  heroIcon: { fontSize: 40, marginBottom: 8 },
  heroTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  heroVersion: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  rowLabel: { fontSize: 14, color: '#555' },
  rowValue: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 14 },
  notice: {
    margin: 16,
    padding: 14,
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  noticeText: { fontSize: 12, color: '#92400e', lineHeight: 18 },
});
