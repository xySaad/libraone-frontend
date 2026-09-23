import type { EventUserRelFragment } from '$lib/graphql/generated';

export type EventPublicUser = NonNullable<EventUserRelFragment['publicUser']>;
