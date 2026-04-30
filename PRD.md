
## Metadata
- Interview ID: thought-board-2026-04-30
- Rounds: 5
- Final Ambiguity Score: **15.9%**
- Type: greenfield
- Generated: 2026-04-30
- Threshold: 0.2 (20%)
- Initial Context Summarized: no
- Status: **PASSED** (early — clarity threshold reached at round 5)

## Clarity Breakdown

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.88 | 0.40 | 0.352 |
| Constraint Clarity | 0.78 | 0.30 | 0.234 |
| Success Criteria | 0.85 | 0.30 | 0.255 |
| **Total Clarity** | | | **0.841** |
| **Ambiguity** | | | **0.159** |

## Goal

웹 브라우저로 접속한 친구·지인들이 닉네임과 함께 떠오르는 생각을 자유롭게 적어 올리고, 모든 글이 **하나의 메인 대시보드에 최신순 채팅 말풍선 형태로 실시간 누적**되는 가벼운 공유 보드. 입력은 화면 하단 채팅 입력창에서 일어나고, 새 글은 **모든 접속자 화면에 1초 이내 자동으로 나타남**. 닉네임은 매 글마다 새로 입력하는 일회성 라벨이며, 글은 영구 보존되지만 시각적 톤(파스텔·말풍선)이 "덜 해로워 보이는" 분위기를 책임진다.

**한 문장 정리**: "친구들끼리 익숙한 메신저 룩으로, 일회성 닉네임을 달고 가벼운 생각을 쏟아 영원히 쌓아두는 공용 채팅 보드".

## Constraints

- **공개 범위**: 친구/지인만 — URL을 아는 사람이 접속. 검색·SNS 노출 의도 없음
- **인증**: **없음** — 닉네임은 일회성 라벨, 매 글마다 새로 입력 (localStorage 저장 안 함)
- **실시간성**: 새 글은 **WebSocket/Realtime 채널을 통해 1초 이내** 모든 뷰어 화면에 자동 반영
- **보존**: **영구** — 모든 글이 DB에 남고, 메인 화면 무한 스크롤로 과거 글까지 접근 가능
- **확장성 가정**: 친구 한정이므로 **수십~수백 명, 일 수십~수백 글** 수준. BaaS 무료 티어로 충분
- **글 길이**: 최대 500자 (UI 깨짐 방지)
- **글 형식**: 텍스트 only. 줄바꿈·이모지 허용. 이미지·파일 업로드 없음. URL은 자동 링크 처리하지 않고 일반 텍스트로 표시(피싱·외부 유도 방지)
- **글 삭제/수정**: 사용자 수정·삭제 기능 없음 (일회성 닉네임 = 본인 인증 불가). 운영자가 DB에서 직접 지울 수 있도록만 둠
- **모더레이션**: 자동 필터 없음. 친구 한정 + 시각적 톤으로 자기 검열에 맡김. 운영자 수동 삭제 경로만 확보
- **시각 톤**: **파스텔 + 둥근 채팅 말풍선 메신저 룩**. 닉네임은 말풍선 옆/위에 표시. "덜 해로워 보이게"는 전적으로 이 시각 톤이 책임짐
- **반응형**: 모바일·데스크톱 모두 사용 가능 (친구가 폰으로도 접속할 가능성 높음)

## Non-Goals

- ❌ 회원가입/로그인 시스템
- ❌ 글 수정·삭제 UI (사용자 측)
- ❌ 좋아요·댓글·답글·스레드
- ❌ 이미지·파일·동영상 업로드
- ❌ 알림(푸시·이메일)
- ❌ 검색·태그·카테고리
- ❌ 자동 욕설/유해어 필터
- ❌ 휘발성 글(자동 삭제) — 명시적으로 거부됨 (Round 4 Contrarian)
- ❌ 다국어 i18n
- ❌ 다크 모드 (단일 파스텔 라이트 톤)
- ❌ 관리자 대시보드 UI (운영자는 BaaS 콘솔에서 직접 처리)

## Acceptance Criteria

