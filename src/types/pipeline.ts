
export type JobStatus = 'pending' | 'scanning' | 'processing' | 'completed' | 'failed';

export interface IngestionJob {
    id: string;
    filename: string;
    fileSize: string;
    timestamp: Date;
    status: JobStatus;
    progress: number; // 0-100
    message?: string;
    source: 'manual' | 'integration';
    integrationType?: 'quickbooks' | 'xero';
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export interface EmissionRecord {
    id: string;
    date: string;
    category: 'Energy' | 'Travel' | 'Logistics' | 'Operations';
    description: string;
    amount: number;
    unit: string;
    carbon_kg: number;
    status: 'verified' | 'flagged';
}
