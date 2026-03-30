import { withProjectBuildGradle } from '@expo/config-plugins';

export default ({ config }) => {
  return {
    ...config,
    // 1. 기본 앱 정보 (기존 app.json 내용)
    name: '한강 그늘막',
    slug: 'hangang-park',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#03C75A',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.hsh.hangangpark',
    },
    android: {
      package: 'com.hsh.hangangpark', // 네이버 콘솔과 일치해야 함
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#03C75A',
      },
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'FOREGROUND_SERVICE',
      ],
    },
    // 2. 네이버 지도 플러그인 설정
    plugins: [
      [
        '@mj-studio/react-native-naver-map',
        {
          clientId: 'vb0jojyaaz', // 대문자 I 주의
        },
      ],
      // 3. 빌드 서버에 네이버 저장소를 강제로 추가하는 '인라인 플러그인'
      (config) => {
        return withProjectBuildGradle(config, (config) => {
          if (config.modResults.language === 'groovy') {
            const contents = config.modResults.contents;
            // 'allprojects { repositories {' 부분을 찾아서 네이버 저장소를 추가합니다.
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
      eas: {
        projectId: '99bf253a-f725-4682-a8af-6d420fb3ec0f',
      },
    },
    owner: 'raiqu',
  };
};
