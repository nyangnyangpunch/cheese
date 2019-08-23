<div align="center">

  <img src="./cheese.png" width="120px">

  # Cheese

</div>

`치즈`는 쿠버네티스 기반의 마이크로 서비스를 운영하는 환경을 위한 데이터 시각화 솔루션입니다. 사용자 친화적으로 쉽고 간편하게 사용할 수 있습니다.

## 사용자 가이드

http://www.cheese.cf 에서 치즈를 설치하고 설정후 사용가능

## 테스트 환경

kubernetes, docker , istio가 설치되어 있어야 동작이 가능함

## 개발 환경

`네이버 클라우드 플랫폼` 기반으로 테스트 환경을 구성하여 진행함

- 서버
  - Node.js >= 8
- 클라이언트 (웹)
  - JQuery (with babel)

## 환경 구성

```bash
# 의존성 모듈 설치 (웹, Node.js 서버)
npm i
```

### 프로젝트 구조

```bash
+-- _static # 웹 페이지 리소스
|   +-- css # CSS
|   +-- dev # JS (개발용)
|   +-- js  # 자동 트랜스파일링 (Babel이 생성함)
|   +-- resource # 이미지 등 기타 리소스
+-- _src # 서버 리소스
|   +-- _api # API 정의 소스
|   +-- _page # 웹 페이지 라우드 정의 소스
|   +-- _util # 서버 공통/유틸 소스
|   +-- init.js # 서버 초기화 소스
+-- _config
|   +-- default.json # 서버 설정 파일
+-- app.js # 서버 실행 파일
+-- .babelrc # Babel 설정파일
+-- package.json # npm 설정 파일
+-- READMD.md
```

### 서버 개발

```bash
# app.js 스크립트 실행
node app.js
```

### 웹 개발

- `static/dev` 폴더 내의 스크립트로 개발 진행
  - `static/js` 폴더는 바벨에 의해 자동 생성되기 때문에 수정 금지

```bash
# Babel 사용을 위해 명령어 입력 후 웹 개발 진행하기
# static/js 폴더로 트랜스파일링된 후 자동 저장됨
npm run web
```

## 개발자

Team `냥냥펀치`
