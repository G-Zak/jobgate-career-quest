/**
 * Custom hook for managing test history functionality
 */

import { useState, useCallback } from 'react';
import testHistoryApi from '../services/testHistoryApi';

export const useTestHistory = () => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 const createTestSession = useCallback(async (testId) => {
 try {
 setLoading(true);
 setError(null);
 const session = await testHistoryApi.createTestSession(testId);
 return session;
 } catch (err) {
 setError(err.message);
 throw err;
 } finally {
 setLoading(false);
 }
 }, []);

 const submitTestSession = useCallback(async (sessionData) => {
 try {
 setLoading(true);
 setError(null);
 const result = await testHistoryApi.submitTestSession(sessionData);
 return result;
 } catch (err) {
 setError(err.message);
 throw err;
 } finally {
 setLoading(false);
 }
 }, []);

 const getTestSessions = useCallback(async () => {
 try {
 setLoading(true);
 setError(null);
 const sessions = await testHistoryApi.getTestSessions();
 return sessions;
 } catch (err) {
 setError(err.message);
 throw err;
 } finally {
 setLoading(false);
 }
 }, []);

 const getTestHistorySummary = useCallback(async () => {
 try {
 setLoading(true);
 setError(null);
 const summary = await testHistoryApi.getTestHistorySummary();
 return summary;
 } catch (err) {
 setError(err.message);
 throw err;
 } finally {
 setLoading(false);
 }
 }, []);

 const getTestCategoryStats = useCallback(async () => {
 try {
 setLoading(true);
 setError(null);
 const stats = await testHistoryApi.getTestCategoryStats();
 return stats;
 } catch (err) {
 setError(err.message);
 throw err;
 } finally {
 setLoading(false);
 }
 }, []);

 const getTestHistoryCharts = useCallback(async () => {
 try {
 setLoading(true);
 setError(null);
 const charts = await testHistoryApi.getTestHistoryCharts();
 return charts;
 } catch (err) {
 setError(err.message);
 throw err;
 } finally {
 setLoading(false);
 }
 }, []);

 const deleteTestSession = useCallback(async (sessionId) => {
 try {
 setLoading(true);
 setError(null);
 await testHistoryApi.deleteTestSession(sessionId);
 } catch (err) {
 setError(err.message);
 throw err;
 } finally {
 setLoading(false);
 }
 }, []);

 return {
 loading,
 error,
 createTestSession,
 submitTestSession,
 getTestSessions,
 getTestHistorySummary,
 getTestCategoryStats,
 getTestHistoryCharts,
 deleteTestSession
 };
};

export default useTestHistory;
