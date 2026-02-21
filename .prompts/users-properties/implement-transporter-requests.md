In `backend/backend-server/src/domains/users/services/properties`:
- Implements transporter methods to read and upsert properties by userId and propertyId.
  - Create 2 topics, 2 DTOs, 2 transporter methods.
- Implement the methods in UsersPropertiesService.ts.
  - Call the methods from UsersPropertiesRepository.
- Implement the transporter methods in UsersPropertiesRequestController.ts.
  - Call the methods from UsersPropertiesService.