# Database Schema & Entity Relationship Model

MobileSQL utilizes PostgreSQL 16 managed via Prisma ORM with 15 normalized tables.

---

## Core Entities & Relational Hierarchy

```
  [User] ──┬── (1:N) ──► [QueryHistory]
           ├── (1:N) ──► [SavedQuery]
           ├── (1:N) ──► [LessonProgress] ──► [AcademyLesson] ──► [AcademyModule] ──► [AcademyTrack]
           ├── (1:N) ──► [ChallengeAttempt] ──► [Challenge] ──► [ChallengeTestCase]
           ├── (1:N) ──► [UserCertificate]
           ├── (1:N) ──► [CustomDataset]
           └── (1:N) ──► [AnalyticsDashboard] ──► [AnalyticsWidget]
```

---

## Table Definitions

### 1. `users`
* `id` (String, UUID PK)
* `email` (String, Unique)
* `username` (String, Unique)
* `passwordHash` (String)
* `name` (String)
* `role` (Enum: GUEST, STUDENT, PRO, ARCHITECT, ADMIN)
* `xp` (Integer, Default: 0)
* `level` (Integer, Default: 1)
* `streakDays` (Integer, Default: 0)
* `lastActiveAt` (DateTime)
* `createdAt` / `updatedAt` (DateTime)

### 2. `academy_tracks`
* `id` (String, PK)
* `slug` (String, Unique)
* `title` (String)
* `description` (Text)
* `difficulty` (Enum: FUNDAMENTALS, INTERMEDIATE, ADVANCED, ARCHITECT)
* `orderIndex` (Integer)
* `isPublished` (Boolean)

### 3. `academy_lessons`
* `id` (String, PK)
* `moduleId` (String, FK to academy_modules)
* `slug` (String)
* `title` (String)
* `contentMarkdown` (Text)
* `initialSql` (Text)
* `solutionSql` (Text)
* `xpReward` (Integer, Default: 25)
* `estimatedMin` (Integer)

### 4. `challenges`
* `id` (String, PK)
* `slug` (String, Unique)
* `title` (String)
* `difficulty` (Enum: BEGINNER, INTERMEDIATE, ADVANCED, GURU)
* `category` (String)
* `pointsReward` (Integer)
* `initialSql` (Text)
* `solutionSql` (Text)
* `isDaily` (Boolean)
* `scheduledDate` (DateTime)

---

## Indexing Strategy
* `users(email)`: B-Tree Unique Index for O(1) auth lookups.
* `lesson_progress(userId, lessonId)`: Compound Unique Index for idempotent progress tracking.
* `query_history(userId, createdAt)`: Compound Index for fast reverse-chronological pagination.
* `challenge_attempts(userId, challengeId)`: Optimized lookup for completed challenge badges.
