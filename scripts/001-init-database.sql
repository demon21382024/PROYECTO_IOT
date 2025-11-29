-- PurrTech Database Schema
-- Initialize tables for IoT smart litter box application

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  plan_id VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cats table (user can have multiple cats)
CREATE TABLE IF NOT EXISTS cats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  breed VARCHAR(255),
  date_of_birth DATE,
  weight_kg DECIMAL(5, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Litter box visits table (IoT sensor data)
CREATE TABLE IF NOT EXISTS litter_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id UUID NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
  visit_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  duration_seconds INT,
  weight_kg DECIMAL(5, 2),
  anomaly_detected BOOLEAN DEFAULT FALSE,
  anomaly_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health alerts table
CREATE TABLE IF NOT EXISTS health_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cat_id UUID NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
  alert_type VARCHAR(100) NOT NULL,
  severity VARCHAR(50),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price_monthly DECIMAL(10, 2),
  max_cats INT,
  history_days INT,
  features JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id VARCHAR(255),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cats_user_id ON cats(user_id);
CREATE INDEX idx_litter_visits_cat_id ON litter_visits(cat_id);
CREATE INDEX idx_litter_visits_timestamp ON litter_visits(visit_timestamp);
CREATE INDEX idx_health_alerts_cat_id ON health_alerts(cat_id);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, price_monthly, max_cats, history_days, features)
VALUES 
  ('free', 'Gratuito', 0.00, 1, 1, '{"realtime_monitoring": true, "basic_alerts": true}'),
  ('vip', 'VIP', 9.99, 2, 30, '{"realtime_monitoring": true, "advanced_alerts": true, "trend_analysis": true}'),
  ('black', 'BLACK', 19.99, 999, 36500, '{"realtime_monitoring": true, "ai_diagnostics": true, "pdf_reports": true, "api_access": true}');
