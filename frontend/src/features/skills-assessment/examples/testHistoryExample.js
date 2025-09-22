/**
 * Example usage of Test History API
 * This file demonstrates how to use the TestHistoryService
 */

import TestHistoryService from '../services/testHistoryService';

// Example 1: Save a test session result
export const saveTestSessionExample = async () => {
  try {
    const testData = {
      user_id: null, // Anonymous user
      test_id: 1, // VRT1 - Reading Comprehension
      score: 85.5,
      percentage_score: 85.5,
      correct_answers: 17,
      total_questions: 20,
      duration_minutes: 18,
      details: {
        answers: {
          "1": "A",
          "2": "B", 
          "3": "C",
          // ... more answers
        },
        metadata: {
          test_type: "VRT1",
          difficulty: "mixed",
          time_per_question: 54 // seconds
        }
      },
      is_completed: true
    };

    const result = await TestHistoryService.saveTestHistory(testData);
    console.log('Test session saved:', result);
    return result;
  } catch (error) {
    console.error('Error saving test session:', error);
  }
};

// Example 2: Get user's test history
export const getUserHistoryExample = async () => {
  try {
    const filters = {
      test_type: 'verbal_reasoning',
      date_from: '2024-01-01',
      date_to: '2024-12-31',
      limit: 20,
      offset: 0
    };

    const history = await TestHistoryService.getUserTestHistory('anonymous', filters);
    console.log('User test history:', history);
    return history;
  } catch (error) {
    console.error('Error fetching test history:', error);
  }
};

// Example 3: Get detailed test session
export const getTestSessionDetailExample = async (sessionId) => {
  try {
    const detail = await TestHistoryService.getTestHistoryDetail(sessionId);
    console.log('Test session detail:', detail);
    return detail;
  } catch (error) {
    console.error('Error fetching test session detail:', error);
  }
};

// Example 4: Get test history statistics
export const getTestHistoryStatsExample = async () => {
  try {
    const stats = await TestHistoryService.getTestHistoryStats('anonymous');
    console.log('Test history statistics:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching test history stats:', error);
  }
};

// Example 5: Delete a test session
export const deleteTestSessionExample = async (sessionId) => {
  try {
    const success = await TestHistoryService.deleteTestHistory(sessionId);
    console.log('Test session deleted:', success);
    return success;
  } catch (error) {
    console.error('Error deleting test session:', error);
  }
};

// Example 6: Format history entry for display
export const formatHistoryEntryExample = (rawEntry) => {
  const formatted = TestHistoryService.formatHistoryEntry(rawEntry);
  console.log('Formatted entry:', formatted);
  return formatted;
};

// Example 7: Get color classes for UI
export const getColorClassesExample = () => {
  const gradeColors = {
    'A': TestHistoryService.getGradeColor('A'),
    'B': TestHistoryService.getGradeColor('B'),
    'C': TestHistoryService.getGradeColor('C'),
    'D': TestHistoryService.getGradeColor('D'),
    'F': TestHistoryService.getGradeColor('F')
  };

  const categoryColors = {
    'verbal_reasoning': TestHistoryService.getCategoryColor('verbal_reasoning'),
    'numerical_reasoning': TestHistoryService.getCategoryColor('numerical_reasoning'),
    'logical_reasoning': TestHistoryService.getCategoryColor('logical_reasoning')
  };

  console.log('Grade colors:', gradeColors);
  console.log('Category colors:', categoryColors);
  
  return { gradeColors, categoryColors };
};

// Example 8: Complete workflow - take test and save history
export const completeTestWorkflowExample = async () => {
  try {
    // 1. Simulate taking a test
    const testAnswers = {
      "1": "A",
      "2": "B",
      "3": "C",
      "4": "A",
      "5": "D"
    };

    const testMetadata = {
      test_type: "VRT1",
      start_time: Date.now() - 1200000, // 20 minutes ago
      end_time: Date.now(),
      difficulty: "mixed"
    };

    // 2. Calculate results (this would normally come from backend scoring)
    const correctAnswers = 4;
    const totalQuestions = 5;
    const percentageScore = (correctAnswers / totalQuestions) * 100;
    const durationMinutes = 20;

    // 3. Save to test history
    const historyData = {
      user_id: null,
      test_id: 1,
      score: percentageScore,
      percentage_score: percentageScore,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      duration_minutes: durationMinutes,
      details: {
        answers: testAnswers,
        metadata: testMetadata
      },
      is_completed: true
    };

    const savedSession = await TestHistoryService.saveTestHistory(historyData);
    console.log('Test completed and saved:', savedSession);

    // 4. Get updated statistics
    const stats = await TestHistoryService.getTestHistoryStats('anonymous');
    console.log('Updated statistics:', stats);

    return { savedSession, stats };
  } catch (error) {
    console.error('Error in complete test workflow:', error);
  }
};

// Export all examples
export default {
  saveTestSessionExample,
  getUserHistoryExample,
  getTestSessionDetailExample,
  getTestHistoryStatsExample,
  deleteTestSessionExample,
  formatHistoryEntryExample,
  getColorClassesExample,
  completeTestWorkflowExample
};
