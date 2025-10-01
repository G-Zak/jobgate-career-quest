/**
 * Test Submission Integration Component
 * Example of how to integrate test history with existing test submission
 */

import React, { useState, useEffect } from 'react';
import testHistoryIntegration from '../services/testHistoryIntegration';

const TestSubmissionIntegration = ({
 testId,
 testType,
 onSubmitTest,
 children
}) => {
 const [testSession, setTestSession] = useState(null);
 const [sessionStarted, setSessionStarted] = useState(false);

 useEffect(() => {
 // Start test session when component mounts
 startTestSession();
 }, [testId]);

 const startTestSession = async () => {
 try {
 const session = await testHistoryIntegration.startTestSession(testId);
 if (session) {
 setTestSession(session);
 setSessionStarted(true);
 console.log(' Test session started:', session.id);
 }
 } catch (error) {
 console.error(' Failed to start test session:', error);
 }
 };

 const handleSubmitTest = async (testData) => {
 try {
 // Call the original submit function
 const result = await onSubmitTest(testData);

 // If submission was successful, save to test history
 if (result && result.success !== false) {
 const historyResult = await testHistoryIntegration.submitTestResults(
 testId,
 testData.answers || {},
 result.score || { percentage_score: 0 },
 testData.duration || 0,
 testData.detailedAnswers || []
 );

 console.log(' Test history saved:', historyResult);

 // Return enhanced result with history info
 return {
 ...result,
 historySaved: historyResult.success,
 historySession: historyResult.historySession
 };
 }

 return result;
 } catch (error) {
 console.error(' Test submission failed:', error);
 throw error;
 }
 };

 // Enhanced submit function that includes test history
 const enhancedSubmitTest = async (answers, score, duration, detailedAnswers = []) => {
 const testData = {
 testId,
 testType,
 answers,
 score,
 duration,
 detailedAnswers,
 sessionId: testSession?.id
 };

 return await handleSubmitTest(testData);
 };

 // Pass enhanced functions to children
 const enhancedChildren = React.Children.map(children, child => {
 if (React.isValidElement(child)) {
 return React.cloneElement(child, {
 onSubmitTest: enhancedSubmitTest,
 testSession,
 sessionStarted
 });
 }
 return child;
 });

 return <>{enhancedChildren}</>;
};

export default TestSubmissionIntegration;

/**
 * Higher-Order Component for easy integration
 */
export const withTestHistory = (WrappedComponent) => {
 return (props) => {
 const [testSession, setTestSession] = useState(null);

 useEffect(() => {
 if (props.testId) {
 testHistoryIntegration.startTestSession(props.testId)
 .then(session => {
 if (session) {
 setTestSession(session);
 }
 })
 .catch(error => {
 console.error('Failed to start test session:', error);
 });
 }
 }, [props.testId]);

 const submitWithHistory = async (testData) => {
 try {
 // Call original submit function if it exists
 let result = testData;
 if (props.onSubmitTest) {
 result = await props.onSubmitTest(testData);
 }

 // Save to test history
 if (result) {
 const historyResult = await testHistoryIntegration.submitTestResults(
 props.testId,
 testData.answers || {},
 testData.score || { percentage_score: 0 },
 testData.duration || 0,
 testData.detailedAnswers || []
 );

 return {
 ...result,
 historySaved: historyResult.success,
 historySession: historyResult.historySession
 };
 }

 return result;
 } catch (error) {
 console.error('Test submission with history failed:', error);
 throw error;
 }
 };

 return (
 <WrappedComponent
 {...props}
 testSession={testSession}
 onSubmitTest={submitWithHistory}
 />
 );
 };
};

/**
 * Hook for test history integration
 */
export const useTestHistoryIntegration = (testId) => {
 const [testSession, setTestSession] = useState(null);
 const [loading, setLoading] = useState(false);

 useEffect(() => {
 if (testId) {
 setLoading(true);
 testHistoryIntegration.startTestSession(testId)
 .then(session => {
 setTestSession(session);
 })
 .catch(error => {
 console.error('Failed to start test session:', error);
 })
 .finally(() => {
 setLoading(false);
 });
 }
 }, [testId]);

 const submitTestWithHistory = async (testData) => {
 try {
 setLoading(true);

 const result = await testHistoryIntegration.submitTestResults(
 testId,
 testData.answers || {},
 testData.score || { percentage_score: 0 },
 testData.duration || 0,
 testData.detailedAnswers || []
 );

 return result;
 } catch (error) {
 console.error('Failed to submit test with history:', error);
 throw error;
 } finally {
 setLoading(false);
 }
 };

 return {
 testSession,
 loading,
 submitTestWithHistory
 };
};
