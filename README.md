# Random thoughts shooter

친구용 실시간 생각 게시판. 닉네임과 짧은 생각을 남기면 모든 접속자 화면에 실시간으로 나타납니다.

---

## 빠른 시작

### 1. Node.js 환경 준비 (1회만)

이 앱은 Node.js가 필요합니다. 두 가지 방법 중 하나를 고르세요.

#### 방법 A: Docker 사용 (시스템에 Node를 설치하지 않음, 권장)

1. [docker.com/get-started](https://docker.com/get-started)에서 **Docker Desktop**을 설치합니다.
2. 설치 후 Docker Desktop을 실행해 우측 상단에 초록색 `Engine running`이 보이는지 확인합니다.
3. PowerShell을 열고 Node 이미지를 미리 받습니다:

   ```powershell
   docker pull node:24-slim
   ```

4. 정상 동작 확인 (선택):

   ```powershell
   docker run -it --rm --entrypoint sh node:24-slim -c "node -v; npm -v"
   # v24.x.x
   # 11.x.x
   ```

5. **이후 모든 npm 명령은 컨테이너 안에서 실행합니다.** 프로젝트 폴더에서 아래 한 줄로 컨테이너 쉘에 진입하세요:

   ```powershell
   # PowerShell (프로젝트 폴더 = Random thoughts shooter 안에서 실행)
   docker run -it --rm -v "${PWD}:/app" -w /app -p 3000:3000 node:24-slim sh
   ```

   이 명령의 의미:
   - `-v "${PWD}:/app"` — 현재 폴더를 컨테이너의 `/app`에 마운트 (코드 수정이 바로 반영, npm 결과도 호스트에 남음)
   - `-w /app` — 컨테이너의 작업 디렉터리
   - `-p 3000:3000` — 컨테이너의 3000 포트를 호스트로 노출
   - `--rm` — 종료 시 컨테이너 자동 삭제 (이미지·볼륨은 유지)

   진입 후엔 일반 리눅스 쉘처럼 `npm install`, `npm run dev` 등을 실행할 수 있습니다 (자세한 명령은 step 4).

#### 방법 B: 네이티브 설치 (Docker 없이)

- [nodejs.org](https://nodejs.org)에서 **LTS 버전** 다운로드 → 설치 마법사 (기본값 OK)
- 새 PowerShell 창에서 `node --version` 입력 → `v20.x.x` 같은 버전이 나오면 성공

### 2. Supabase 프로젝트 생성

- [supabase.com](https://supabase.com) 가입 → **New project**
- Region: **Northeast Asia (Seoul)** 권장
- 비밀번호 메모해두기 (이 앱은 직접 사용하지 않지만 콘솔 접근에 필요)

### 3. 스키마 적용

- Supabase 대시보드 → **SQL Editor**
- `supabase/schema.sql` 내용 전체 복사 → 붙여넣기 → **Run** 클릭
- **Table Editor**에서 `thoughts` 테이블이 생성됐는지 확인
- **Database → Replication** → `supabase_realtime` publication에 `thoughts`가 포함됐는지 확인

### 4. 환경 변수 설정

프로젝트 **Settings → API** 페이지에서 두 값을 복사합니다:

| 항목 | 환경 변수명 |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| anon public key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

```powershell
# Windows PowerShell
Copy-Item .env.local.example .env.local
# .env.local 파일을 메모장 등으로 열어 위 두 값 입력
```

> **보안 참고**: anon key는 Supabase 설계상 클라이언트 번들에 포함되도록 설계된 공개 키입니다. RLS 정책이 실제 접근 제어를 담당합니다.

### 5. 로컬 실행

#### 방법 A: Docker (step 1에서 Docker를 선택한 경우)

`Random thoughts shooter` 폴더에서 PowerShell을 열고 컨테이너 진입:

```powershell
docker run -it --rm -v "${PWD}:/app" -w /app -p 3000:3000 node:24-slim sh
```

컨테이너 쉘에서 (`#` 프롬프트가 뜸):

```sh
npm install
npm run dev -- --hostname 0.0.0.0
```

> **`--hostname 0.0.0.0`이 꼭 필요합니다**. Next.js 기본값은 `localhost`(127.0.0.1)에 바인딩되는데, 그러면 컨테이너 내부에서만 보이고 호스트에서 접속이 안 됩니다.

호스트 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

종료하려면 컨테이너 쉘에서 `Ctrl+C` → `exit`.

#### 방법 B: 네이티브 (step 1에서 네이티브 설치를 선택한 경우)

```powershell
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

### 6. Vercel 배포

1. GitHub에 리포를 push합니다.
2. [vercel.com](https://vercel.com) → **New Project** → 리포 import
3. **Environment Variables** 두 개 설정 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. **Deploy** → 발급된 `*.vercel.app` URL을 친구에게 공유

> Vercel 빌드는 Vercel 측 인프라가 알아서 Node.js 환경을 세팅하므로 **로컬 Docker 여부와 무관**합니다.

---

## 운영

- **부적절한 글 삭제**: Supabase Studio → Table Editor → `thoughts` → 해당 행 삭제
- **전체 비우기**: SQL Editor에서 `truncate thoughts;` 실행

---

## 수동 확인 체크리스트

| # | 항목 | 방법 |
|---|---|---|
| 1 | 최신 순 표시 | SQL로 5개 행 삽입 후 새로고침 — 순서 확인 |
| 2 | 본인 화면 즉시 말풍선 (Optimistic) | DevTools → 느린 3G 설정 후 전송 → 즉시 표시 확인 |
| 3 | 다른 사용자 화면 1초 이내 자동 추가 | 브라우저 두 개 열고 A에서 전송 → B에서 1초 내 표시 확인 |
| 4 | 시각 자동 기록·표시 | 전송 후 "방금 전" 확인, 5분 후 "5분 전" 확인, 마우스오버 → 절대 시각 |
| 5 | 미입력 시 전송 비활성 | 닉네임 또는 본문 비워두면 전송 버튼 disabled 확인 |
| 6 | 500자 초과 차단 | 600자 붙여넣기 → 500자에서 잘림, 카운터 빨간색 |
| 7 | 무한 스크롤 과거 글 로드 | SQL로 250개 삽입 후 하단까지 스크롤 → 배치 로드 확인 |
| 8 | 닉네임 해시 색상 | 같은 닉네임 → 같은 색, 다른 닉네임 → 다른 색 (5색 팔레트) |
| 9 | 닉네임 말풍선 위 작게 표시 | 시각적 확인 |
| 10 | 입력창 하단 고정 | 스크롤 해도 composer 항상 하단 고정 확인 |
| 11 | 모바일 가독성 | DevTools iPhone 14 뷰포트 → 말풍선 90% 이내 |
| 12 | Pretendard 폰트 | DevTools Computed → font-family에 Pretendard 포함 확인 |
| 13 | 첫 로드 < 2초 | Vercel 배포 후 Lighthouse 측정 |
| 14 | 게시 → 다른 클라이언트 < 1초 | 항목 3과 동일 |
| 15 | 오프라인 알림 | DevTools → Offline 모드 → 상단 알림 배지 표시 확인 |

---

## 알려진 제약

- 실시간 채널이 일시 끊기는 동안 올라온 글은 **새로고침**해야 볼 수 있습니다.
- **인증 없음** — 닉네임은 익명 라벨로, 같은 닉네임을 누구나 사용할 수 있습니다.
- **글 수정/삭제 UI 없음** — 운영자만 Supabase 콘솔에서 처리합니다.
