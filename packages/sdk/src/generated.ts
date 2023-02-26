import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Time: any;
};

export type AccessToken = {
  __typename?: 'AccessToken';
  created_at: Scalars['Time'];
  expires_at: Scalars['Time'];
  id: Scalars['ID'];
  name: Scalars['String'];
  owner: Scalars['String'];
  token: Scalars['String'];
};

export type CommitArgs = {
  expr?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  state?: InputMaybe<Scalars['String']>;
};

export type CreateJobArgs = {
  expr: Scalars['String'];
  meta?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  retries?: InputMaybe<Scalars['Int']>;
  start_at?: InputMaybe<Scalars['Time']>;
  state: Scalars['String'];
  timeout?: InputMaybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  batchCreateJobs: Array<Scalars['ID']>;
  commitJobs: Array<Scalars['ID']>;
  createJob: TinyJob;
  createToken: Scalars['String'];
  deleteJobByID: TinyJob;
  deleteJobByName: TinyJob;
  failJobs: Array<Scalars['ID']>;
  fetchForProcessing: Array<TinyJob>;
  listTokens: Array<AccessToken>;
  restartJob: TinyJob;
  retryJobs: Array<Scalars['ID']>;
  revokeAllTokens: Scalars['Boolean'];
  revokeToken: Scalars['Boolean'];
  stopJob: TinyJob;
  updateExprByID: TinyJob;
  updateJobById: TinyJob;
  updateJobByName: TinyJob;
  updateStateByID: TinyJob;
  validateExprFormat: Scalars['Boolean'];
};


export type MutationBatchCreateJobsArgs = {
  args: Array<CreateJobArgs>;
  executor: Scalars['String'];
};


export type MutationCommitJobsArgs = {
  commits: Array<CommitArgs>;
  executor: Scalars['String'];
};


export type MutationCreateJobArgs = {
  args: CreateJobArgs;
  executor: Scalars['String'];
};


export type MutationCreateTokenArgs = {
  name: Scalars['String'];
};


