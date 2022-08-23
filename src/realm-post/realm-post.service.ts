import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicKey } from '@solana/web3.js';
import * as AR from 'fp-ts/Array';
import * as FN from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { Repository, In } from 'typeorm';

import * as errors from '@lib/errors/gql';
import { Environment } from '@lib/types/Environment';

import { RealmPost } from './entities/RealmPost.entity';

@Injectable()
export class RealmPostService {
  constructor(
    @InjectRepository(RealmPost)
    private readonly realmPostRepository: Repository<RealmPost>,
  ) {}

  /**
   * Get posts by ids
   */
  getPostsForRealmByIds(
    realmPublicKey: PublicKey,
    ids: string[],
    requestingUser: PublicKey | null,
    environment: Environment,
  ) {
    if (environment === 'devnet') {
      return TE.left(new errors.UnsupportedDevnet());
    }

    return FN.pipe(
      TE.tryCatch(
        () =>
          this.realmPostRepository.find({
            where: {
              environment,
              id: In(ids),
              realmPublicKeyStr: realmPublicKey.toBase58(),
            },
          }),
        (e) => new errors.Exception(e),
      ),
      TE.map(
        AR.reduce({} as { [id: string]: RealmPost }, (acc, post) => {
          acc[post.id] = post;
          return acc;
        }),
      ),
    );
  }
}
