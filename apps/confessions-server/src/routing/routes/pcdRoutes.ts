import express, { NextFunction, Request, Response } from "express";
import { sha256 } from "js-sha256";
import { ApplicationContext } from "../../types";
import { prisma } from "../../util/prisma";
import { verifyEthProof, verifyGroupProof } from "../../util/verify";

/**
 * The endpoints in this function accepts proof (pcd) in the request.
 * It verifies the proof before proceed. So in this case no other type of auth (e.g. jwt)
 * is needed.
 */
export function initPCDRoutes(
  app: express.Application,
  _context: ApplicationContext
): void {
  app.post(
    "/new-confession",
    async (req: Request, res: Response, next: NextFunction) => {
      const request = req.body as PostConfessionRequest;

      try {
        const err = await verifyGroupProof(
          request.semaphoreGroupUrl,
          request.proof,
          request.confession
        );

        if (err != null) throw err;

        if (request.ethPcdStr) {
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", request.ethPcdStr);
          const valid = await verifyEthProof(request.ethPcdStr);
          if (!valid) throw new Error("invalid ethereum proof");
        }

        const proofHash = sha256(request.proof);

        // proof should be unique
        await prisma.confession.upsert({
          where: {
            proofHash: proofHash,
          },
          update: {},
          create: {
            semaphoreGroupUrl: request.semaphoreGroupUrl,
            body: request.confession,
            proof: request.proof,
            proofHash: proofHash,
            ethProof: request.ethPcdStr,
          },
        });

        res.send("ok");
      } catch (e) {
        console.error(e);
        next(e);
      }
    }
  );
}

export interface PostConfessionRequest {
  semaphoreGroupUrl: string;
  confession: string;
  proof: string;
  ethPcdStr?: string;
}
