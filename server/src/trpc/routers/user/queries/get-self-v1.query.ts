import { NotFoundError } from "../../../../common/errors";
import { getDb } from "../../../../db";
import { getUserById } from "../../../../services/user/get-user-by-id";
import { privateProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";
import { toUserV1Dto } from "../dto/user-v1.dto";

export const getSelfV1Query = privateProcedure.query(async ({ ctx }) => {
  try {
    const { readTx } = getDb();

    const user = await getUserById(readTx, ctx.session.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return toUserV1Dto(user);
  } catch (err) {
    throw mapToTrpcError(err);
  }
});
