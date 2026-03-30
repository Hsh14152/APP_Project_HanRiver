import {
  withProjectBuildGradle,
  withAndroidManifest,
} from '@expo/config-plugins';

export default ({ config }) => {
  return {
    ...config,
    name: '한강 그늘막',
    slug: 'hangang-park',
    version: '1.0.0',
    android: {
      package: 'com.hsh.hangangpark',
      compilerSdkVersion: 34,
      targetSdkVersion: 34,
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#03C75A',
      },
      permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
    },
    plugins: [
      [
        '@mj-studio/react-native-naver-map',
        {
          clientId: 'vb0jojyaaz', // 여기에 실제 본인의 Client ID가 있는지 다시 확인!
        },
      ],
      // 1. AndroidManifest에 네이버 키가 누락되지 않도록 강제 주입하는 플러그인
      (config) => {
        return withAndroidManifest(config, (config) => {
          const mainApplication = config.modResults.manifest.application[0];

          // 기존에 있을지 모를 잘못된 meta-data 제거 후 새로 추가
          if (mainApplication['meta-data']) {
            mainApplication['meta-data'] = mainApplication['meta-data'].filter(
              (meta) =>
                meta.$['android:name'] !== 'com.naver.maps.map.CLIENT_ID',
            );
          } else {
            mainApplication['meta-data'] = [];
          }

          mainApplication['meta-data'].push({
            $: {
              'android:name': 'com.naver.maps.map.CLIENT_ID',
              'android:value': 'vb0jojyaaz', // 여기에 ID 직접 입력
            },
          });
          return config;
        });
      },
      // 2. 메이븐 저장소 주입 플러그인 (기존과 동일)
      (config) => {
        return withProjectBuildGradle(config, (config) => {
          if (config.modResults.language === 'groovy') {
            const contents = config.modResults.contents;
            if (
              !contents.includes(
                'https://repository.map.naver.com/archive/maven',
              )
            ) {
              config.modResults.contents = contents.replace(
                /allprojects\s*\{\s*repositories\s*\{/,
                `allprojects {
    repositories {
        maven { url 'https://repository.map.naver.com/archive/maven' }`,
              );
            }
          }
          return config;
        });
      },
    ],
    extra: {
      eas: { projectId: '99bf253a-f725-4682-a8af-6d420fb3ec0f' },
    },
  };
};
