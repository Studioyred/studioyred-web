# assets/

씬에서 참조하는 미디어 파일을 여기에 넣으세요.

## 배경 이미지
- PNG / JPG 권장
- `scenes.js`의 `bgImage` 필드에 상대 경로로 지정: `"assets/my-bg.jpg"`

## 배경 음악
- MP3 / OGG 권장
- `scenes.js`의 `music` 필드에 상대 경로로 지정: `"assets/ambient.mp3"`
- 브라우저 자동 재생 정책 때문에 **사용자 인터랙션(클릭 등) 이후** 재생됩니다.

## 예시 scenes.js 항목
```js
{
  bgImage:     "assets/space.jpg",
  music:       "assets/space-ambient.mp3",
  musicVolume: 0.45,
  ...
}
```
