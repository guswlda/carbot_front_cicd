# Node.js 빌드 스테이지
FROM node:20 AS build

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 소스 코드 복사 및 React 애플리케이션 빌드
COPY . .
RUN npm run build

# Nginx 설정 스테이지
FROM nginx:alpine

# 빌드된 정적 파일을 Nginx 기본 경로에 복사
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Nginx 포트 설정
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
