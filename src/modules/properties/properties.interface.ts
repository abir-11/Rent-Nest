import { PropertiesWhereInput } from "../../../prisma/generated/prisma/models";

export interface IPropertiesQuery extends PropertiesWhereInput{
    searchTerm?:string;
    page?:string;
    limit?:string;
    sortOrder?:string;
    sortBy?:string;
    type?:string
}