export type MutationDeleteJobByIdArgs = {
  executor: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationDeleteJobByNameArgs = {
  executor: Scalars['String'];
  name: Scalars['String'];
};


export type MutationFailJobsArgs = {
  commits: Array<CommitArgs>;
  executor: Scalars['String'];
};


export type MutationFetchForProcessingArgs = {
  executor: Scalars['String'];
  limit?: Scalars['Int'];
};


export type MutationRestartJobArgs = {
  executor: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationRetryJobsArgs = {
  commits: Array<CommitArgs>;
  executor: Scalars['String'];
};


export type MutationRevokeTokenArgs = {
  id: Scalars['String'];
};


export type MutationStopJobArgs = {
  executor: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationUpdateExprByIdArgs = {
  executor: Scalars['String'];
  expr: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationUpdateJobByIdArgs = {
  args: UpdateJobArgs;
  executor: Scalars['String'];
  id: Scalars['ID'];
};


export type MutationUpdateJobByNameArgs = {
  args: UpdateJobArgs;
  executor: Scalars['String'];
  name: Scalars['String'];
};


export type MutationUpdateStateByIdArgs = {
  executor: Scalars['String'];
  id: Scalars['ID'];
  state: Scalars['String'];
};


export type MutationValidateExprFormatArgs = {
  expr: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  countTotalJobs: Scalars['Int'];
  listActiveQueues: Array<Scalars['String']>;
  queryJobByID: TinyJob;
  queryJobByName: TinyJob;
  searchJobs: Array<TinyJob>;
  searchJobsByMeta: SearchJobsByMetaResult;
};


export type QueryQueryJobByIdArgs = {
  executor: Scalars['String'];
  id: Scalars['ID'];
};


export type QueryQueryJobByNameArgs = {
  executor: Scalars['String'];
  name: Scalars['String'];
};


export type QuerySearchJobsArgs = {
  args: QueryJobsArgs;
  executor: Scalars['String'];
};


export type QuerySearchJobsByMetaArgs = {
  args: QueryJobsMetaArgs;
  executor: Scalars['String'];
};

export type QueryJobsArgs = {
  filter: Scalars['String'];
  limit?: Scalars['Int'];
  skip?: Scalars['Int'];
};

export type QueryJobsMetaArgs = {
  from: Scalars['Time'];
  isOneShot: Scalars['Boolean'];
  limit?: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
  query?: InputMaybe<Scalars['String']>;
  skip?: Scalars['Int'];
  statuses: Array<Scalars['String']>;
  to: Scalars['Time'];
};

export type SearchJobsByMetaResult = {
  __typename?: 'SearchJobsByMetaResult';
  jobs: Array<TinyJob>;
  total: Scalars['Int'];
};

export type TinyJob = {
  __typename?: 'TinyJob';
  created_at: Scalars['Time'];
  execution_amount: Scalars['Int'];
  executor: Scalars['String'];
  expr: Scalars['String'];
  id: Scalars['ID'];
  last_run_at?: Maybe<Scalars['Time']>;
  meta: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  retries: Scalars['Int'];
  run_at: Scalars['Time'];
  start_at?: Maybe<Scalars['Time']>;
  state?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  timeout?: Maybe<Scalars['Int']>;
};

export type UpdateJobArgs = {
  expr?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  timeout?: InputMaybe<Scalars['Int']>;
};

export type TinyPropsFragment = { __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number };

export type SearchJobsByMetaResultFragment = { __typename?: 'SearchJobsByMetaResult', total: number, jobs: Array<{ __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number }> };

export type AccessTokenFragment = { __typename?: 'AccessToken', id: string, token: string, owner: string, expires_at: any, created_at: any, name: string };

export type CreateTokenMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateTokenMutation = { __typename?: 'Mutation', createToken: string };

export type ListTokensMutationVariables = Exact<{ [key: string]: never; }>;


export type ListTokensMutation = { __typename?: 'Mutation', listTokens: Array<{ __typename?: 'AccessToken', id: string, token: string, owner: string, expires_at: any, created_at: any, name: string }> };

export type RevokeTokenMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type RevokeTokenMutation = { __typename?: 'Mutation', revokeToken: boolean };

export type RevokeAllTokensMutationVariables = Exact<{ [key: string]: never; }>;


export type RevokeAllTokensMutation = { __typename?: 'Mutation', revokeAllTokens: boolean };

export type ValidateExprFormatMutationVariables = Exact<{
  expr: Scalars['String'];
}>;


export type ValidateExprFormatMutation = { __typename?: 'Mutation', validateExprFormat: boolean };

export type ListActiveQueuesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListActiveQueuesQuery = { __typename?: 'Query', listActiveQueues: Array<string> };

export type CountTotalJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type CountTotalJobsQuery = { __typename?: 'Query', countTotalJobs: number };

export type SearchJobsQueryVariables = Exact<{
  executor: Scalars['String'];
  args: QueryJobsArgs;
}>;


export type SearchJobsQuery = { __typename?: 'Query', searchJobs: Array<{ __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number }> };

export type SearchJobsByMetaQueryVariables = Exact<{
  executor: Scalars['String'];
  args: QueryJobsMetaArgs;
}>;


export type SearchJobsByMetaQuery = { __typename?: 'Query', listActiveQueues: Array<string>, countTotalJobs: number, searchJobsByMeta: { __typename?: 'SearchJobsByMetaResult', total: number, jobs: Array<{ __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number }> } };

export type QueryJobByNameQueryVariables = Exact<{
  executor: Scalars['String'];
  name: Scalars['String'];
}>;


export type QueryJobByNameQuery = { __typename?: 'Query', queryJobByName: { __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number } };

export type QueryJobByIdQueryVariables = Exact<{
  executor: Scalars['String'];
  id: Scalars['ID'];
}>;


export type QueryJobByIdQuery = { __typename?: 'Query', queryJobByID: { __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number } };

export type CreateJobMutationVariables = Exact<{
  executor: Scalars['String'];
  args: CreateJobArgs;
}>;


export type CreateJobMutation = { __typename?: 'Mutation', createJob: { __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number } };

export type BatchCreateJobsMutationVariables = Exact<{
  executor: Scalars['String'];
  args: Array<CreateJobArgs> | CreateJobArgs;
}>;


export type BatchCreateJobsMutation = { __typename?: 'Mutation', batchCreateJobs: Array<string> };

export type UpdateJobByNameMutationVariables = Exact<{
  executor: Scalars['String'];
  name: Scalars['String'];
  args: UpdateJobArgs;
}>;


export type UpdateJobByNameMutation = { __typename?: 'Mutation', updateJobByName: { __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number } };

export type UpdateJobByIdMutationVariables = Exact<{
  executor: Scalars['String'];
  id: Scalars['ID'];
  args: UpdateJobArgs;
}>;


export type UpdateJobByIdMutation = { __typename?: 'Mutation', updateJobById: { __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number } };

export type UpdateStateByIdMutationVariables = Exact<{
  executor: Scalars['String'];
  id: Scalars['ID'];
  state: Scalars['String'];
}>;


export type UpdateStateByIdMutation = { __typename?: 'Mutation', updateStateByID: { __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number } };

export type UpdateExprByIdMutationVariables = Exact<{
  executor: Scalars['String'];
  id: Scalars['ID'];
  expr: Scalars['String'];
}>;


export type UpdateExprByIdMutation = { __typename?: 'Mutation', updateExprByID: { __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number } };

export type DeleteJobByNameMutationVariables = Exact<{
  executor: Scalars['String'];
  name: Scalars['String'];
}>;


export type DeleteJobByNameMutation = { __typename?: 'Mutation', deleteJobByName: { __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number } };

export type DeleteJobByIdMutationVariables = Exact<{
  executor: Scalars['String'];
  id: Scalars['ID'];
}>;


export type DeleteJobByIdMutation = { __typename?: 'Mutation', deleteJobByID: { __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number } };

export type FetchForProcessingMutationVariables = Exact<{
  executor: Scalars['String'];
  limit?: Scalars['Int'];
}>;


export type FetchForProcessingMutation = { __typename?: 'Mutation', fetchForProcessing: Array<{ __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number }> };

export type CommitJobsMutationVariables = Exact<{
  executor: Scalars['String'];
  commits: Array<CommitArgs> | CommitArgs;
}>;


export type CommitJobsMutation = { __typename?: 'Mutation', commitJobs: Array<string> };

export type FailJobsMutationVariables = Exact<{
  executor: Scalars['String'];
  commits: Array<CommitArgs> | CommitArgs;
}>;


export type FailJobsMutation = { __typename?: 'Mutation', failJobs: Array<string> };

export type RetryJobsMutationVariables = Exact<{
  executor: Scalars['String'];
  commits: Array<CommitArgs> | CommitArgs;
}>;


export type RetryJobsMutation = { __typename?: 'Mutation', retryJobs: Array<string> };

export type StopJobMutationVariables = Exact<{
  executor: Scalars['String'];
  id: Scalars['ID'];
}>;


export type StopJobMutation = { __typename?: 'Mutation', stopJob: { __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number } };

export type RestartJobMutationVariables = Exact<{
  executor: Scalars['String'];
  id: Scalars['ID'];
}>;


export type RestartJobMutation = { __typename?: 'Mutation', restartJob: { __typename?: 'TinyJob', id: string, name?: string | null, expr: string, run_at: any, last_run_at?: any | null, start_at?: any | null, timeout?: number | null, created_at: any, executor: string, state?: string | null, status: string, meta: string, retries: number, execution_amount: number } };

export const TinyPropsFragmentDoc = gql`
    fragment TinyProps on TinyJob {
  id
  name
  expr
  run_at
  last_run_at
  start_at
  timeout
  created_at
  executor
  state
  status
  meta
  retries
  execution_amount
}
    `;
export const SearchJobsByMetaResultFragmentDoc = gql`
    fragment SearchJobsByMetaResult on SearchJobsByMetaResult {
  total
  jobs {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const AccessTokenFragmentDoc = gql`
    fragment AccessToken on AccessToken {
  id
  token
  owner
  expires_at
  created_at
  name
}
    `;
export const CreateTokenDocument = gql`
    mutation createToken($name: String!) {
  createToken(name: $name)
}
    `;
export const ListTokensDocument = gql`
    mutation listTokens {
  listTokens {
    ...AccessToken
  }
}
    ${AccessTokenFragmentDoc}`;
export const RevokeTokenDocument = gql`
    mutation revokeToken($id: String!) {
  revokeToken(id: $id)
}
    `;
export const RevokeAllTokensDocument = gql`
    mutation revokeAllTokens {
  revokeAllTokens
}
    `;
export const ValidateExprFormatDocument = gql`
    mutation validateExprFormat($expr: String!) {
  validateExprFormat(expr: $expr)
}
    `;
export const ListActiveQueuesDocument = gql`
    query listActiveQueues {
  listActiveQueues
}
    `;
export const CountTotalJobsDocument = gql`
    query countTotalJobs {
  countTotalJobs
}
    `;
export const SearchJobsDocument = gql`
    query searchJobs($executor: String!, $args: QueryJobsArgs!) {
  searchJobs(executor: $executor, args: $args) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const SearchJobsByMetaDocument = gql`
    query searchJobsByMeta($executor: String!, $args: QueryJobsMetaArgs!) {
  searchJobsByMeta(executor: $executor, args: $args) {
    ...SearchJobsByMetaResult
  }
  listActiveQueues
  countTotalJobs
}
    ${SearchJobsByMetaResultFragmentDoc}`;
export const QueryJobByNameDocument = gql`
    query queryJobByName($executor: String!, $name: String!) {
  queryJobByName(executor: $executor, name: $name) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const QueryJobByIdDocument = gql`
    query queryJobByID($executor: String!, $id: ID!) {
  queryJobByID(executor: $executor, id: $id) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const CreateJobDocument = gql`
    mutation createJob($executor: String!, $args: CreateJobArgs!) {
  createJob(executor: $executor, args: $args) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const BatchCreateJobsDocument = gql`
    mutation batchCreateJobs($executor: String!, $args: [CreateJobArgs!]!) {
  batchCreateJobs(executor: $executor, args: $args)
}
    `;
export const UpdateJobByNameDocument = gql`
    mutation updateJobByName($executor: String!, $name: String!, $args: UpdateJobArgs!) {
  updateJobByName(executor: $executor, name: $name, args: $args) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const UpdateJobByIdDocument = gql`
    mutation updateJobById($executor: String!, $id: ID!, $args: UpdateJobArgs!) {
  updateJobById(executor: $executor, id: $id, args: $args) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const UpdateStateByIdDocument = gql`
    mutation updateStateByID($executor: String!, $id: ID!, $state: String!) {
  updateStateByID(executor: $executor, id: $id, state: $state) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const UpdateExprByIdDocument = gql`
    mutation updateExprByID($executor: String!, $id: ID!, $expr: String!) {
  updateExprByID(executor: $executor, id: $id, expr: $expr) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const DeleteJobByNameDocument = gql`
    mutation deleteJobByName($executor: String!, $name: String!) {
  deleteJobByName(executor: $executor, name: $name) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const DeleteJobByIdDocument = gql`
    mutation deleteJobByID($executor: String!, $id: ID!) {
  deleteJobByID(executor: $executor, id: $id) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const FetchForProcessingDocument = gql`
    mutation fetchForProcessing($executor: String!, $limit: Int! = 50) {
  fetchForProcessing(executor: $executor, limit: $limit) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const CommitJobsDocument = gql`
    mutation commitJobs($executor: String!, $commits: [CommitArgs!]!) {
  commitJobs(executor: $executor, commits: $commits)
}
    `;
export const FailJobsDocument = gql`
    mutation failJobs($executor: String!, $commits: [CommitArgs!]!) {
  failJobs(executor: $executor, commits: $commits)
}
    `;
export const RetryJobsDocument = gql`
    mutation retryJobs($executor: String!, $commits: [CommitArgs!]!) {
  retryJobs(executor: $executor, commits: $commits)
}
    `;
export const StopJobDocument = gql`
    mutation stopJob($executor: String!, $id: ID!) {
  stopJob(executor: $executor, id: $id) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;
export const RestartJobDocument = gql`
    mutation restartJob($executor: String!, $id: ID!) {
  restartJob(executor: $executor, id: $id) {
    ...TinyProps
  }
}
    ${TinyPropsFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    createToken(variables: CreateTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateTokenMutation>(CreateTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createToken', 'mutation');
    },
    listTokens(variables?: ListTokensMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ListTokensMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListTokensMutation>(ListTokensDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'listTokens', 'mutation');
    },
    revokeToken(variables: RevokeTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RevokeTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RevokeTokenMutation>(RevokeTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'revokeToken', 'mutation');
    },
    revokeAllTokens(variables?: RevokeAllTokensMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RevokeAllTokensMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RevokeAllTokensMutation>(RevokeAllTokensDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'revokeAllTokens', 'mutation');
    },
    validateExprFormat(variables: ValidateExprFormatMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ValidateExprFormatMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ValidateExprFormatMutation>(ValidateExprFormatDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'validateExprFormat', 'mutation');
    },
    listActiveQueues(variables?: ListActiveQueuesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ListActiveQueuesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListActiveQueuesQuery>(ListActiveQueuesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'listActiveQueues', 'query');
    },
    countTotalJobs(variables?: CountTotalJobsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CountTotalJobsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CountTotalJobsQuery>(CountTotalJobsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'countTotalJobs', 'query');
    },
    searchJobs(variables: SearchJobsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchJobsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchJobsQuery>(SearchJobsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchJobs', 'query');
    },
    searchJobsByMeta(variables: SearchJobsByMetaQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchJobsByMetaQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchJobsByMetaQuery>(SearchJobsByMetaDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchJobsByMeta', 'query');
    },
    queryJobByName(variables: QueryJobByNameQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<QueryJobByNameQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<QueryJobByNameQuery>(QueryJobByNameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'queryJobByName', 'query');
    },
    queryJobByID(variables: QueryJobByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<QueryJobByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<QueryJobByIdQuery>(QueryJobByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'queryJobByID', 'query');
    },
    createJob(variables: CreateJobMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateJobMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateJobMutation>(CreateJobDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createJob', 'mutation');
    },
    batchCreateJobs(variables: BatchCreateJobsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<BatchCreateJobsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<BatchCreateJobsMutation>(BatchCreateJobsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'batchCreateJobs', 'mutation');
    },
    updateJobByName(variables: UpdateJobByNameMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateJobByNameMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateJobByNameMutation>(UpdateJobByNameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateJobByName', 'mutation');
    },
    updateJobById(variables: UpdateJobByIdMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateJobByIdMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateJobByIdMutation>(UpdateJobByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateJobById', 'mutation');
    },
    updateStateByID(variables: UpdateStateByIdMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateStateByIdMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateStateByIdMutation>(UpdateStateByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateStateByID', 'mutation');
    },
    updateExprByID(variables: UpdateExprByIdMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateExprByIdMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateExprByIdMutation>(UpdateExprByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateExprByID', 'mutation');
    },
    deleteJobByName(variables: DeleteJobByNameMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteJobByNameMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteJobByNameMutation>(DeleteJobByNameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteJobByName', 'mutation');
    },
    deleteJobByID(variables: DeleteJobByIdMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteJobByIdMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteJobByIdMutation>(DeleteJobByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteJobByID', 'mutation');
    },
    fetchForProcessing(variables: FetchForProcessingMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FetchForProcessingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<FetchForProcessingMutation>(FetchForProcessingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'fetchForProcessing', 'mutation');
    },
    commitJobs(variables: CommitJobsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CommitJobsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CommitJobsMutation>(CommitJobsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'commitJobs', 'mutation');
    },
    failJobs(variables: FailJobsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FailJobsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<FailJobsMutation>(FailJobsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'failJobs', 'mutation');
    },
    retryJobs(variables: RetryJobsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RetryJobsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RetryJobsMutation>(RetryJobsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'retryJobs', 'mutation');
    },
    stopJob(variables: StopJobMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<StopJobMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<StopJobMutation>(StopJobDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stopJob', 'mutation');
    },
    restartJob(variables: RestartJobMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RestartJobMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RestartJobMutation>(RestartJobDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'restartJob', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;