import { ConnectionConfig } from 'mysql';
export declare type AvailableJobNames = "SendEmail" | "TriggerBriteRecapitalization";
export declare class AvailableJob {
    id: number;
    title: string;
    description: string;
    class: string;
    queueName: string;
    payloadValidation: string;
    payloadKey: string;
    created_at: Date;
    updated_at: Date;
    name: string;
}
export declare class LaravelJob {
    queue: string;
    payload: string;
    attempts: number;
    available_at: number;
    created_at: number;
}
export declare class QueueOptions {
    "maxTries": number;
    "maxExceptions": number;
    "failOnTimeout": boolean;
    "backoff": number;
    "timeout": number;
    "retryUntil": number;
}
export declare class JobOptions {
    job?: string;
    connection?: string;
    queue?: string;
    chainConnection?: string;
    chainQueue?: string;
    delay?: number;
}
export interface LaravelQueueConfig {
    db: ConnectionConfig;
    queueName: string;
}
export declare class LaravelQueue {
    private readonly mySqlConnection;
    private readonly connectionReady;
    private availableJobs;
    private config;
    constructor(config: LaravelQueueConfig);
    query<T>(sql: string): Promise<T>;
    fetchAvailableJobs(): Promise<void>;
    getJob(job: string): Promise<AvailableJob>;
    pushTo(jobName: AvailableJobNames, payload?: any, options?: JobOptions): Promise<unknown>;
    private prepareData;
    private prepareForSerialization;
    private prepareForSerializationArray;
    private generateUUID;
}
