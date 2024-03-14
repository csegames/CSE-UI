# What is the library?

The library is shared code between game projects. It's designed to be an npm package. It consists of code for all games and project specific shared code.

## Game Interface

*Note : this is deprecated in favor of using `clientAPI` interface because the game object requires late runtime binding and doesn't support notification on value changes.*

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

- `_cse_dev_enterActionBarEditMode`
- `_cse_dev_exitActionBarEditMode`
- `_cse_dev_listenForKeyBindingTask`
  etc.
