In `ShareNamedMealPicker.tsx` and `ShareNamedMealPicker.translations.ts` create a component wrapped in a centered modal which allows to pick a named meal and a user to share the meal with.

The component:
- Must have 2 input fields. One for picking named meals, the other for picker users.
- Both of the fields must have dropdown which show matching named meals and users.
  - Use `NamedMealPickerDropdown`.
  - Create a dropdown for users in file `ShareUsersDropdown.ts`.
- Must have a button `Share`.
- Must have callback functions in the properties:
  - When the share button is clicked (named meal and user are passed to the function).

In `MealPlanner.tsx` add code necessary to show/hide the component/modal.

Use `MealsNamedShareService.readShareUsers` to list users.
Use `MealsNamedService.getAll` to list all named meals.