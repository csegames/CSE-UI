# What is an Action Handler?
An action handler, in this project, is a component who's responsibility is to listen to specific events and handle side effects. They are mounted along with all the other data ContextProviders, and use the data provided by them to make actions at a root level.

# Why do we need Action Handlers?
Action Handlers aren't tied to any specific component in the component hierarchy and are still children of ContextProviders, meaning that they can use state derived from multiple contexts to handle events.

# Why can't we do this in the most top-level component like hud/index.ts
We *could* do in the root hud/index.ts, but it's bad. If we were to do that, we'd have an evergrowing, bloated file. Also, the goal of these ActionHandlers is to enforce specific responsibilities for specific events. If we handle all events in the top-level component, it starts to have a lot of general responsibility, which can lead to more bugs, confusion, etc.

# Action Handler restrictions?
* They are renderless components.
* They do not have any state themselves.
* They do not provide any data to other components.
