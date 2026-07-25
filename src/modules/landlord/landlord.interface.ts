
export interface IProperty {
    landlordId:string;
    categoryId: string;
    title: string;
    description: string;
    location: string;
    price: number;
    images?:string;
    amenities: string[];
    isAvailable?: boolean;
}

export interface IUpdateProperties{
    title?: string;
    description?: string;
    location?: string;
    price?: number;
    images?:string;
    amenities?: string[];
    isAvailable?: boolean;
}