import { ObjectType, ID, ArgsType, Field } from '@nestjs/graphql';
import * as Relay from 'graphql-relay';

@ArgsType()
export class ConnectionArgs implements Relay.ConnectionArguments {
  @Field(() => ID, {
    description: '`after` cursor for pagination',
    nullable: true,
  })
  after?: Relay.ConnectionCursor;

  @Field(() => ID, {
    description: '`before` cursor for pagination',
    nullable: true,
  })
  before?: Relay.ConnectionCursor;

  @Field(() => Number, {
    description: 'Count of items to grab from the head of the full list',
    nullable: true,
  })
  first?: number;

  @Field(() => Number, {
    description: 'Count of items to grab form the tail of the full list',
    nullable: true,
  })
  last?: number;
}

@ObjectType()
class PageInfo implements Relay.PageInfo {
  @Field(() => Boolean, {
    description: 'If there are additional results after these',
  })
  hasNextPage: boolean;

  @Field(() => Boolean, {
    description: 'If there are additional results before these',
  })
  hasPreviousPage: boolean;

  @Field(() => ID, {
    description: 'A cursor representing the head of the returned results',
    nullable: true,
  })
  startCursor: Relay.ConnectionCursor | null;

  @Field(() => ID, {
    description: 'A cursor representing the end of the returned results',
    nullable: true,
  })
  endCursor: Relay.ConnectionCursor | null;
}

export function EdgeType<NodeType>(
  nodeName: string,
  nodeType: new (...args: any[]) => NodeType,
): (abstract new (...args: any[]) => Relay.Edge<NodeType>) {
  @ObjectType(`${nodeName}Edge`, { isAbstract: true })
  abstract class Edge implements Relay.Edge<NodeType> {
    @Field(() => nodeType, {
      description: `A single ${nodeName}`,
    })
    node: NodeType;

    @Field(() => String, {
      description: 'A cursor representing this node. Used in `before` and `after` args.',
    })
    cursor: Relay.ConnectionCursor;
  }

  return Edge;
}

type ExtractNodeType<EdgeType> = EdgeType extends Relay.Edge<infer NodeType> ? NodeType : never;

export function ConnectionType<
  EdgeType extends Relay.Edge<NodeType>,
  NodeType = ExtractNodeType<EdgeType>
>(
  nodeName: string,
  edgeClass: (new (...args: any[]) => EdgeType),
): (abstract new (...args: any[]) => Relay.Connection<NodeType>) {
  @ObjectType(`${nodeName}Connection`, { isAbstract: true })
  abstract class Connection implements Relay.Connection<NodeType> {
    @Field(() => PageInfo, {
      description: 'Information about this page',
    })
    pageInfo: PageInfo;

    @Field(() => [edgeClass], {
      description: 'The results found in this page',
    })
    edges: EdgeType[];
  }

  return Connection;
}
