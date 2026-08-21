# QuizReward API Contract

## Authentication
All protected endpoints require a Bearer token in the Authorization header.
`Authorization: Bearer <JWT_TOKEN>`

---

### Auth
- **POST** `/auth/login`
  - Body: `{ "email": "user@example.com", "password": "...", "device_id": "..." }`
  - Response: `{ "token": "...", "user": { ... } }`
- **POST** `/auth/refresh`
  - Body: `{ "refresh_token": "..." }`
- **GET** `/me`
  - Response: User details & wallet balances.

---

### Categories & Questions
- **GET** `/categories`
  - Response: `[{ "id": 1, "name": "General Knowledge", "icon": "..." }]`
- **GET** `/subjects?category_id=1`
- **GET** `/topics?subject_id=1`
- **GET** `/questions?topic_id=1&limit=10`
- **POST** `/quiz/start`
  - Body: `{ "type": "daily|topic|practice", "topic_id": 1 }`
  - Response: `{ "attempt_id": "...", "questions": [...] }`
- **POST** `/quiz/answer`
  - Body: `{ "attempt_id": "...", "question_id": 1, "selected_option": "A", "time_taken_ms": 1500 }`
- **POST** `/quiz/finish`
  - Body: `{ "attempt_id": "..." }`
  - Response: `{ "score": 8, "coins_earned": 10, "reward_earned": 0 }`
- **POST** `/questions/:id/report`
  - Body: `{ "reason": "Wrong answer provided" }`
- **POST** `/questions/:id/bookmark`

---

### Wallet
- **GET** `/wallet`
  - Response: `{ "coins_balance": 150, "reward_balance": 500.0, "pending_balance": 0.0, "paid_balance": 1000.0 }`
- **GET** `/wallet/ledger`
- **POST** `/wallet/withdrawal-request`
  - Body: `{ "amount": 200, "payout_account_id": 1, "idempotency_key": "..." }`
- **GET** `/wallet/withdrawals`

---

### Ads
- **POST** `/ads/reward-claim`
  - Body: `{ "ad_network": "admob", "reward_type": "coins", "reward_amount": 5, "idempotency_key": "..." }`
  - Note: Backend verifies frequency limit and maximum daily allowed ads.
- **GET** `/ads/limits`
  - Response: `{ "daily_limit": 10, "claimed_today": 3 }`

---

### Leaderboard
- **GET** `/leaderboard/daily`
- **GET** `/leaderboard/weekly`
- **GET** `/leaderboard/monthly`

---

### Referral
- **POST** `/referral/apply-code`
  - Body: `{ "code": "FRIEND123" }`
- **GET** `/referral/status`

---

### Admin
- **POST** `/admin/login`
- **GET** `/admin/dashboard`
- **GET/POST/PUT/DELETE** `/admin/questions`
- **POST** `/admin/questions/import-csv`
- **GET** `/admin/withdrawals`
- **POST** `/admin/withdrawals/:id/approve`
- **POST** `/admin/withdrawals/:id/reject`
- **GET** `/admin/fraud-events`
- **GET** `/admin/audit-logs`

---

### Webhooks
- **POST** `/webhooks/payout-provider`
  - Receives async updates from mock payout provider (or RazorpayX/Cashfree).
