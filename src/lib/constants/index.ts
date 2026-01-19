/**
 * Application constants and configuration values.
 */

export const APP_NAME = 'Progressia';
export const APP_VERSION = '1.0.0';
export const LANGUAGE_DEFAULT = 'es';

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
} as const;

// Track types
export const TRACK_TYPES = {
  TRADING: 'trading',
  FINANZAS: 'finanzas',
  AMBOS: 'ambos',
} as const;

// Learning limits
export const LEARNING_LIMITS = {
  FREE_LESSONS_PER_DAY: 1,
  PRO_LESSONS_PER_DAY: 999, // Unlimited
  FREE_SPINS_PER_DAY: 1,
  PRO_SPINS_PER_DAY: 3,
  PASSING_SCORE_PERCENT: 70,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  QUIZ_MIN_QUESTIONS: 3,
  QUIZ_MAX_QUESTIONS: 10,
  LESSON_DURATION_MIN: 5,
  LESSON_DURATION_MAX: 10,
  LEVELS_PER_ROUTE: 20,
  ROUTES_COUNT: 2,
} as const;

// Gamification
export const XP_REWARDS = {
  LESSON_BASE: 10,
  LESSON_STREAK_BONUS: 5,
  PERFECT_SCORE: 25,
  FIRST_LESSON: 50,
  MILESTONE_3_DAYS: 100,
  MILESTONE_7_DAYS: 250,
  MILESTONE_10_LESSONS: 200,
} as const;

export const COIN_REWARDS = {
  LESSON_COMPLETION: 5,
  DAILY_LOGIN: 2,
} as const;

// Session
export const SESSION_DURATION_DAYS = 7;
export const SESSION_TIMEOUT_MINUTES = 30;

// API
export const API_TIMEOUT_MS = 10000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 1000;

// Validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const DISPLAY_NAME_MAX_LENGTH = 30;
export const LESSON_TITLE_MAX_LENGTH = 60;
export const LESSON_SUBTITLE_MAX_LENGTH = 140;
export const ANSWER_EXPLANATION_MAX_LENGTH = 500;

// Cache
export const CACHE_DURATION = {
  LESSONS: 3600, // 1 hour
  RANKINGS: 86400, // 24 hours
  USER_PROFILE: 300, // 5 minutes
} as const;
