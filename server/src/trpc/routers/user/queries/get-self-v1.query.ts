import { getUserById } from "../../../../services/user/get-user-by-id";
import { privateProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";
import { toUserV1Dto } from "../dto/user-v1.dto";

export const getSelfV1Query = privateProcedure.query(async ({ ctx }) => {
  try {
    const user = await getUserById(ctx.session.userId);
    return toUserV1Dto(user);
  } catch (err) {
    throw mapToTrpcError(err);
  }
});
