# What is the library?
The library is shared code between projects. It's designed to be an npm package. It consists of code for all games, the patcher, and project specific shared code.

### Key components brief overview
* **_baseGame/**
	* **GameClientModels/** - These are models that are a combination of javascript-side data structures and structures we get from the client.
	* **graphql/** - This consists of the code we use to make graphql requests and subscriptions.
	* **types/** - These are pretty generic Typescript types that we use across FSR and CU
	* **utils/** - These are pretty generic utility functions that we use across FSR, and CU
* **camelotunchained/**
	* **game/** - Consists of code related to the in-game CU UI
		* **GameClientModels/** - Models that are made up of javascript-side data/code and data we get from Coherent from events, game, etc.
		* **typeExtensions/** - Helper functions that relate to common types.
		* **types/** - These are Typescript interfaces and types that are specific to CU.
		* **engineEvents.ts** - These are events that are triggered from Coherent that are CU specific. When an engine event is triggered, the forwardingMethod callback gets invoked. These forwarding methods are presented on the global `camelotunchained.game` object (e.g. `camelotunchained.game.onBuildingModeChanged(callback)`)
	* **graphql** - Generated typescript interfaces and types based off of the Hatchery API graphql schema.
	* **webAPI** - Contains typescript interfaces, types, and request methods from the Hatchery API server (things marked with TypeScriptGen) 
* **hordetest**
	* **game** - Consists of code related to the in-game FSR UI
		* **GameClientModels** - Models that are made up of javascript-side data/code and data we get from Coherent from events, game, etc.
		* types
		* **engineEvents** - These are events triggered from Coherent that are FSR specific. When an engine event is triggered, the forwardingMethod callback gets invoked. These forwarding methods are presented on the global `hordetest.game` object (e.g. hordetest.game.onObjectivesUpdate(callback))
	* **graphQL** - Generated typescript interfaces and types based off of the Omelette API graphql schema.
	* **webAPI** - Contains typescript interfaces, types, and request methods from the Omelette API server (things marked with TypeScriptGen)


### Game Interface

**game** - a global object that has multiple values and functions exposed to the UI through Coherent. The interface is in `library/src/_baseGame/BaseGameInterface.ts` and contains some documentation about each value/function.
**camelotunchained.game** - Specific to CU. The interface is in `library/src/camelotunchained/game/GameInterface.ts` and contains some documentation about each value/function.
**hordetest.game** - Specific to FSR. The interface is in `library/src/hordetest/game/GameInterface.ts` and contains some documentation about each value/function.

### makeClientPromise

Some functions exposed to the UI through the client return a `TaskHandle` when invoked.
```
interface TaskHandle {
	id: number;
	cancel: () => void;
}
```

The UI wraps these types of functions with makeClientPromise. Inside makeClientPromise, a promise is created and the UI starts listening for a `taskComplete` event from Coherent which, when triggered, passes a `TaskResult` with the corresponding id on the TaskHandle.

```
enum TaskStatus {
	Pending,
	Failed,
	Success,
	UserCancelled,
}

interface TaskResult {
	id: number;
	statusCode: TaskStatus;
	value: any;
	reason: string;
}
```

Once the UI gets one of these events, it resolves/rejects the promise associated with the TaskResult/TaskHandle.

The functions that require themselves to be wrapped by makeClientPromise have a similar naming convention where they are prefixed with `_cse_dev_`. These are actions that generally need a result after a certain amount of time/user input. Some examples of functions that would need this are
* `_cse_dev_enterActionBarEditMode`
* `_cse_dev_exitActionBarEditMode`
* `_cse_dev_listenForKeyBindingTask`
etc.

### API server typescript definitions (definitions.ts)
If you go to an api servers `/codegen/definitions.ts` route, you will see a file with a bunch of different Typescript interfaces/types.

Some examples are
http://hatcheryapi.camelotunchained.com/codegen/definitions.ts
https://omeletteapi.camelotunchained.com/codegen/definitions.ts'

These interfaces/types are generated on the api server from classes, enums, etc. marked with the attribute `TypeScriptGen`. You can see how more on how they are generated in TypeScriptGen.cs.

Also, on the api server, they are being served through the TypeGenController, which can be found in TypeGenController.cs.

**To update the interface/types on the UI**
1. Navigate to the library/
2. Run command to update
	- Updating CU definitions (Hatchery) `yarn start definitions.camelotunchained`
	- Updating FSR definitions (Omelette) `yarn start definitions.hordetest`
3. Build library again `yarn start build`
	- There are frequently problems with the typescript generated file. You will have to take them case by case, and they are generally caused by something on the API server side. Good luck.

### GraphQL schema.ts generation
GraphQL schema generation is a completely different system than our webAPI typescript system.

We use a tool called `apollo-codegen` (at the time of writing this documentation, it seems to be deprecated https://www.npmjs.com/package/apollo-codegen) which generates a schema.json file based off of the schema being provided by the corresponding api server. Then, we use `gql-gen` to create a schema.ts file from the schema.json file.

**To update the graphql schema types**
1. Navigate to the library/
2. Run command to update
	- Update CU definitions (Hatchery) `yarn start gql.camelotunchained`
	- Update FSR definitions (Omelette) `yarn start gql.hordetest`
3. Build library again `yarn start build`

To see how these scripts are built, go into **library/package-scripts.js**