기능 (functional):
- [ ] 메인 화면 접속 시 모든 과거 글이 **최신 순**으로 화면에 표시된다
- [ ] 화면 하단 입력창에 닉네임과 본문을 입력하고 전송하면, **본인 화면에 즉시** 새 말풍선이 나타난다 (Optimistic UI)
- [ ] 같은 시각 다른 사용자의 화면에도 **1초 이내**에 자동으로 새 말풍선이 추가된다 (수동 새로고침 불필요)
- [ ] 입력 시각이 자동으로 기록되고 각 말풍선에 표시된다 ("방금 전", "5분 전", 또는 절대시각)
- [ ] 닉네임 미입력 또는 본문 미입력 시 전송 버튼이 비활성화되거나 에러 표시
- [ ] 본문 500자 초과 시 입력 차단 또는 명시적 안내
- [ ] 무한 스크롤로 과거 글까지 끊김 없이 로드됨

UI/디자인:
- [ ] 말풍선이 둥근 모서리 + 파스텔 색상 (예: 분홍·하늘·연노랑·연보라 중 닉네임 해시로 자동 배정)
- [ ] 닉네임이 말풍선 위 또는 옆에 작게 표시
- [ ] 입력창은 메신저 앱처럼 화면 하단 고정, 닉네임 + 본문 두 칸 + 전송 버튼
- [ ] 모바일 폭에서도 가독성·터치성 보장 (말풍선 너비 90% 이내)
- [ ] 폰트는 둥글고 친근한 sans-serif (예: Pretendard, Pretendard Variable, 또는 system-ui)

비기능:
- [ ] 첫 방문 페이지 로드 < 2초 (무료 티어 기준)
- [ ] 새 글 게시 → 다른 클라이언트 표시까지 < 1초
- [ ] 오프라인/네트워크 끊김 시 사용자에게 명확히 알림

## Assumptions Exposed & Resolved

| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| "공개 게시판" → 인터넷 누구나 가정 | 누구에게 도달? | **친구 한정 (링크 공유)** → 인증·모더레이션·확장 모두 단순화 |
| "즉시 업로드" 의미 모호 | 실시간 푸시인가, 폴링인가, 수동 새로고침인가? | **실시간 (WebSocket/Realtime)** → BaaS 사용 결정 |
| 닉네임 = 사용자 정체성 가정 | 사람에 묶이나 글에 묶이나? | **글에 묶임 (일회성 라벨)** → User 엔티티 제거, Thought.nickname 필드로 흡수 |
| 게시판 = 영구 보존 무의식 가정 | 휘발성으로 가면 더 안전하지 않나? (Contrarian) | **명시적으로 영구 보존 선택** → harm-mitigation은 디자인의 몫 |
| "단순+귀여움" 시각적 정의 부재 | 어떤 메타포? | **채팅 말풍선 + 파스텔** → 테스트 가능한 디자인 기준 확보 |

## Technical Context (Confirmed Stack)

사용자 확정: **Supabase 기반**. 나머지 layer는 Supabase와 가장 자연스럽게 결합되는 조합으로 고정.

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | **Next.js 15 (App Router) + TypeScript** | Vercel 1-click 배포, Supabase Auth/SSR helper 1급 지원 |
| UI | **Tailwind CSS** + 자체 말풍선 컴포넌트 (선택적으로 shadcn/ui 일부) | 빠른 개발, 모바일 반응형 |
| Realtime + DB | **Supabase Realtime + Postgres** (무료 티어) | 실시간 채널 내장, SQL 기반, RLS로 권한 처리, 운영자가 콘솔에서 글 삭제 가능 |
| Client SDK | `@supabase/supabase-js` v2 + `@supabase/ssr` | 공식, 타입 안전 |
| Hosting | **Vercel Hobby** | Next.js 최적, 친구 한정 트래픽엔 무료로 충분 |
| Font | **Pretendard Variable** (CDN 또는 npm) | 한글 가독성 + 친근한 느낌 |
| Time formatting | **date-fns** (ko locale) | "5분 전" 같은 상대시각 |

## Ontology (Key Entities)

| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| Thought | core domain | id (uuid), nickname (string, ≤30자), content (string, ≤500자), created_at (timestamptz, server-side) | (none — flat) |
| Board | conceptual container | (단일 인스턴스, 별도 엔티티 없음) | has many Thoughts |

User/Poster 엔티티는 **명시적으로 제거됨** — 닉네임이 일회성 라벨로 결정되면서 Thought.nickname 필드로 흡수.

