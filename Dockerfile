# 1단계: Node.js 빌드 스테이지
FROM node:20 AS build

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 종속성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드 (프론트엔드 빌드가 필요한 경우, 필요한 스크립트 추가)
# 예시: RUN npm run build

# 2단계: Nginx 설정 및 Node.js 애플리케이션 실행
FROM nginx:alpine

# Node.js 애플리케이션을 Nginx의 기본 루트 경로로 복사
COPY --from=build /usr/src/app /usr/share/nginx/html

# 외부에 노출할 포트
EXPOSE 80

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]
