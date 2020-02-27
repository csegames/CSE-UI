# What is the goal of these ContextProvider tests?
These are the data providers for a countless amount of components. We need to ensure their robustness internally so that they are always reliable to some level, which helps us create a standard to build out UI components with the assumption that data will AT LEAST be provided a certain structure. This will increase confidence in those components.

# What should we test?
Really just need to write some tests to ensure that the data in state never gets malformed into something worse than what is returned from getDefaultState given some mock response from the server. Also, we need to test the functions attached to the context that manipulate the state to ensure they're not malforming data. That way, the UI knows the minimum of what to null check around the application so that it doesn’t crash from malformed data that it wasn’t expecting.
