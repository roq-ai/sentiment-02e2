import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { brokerValidationSchema } from 'validationSchema/brokers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.broker
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBrokerById();
    case 'PUT':
      return updateBrokerById();
    case 'DELETE':
      return deleteBrokerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBrokerById() {
    const data = await prisma.broker.findFirst(convertQueryToPrismaUtil(req.query, 'broker'));
    return res.status(200).json(data);
  }

  async function updateBrokerById() {
    await brokerValidationSchema.validate(req.body);
    const data = await prisma.broker.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBrokerById() {
    const data = await prisma.broker.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
