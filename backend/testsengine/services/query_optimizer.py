"""
Query Optimization Service
=========================

This service provides query optimization utilities and performance monitoring
for the scoring system database operations.

Features:
- Query performance analysis
- Index recommendations
- Query caching strategies
- Database connection optimization
- Query execution monitoring
"""

import time
import logging
from typing import Dict, List, Any, Optional, Tuple
from django.db import connection
from django.core.cache import cache
from django.conf import settings
from contextlib import contextmanager

logger = logging.getLogger(__name__)

class QueryOptimizer:
 """Service for optimizing database queries and performance"""

 def __init__(self):
 self.cache_timeout = getattr(settings, 'QUERY_CACHE_TIMEOUT', 300) # 5 minutes
 self.slow_query_threshold = getattr(settings, 'SLOW_QUERY_THRESHOLD', 100) # 100ms

 @contextmanager
 def query_timer(self, query_name: str):
 """Context manager to time query execution"""
 start_time = time.time()
 try:
 yield
 finally:
 duration = (time.time() - start_time) * 1000 # Convert to milliseconds
 if duration > self.slow_query_threshold:
 logger.warning(f"Slow query detected: {query_name} took {duration:.2f}ms")
 else:
 logger.debug(f"Query {query_name} completed in {duration:.2f}ms")

 def get_cached_query(self, cache_key: str, query_func, *args, **kwargs):
 """Execute query with caching"""
 cached_result = cache.get(cache_key)
 if cached_result is not None:
 logger.debug(f"Cache hit for {cache_key}")
 return cached_result

 logger.debug(f"Cache miss for {cache_key}, executing query")
 result = query_func(*args, **kwargs)
 cache.set(cache_key, result, self.cache_timeout)
 return result

 def analyze_query_performance(self, query: str, params: tuple = None) -> Dict[str, Any]:
 """Analyze query performance using EXPLAIN ANALYZE"""
 with connection.cursor() as cursor:
 start_time = time.time()

 # Get query plan
 explain_query = f"EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) {query}"
 cursor.execute(explain_query, params or ())
 plan = cursor.fetchone()[0][0]

 execution_time = (time.time() - start_time) * 1000

 # Extract performance metrics
 total_cost = plan.get('Total Cost', 0)
 actual_time = plan.get('Actual Total Time', 0)
 rows_returned = plan.get('Actual Rows', 0)

 # Analyze buffer usage
 buffer_info = plan.get('Shared Hit Blocks', 0), plan.get('Shared Read Blocks', 0)

 return {
 'query': query,
 'execution_time_ms': execution_time,
 'total_cost': total_cost,
 'actual_time': actual_time,
 'rows_returned': rows_returned,
 'buffer_hits': buffer_info[0],
 'buffer_reads': buffer_info[1],
 'plan': plan
 }

 def get_table_statistics(self) -> Dict[str, Any]:
 """Get comprehensive table statistics"""
 with connection.cursor() as cursor:
 cursor.execute("""
 SELECT
 schemaname,
 tablename,
 n_tup_ins as inserts,
 n_tup_upd as updates,
 n_tup_del as deletes,
 n_live_tup as live_rows,
 n_dead_tup as dead_rows,
 last_vacuum,
 last_autovacuum,
 last_analyze,
 last_autoanalyze,
 vacuum_count,
 autovacuum_count,
 analyze_count,
 autoanalyze_count
 FROM pg_stat_user_tables
 WHERE schemaname = 'public'
 ORDER BY n_live_tup DESC;
 """)

 tables = cursor.fetchall()

 # Get table sizes
 cursor.execute("""
 SELECT
 tablename,
 pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
 pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
 FROM pg_tables
 WHERE schemaname = 'public'
 ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
 """)

 sizes = {row[0]: {'size': row[1], 'size_bytes': row[2]} for row in cursor.fetchall()}

 # Combine data
 result = {}
 for table in tables:
 table_name = table[1]
 result[table_name] = {
 'inserts': table[2],
 'updates': table[3],
 'deletes': table[4],
 'live_rows': table[5],
 'dead_rows': table[6],
 'last_vacuum': table[7],
 'last_autovacuum': table[8],
 'last_analyze': table[9],
 'last_autoanalyze': table[10],
 'vacuum_count': table[11],
 'autovacuum_count': table[12],
 'analyze_count': table[13],
 'autoanalyze_count': table[14],
 'size': sizes.get(table_name, {}).get('size', 'Unknown'),
 'size_bytes': sizes.get(table_name, {}).get('size_bytes', 0)
 }

 return result

 def get_index_usage_stats(self) -> Dict[str, Any]:
 """Get index usage statistics"""
 with connection.cursor() as cursor:
 cursor.execute("""
 SELECT
 schemaname,
 tablename,
 indexname,
 idx_tup_read,
 idx_tup_fetch,
 idx_scan,
 pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
 pg_relation_size(indexrelid) as index_size_bytes
 FROM pg_stat_user_indexes
 WHERE schemaname = 'public'
 ORDER BY idx_scan DESC;
 """)

 indexes = cursor.fetchall()

 result = {
 'total_indexes': len(indexes),
 'unused_indexes': [],
 'most_used_indexes': [],
 'indexes_by_table': {}
 }

 for index in indexes:
 schema, table, name, reads, fetches, scans, size, size_bytes = index

 index_info = {
 'name': name,
 'reads': reads,
 'fetches': fetches,
 'scans': scans,
 'size': size,
 'size_bytes': size_bytes,
 'efficiency': (fetches / reads * 100) if reads > 0 else 0
 }

 if scans == 0:
 result['unused_indexes'].append({
 'table': table,
 'index': name,
 'size': size
 })
 else:
 result['most_used_indexes'].append({
 'table': table,
 'index': name,
 'scans': scans,
 'efficiency': index_info['efficiency']
 })

 if table not in result['indexes_by_table']:
 result['indexes_by_table'][table] = []
 result['indexes_by_table'][table].append(index_info)

 # Sort by usage
 result['most_used_indexes'].sort(key=lambda x: x['scans'], reverse=True)
 result['unused_indexes'].sort(key=lambda x: x['size'], reverse=True)

 return result

 def get_query_recommendations(self) -> List[Dict[str, Any]]:
 """Get query optimization recommendations"""
 recommendations = []

 with connection.cursor() as cursor:
 # Check for missing indexes on foreign keys
 cursor.execute("""
 SELECT
 t.table_name,
 t.column_name,
 t.constraint_name,
 pg_size_pretty(pg_total_relation_size('public.' || t.table_name)) as table_size
 FROM information_schema.table_constraints tc
 JOIN information_schema.key_column_usage t ON tc.constraint_name = t.constraint_name
 WHERE tc.constraint_type = 'FOREIGN KEY'
 AND tc.table_schema = 'public'
 AND NOT EXISTS (
 SELECT 1 FROM pg_indexes
 WHERE tablename = t.table_name
 AND indexdef LIKE '%' || t.column_name || '%'
 );
 """)

 missing_fk_indexes = cursor.fetchall()

 for table, column, constraint, size in missing_fk_indexes:
 recommendations.append({
 'type': 'missing_foreign_key_index',
 'priority': 'high',
 'table': table,
 'column': column,
 'constraint': constraint,
 'table_size': size,
 'recommendation': f"Create index on {table}.{column} for foreign key constraint {constraint}",
 'sql': f"CREATE INDEX CONCURRENTLY idx_{table}_{column} ON {table} ({column});"
 })

 # Check for tables with high dead tuple ratio
 cursor.execute("""
 SELECT
 tablename,
 n_live_tup,
 n_dead_tup,
 ROUND((n_dead_tup::float / NULLIF(n_live_tup + n_dead_tup, 0)) * 100, 2) as dead_ratio
 FROM pg_stat_user_tables
 WHERE schemaname = 'public'
 AND n_live_tup > 0
 AND (n_dead_tup::float / NULLIF(n_live_tup + n_dead_tup, 0)) > 0.1
 ORDER BY dead_ratio DESC;
 """)

 high_dead_ratio_tables = cursor.fetchall()

 for table, live_tuples, dead_tuples, dead_ratio in high_dead_ratio_tables:
 recommendations.append({
 'type': 'high_dead_tuple_ratio',
 'priority': 'medium',
 'table': table,
 'live_tuples': live_tuples,
 'dead_tuples': dead_tuples,
 'dead_ratio': dead_ratio,
 'recommendation': f"Run VACUUM on {table} - {dead_ratio}% dead tuples",
 'sql': f"VACUUM ANALYZE {table};"
 })

 # Check for tables without recent analyze
 cursor.execute("""
 SELECT
 tablename,
 last_analyze,
 last_autoanalyze,
 n_live_tup
 FROM pg_stat_user_tables
 WHERE schemaname = 'public'
 AND n_live_tup > 1000
 AND (last_analyze IS NULL OR last_analyze < NOW() - INTERVAL '7 days')
 AND (last_autoanalyze IS NULL OR last_autoanalyze < NOW() - INTERVAL '7 days')
 ORDER BY n_live_tup DESC;
 """)

 stale_stats_tables = cursor.fetchall()

 for table, last_analyze, last_autoanalyze, live_tuples in stale_stats_tables:
 recommendations.append({
 'type': 'stale_statistics',
 'priority': 'low',
 'table': table,
 'live_tuples': live_tuples,
 'last_analyze': last_analyze,
 'last_autoanalyze': last_autoanalyze,
 'recommendation': f"Update statistics for {table} - last analyzed: {last_analyze or 'Never'}",
 'sql': f"ANALYZE {table};"
 })

 return recommendations

 def optimize_connection_pool(self) -> Dict[str, Any]:
 """Get connection pool optimization recommendations"""
 with connection.cursor() as cursor:
 # Get current connection stats
 cursor.execute("""
 SELECT
 count(*) as total_connections,
 count(*) FILTER (WHERE state = 'active') as active_connections,
 count(*) FILTER (WHERE state = 'idle') as idle_connections,
 count(*) FILTER (WHERE state = 'idle in transaction') as idle_in_transaction
 FROM pg_stat_activity
 WHERE datname = current_database();
 """)

 conn_stats = cursor.fetchone()

 # Get database settings
 cursor.execute("""
 SELECT
 name,
 setting,
 unit,
 context
 FROM pg_settings
 WHERE name IN (
 'max_connections',
 'shared_buffers',
 'effective_cache_size',
 'work_mem',
 'maintenance_work_mem'
 );
 """)

 settings = {row[0]: {'value': row[1], 'unit': row[2], 'context': row[3]} for row in cursor.fetchall()}

 return {
 'connection_stats': {
 'total': conn_stats[0],
 'active': conn_stats[1],
 'idle': conn_stats[2],
 'idle_in_transaction': conn_stats[3]
 },
 'settings': settings,
 'recommendations': self._get_connection_recommendations(conn_stats, settings)
 }

 def _get_connection_recommendations(self, conn_stats: tuple, settings: dict) -> List[str]:
 """Get connection pool recommendations"""
 recommendations = []

 total, active, idle, idle_in_transaction = conn_stats

 if idle_in_transaction > 0:
 recommendations.append(f"Warning: {idle_in_transaction} connections idle in transaction")

 if idle > active * 2:
 recommendations.append(f"Consider reducing connection pool size - {idle} idle vs {active} active")

 max_conn = int(settings.get('max_connections', {}).get('value', 100))
 if total > max_conn * 0.8:
 recommendations.append(f"High connection usage: {total}/{max_conn} connections used")

 return recommendations

 def get_performance_summary(self) -> Dict[str, Any]:
 """Get comprehensive performance summary"""
 return {
 'timestamp': time.time(),
 'table_stats': self.get_table_statistics(),
 'index_stats': self.get_index_usage_stats(),
 'recommendations': self.get_query_recommendations(),
 'connection_pool': self.optimize_connection_pool()
 }

