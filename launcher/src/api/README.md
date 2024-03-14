The graphql schema here is from both the cross-shard LauncherAPI and the per-shard WebAPI
The webapi schema is from the per-shard WebAPI

Generally speaking, the "primary" cross-shard GraphQL types should be powering the master character listing with its SimplifiedCharacter type.

The "shard" GraphQL types paired with WebAPI calls should be powering character actions including creation and deletion.

It is not always clear from context which system a component belongs to--a reorganization of the content would greatly help clarify which API data format is appropriate for a given component.
