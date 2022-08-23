import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, ResolveField, Root, Int } from '@nestjs/graphql';
import { PublicKey } from '@solana/web3.js';

import { CurrentEnvironment, Environment } from '@lib/decorators/CurrentEnvironment';
import { CurrentUser, User } from '@lib/decorators/CurrentUser';
import { ConnectionArgs } from '@lib/gqlTypes/Connection';
import { AuthJwtGuard } from '@src/auth/auth.jwt.guard';
import { EitherResolver } from '@src/lib/decorators/EitherResolver';
import { PublicKeyScalar } from '@src/lib/scalars/PublicKey';
import { RealmFeedItemSort, RealmFeedItemConnection } from '@src/realm-feed-item/dto/pagination';
import {
  RealmFeedItemGQLService,
  RealmFeedItemCursor,
} from '@src/realm-feed-item/realm-feed-item.gql.service';
import { RealmMemberSort, RealmMemberConnection } from '@src/realm-member/dto/pagination';
import { RealmMemberService, RealmMemberCursor } from '@src/realm-member/realm-member.service';
import { RealmProposalSort, RealmProposalConnection } from '@src/realm-proposal/dto/pagination';
import {
  RealmProposalGQLService,
  RealmProposalCursor,
} from '@src/realm-proposal/realm-proposal.gql.service';

import { Realm } from './dto/Realm';
import { RealmService } from './realm.service';

@Resolver(() => Realm)
export class RealmResolver {
  constructor(
    private readonly realmFeedItemGqlService: RealmFeedItemGQLService,
    private readonly realmMemberService: RealmMemberService,
    private readonly realmProposalGqlService: RealmProposalGQLService,
    private readonly realmService: RealmService,
  ) {}

  @ResolveField(() => RealmFeedItemConnection, {
    description: 'Realm feed',
  })
  @EitherResolver()
  feed(
    @Args() args: ConnectionArgs,
    @Args('sort', {
      type: () => RealmFeedItemSort,
      description: 'Sort order for the feed',
      defaultValue: RealmFeedItemSort.Relevance,
      nullable: true,
    })
    sort: RealmFeedItemSort = RealmFeedItemSort.Relevance,
    @Root() realm: Realm,
    @CurrentEnvironment() environment: Environment,
    @CurrentUser() user: User | null,
  ) {
    return this.realmFeedItemGqlService.getGQLFeedItemsList(
      realm.publicKey,
      user ? user.publicKey : null,
      sort,
      environment,
      args.after as RealmFeedItemCursor | undefined,
      args.before as RealmFeedItemCursor | undefined,
      args.first,
      args.last,
    );
  }

  @Query(() => Realm, {
    description: 'A Realm',
  })
  @EitherResolver()
  realm(
    @Args('publicKey', {
      description: 'The public key of the Realm',
      type: () => PublicKeyScalar,
    })
    publicKey: PublicKey,
    @CurrentEnvironment() environment: Environment,
  ) {
    return this.realmService.getRealm(publicKey, environment);
  }

  @ResolveField(() => RealmMemberConnection, {
    description: 'List of members in the realm',
  })
  @EitherResolver()
  members(
    @Args() args: ConnectionArgs,
    @Args('sort', {
      type: () => RealmMemberSort,
      description: 'Sort order for the list',
      defaultValue: RealmMemberSort.Alphabetical,
      nullable: true,
    })
    sort: RealmMemberSort = RealmMemberSort.Alphabetical,
    @Root() realm: Realm,
    @CurrentEnvironment() environment: Environment,
  ) {
    return this.realmMemberService.getGQLMemberList(
      realm.publicKey,
      sort,
      environment,
      args.after as RealmMemberCursor | undefined,
      args.before as RealmMemberCursor | undefined,
      args.first,
      args.last,
    );
  }

  @ResolveField(() => Int, {
    description: 'Count of the number of members in this Realm',
  })
  @EitherResolver()
  membersCount(@Root() realm: Realm, @CurrentEnvironment() environment: Environment) {
    return this.realmMemberService.getMembersCountForRealm(realm.publicKey, environment);
  }

  @ResolveField(() => RealmProposalConnection, {
    description: 'List of proposals in the realm',
  })
  @EitherResolver()
  @UseGuards(AuthJwtGuard)
  proposals(
    @Args() args: ConnectionArgs,
    @Args('sort', {
      type: () => RealmProposalSort,
      description: 'Sort order for the list',
      defaultValue: RealmProposalSort.Time,
      nullable: true,
    })
    sort: RealmProposalSort = RealmProposalSort.Time,
    @Root() realm: Realm,
    @CurrentEnvironment() environment: Environment,
    @CurrentUser() user: User | null,
  ) {
    return this.realmProposalGqlService.getGQLProposalList(
      realm.publicKey,
      user ? user.publicKey : null,
      sort,
      environment,
      args.after as RealmProposalCursor | undefined,
      args.before as RealmProposalCursor | undefined,
      args.first,
      args.last,
    );
  }
}
