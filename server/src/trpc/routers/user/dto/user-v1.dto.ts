import { User } from "../../../../db/schema";

export type UserV1Dto = {
  id: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function toUserV1Dto(user: User): UserV1Dto {
  return {
    id: user.id,
    email: user.email,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
