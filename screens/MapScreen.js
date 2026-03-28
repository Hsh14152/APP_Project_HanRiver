import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';

// 확인된 실제 이름들로 임포트합니다.
import {
  NaverMapView,
  NaverMapMarkerOverlay,
  NaverMapPolygonOverlay,
} from '@mj-studio/react-native-naver-map';

import { COLORS } from '../constants/colors';
import { ZONES, PARK_CENTERS } from '../data/zones';
import ZoneDetailSheet from '../components/ZoneDetailSheet';

export default function MapScreen({ route }) {
  const initialPark = route?.params?.parkId || 'yeouido';
  const [currentPark, setCurrentPark] = useState(initialPark);
  const [myLocation, setMyLocation] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isMyLocActive, setIsMyLocActive] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High },
        (loc) => {
          setMyLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        },
      );
    })();
  }, []);

  useEffect(() => {
    if (!currentPark) return;
    if (mapRef.current) {
      mapRef.current.animateCameraTo({
        latitude: center.lat,
        longitude: center.lng,
        zoom: 15,
      });
    }
  }, [currentPark]);

  useEffect(() => {
    if (route?.params?.parkId) {
      setCurrentPark(route.params.parkId);
    }
  }, [route?.params?.parkId]);

  const center = currentPark
    ? PARK_CENTERS[currentPark]
    : PARK_CENTERS['yeouido'];

  return (
    <View style={styles.container}>
      {/* 공원 탭 */}
      <View style={{ height: 60 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
        >
          {/* 내 위치 버튼 — 맨 왼쪽 */}
          <TouchableOpacity
            style={[styles.tab, isMyLocActive && styles.tabActive]}
            onPress={() => {
              if (myLocation && mapRef.current) {
                mapRef.current.animateCameraTo({
                  latitude: myLocation.latitude,
                  longitude: myLocation.longitude,
                  zoom: 16,
                });
                setIsMyLocActive(true); // 내 위치 버튼 활성화
                setCurrentPark(null); // 공원 탭 비활성화
              }
            }}
          >
            <Text
              style={[
                styles.tabText,
                { color: COLORS.brand },
                isMyLocActive && styles.tabTextActive,
              ]}
            >
              내 위치
            </Text>
          </TouchableOpacity>
          {Object.entries(PARK_CENTERS).map(([parkId, info]) => (
            <TouchableOpacity
              key={parkId}
              style={[styles.tab, currentPark === parkId && styles.tabActive]}
              onPress={() => {
                setCurrentPark(parkId);
                setIsMyLocActive(false);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  currentPark === parkId && styles.tabTextActive,
                ]}
              >
                {info.icon} {info.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 지도 영역 - 확인된 이름 'NaverMapView' 사용 */}
      <NaverMapView
        ref={mapRef}
        style={styles.map}
        initialCamera={{
          latitude: center.lat,
          longitude: center.lng,
          zoom: 15,
        }}
      >
        {/* 내 위치 마커 - 확인된 이름 'NaverMapMarkerOverlay' 사용 */}
        {myLocation && (
          <NaverMapMarkerOverlay
            latitude={myLocation.latitude}
            longitude={myLocation.longitude}
            anchor={{ x: 0.5, y: 0.5 }}
            width={32}
            height={32}
            caption={undefined}
          >
            <View style={styles.myLocOuter}>
              <View style={styles.myLocDot} />
            </View>
          </NaverMapMarkerOverlay>
        )}
        {ZONES.features
          .filter(
            (f) => f.properties.park === currentPark && f.properties.shade,
          )
          .map((feature) => {
            const coords = feature.geometry.coordinates[0].map((c) => ({
              latitude: c[1],
              longitude: c[0],
            }));
            return (
              <NaverMapPolygonOverlay
                key={feature.properties.id}
                coords={coords}
                color={'rgba(35, 151, 245, 0.45)'} // 그늘막 노란색 45% 투명도
                outlineColor={'#2397f5'}
                outlineWidth={2}
                onTap={() => setSelectedZone(feature.properties)}
              />
            );
          })}
      </NaverMapView>

      {selectedZone && (
        <ZoneDetailSheet
          zone={selectedZone}
          onClose={() => setSelectedZone(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  tabBar: { borderBottomWidth: 1, borderColor: '#eee' },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 6,
    borderWidth: 1.5,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  tabText: { fontSize: 12, color: '#555', fontWeight: 'bold' },
  tabTextActive: { color: 'white' },
  map: { flex: 1 },

  myLocOuter: {
    width: 32,
    height: 32,
    borderRadius: 18,
    backgroundColor: 'rgba(3, 199, 90, 0.25)', // 초록 반투명
    alignItems: 'center',
    justifyContent: 'center',
  },

  myLocDot: {
    width: 21,
    height: 21,
    borderRadius: 10,
    backgroundColor: COLORS.brand,
    borderWidth: 3,
    borderColor: 'white',
    elevation: 8, // 안드로이드 그림자
  },
  tabRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: 'white',
  },
});
