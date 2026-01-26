/**
 * Shared type definitions and interfaces used across the application.
 */

// User-related types
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  authProvider: 'google' | 'email';
  countryCode?: string;
  language: string;
  timezone: string;
  subscriptionTier: 'free' | 'pro';
  isActive: boolean;
  onboardingCompleted: boolean;
  preferredTrack?: 'trading' | 'finanzas' | 'ambos';
  createdAt: Date;
  updatedAt: Date;
}

// Lesson-related types
export interface LessonCard {
  type: 'concept' | 'example' | 'tip' | 'warning' | 'visual';
  content: string;
  image?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  slug: string;
  trackType: 'trading' | 'finanzas';
  routeId: string;
  levelId: number;
  orderIndex: number;
  version: string;
  title: string;
  subtitle: string;
  objective: string;
  estimatedMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  language: string;
  lessonFormat: 'quiz_only' | 'cards+quiz' | 'scenario+quiz';
  cards?: LessonCard[];
  questions: QuizQuestion[];
  isFree: boolean;
  requiresSubscription: 'free' | 'pro';
  prerequisites?: string[];
  masteryThreshold: number;
  xpRewardBase: number;
  xpBonusStreak: number;
  coinReward: number;
  status: 'draft' | 'in_review' | 'approved' | 'published' | 'deprecated' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Progress-related types
export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: 'locked' | 'available' | 'in_progress' | 'practice_pending' | 'completed' | 'failed' | 'review_suggested';
  startedAt?: Date;
  completedAt?: Date;
  quizScore?: number;
  quizAttempts: number;
  cardsViewed: number;
  timeSpentSeconds: number;
  isPassed: boolean;
  needsReview: boolean;
  xpEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

// Gamification types
export interface DailyStreak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakFreezeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  xpReward: number;
  requirementType: 'streak' | 'lessons_completed' | 'level_up' | 'perfect_score';
  requirementValue: number;
  isHidden: boolean;
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  isVisible: boolean;
}

export interface Ranking {
  id: string;
  userId: string;
  totalXp: number;
  globalRank?: number;
  countryRank?: number;
  lessonsCompleted: number;
  lastCalculated: Date;
}

// Reward/Spin types
export interface Reward {
  id: string;
  rewardType: 'xp_boost' | 'coins' | 'streak_freeze' | 'badge';
  tier: 'common' | 'rare' | 'epic';
  xpValue?: number;
  coinValue?: number;
  icon: string;
  probabilityFree: number;
  probabilityPro: number;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  claimedAt: Date;
  isUsed: boolean;
  usedAt?: Date;
}

export interface DailySpinLog {
  id: string;
  userId: string;
  spinDate: Date;
  spinsUsed: number;
  spinsAvailable: number;
  lastSpinAt: Date;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

// Learning route types
export interface LearningRoute {
  id: string;
  type: 'trading' | 'finanzas';
  title: string;
  description: string;
  levels: number; // Always 20
}

export interface Level {
  id: string;
  routeId: string;
  levelNumber: number; // 1-20
  title: string;
  lessons: Lesson[];
  isUnlocked: boolean;
  progressPercentage: number;
}
