# Node.js 기본 이미지 설정
FROM node:20

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사 (있는 경우)
COPY package*.json ./

# 종속성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 외부에 노출할 포트 설정
EXPOSE 80

# 애플리케이션 실행 명령어 (쉼표와 대괄호 사용에 주의)
CMD ["node", "src/index.js"]
