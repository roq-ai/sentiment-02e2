import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { forexPairValidationSchema } from 'validationSchema/forex-pairs';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.forex_pair
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getForexPairById();
    case 'PUT':
      return updateForexPairById();
    case 'DELETE':
      return deleteForexPairById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getForexPairById() {
    const data = await prisma.forex_pair.findFirst(convertQueryToPrismaUtil(req.query, 'forex_pair'));
    return res.status(200).json(data);
  }

  async function updateForexPairById() {
    await forexPairValidationSchema.validate(req.body);
    const data = await prisma.forex_pair.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteForexPairById() {
    const data = await prisma.forex_pair.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
