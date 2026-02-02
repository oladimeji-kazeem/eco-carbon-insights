
import { create } from 'zustand';
import { IngestionJob, EmissionRecord } from '@/types/pipeline';

interface PipelineState {
    jobs: IngestionJob[];
    records: EmissionRecord[];

    // Actions
    addJob: (job: IngestionJob) => void;
    updateJob: (id: string, updates: Partial<IngestionJob>) => void;
    addRecords: (newRecords: EmissionRecord[]) => void;

    // Computed (helper for UI)
    getPendingCount: () => number;
    getFailedCount: () => number;
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
    jobs: [],
    records: [],

    addJob: (job) => set((state) => ({
        jobs: [job, ...state.jobs]
    })),

    updateJob: (id, updates) => set((state) => ({
        jobs: state.jobs.map((job) =>
            job.id === id ? { ...job, ...updates } : job
        )
    })),

    addRecords: (newRecords) => set((state) => ({
        records: [...state.records, ...newRecords]
    })),

    getPendingCount: () => {
        return get().jobs.filter(j => ['pending', 'scanning', 'processing'].includes(j.status)).length;
    },

    getFailedCount: () => {
        return get().jobs.filter(j => j.status === 'failed').length;
    }
}));
