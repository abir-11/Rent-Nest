import { PaymentStatus } from "../../../prisma/generated/prisma/enums";

export interface ICreatePayment {
  rentalRequestId: string;
  method?: string;
  userId: string;
}


export interface IPaymentQuery {
  page?: string;
  limit?: string;
  status?: PaymentStatus;
}