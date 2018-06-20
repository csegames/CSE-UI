Questions:

1. Do the types of ingredients (inventory items) that can be added to the vox depend on the vox job type?

Currently, there is not a restriction on the types of items that can be placed as an ingredient in a vox. That does mean that it is possible to put in an item which could not be used with the type of crafting job being performed.

2. Do reicpes require specific ingredients, and can I use the API to find that out?

Recipes often have ingredient requirements.

- Block - Has a set of rules that the ingredients must match.  This includes matching the item type specifically (Ex. Iron) or by tag (Ex. Metal), as well as the unit count amount (ex. 50%-60%).  These recipes can have additional requirements on them that restrict being able to use them at all, so not every player has access to all recipes (Ex. a recipe might only be available to the TDD).

- Shape - Very similar to the block recipe format, however, the first ingredient is the 'primary' ingredient and must be added first.  In addition, these recipes are 'discovered' once ingredients have been added to the vox that match the recipe requirements, so you won't see them in the list command until this has occurred.

- Grind - Each recipe specifies a single specific item as input and output

- Purify - Each recipe specifies a single specific item as input and output

- Repair - Takes any item that has a less then max durability.

I recommend running the "/cr list <recipetypes>" commands - you can see some of the ingredient details for the various crafting types.  Not as good as an API, but it might help give a better picture of what I listed above.

We do not have an API for accessing recipe rules. But @CSE JB  maybe we should talk about adding this.

3. Same as 2, but for Templates.

- Make - Will take any weapon or item template as the output and any alloy of sufficient mass as the input