## Ontology Convergence

| Round | Entity Count | New | Changed | Removed | Stable | Stability |
|-------|-------------|-----|---------|---------|--------|-----------|
| 1 | 3 (Thought, Poster, Board) | 3 | - | - | - | N/A (round 1) |
| 2 | 3 (Thought, Poster, Board) | 0 | 0 | 0 | 3 | 100% |
| 3 | 2 (Thought, Board) | 0 | 0 | 1 (Poster — 일회성 결정으로 흡수) | 2 | 67% (재구조화) |
| 4 | 2 (Thought, Board) | 0 | 0 | 0 | 2 | 100% |
| 5 | 2 (Thought, Board) | 0 | 0 | 0 | 2 | 100% |

도메인 모델은 Round 3에서 재구조화(User 제거) → Round 4–5에서 100% 안정화. 매우 단순한 도메인.

## DB Schema (제안)

```sql
create table thoughts (
  id          uuid primary key default gen_random_uuid(),
  nickname    text not null check (char_length(nickname) between 1 and 30),
  content     text not null check (char_length(content) between 1 and 500),
  created_at  timestamptz not null default now()
);

create index thoughts_created_at_desc on thoughts (created_at desc);

-- Realtime publication
alter publication supabase_realtime add table thoughts;

-- RLS: anyone can read, anyone can insert, no one can update/delete (operator uses service role)
alter table thoughts enable row level security;

create policy "anyone can read thoughts"
  on thoughts for select
  using (true);

create policy "anyone can insert thoughts"
  on thoughts for insert
  with check (true);
```

## Interview Transcript

<details>
<summary>Full Q&A (5 rounds)</summary>

### Round 1 — Constraint Clarity
**Q:** 이 생각 게시판은 누구에게 공개되나요?
**A:** 친구/지인만 (링크 공유)
**Ambiguity after:** 42.5% (Goal: 0.65, Constraints: 0.55, Criteria: 0.50)

### Round 2 — Success Criteria
**Q:** 친구가 새 생각을 올렸을 때, 내가 페이지를 보고 있으면 어떻게 나타나면 좋겠어요?
**A:** 자동으로 즉시 떨어지듯 나타남 (실시간)
**Ambiguity after:** 33.5% (Goal: 0.65, Constraints: 0.65, Criteria: 0.70)

### Round 3 — Goal Clarity
**Q:** 닉네임은 사람에 묶이나요, 글에 묶이나요?
**A:** 매번 입력 (일회성)
**Ambiguity after:** 28.3% (Goal: 0.78, Constraints: 0.65, Criteria: 0.70)

### Round 4 — Constraint Clarity (🔄 Contrarian Mode)
**Q:** 올라온 생각은 얼마나 오래 남아있어야 하나요? *(Contrarian: 휘발성을 도전)*
**A:** 영구 보존
**Ambiguity after:** 21.6% (Goal: 0.85, Constraints: 0.78, Criteria: 0.70)

### Round 5 — Success Criteria
**Q:** "단순하고 귀여운, 이상한 글도 덜 해로워 보이는" 느낌은 어떤 시각적 메타포에 가까울까요?
**A:** 채팅 말풍선 (메신저 느낌, 파스텔)
**Ambiguity after:** **15.9%** ✅ (Goal: 0.88, Constraints: 0.78, Criteria: 0.85)

</details>

## Open Decisions for Execution Phase

명세는 위에서 정해졌고, 실행(ralplan/autopilot) 단계에서 사용자가 마지막으로 확인·확정할 사항:

1. **도메인**: 별도 도메인 살지 vs `*.vercel.app` 무료 도메인 사용
2. **Supabase 프로젝트 셋업**: 사용자가 신규 프로젝트 생성 후 URL + anon key 제공 필요 (1–2분)
3. **글 색상 자동 배정 로직**: 닉네임 해시 → 4–5색 파스텔 풀에서 결정 (vs 완전 랜덤)
4. **첫 진입 시 빈 보드 onboarding 메시지**: "첫 생각을 적어주세요" 같은 placeholder
5. **상대시각 vs 절대시각 표기**: "5분 전" 기본, hover 시 절대시각 툴팁?