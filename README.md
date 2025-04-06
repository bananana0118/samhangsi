# 🚀 삼행시 광장 🚀

> N행시 장인이 되어보자! ✍️

주어진 단어로 센스 넘치는 N행시(최대 6행시!)를 짓고 전 세계(?) 사람들과 함께 웃고 즐기는 웹 앱이에요! 🎉

## 🛠️ 사용된 기술 스택

이 앱을 만드는 데 사용된 멋진 기술들이에요:

-   **뼈대:** [Next.js](https://nextjs.org/) (App Router 방식) - 빠르고 강력한 웹 앱 만들기! 💪
-   **언어:** [TypeScript](https://www.typescriptlang.org/) - 코드에 날개를 달아주는 타입 시스템! 🦋
-   **스타일링:** [Tailwind CSS](https://tailwindcss.com/) - 디자인? 맡겨만 주세요! 🎨
-   **데이터 저장:** [Firebase Firestore](https://firebase.google.com/products/firestore) - 실시간 데이터베이스, 완전 신기! 🔥
-   **날려보내기(배포):** [Vercel](https://vercel.com/) - 클릭 몇 번으로 전 세계에 앱 출시! 🌍

## ✨ 주요 기능

-   **주제어 던지기:** 최대 6글자까지! 어떤 단어든 좋아요 👌
-   **자동 행 생성:** 주제어 글자 수만큼 딱! 입력 칸이 생겨요 🪄
-   **N행시 창작:** 여러분의 드립력을 보여주세요! 🤣
-   **실시간 공유:** 내가 쓴 N행시가 바로바로 올라가요 (Firestore 덕분!) ⚡
-   **다른 작품 감상:** 다른 사람들은 어떤 드립을 쳤을까? 🤔

## 💻 내 컴퓨터에서 실행해보기

1.  **코드 가져오기:**

    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    cd YOUR_REPOSITORY_NAME
    ```

2.  **필요한 재료 설치:** (마법 주문 외우기!)

    ```bash
    npm install
    # 또는 yarn 사용자라면
    yarn install
    ```

3.  **Firebase 연결 설정:**

    -   [Firebase](https://console.firebase.google.com/)에서 프로젝트 만들고 웹 앱 추가하기!
    -   프로젝트 폴더에 `.env` 파일 만들고, Firebase 콘솔에서 복사한 키 값들을 넣어주세요. (아래 형식 참고!)
    -   **🚨 중요:** `.env` 파일은 소중한 비밀번호 같은 거니까, `.gitignore` 파일에 꼭 추가해서 실수로 GitHub 같은 곳에 올리지 않도록 주의하세요!

    ```dotenv
    # .env 파일 이렇게 생겼어요!
    NEXT_PUBLIC_FIREBASE_API_KEY=여러분의_API_키를_여기에_뙇!
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=여러분의_Auth_Domain을_여기에_뙇!
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=여러분의_Project_ID를_여기에_뙇!
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=여러분의_Storage_Bucket을_여기에_뙇!
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=여러분의_Sender_ID를_여기에_뙇!
    NEXT_PUBLIC_FIREBASE_APP_ID=여러분의_App_ID를_여기에_뙇!
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=측정_ID가_있다면_여기에! (선택사항)
    ```

4.  **개발 서버 🔥ON🔥:**
    ```bash
    npm run dev
    # 또는 yarn 사용자라면
    yarn dev
    ```
    이제 웹 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 달려가세요! 🏃‍♀️🏃‍♂️

## 🚀 세상에 공개하기 (배포)

[Vercel](https://vercel.com/)과 함께라면 배포도 식은 죽 먹기!

1.  여러분의 멋진 코드를 GitHub/GitLab/Bitbucket 저장소에 푸시! PUSH! PUSH!
2.  Vercel에 로그인해서 방금 푸시한 저장소를 선택! (클릭! 클릭!)
3.  **잊지 마세요!** Vercel 프로젝트 설정 > Environment Variables에 `.env` 파일에 적었던 비밀 키 값들을 똑같이 넣어줘야 해요! 🔑
4.  'Deploy' 버튼을 누르면... 잠시 후 마법 같은 일이 벌어집니다! ✨

짠! 이제 여러분만의 N행시 웹사이트가 세상에 나왔습니다! 🥳

## 🙌 함께 만들어요! (기여하기)

아직은 혼자 만들고 있지만, 아이디어나 도움은 언제나 환영이에요! 🤗 (가이드라인은 곧 추가할게요!)

## 📜 라이선스

[라이선스 정보도 곧...] (MIT 라이선스 같은 걸 고려 중이에요!)
