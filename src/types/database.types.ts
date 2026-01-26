/**
 * Database type definitions for Supabase tables.
 * These types are auto-generated from your Supabase schema.
 *
 * To regenerate these types after schema changes:
 * npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
 *
 * Tables:
 * - User: User accounts and profile info
 * - Lesson: Educational content metadata
 * - UserProgress: User progress tracking per lesson
 * - DailyStreak: User streak tracking
 * - Achievement: Achievement definitions
 * - UserAchievement: User achievement tracking
 * - Ranking: User ranking data
 * - Reward: Reward wheel definitions
 * - UserReward: User reward tracking
 * - DailySpinLog: Daily spin tracking
 */

export interface Database {
  public: {
    Tables: {
      user: {
        Row: {
          id: string;
          email: string;
          display_name?: string;
          auth_provider: 'google' | 'email';
          country_code?: string;
          language: string;
          timezone: string;
          subscription_tier: 'free' | 'pro';
          is_active: boolean;
          onboarding_completed: boolean;
          preferred_track?: 'trading' | 'finanzas' | 'ambos';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user']['Insert']>;
      };
      lesson: {
        Row: {
          id: string;
          slug: string;
          track_type: 'trading' | 'finanzas';
          route_id: string;
          level_id: number;
          order_index: number;
          version: string;
          title: string;
          subtitle: string;
          objective: string;
          estimated_minutes: number;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          tags?: string[];
          language: string;
          lesson_format: 'quiz_only' | 'cards+quiz' | 'scenario+quiz';
          cards?: object[];
          questions: object[];
          is_free: boolean;
          requires_subscription: 'free' | 'pro';
          prerequisites?: string[];
          mastery_threshold: number;
          xp_reward_base: number;
          xp_bonus_streak: number;
          coin_reward: number;
          status: 'draft' | 'in_review' | 'approved' | 'published' | 'deprecated' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lesson']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['lesson']['Insert']>;
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: 'locked' | 'available' | 'in_progress' | 'practice_pending' | 'completed' | 'failed' | 'review_suggested';
          started_at?: string;
          completed_at?: string;
          quiz_score?: number;
          quiz_attempts: number;
          cards_viewed: number;
          time_spent_seconds: number;
          is_passed: boolean;
          needs_review: boolean;
          xp_earned: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_progress']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_progress']['Insert']>;
      };
      daily_streak: {
        Row: {
          id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string;
          streak_freeze_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['daily_streak']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['daily_streak']['Insert']>;
      };
      achievement: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          icon: string;
          tier: 'bronze' | 'silver' | 'gold' | 'platinum';
          xp_reward: number;
          requirement_type: 'streak' | 'lessons_completed' | 'level_up' | 'perfect_score';
          requirement_value: number;
          is_hidden: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['achievement']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['achievement']['Insert']>;
      };
      user_achievement: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
          is_visible: boolean;
        };
        Insert: Omit<Database['public']['Tables']['user_achievement']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['user_achievement']['Insert']>;
      };
      ranking: {
        Row: {
          id: string;
          user_id: string;
          total_xp: number;
          global_rank?: number;
          country_rank?: number;
          lessons_completed: number;
          last_calculated: string;
        };
        Insert: Omit<Database['public']['Tables']['ranking']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['ranking']['Insert']>;
      };
      reward: {
        Row: {
          id: string;
          reward_type: 'xp_boost' | 'coins' | 'streak_freeze' | 'badge';
          tier: 'common' | 'rare' | 'epic';
          xp_value?: number;
          coin_value?: number;
          icon: string;
          probability_free: number;
          probability_pro: number;
        };
        Insert: Omit<Database['public']['Tables']['reward']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['reward']['Insert']>;
      };
      user_reward: {
        Row: {
          id: string;
          user_id: string;
          reward_id: string;
          claimed_at: string;
          is_used: boolean;
          used_at?: string;
        };
        Insert: Omit<Database['public']['Tables']['user_reward']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['user_reward']['Insert']>;
      };
      daily_spin_log: {
        Row: {
          id: string;
          user_id: string;
          spin_date: string;
          spins_used: number;
          spins_available: number;
          last_spin_at: string;
        };
        Insert: Omit<Database['public']['Tables']['daily_spin_log']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['daily_spin_log']['Insert']>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
