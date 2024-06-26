[Back to Main](../README.md)

# Updating Game APIs

Our game UIs currently use four contact points to communicate to the outside world:

- The coherent bindings that allow communication with native code
- The graphql schema that combines RPC and PubSub models coming from the WebAPI
- The REST API that allows additional RPC calls to the WebAPI
- The Protobuf schema for communicating with FSR chat service embedded into the game server

Maintaining the coherent bindings/client API is currently done by hand, but the bindings to the WebAPI are generated by running commands on the library project.

## Library generation commands

The top-level command that attempts to regenerate all WebAPI bindings for all games is `npm run gen`; it will attempt to synchronize with the latest deployed code in Omelette and Hatchery shards for FSR and CU respectively. The generators can also be run individually by appending a scope to the request:

- `npm run gen:ht-gql` for FSR GraphQL
- `npm run gen:ht-rest` for FSR REST
- `npm run gen:cu-gql` for CU GraphQL
- `npm run gen:cu-rest` for CU REST

The FSR chat service can be refreshed by running `npm run gen:chat`, but development on this service has halted so updating this interface is discouraged.

## Using local development WebAPI as a source

If you want to synchronize with your local development WebAPI instead of the currently deployed code, you can change the prefix of the gen command before the colon to target a different hostname and port:

- `npm run gen-local:ht-gql` will target a standalone webAPI at `http://localhost:1337`
- `npm run gen-embed:ht-gql` will target an embedded webAPI at `http://localhost:8000`

# Updating Launcher APIs

The launcher uses two different API servers (master/api and CU shard webapi) to communicate, but refreshing the values is very similar to how it's done for game APIs.
- `npm run gen` will update using live api and hatchery webapi
