import { TestSubmission, SyncStatus, NetworkCondition } from '../types';
import { INITIAL_SUBMISSIONS } from './mockData';

const STORAGE_KEY_SUBMISSIONS = 'sports_talent_submissions_v1';
const STORAGE_KEY_NETWORK = 'sports_talent_network_condition_v1';

export class OfflineStorageManager {
  private static subscribers: Array<() => void> = [];

  static subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private static notify() {
    this.subscribers.forEach(cb => cb());
  }

  static getNetworkCondition(): NetworkCondition {
    const saved = localStorage.getItem(STORAGE_KEY_NETWORK);
    return (saved as NetworkCondition) || 'online';
  }

  static setNetworkCondition(condition: NetworkCondition) {
    localStorage.setItem(STORAGE_KEY_NETWORK, condition);
    this.notify();
  }

  static getSubmissions(): TestSubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
        return INITIAL_SUBMISSIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  }

  static saveSubmissionLocally(submission: TestSubmission): TestSubmission {
    const network = this.getNetworkCondition();
    const current = this.getSubmissions();

    // If offline or poor 2G, set status to pending or retry
    const initialSyncStatus: SyncStatus = network === 'offline' ? 'pending' : (network === 'slow2g' ? 'pending' : 'synced');
    const enriched: TestSubmission = {
      ...submission,
      localId: submission.localId || `local_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      syncStatus: initialSyncStatus,
      syncedAt: initialSyncStatus === 'synced' ? new Date().toISOString() : undefined,
    };

    const updated = [enriched, ...current];
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(updated));
    this.notify();
    return enriched;
  }

  static getPendingSubmissions(): TestSubmission[] {
    const all = this.getSubmissions();
    return all.filter(s => s.syncStatus === 'pending' || s.syncStatus === 'retry' || s.syncStatus === 'failed');
  }

  static async syncPendingSubmissions(): Promise<{ syncedCount: number; failedCount: number }> {
    const network = this.getNetworkCondition();
    if (network === 'offline') {
      throw new Error('Cannot synchronize while offline. Please connect to internet.');
    }

    const all = this.getSubmissions();
    let syncedCount = 0;
    let failedCount = 0;

    // Simulate network latency (faster on 4G, slower on 2G)
    const delay = network === 'slow2g' ? 1800 : 700;

    const updated = await Promise.all(
      all.map(async (sub) => {
        if (sub.syncStatus === 'pending' || sub.syncStatus === 'retry' || sub.syncStatus === 'failed') {
          // Mark uploading temporarily
          await new Promise(r => setTimeout(r, delay / 2));
          
          if (network === 'slow2g' && Math.random() < 0.25) {
            failedCount++;
            return { ...sub, syncStatus: 'retry' as SyncStatus };
          }

          syncedCount++;
          return {
            ...sub,
            syncStatus: 'synced' as SyncStatus,
            syncedAt: new Date().toISOString(),
          };
        }
        return sub;
      })
    );

    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(updated));
    this.notify();
    return { syncedCount, failedCount };
  }

  static resetToDemo() {
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    localStorage.setItem(STORAGE_KEY_NETWORK, 'online');
    this.notify();
  }
}