# Query optimization decorators and utilities
def cache_query(cache_key: str, timeout: int = 300):
 """Decorator to cache query results"""
 def decorator(func):
 def wrapper(*args, **kwargs):
 optimizer = QueryOptimizer()
 return optimizer.get_cached_query(cache_key, func, *args, **kwargs)
 return wrapper
 return decorator

def monitor_query(query_name: str):
 """Decorator to monitor query performance"""
 def decorator(func):
 def wrapper(*args, **kwargs):
 optimizer = QueryOptimizer()
 with optimizer.query_timer(query_name):
 return func(*args, **kwargs)
 return wrapper
 return decorator

# Predefined optimized queries
class OptimizedQueries:
 """Collection of optimized queries for common operations"""

 @staticmethod
 def get_test_questions_optimized(test_id: int, limit: int = None) -> str:
 """Optimized query for getting test questions"""
 limit_clause = f"LIMIT {limit}" if limit else ""
 return f"""
 SELECT
 q.id,
 q.question_text,
 q.question_type,
 q.difficulty_level,
 q.scoring_coefficient,
 q.options,
 q."order"
 FROM testsengine_question q
 WHERE q.test_id = %s
 ORDER BY q."order"
 {limit_clause};
 """

 @staticmethod
 def get_user_submissions_optimized(user_id: int, test_id: int = None) -> str:
 """Optimized query for getting user submissions"""
 where_clause = "WHERE ts.user_id = %s"
 params = [user_id]

 if test_id:
 where_clause += " AND ts.test_id = %s"
 params.append(test_id)

 return f"""
 SELECT
 ts.id,
 ts.test_id,
 ts.submitted_at,
 ts.time_taken_seconds,
 ts.is_complete,
 ts.submission_metadata,
 s.raw_score,
 s.percentage_score,
 s.grade_letter,
 s.passed
 FROM testsengine_testsubmission ts
 LEFT JOIN testsengine_score s ON ts.id = s.submission_id
 {where_clause}
 ORDER BY ts.submitted_at DESC;
 """, params

 @staticmethod
 def get_leaderboard_optimized(test_id: int, limit: int = 10) -> str:
 """Optimized query for getting leaderboard"""
 return f"""
 SELECT
 ts.user_id,
 u.username,
 s.raw_score,
 s.percentage_score,
 s.grade_letter,
 ts.submitted_at,
 ts.time_taken_seconds
 FROM testsengine_testsubmission ts
 JOIN auth_user u ON ts.user_id = u.id
 JOIN testsengine_score s ON ts.id = s.submission_id
 WHERE ts.test_id = %s
 AND ts.is_complete = true
 ORDER BY s.percentage_score DESC, ts.submitted_at ASC
 LIMIT {limit};
 """

 @staticmethod
 def get_test_analytics_optimized(test_id: int) -> str:
 """Optimized query for test analytics"""
 return """
 SELECT
 COUNT(ts.id) as total_submissions,
 COUNT(CASE WHEN ts.is_complete THEN 1 END) as completed_submissions,
 AVG(s.percentage_score) as avg_score,
 MIN(s.percentage_score) as min_score,
 MAX(s.percentage_score) as max_score,
 AVG(ts.time_taken_seconds) as avg_time,
 COUNT(CASE WHEN s.passed THEN 1 END) as passed_count
 FROM testsengine_testsubmission ts
 LEFT JOIN testsengine_score s ON ts.id = s.submission_id
 WHERE ts.test_id = %s;
 """
