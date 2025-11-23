-- Create daily analytics view
CREATE OR REPLACE VIEW daily_analytics AS
SELECT 
  DATE(created_at) as date,
  event_category,
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions
FROM user_activity_logs
GROUP BY DATE(created_at), event_category, event_type
ORDER BY date DESC;

-- Create hourly analytics view for real-time dashboard
CREATE OR REPLACE VIEW hourly_analytics AS
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  event_category,
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users
FROM user_activity_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', created_at), event_category, event_type
ORDER BY hour DESC;