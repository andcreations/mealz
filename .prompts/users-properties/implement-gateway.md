Use `backend/backend-server/src/domains/users/services/crud/gateway` as reference.
In `backend/backend-server/src/domains/users/services/properties/gateway`:
- Implement the types from `backend/backend-server/src/domains/users/services/properties/gateway-api/types`:
  - Create the types in `backend/backend-server/src/domains/users/services/properties/gateway/types`
- Implement DTOs from `backend/backend-server/src/domains/users/services/properties/gateway-api/dtos`:
  - Create the DTOs in `backend/backend-server/src/domains/users/services/properties/gateway/dtos`
- Create controller UsersPropertiesGWController.
  - Implement the HTTP methods from `backend/backend-server/src/domains/users/services/properties/gateway-api`
  - Call UsersPropertiesGWService
- Create service UsersPropertiesGWService.
  - Call UsersPropertiesTransporter.
- Create the NestJS module file.


