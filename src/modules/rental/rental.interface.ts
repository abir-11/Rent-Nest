

export interface IRentalRequest {
    propertyId: string;
    message?: string;
    tenantId: string;
    startDate:string;
    endDate:string;
    approvedAt?:string ;
    rejectedAt?:string ;
    completedAt?:string
}