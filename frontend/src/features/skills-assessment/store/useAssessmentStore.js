/**
 * Assessment store for managing attempts and metrics
 * Using a simple state management pattern without external dependencies
 */
import React from 'react';

class AssessmentStore {
  constructor() {
    this.state = {
      attempts: [],
      metrics: {
        totalAttempts: 0,
        testsCompleted: 0,
        avgPercentage: 0,
        bestByTest: {},
        lastByTest: {}
      },
      loading: false,
      error: null
    };
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  hydrateAttempts(attempts) {
    const metrics = this.computeMetrics(attempts);
    this.setState({ attempts, metrics, loading: false, error: null });
  }

  addAttempt(attempt) {
    const attempts = [attempt, ...this.state.attempts];
    const metrics = this.computeMetrics(attempts);
    this.setState({ attempts, metrics });
  }

  setLoading(loading) {
    this.setState({ loading });
  }

  setError(error) {
    this.setState({ error, loading: false });
  }

  computeMetrics(attempts) {
    const totalAttempts = attempts.length;
    const byTest = {};
    
    attempts.forEach((attempt) => {
      const testId = attempt.test_id;
      if (!byTest[testId]) {
        byTest[testId] = [];
      }
      byTest[testId].push(attempt);
    });

    let sum = 0;
    let count = 0;
    const bestByTest = {};
    const lastByTest = {};
    let testsCompleted = 0;

    Object.entries(byTest).forEach(([testId, testAttempts]) => {
      // Sort by created_at desc to get last attempt
      testAttempts.sort((a, b) => 
        new Date(b.created_at || b.finished_at) - new Date(a.created_at || a.finished_at)
      );
      
      if (testAttempts.length > 0) {
        lastByTest[testId] = testAttempts[0].percentage || 0;
      }
      
      bestByTest[testId] = Math.max(...testAttempts.map(x => x.percentage || 0));
      
      const completed = testAttempts.some(x => 
        x.result === 'completed' || x.result === 'timeout'
      );
      if (completed) {
        testsCompleted += 1;
      }
      
      testAttempts.forEach(attempt => {
        if (typeof attempt.percentage === 'number') {
          sum += attempt.percentage;
          count += 1;
        }
      });
    });

    const avgPercentage = count ? Math.round(sum / count) : 0;

    return {
      totalAttempts,
      testsCompleted,
      avgPercentage,
      bestByTest,
      lastByTest
    };
  }

  getState() {
    return this.state;
  }
}

// Create a singleton instance
const assessmentStore = new AssessmentStore();

// React hook for using the store
export function useAssessmentStore() {
  const [state, setState] = React.useState(assessmentStore.getState());

  React.useEffect(() => {
    const unsubscribe = assessmentStore.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    hydrateAttempts: (attempts) => assessmentStore.hydrateAttempts(attempts),
    addAttempt: (attempt) => assessmentStore.addAttempt(attempt),
    setLoading: (loading) => assessmentStore.setLoading(loading),
    setError: (error) => assessmentStore.setError(error)
  };
}

export default assessmentStore;
