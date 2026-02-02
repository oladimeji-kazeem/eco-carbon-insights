
import { usePipelineStore } from "@/lib/pipelineStore";
import { IngestionJob, EmissionRecord } from "@/types/pipeline";
import { v4 as uuidv4 } from 'uuid';

export const pipelineService = {
    uploadFile: async (file: File) => {
        const addJob = usePipelineStore.getState().addJob;
        const updateJob = usePipelineStore.getState().updateJob;
        const addRecords = usePipelineStore.getState().addRecords;

        const jobId = uuidv4();

        // 1. Initialize Job
        const newJob: IngestionJob = {
            id: jobId,
            filename: file.name,
            fileSize: `${(file.size / 1024).toFixed(2)} KB`,
            timestamp: new Date(),
            status: 'pending',
            progress: 0,
            source: 'manual'
        };

        addJob(newJob);

        // Simulate Network Delay for Upload
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateJob(jobId, { status: 'scanning', progress: 30 });

        // Simulate Scanning / Virus Check
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateJob(jobId, { status: 'processing', progress: 60 });

        // Simulate Processing & Extraction
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock Random Success/Failure
        const isSuccess = Math.random() > 0.2; // 80% success rate

        if (isSuccess) {
            updateJob(jobId, { status: 'completed', progress: 100 });

            // Generate some mock records from this "file"
            const mockRecords: EmissionRecord[] = [
                {
                    id: uuidv4(),
                    date: new Date().toISOString().split('T')[0],
                    category: 'Energy',
                    description: `Electricity usage extracted from ${file.name}`,
                    amount: Math.floor(Math.random() * 1000),
                    unit: 'kWh',
                    carbon_kg: Math.floor(Math.random() * 500),
                    status: 'verified'
                },
                {
                    id: uuidv4(),
                    date: new Date().toISOString().split('T')[0],
                    category: 'Operations',
                    description: `Office supplies from ${file.name}`,
                    amount: Math.floor(Math.random() * 500),
                    unit: 'USD',
                    carbon_kg: Math.floor(Math.random() * 50),
                    status: 'verified'
                }
            ];

            addRecords(mockRecords);
            return { success: true };
        } else {
            updateJob(jobId, { status: 'failed', progress: 100, message: 'Schema validation failed: Missing required field "Invoice Date"' });
            return { success: false, error: 'Validation Failed' };
        }
    }
};
